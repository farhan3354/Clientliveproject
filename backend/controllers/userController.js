const session = require("express-session");
const bcrypt = require("bcrypt");
const moment = require("moment");
const nodemailer = require("nodemailer");
const config = require("../env");
const { v4: uuidv4 } = require('uuid');
const requestIp = require('request-ip'); // Import the library
const axios = require('axios');
const { pool, query } = require("../database"); // Import the database connection pool

// Configure your email transport
const transporter = nodemailer.createTransport({
  // Set your email service provider and credentials
  service: "gmail",
  auth: {
    user: "brandambassador.ai@gmail.com",
    pass: "ncxrbwfhmqrtczzw",
  },
});

// Enroll Program function from the old code
const enrolProgram = async (userId, programId) => {
  const userProgram = {
    userId: userId,
    programId: programId,
    programLink: `mba/${userId}/${programId}`,
    enrollmentDate: moment().format("YYYY-MM-DD HH:mm:ss"),
  };

  try {
    const rows = await query(
      "INSERT INTO UserPrograms (userId, programId, programLink, enrollmentDate) VALUES (?, ?, ?, ?)",
      [
        userProgram.userId,
        userProgram.programId,
        userProgram.programLink,
        userProgram.enrollmentDate,
      ]
    );

    if (rows.affectedRows === 1) {
      console.log("User enrolled in program:", programId);
    }
  } catch (error) {
    console.error("Error enrolling user in program:", error);
  }
};

// Function to generate a unique 4-character ID
function generate4CharId() {
  const chars = 'abcdefghijklmnopqrstuvwxyz0123456789';
  let id = '';
  for (let i = 0; i < 4; i++) {
    id += chars.charAt(Math.floor(Math.random() * chars.length));
  }
  return id;
}

// Unique ID generation check for new users
async function getUniqueUserId() {
  let userId;
  let exists = true;

  while (exists) {
    userId = generate4CharId();
    const existingUser = await query("SELECT userId FROM Users WHERE userId = ?", [userId]);
    if (existingUser.length === 0) {
      exists = false;
    }
  }
  return userId;
}

exports.register = async (req, res) => { 
  const { first_name, last_name, email, password, ref } = req.body;

  try {
    // Check if the email already exists
    const existingUserRows = await query("SELECT * FROM Users WHERE email = ?", [email]);
    if (existingUserRows.length > 0) {
      return res.status(409).send({ message: "Email already exists." });
    }

    // Generate a hashed password and unique user ID
    const hashedPassword = await bcrypt.hash(password, 10);
    const newUser = {
      userId: await getUniqueUserId(),
      firstName: first_name,
      lastName: last_name,
      email,
      password: hashedPassword,
      role: "mba",
      mailNotification: 1,
    };

    // Insert the new user into the Users table
    const insertUserQuery = `
      INSERT INTO Users (userId, firstName, lastName, email, password, role, mailNotification) 
      VALUES (?, ?, ?, ?, ?, ?, ?)
    `;
    const insertUserParams = [
      newUser.userId,
      newUser.firstName,
      newUser.lastName,
      newUser.email,
      newUser.password,
      newUser.role,
      newUser.mailNotification,
    ];

    const insertUserRows = await query(insertUserQuery, insertUserParams);

    if (insertUserRows.affectedRows === 1) {
      console.log("User registered:", email);

      // Set user session
      req.session.user = { userId: newUser.userId, role: newUser.role };

      // Respond to the client immediately
      res.json({
        userId: newUser.userId,
        role: newUser.role,
      });

      // Handle other tasks asynchronously
      (async () => {
        // Send Welcome Email to the User
        const mailOptions = {
          from: config.brandName + "BrandAmbassadors@gmail.com",
          to: email,
          subject: "Welcome to " + config.brandName + " Brand Ambassadors!",
          html: `<!DOCTYPE html>
                   <html>
                  <head>
                      <style>
                      /* CSS styles for the email */
                      body {
                          font-family: Arial, sans-serif;
                          line-height: 1.5;
                          color: #333333;
                          background-color: #f7f7f7;
                          margin: 0;
                          padding: 0;
                      }
              
                      .container {
                          max-width: 98%;
                          margin: 0 auto;
                          padding: 5px;
                          background-color: #ffffff;
                          border: 1px solid #dddddd;
                          border-radius: 10px;
                          box-shadow: 0px 2px 10px rgba(0, 0, 0, 0.1);
                          position: relative;
                          overflow: hidden;
                      }
              
                      h1 {
                          color: #555555;
                          font-size: 28px;
                          margin-bottom: 20px;
                      }
              
                      p {
                          margin: 10px 0;
                      }
              
                      ul {
                          list-style-type: disc;
                          padding-left: 20px;
                      }
              
                      li {
                          margin-bottom: 10px;
                      }
              
                      .highlight {
                          color: #ff6600;
                          font-weight: bold;
                      }
              
                      .background-top {
                          position: absolute;
                          top: 0;
                          left: 0;
                          width: 100%;
                          height: 50%;
                          background-color: #ff6600;
                          clip-path: polygon(0 0, 100% 0, 100% 100%, 0 90%);
                          z-index: -1;
                      }
              
                      .background-bottom {
                          position: absolute;
                          bottom: 0;
                          left: 0;
                          width: 100%;
                          height: 50%;
                          background-color: #ffcc80;
                          clip-path: polygon(0 10%, 100% 0, 100% 100%, 0 100%);
                          z-index: -1;
                      }
              
                      .logo {
                          width: 150px;
                          margin: 0 auto;
                          display: block;
                      }
              
                      .website-link {
                          display: inline-block;
                          text-align: center;
                          margin-top: 20px;
                          padding: 10px 20px;
                          background-color: #ff6600;
                          color: #ffffff;
                          text-decoration: none;
                          font-weight: bold;
                          border-radius: 5px;
                          transition: background-color 0.3s ease;
                      }
              
                      .website-link:hover {
                          background-color: #ff4c00;
                      }
              
                  </style>
                  </head>
                  <body>
                      <div class="container">
              
                          <div style="background-color: #f7f7f7;">
                              <div
                                  style="max-width: 95%; margin: 0 auto; background-color: #ffffff; border: 1px solid #dddddd; border-radius: 10px; padding: 40px; box-shadow: 0px 2px 10px rgba(0, 0, 0, 0.1);">
                                  <h1
                                      style="color: #555555; font-size: 28px; margin-bottom: 20px;">Welcome
                                      to ${config.brandName} Brand Ambassadors!
                                  </h1>
                                  <p>Dear ${
                                    newUser.firstName + " " + newUser.lastName
                                  },</p>
              
                                  <p>Welcome to ${
                                    config.brandName
                                  } Brand Ambassadors! We're excited to
                                      have you on board and appreciate your decision to join
                                      our ambassador community.</p>
              
                                  <p style="color: #ff6600; font-weight: bold;">Thank You for
                                      Joining 🎉</p>
              
                                  <p style="margin: 10px 0;">At ${
                                    config.brandName
                                  } Brand Ambassadors, we
                                      believe in recognizing and rewarding your efforts. As an
                                      ambassador, you have the opportunity to earn points and
                                      unlock fantastic rewards. Here's how it works:</p>
              
                                  <ol style="padding-left: 20px;">
                                      <li style="margin-bottom: 10px;">Share Your Link: Check your enrolled
                                          programs (Progam Detail or Program Links Tab), you have received a personalized shareable
                                          link. Spread the word by sharing this link with your
                                          network, friends, and social media followers. Every
                                          click and engagement on your link earns you valuable
                                          points.</li>
                                      <li style="margin-bottom: 10px;">Earn Points: The more
                                          people you engage, the higher your points! Keep
                                          sharing your link and encouraging participation to
                                          maximize your score.</li>
                                  </ol>
                                  <p class="highlight">Monthly & Yearly Rewards 🏆</p>
              
                                  <p>We reward our top performers! At the end of each month
                                      and year, the ambassador with the highest points will
                                      receive exclusive rewards, recognition, and exciting
                                      prizes.</p>
              
                                  <p>Stay enthusiastic, stay engaged, and aim for the top!
                                      Your dedication and efforts will be recognized and
                                      celebrated.</p>
              
                                  <p>We're here to support you on your journey as a ${
                                    config.brandName
                                  }
                                      Brand Ambassador. If you have any questions or need
                                      assistance, our team is ready to help.</p>
              
                                  <p>Welcome once again to the ${
                                    config.brandName
                                  } Brand Ambassadors
                                      family. Let's create a vibrant community of passionate
                                      individuals making a difference together.</p>
              
                                  <p>Best regards,</p>
                                  <p>${config.brandName} Brand Ambassadors</p>
                                  <a class="website-link"
                                      href="${
                                        config.brandSite
                                      }">Visit Website</a>
                              </div>
              
                          </div>
                      </div>
                  </body>
              </html>`, // truncated for brevity
        };

        try {
          const info = await transporter.sendMail(mailOptions);
          console.log("Email sent:", info.response);
        } catch (error) {
          console.log("Error sending email:", error);
        }

        // Process referral code if provided
        if (ref) {
          const { status, message } = await validateReferralCode(ref);
          if (status) {
            await query("INSERT INTO Referrals (referrerId, referredId) VALUES (?, ?)", [ref, newUser.userId]);
          } else {
            console.log("Invalid referral code provided:", message);
          }
        }

        // Enroll user in all programs
        const programRows = await query("SELECT programId FROM Programs");
        for (const programRow of programRows) {
          await enrolProgram(newUser.userId, programRow.programId);
        }
      })();

    }
  } catch (error) {
    console.error("Error registering user:", error);
    return res.status(500).send({ message: "Server error during registration." });
  }
};

// Referral validation function
async function validateReferralCode(ref) {
  try {
    const referrerUser = await query("SELECT userId FROM Users WHERE userId = ?", [ref]);
    if (referrerUser.length === 0) {
      return { status: false, message: "Invalid referral code." };
    }
    return { status: true, message: "Valid referral code." };
  } catch (error) {
    console.error("Error validating referral code:", error);
    return { status: false, message: "Server error." };
  }
}

// Separate endpoint for referral validation
exports.validateReferral = async (req, res) => {
  const { ref } = req.query;
  try {
    const { status, message } = await validateReferralCode(ref);
    if (status) {
      return res.status(200).send({ message });
    } else {
      return res.status(400).send({ message });
    }
  } catch (error) {
    console.error("Error validating referral code:", error);
    return res.status(500).send({ message: "Server error." });
  }
};

// Endpoint for generating referral link
exports.generateReferralLink = async (req, res) => {
  if (!req.session || !req.session.user || !req.session.user.userId) {
    return res.status(401).json({ message: "User not authenticated." });
  }

  const { userId } = req.session.user;

  try {
    const referralLink = `http://localhost:3000/register?ref=${userId}`;
    res.status(200).json({ referralLink });
  } catch (error) {
    console.error("Error generating referral link:", error);
    return res.status(500).json({ message: "Server error." });
  }
};



exports.signIn = async (req, res) => {
  const { email, password } = req.body;
  // return;
  try {
    const userRows = await query("SELECT * FROM Users WHERE email = ?", [
      email,
    ]);

    if (userRows.length === 0) {
        
      return res.status(401).send({ message: 'no user found' });
    }

    const user = userRows[0];
    const passwordIsValid = bcrypt.compareSync(password, user.password);

    if (!passwordIsValid) {
      return res.status(401).send({ message: "Invalid password." });
    }

    // Set the user data in the session
    req.session.user = { userId: user.userId, role: user.role };

    // Save the session
    req.session.save();

    res.status(200).json({ userId: user.userId, role: user.role });
  } catch (error) {
    console.log("Error signing in:", error);
    return res.status(500).json({ message: "Error on the server." });
  }
};


exports.getbyid = async (req, res) => {
  const userId = req.params.id;

  try {
    // Fetch user by ID
    const userRows = await query("SELECT * FROM Users WHERE userId = ?", [
      userId,
    ]);

    if (userRows.length === 0) {
      return res.status(404).json({ message: "User not found" });
    }

    const user = userRows[0];

    // Extract only the fields you want to return
    const userData = {
      firstName: user.firstName,
      lastName: user.lastName,
      email: user.email,
      phoneNumber: user.phoneNumber,
      city: user.city,
      state: user.state,
    };

    // Return the filtered data
    return res.json(userData);
  } catch (error) {
    console.error(error);
    return res.status(500).json({ message: "Internal server error" });
  }
};


exports.programs = async (req, res) => {
  try {
    const userId = req.params.userId; // Retrieve user ID from request parameters

    // Fetch user by ID
    const userRows = await query(
      "SELECT * FROM UserPrograms WHERE userId = ?",
      [userId]
    );

    const user = userRows[0];

    // Retrieve program details from user's records
    const programDetails = [];
    for (const record of userRows) {
      const programId = record.programId;

      // Fetch program details (programId, name, description, images)
      const programRows = await query(
        "SELECT programId, name, description, images FROM Programs WHERE programId = ?",
        [programId]
      );

      const program = programRows[0];

      programDetails.push({
        programId: program.programId,
        name: program.name,
        description: program.description,
        images: program.images,
      });
    }

    res.json(programDetails);
  } catch (error) {
    console.error("Error fetching program details:", error);
    res.status(500).json({ error: "Failed to fetch program details" });
  }
};

exports.programsLink = async (req, res) => {
  try {
    const userId = req.params.userId; // Retrieve user ID from request parameters

    // Fetch user by ID
    const userRows = await query(
      "SELECT * FROM UserPrograms WHERE userId = ?",
      [userId]
    );

    const user = userRows[0];

    // Retrieve program details from user's records
    const programDetails = [];
    for (const record of userRows) {
      const programId = record.programId;

      // Fetch program details (name and points)
      const programRows = await query(
        "SELECT name, points FROM Programs WHERE programId = ?",
        [programId]
      );

      const program = programRows[0];

      programDetails.push({
        programId: programId,
        name: program.name,
        programLink: record.programLink,
        programPoints: program.points,
      });
    }
    res.json(programDetails);
  } catch (error) {
    console.error("Error fetching program details:", error);
    res.status(500).json({ error: "Failed to fetch program details" });
  }
};

async function getUserRankInCurrentMonth(userId) {
  const currentDate = new Date();
  const startOfMonth = new Date(
    currentDate.getFullYear(),
    currentDate.getMonth(),
    1
  ).toISOString();
  const endOfMonth = new Date(
    currentDate.getFullYear(),
    currentDate.getMonth() + 1,
    0
  ).toISOString();

  const points = await query(
    `
    SELECT userId, SUM(pointsGiven) AS totalPoints
    FROM Points
    WHERE dateClickedAt >= ? AND dateClickedAt <= ?
    GROUP BY userId
    ORDER BY totalPoints DESC;
  `,
    [startOfMonth, endOfMonth]
  );

  const userRank =
    points.findIndex((item) => item.userId === userId.toString()) + 1;

  return userRank;
}

async function getUserRankInCurrentYear(userId) {
  const currentDate = new Date();
  const startOfYear = new Date(currentDate.getFullYear(), 0, 1).toISOString();
  const endOfYear = new Date(currentDate.getFullYear(), 11, 31).toISOString();

  const points = await query(
    `
    SELECT p.userId, SUM(p.pointsGiven) AS totalPoints
    FROM Points p
    WHERE p.dateClickedAt >= ? AND p.dateClickedAt <= ?
    GROUP BY p.userId
    ORDER BY totalPoints DESC;
  `,
    [startOfYear, endOfYear]
  );

  const userRank =
    points.findIndex((item) => item.userId === userId.toString()) + 1;

  return userRank;
}

exports.dash = async (req, res) => {
  try {
    const userId = req.params.id;
    let total_points = 0;

    // Total Programs
    const user = await query("SELECT * FROM Users WHERE userId = ?", [userId]);
    const programs = await query(
      "SELECT Count(*) as total FROM UserPrograms WHERE userId = ?",
      [userId]
    );

    console.log(programs);
    const totalPrograms = programs[0].total;

    const aggregateResult = await query(
      "SELECT SUM(pointsGiven) AS total_points FROM Points WHERE userId = ?",
      [userId]
    );

    if (aggregateResult.length > 0) {
      total_points = aggregateResult[0].total_points;
    }

    const MRank = await getUserRankInCurrentMonth(userId); // You need to implement this function for MySQL
    const YRank = await getUserRankInCurrentYear(userId); // You need to implement this function for MySQL

    const countResult = await query(
      "SELECT COUNT(*) AS total FROM Users WHERE role = 'mba'"
    );
    const count = countResult[0].total;

    console.log(count);

    res.json({
      totalPrograms,
      total_points,
      monthRank: MRank,
      yearRank: YRank,
      total: count,
    });
  } catch (error) {
    console.error("Error fetching user dashboard data:", error);
    res.status(500).json({ error: error });
  }
};

exports.getUserDetail = async (req, res) => {
  const userId = req.params.id;
  const currentDate = moment().startOf("day");

  try {
    const [yearly, quarterly, monthly, daily, clickRecord] = await Promise.all([
      getTotalPointsByDuration(userId, "last12months"),
      getTotalPointsByDuration(userId, "last3months"),
      getTotalPointsByDuration(userId, "last30days"),
      getTotalPointsByDuration(userId, "last24hours"),
      getMonthlyClickRecord(userId, currentDate),
    ]);
    res.json({
      yearly,
      quarterly,
      monthly,
      daily,
      clickRecord,
    });
  } catch (error) {
    console.error("Error fetching user details:", error);
    res.status(500).json({ error: "Internal Server Error" });
  }
};

async function getTotalPointsByDuration(userId, duration) {
  let startDate, endDate;

  switch (duration) {
    case "last24hours":
      startDate = moment().subtract(1, "days").startOf("day").toDate();
      endDate = moment().toDate();
      break;
    case "last30days":
      startDate = moment().subtract(30, "days").startOf("day").toDate();
      endDate = moment().toDate();
      break;
    case "last3months":
      startDate = moment().subtract(3, "months").startOf("month").toDate();
      endDate = moment().toDate();
      break;
    case "last12months":
      startDate = moment().subtract(12, "months").startOf("month").toDate();
      endDate = moment().toDate();
      break;
  }

  const queryk = `
  SELECT COALESCE(SUM(pointsGiven), 0) AS totalPoints
  FROM Points
  WHERE userId = ? AND dateClickedAt >= ? AND dateClickedAt <= ?;
  `;

  const rows = await query(queryk, [userId, startDate, endDate]);
  return rows[0].totalPoints;
}

// async function getMonthlyClickRecord(userId, currentDate) {
//   const clickRecord = [];
//   const startDate = moment(currentDate).startOf("month");

//   for (let month = 0; month < 12; month++) {
//     const monthStart = moment(startDate)
//       .subtract(month, "months")
//       .startOf("month")
//       .format("YYYY-MM-DD HH:mm:ss");

//     const monthEnd = moment(monthStart)
//       .endOf("month")
//       .format("YYYY-MM-DD HH:mm:ss");

//     const totalPoints = await getTotalPointsForMonth(
//       userId,
//       monthStart,
//       monthEnd
//     );
//     const monthName = moment(monthStart).format("MMMM");
//     clickRecord.push({ month: monthName, totalPoints });
//   }

//   return clickRecord.reverse(); // Reverse array to have data from current month to last 12 months
// }


// async function getTotalPointsByDuration(userId, duration) {
//   let startDate, endDate;

//   switch (duration) {
//     case "yearly":
//       startDate = moment().subtract(12, "months").startOf("month").toDate();
//       endDate = moment().subtract(0, "months").endOf("month").toDate();
//       break;
//     case "quarterly":
//       startDate = moment().subtract(3, "months").startOf("month").toDate();
//       endDate = moment().toDate();
//       break;
//     case "monthly":
//       startDate = moment().subtract(1, "months").startOf("month").toDate();
//       endDate = moment().toDate();
//       break;
//     case "daily":
//       startDate = moment().subtract(1, "days").startOf("day").toDate();
//       endDate = moment().toDate();
//       break;
//   }

//   const queryk = `
//   SELECT COALESCE(SUM(pointsGiven), 0) AS totalPoints
//   FROM Points
//   WHERE userId = ? AND DATE(dateClickedAt) >= ? AND DATE(dateClickedAt) <= ?;
//   `;

//   const rows = await query(queryk, [userId, startDate, endDate]);
//   return rows[0].totalPoints;
// }

async function getMonthlyClickRecord(userId, currentDate) {
  const clickRecord = [];
  const startDate = moment(currentDate).subtract(12, "months").startOf("month");

  for (let month = 1; month < 13; month++) {
    const monthStart = moment(startDate)
      .add(month, "months")
      .startOf("month")
      .format("YYYY-MM-DD HH:mm:ss"); // Format the date as "YYYY-MM-DD HH:mm:ss"

    const monthEnd = moment(monthStart)
      .endOf("month")
      .format("YYYY-MM-DD HH:mm:ss"); // Format the date as "YYYY-MM-DD HH:mm:ss"

    const totalPoints = await getTotalPointsForMonth(
      userId,
      monthStart,
      monthEnd
    );
    const monthName = moment(monthEnd).format("MMMM");
    clickRecord.push(totalPoints);
  }

  return clickRecord;
}

async function getTotalPointsForMonth(userId, startDate, endDate) {
  const queryk = `
    SELECT COALESCE(SUM(pointsGiven), 0) AS totalPoints
    FROM Points
    WHERE userId = ? AND dateClickedAt >= ? AND dateClickedAt <= ?;
  `;

  const rows = await query(queryk, [userId, startDate, endDate]);
  return rows[0].totalPoints;
}

exports.edit = async (req, res) => {
  const { id } = req.params;

  try {
    const updatedUser = req.body;
    // Update user by ID
    const updateResult = await query(
      "UPDATE Users SET firstName = ?, lastName = ?, email = ?, password = ?, role = ?,city=?, state=?,phoneNumber=?, mailNotification = ? WHERE userId = ?",
      [
        updatedUser.firstName,
        updatedUser.lastName,
        updatedUser.email,
        updatedUser.password,
        updatedUser.role,
        updatedUser.city,
        updatedUser.state,
        updatedUser.phoneNumber,
        updatedUser.mailNotification,
        id,
      ]
    );

    if (updateResult.affectedRows === 0) {
      return res.status(404).json({ error: "User not found" });
    }

    // Fetch the updated user's data
    const userRows = await query("SELECT * FROM Users WHERE userId = ?", [id]);

    const updatedUser2 = userRows[0];
    return res.json(updatedUser2);
  } catch (error) {
    console.error(error);
    return res.status(500).json({ error: "Server error" });
  }
};

exports.passwordChange = async (req, res) => {
  const { id } = req.params;
  const { currentPassword, newPassword } = req.body;
  console.log(id);
  // return;
  try {
    // Find the user by ID
    let user = null;
    if (id == "null") {
      user = await query("SELECT * FROM Users WHERE role = 'admin' LIMIT 1");
    } else {
      user = await query("SELECT * FROM Users WHERE userId = ?", [id]);
    }

    console.log(user);
    // Check if the user exists
    if (!user) {
      return res.status(404).json({ error: "User not found" });
    }

    const p = await bcrypt.hash(currentPassword, 10);

    // Compare the current password with the stored encrypted password
    const isMatch = await bcrypt.compare(currentPassword, user[0].password);

    // Check if the current password matches the user's password
    if (!isMatch) {
      return res.status(400).json({ error: "Current password is incorrect" });
    }

    // Update the user's password with the new encrypted password
    const hashedPassword = await bcrypt.hash(newPassword, 10);

    await query("UPDATE Users SET password = ? WHERE id = ?", [
      hashedPassword,
      user[0].id,
    ]);

    // Return success response
    res.status(200).json({ message: "Password changed successfully" });
  } catch (error) {
    console.error("Failed to change password:", error);
    res.status(500).json({ error: "Failed to change password" });
  }
};

exports.getalluser = async (req, res) => {
  try {
    const userRows = await query("SELECT * FROM Users WHERE role='mba'");

    res.json(userRows);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Internal server error" });
  }
};

exports.userMail = async (req, res) => {
  const { id } = req.params;
  const userRows = await query(
    "SELECT mailNotification FROM Users WHERE userId = ?",
    [id]
  );

  if (userRows.length === 0) {
    return res.status(404).json({ error: "User not found" });
  }

  const mailNotification = userRows[0].mailNotification;
  res.json({ mailNotification });
};

exports.toggleMailStatus = async (req, res) => {
  try {
    const { id } = req.params;
    // Fetch user by ID
    const userRows = await query("SELECT * FROM Users WHERE userId = ?", [id]);

    if (userRows.length === 0) {
      return res.status(404).json({ error: "User not found" });
    }

    const user = userRows[0];
    const mailNotif = !user.mailNotification;

    // Update mail notification status
    await query("UPDATE Users SET mailNotification = ? WHERE userId = ?", [
      mailNotif,
      id,
    ]);
    res.send("Done");
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Internal server error" });
  }
};

exports.mailSender = async (req, res) => {
  const email = req.params.mail;

  try {
    // Check if the user exists
    const userRows = await query("SELECT * FROM Users WHERE email = ?", [
      email,
    ]);

    if (userRows.length === 0) {
      return res.status(404).json({ error: "User not found" });
    }

    const user = userRows[0];

    // Generate OTP
    const otp = Math.floor(100000 + Math.random() * 900000);
    // Send OTP to the user's email
    const mailOptions = {
      from: "brandambassador.ai@gmail.com",
      to: email,
      subject: "Password Reset OTP",
      html: `
      <!DOCTYPE html>
      <html>
          <head>
              <style>
                /* CSS styles for the email */
                body {
                  font-family: Arial, sans-serif;
                  line-height: 1.5;
                  color: #333333;
                  background-color: #f9f9f9;
                  margin: 0;
                  padding: 0;
                }
                
                .container {
                  max-width: 600px;
                  margin: 0 auto;
                  padding: 20px;
                  border: 1px solid #dddddd;
                  border-radius: 5px;
                  background-color: #ffffff;
                  box-shadow: 0px 4px 8px rgba(0, 0, 0, 0.1);
                }
                
                h2 {
                  color: #555555;
                  margin-top: 0;
                }
                
                hr {
                  border: none;
                  border-top: 1px solid #dddddd;
                  margin: 20px 0;
                }
                
                p {
                  margin: 0 0 10px;
                }
                
                strong {
                  font-weight: bold;
                }
              </style>
          </head>
          <body>
              <div class="container">
                  <h2>Password Reset OTP</h2>
                  <p>Dear ${user.firstName + " " + user.lastName},</p>
      
                  <p>Your OTP for password reset is: <strong>${otp}</strong></p>
      
                  <p><strong>Important:</strong> Please do not share this OTP with
                      anyone.</p>
      
                  <p>If you did not request this OTP, please disregard this email and
                      ensure your account security.</p>
      
                  <p>Thank you for choosing <strong>${
                    config.brandName
                  } Brand Ambassadors.</strong></p>
              </div>
          </body>
      </html>
      `,
    };

    transporter.sendMail(mailOptions, (error, info) => {
      if (error) {
        console.log("Error sending email:", error);
        return res.status(500).json({ error: "Failed to send OTP" });
      }
      console.log("Email sent:", info.response);

      res.json({ otp });
    });
  } catch (error) {
    console.log("Error:", error);
    res.status(500).json({ error: "Server error" });
  }
};

exports.resetPass = async (req, res) => {
  const email = req.params.mail;
  const { newPassword } = req.body;

  try {
    // Find the user by email
    const user = await query("SELECT * FROM Users WHERE email = ?", [email]);

    if (!user) {
      return res.status(404).json({ error: "User not found" });
    }

    // Update the user's password with the new encrypted password
    const hashedPassword = await bcrypt.hash(newPassword, 10);
    await query("UPDATE Users SET password = ? WHERE email = ?", [
      hashedPassword,
      email,
    ]);

    // Return success response
    res.status(200).json({ message: "Password changed successfully" });
  } catch (error) {
    console.error("Failed to change password:", error);
    res.status(500).json({ error: "Failed to change password" });
  }
};

exports.getUserRankingsMonthly = async (req, res) => {
  try {
    const currentDate = new Date();

    // Construct and execute the MySQL query
    const rows = await query(`
      SELECT
          u.userId AS _id,
          u.firstName,
          u.lastName,
          IFNULL(SUM(IFNULL(p.pointsGiven, 0)), 0) AS totalPoints
      FROM
          Users u
      LEFT JOIN
          Points p ON u.userId = p.userId
      WHERE
          u.role = 'mba'
          AND (p.dateClickedAt BETWEEN DATE_FORMAT(NOW(), '%Y-%m-01') AND LAST_DAY(NOW()))
      GROUP BY
          u.userId, u.firstName, u.lastName
      ORDER BY
          totalPoints DESC;
    `);

    const currentMonth = currentDate.toLocaleString("default", {
      month: "long",
    });
    const currentYear = currentDate.getFullYear();

    const rankingsWithMonthYear = {
      month: currentMonth,
      year: currentYear,
      rankings: rows,
    };

    res.json(rankingsWithMonthYear);
  } catch (error) {
    console.error("Error fetching user rankings:", error);
    res.status(500).json({ error: "Server error" });
  }
};

exports.getUserRankingsLastMonth = async (req, res) => {
  try {
    const currentDate = new Date();
    // Calculate the first day of the last month
    const firstDayOfLastMonth = new Date(
      currentDate.getFullYear(),
      currentDate.getMonth() - 1,
      1
    );
    // Calculate the last day of the last month
    const lastDayOfLastMonth = new Date(
      currentDate.getFullYear(),
      currentDate.getMonth(),
      1
    );


// Calculate the first day of the next month
const firstDayOfNextMonth = new Date(
  currentDate.getFullYear(),
  currentDate.getMonth() + 1,
  1
);
    // Construct and execute the MySQL query
    const rows = await query(
      `
      SELECT
    u.userId AS _id,
    u.firstName,
    u.lastName,
    IFNULL(SUM(IFNULL(p.pointsGiven, 0)), 0) AS totalPoints
FROM
    Users u
LEFT JOIN
    Points p ON u.userId = p.userId
WHERE
    u.role = 'mba'
    AND (p.dateClickedAt >= ? AND p.dateClickedAt <= ?) -- Adjusted date range
GROUP BY
    u.userId, u.firstName, u.lastName
ORDER BY
    totalPoints DESC;

    `,
      [firstDayOfLastMonth, lastDayOfLastMonth]
    );

    const lastMonth = firstDayOfLastMonth.toLocaleString("default", {
      month: "long",
    });
    const lastYear = firstDayOfLastMonth.getFullYear();

    const rankingsWithMonthYear = {
      month: lastMonth,
      year: lastYear,
      rankings: rows,
    };

    res.json(rankingsWithMonthYear);
  } catch (error) {
    console.error("Error fetching user rankings:", error);
    res.status(500).json({ error: "Server error" });
  }
};
exports.getUserRankingsYearly = async (req, res) => {
  try {
    const currentDate = new Date();

    // Construct and execute the MySQL query
    const rows = await query(`
      SELECT
          u.userId AS _id,
          u.firstName,
          u.lastName,
          IFNULL(SUM(IFNULL(p.pointsGiven, 0)), 0) AS totalPoints
      FROM
          Users u
      LEFT JOIN
          Points p ON u.userId = p.userId
      WHERE
          u.role = 'mba'
          AND (p.dateClickedAt BETWEEN CONCAT(YEAR(NOW()), '-01-01') AND CONCAT(YEAR(NOW()), '-12-31'))
      GROUP BY
          u.userId, u.firstName, u.lastName
      ORDER BY
          totalPoints DESC;
    `);

    const currentYear = currentDate.getFullYear();

    const rankingsWithYear = {
      year: currentYear,
      rankings: rows,
    };

    res.json(rankingsWithYear);
  } catch (error) {
    console.error("Error fetching user rankings:", error);
    res.status(500).json({ error: "Server error" });
  }
};

// exports.getUserAllPoints = async (req, res) => {
//   try {
//     // Construct and execute the MySQL query
//     const rows = await query(`
//       SELECT
//           u.userId AS _id,
//           u.firstName,
//           u.lastName,
//           IFNULL(SUM(IFNULL(p.pointsGiven, 0)), 0) AS totalPoints
//       FROM
//           Users u
//       LEFT JOIN
//           Points p ON u.userId = p.userId
//       WHERE
//           u.role = 'mba'
//       GROUP BY
//           u.userId, u.firstName, u.lastName
//       ORDER BY
//           totalPoints DESC;
//     `);

//     res.json(rows);
//   } catch (error) {
//     console.error("Error fetching user points:", error);
//     res.status(500).json({ error: "Server error" });
//   }
// };

exports.getUserAllPoints = async (req, res) => {
  try {
    // Construct and execute the MySQL query
    const rows = await query(`
      SELECT
          u.userId AS _id,
          u.firstName,
          u.lastName,
          IFNULL(SUM(IFNULL(p.pointsGiven, 0)), 0) AS totalPoints
      FROM
          Users u
      LEFT JOIN
          Points p ON u.userId = p.userId
      WHERE
          u.role = 'mba' AND p.dateClickedAt > '2024-01-01'
      GROUP BY
          u.userId, u.firstName, u.lastName
      ORDER BY
          totalPoints DESC;
    `);

    res.json(rows);
  } catch (error) {
    console.error("Error fetching user points:", error);
    res.status(500).json({ error: "Server error" });
  }
};

exports.getUserAllPoints23 = async (req, res) => {
  try {
    // Construct and execute the MySQL query
    const rows = await query(`
      SELECT
          u.userId AS _id,
          u.firstName,
          u.lastName,
          IFNULL(SUM(IFNULL(p.pointsGiven, 0)), 0) AS totalPoints
      FROM
          Users u
      LEFT JOIN
          Points p ON u.userId = p.userId
      WHERE
          u.role = 'mba' AND p.dateClickedAt < '2024-01-01'
      GROUP BY
          u.userId, u.firstName, u.lastName
      ORDER BY
          totalPoints DESC;
    `);

    res.json(rows);
  } catch (error) {
    console.error("Error fetching user points:", error);
    res.status(500).json({ error: "Server error" });
  }
};



exports.getAllLocations = async (req, res) => {
  try {
    // Get all users from the users table
    const userRows = await query("SELECT * FROM Users");

    // Create a set of unique cities from user data
    const citySet = new Set();
    userRows.forEach((user) => {
      if (user.city) {
        const trimmedCity = user.city.trim();
        citySet.add(trimmedCity);
      }
    });

    // Convert set to array
    const locations = Array.from(citySet);

    // Initialize an array to store the result for each location
    const result = [];

    // Loop through each location and get the number of users and clicks for that location
    for (const location of locations) {
      const usersInLocation = userRows.filter(
        (user) => user.city && user.city.trim() === location
      ).length;

      // Get the total number of points for users in this location
      const pointsQuery = `
        SELECT COUNT(*) AS totalPoints
        FROM Points
        WHERE userId IN (SELECT userId FROM Users WHERE TRIM(city) = ?)
      `;
      const pointsRows = await query(pointsQuery, [location]);
      const points = pointsRows[0].totalPoints;

      result.push({ location, users: usersInLocation, clicks: points });
    }

    res.status(200).json(result);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Server error" });
  }
};

exports.pointsbyprogram = async (req, res) => {
  try {
    const userId = req.params.userId; // Retrieve user ID from request parameters
    // Fetch user by ID
    const userRows = await query(
      "SELECT * FROM UserPrograms WHERE userId = ?",
      [userId]
    );

    const user = userRows[0];

    // Retrieve program details from user's records
    const programDetails = [];
    for (const record of userRows) {
      const programId = record.programId;

      // Fetch program details (programId, name, description, images)
      const programRows = await query(
        "SELECT programId, name, description, images FROM Programs WHERE programId = ?",
        [programId]
      );

      const points = await query(
        "SELECT COUNT(*) as totalCount, SUM(pointsGiven) as totalPoints FROM Points WHERE programId = ? AND userId = ?",
        [programId, userId]
      );

      const program = programRows[0];

      programDetails.push({
        programId: program.programId,
        name: program.name,
        clicks: points[0].totalCount,
        points: points[0].totalPoints,
      });
    }
    res.json(programDetails);
  } catch (error) {
    console.error("Error fetching program details:", error);
    res.status(500).json({ error: "Failed to fetch program details" });
  }
};
