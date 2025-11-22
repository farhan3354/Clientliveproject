const { query } = require("../database");
const nodemailer = require("nodemailer");
const config = require("../env");

exports.linkHandler = async (req, res) => {
  let { userId, programId } = req.params;
  
  if (programId.length > 4) {
    programId = programId.slice(0, 4);
  }

  try {
    // Fetch program details
    const programRows = await query(
      "SELECT * FROM Programs WHERE programId = ?",
      [programId]
    );

    if (programRows.length === 0) {
      return res.sendStatus(404);
    }

    let program = programRows[0];

    // Extract IP address dynamically
    let ipAddress = req.headers["x-forwarded-for"] || req.socket.remoteAddress;

    // Normalize IP formats
    if (ipAddress) {
      ipAddress = ipAddress.split(",")[0].trim();  // Handle multiple proxies
    }
    if (ipAddress === "::1" || ipAddress === "127.0.0.1") {
      ipAddress = "127.0.0.1"; // Ensure IPv6 loopback is converted properly
    }

    // Check if the user has already received points
    const existingPointRows = await query(
      "SELECT * FROM Points WHERE userId = ? AND programId = ? AND ipAddress = ?",
      [userId, program.programId, ipAddress]
    );

    const cookieName = "user_visited";
    const userVisited = req.cookies[cookieName] === "true";

    // If no points have been awarded yet or no cookie exists, proceed
    if (existingPointRows.length === 0 || !userVisited) {
      res.cookie(cookieName, "true", { maxAge: 31536000000 }); // 1-year expiry

      // Check if user has a referrer
      const referralRows = await query(
        "SELECT referrerId FROM Referrals WHERE referredId = ?",
        [userId]
      );

      if (referralRows.length > 0) {
        const referrerId = referralRows[0].referrerId;
        const pointsToAward = program.points;  // Full points for referred user
        const referrerBonus = program.points * 0.1;  // 10% bonus for referrer
    
        // Award points to referred user
        await query(
            "INSERT INTO Points (userId, programLink, ipAddress, pointsGiven, programId) VALUES (?, ?, ?, ?, ?)",
            [
                userId,
                `mba/${userId}/${programId}`,
                ipAddress,
                pointsToAward,
                program.programId,
            ]
        );
    
        // Check if referrer already has points
        const referrerPointsRow = await query(
            "SELECT * FROM Points WHERE userId = ? AND programId = ?",
            [referrerId, program.programId]
        );
    
        if (referrerPointsRow.length > 0) {
            await query(
                "UPDATE Points SET pointsGiven = pointsGiven + ? WHERE userId = ? AND programId = ?",
                [referrerBonus, referrerId, program.programId]
            );
        } else {
            await query(
                "INSERT INTO Points (userId, programLink, ipAddress, pointsGiven, programId) VALUES (?, ?, ?, ?, ?)",
                [
                    referrerId,
                    `mba/${referrerId}/${programId}`,
                    ipAddress,
                    referrerBonus,
                    program.programId,
                ]
            );
        }
    } else {
        // No referrer: Normal user handling
        await query(
            "INSERT INTO Points (userId, programLink, ipAddress, pointsGiven, programId) VALUES (?, ?, ?, ?, ?)",
            [
                userId,
                `mba/${userId}/${programId}`,
                ipAddress,
                program.points,
                program.programId,
            ]
        );
    }
    

      // Optional: Send reward email if eligible
      const eligibleRewards = await query(
        "SELECT * FROM Rewards WHERE rewardType = ?",
        [program.points]
      );

      if (eligibleRewards.length > 0) {
        sendRewardEmail(userId, eligibleRewards);
      }
    }

    res.redirect(program.promotionLink);
  } catch (error) {
    console.error(error);
    res.redirect(program.promotionLink);
  }
};




// Function to send a reward email
async function sendRewardEmail(userId, eligibleRewards) {
  try {
    const user = await query("SELECT * FROM Users WHERE userId = ?", [userId]);

    // Prepare email content
    const mailOptions = {
      from: "brandambassador.ai@gmail.com",
      to: user.email, // Use the actual user's email here
      subject: "Congratulations! You've Earned Rewards",
      html: generateRewardEmail(eligibleRewards),
    };

    // Send the email
    // await transporter.sendMail(mailOptions);
  } catch (error) {
    console.error("Error sending reward email:", error);
  }
}

// Function to generate the HTML content of the reward email
function generateRewardEmail(eligibleRewards) {
  const brandName = config.brandName;

  const emailContent = `
    <div style="font-family: 'Arial', sans-serif; max-width: 90%; margin: 0 auto; padding: 20px; border: 1px solid #ccc; border-radius: 10px;">
        <h2 style="color: #333;">Hello Brand Ambassador,</h2>
        
        <p>Congratulations! You've earned rewards from ${brandName}. Here is your reward:</p>
        
        <ul style="list-style: none; padding: 0;">
            ${eligibleRewards
              .map(
                (reward) =>
                  `<li style="margin-bottom: 10px;"><strong>${reward.rewardGift} on reaching ${reward.rewardGift} points</strong> </li>`
              )
              .join("")}
        </ul>
        
        <p>Thank you for your dedication and hard work!</p>
        
        <p style="color: #555;">Best regards,<br>${brandName} Team</p>
    </div>
`;

  console.log(emailContent);
  return emailContent;
}
