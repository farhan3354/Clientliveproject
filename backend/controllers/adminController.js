const config = require("../env");
const { query } = require("../database");
const nodemailer = require("nodemailer");

async function fetchAdminStats() {
  try {
    // setClicksPerHourArray(dashboardData.clicksPerHourArray);
    //   setClicksPerLast30DaysArray(dashboardData.clicksPerLast30DaysArray);
    //   setClicksPerQuarterArray(dashboardData.clicksPerQuarterArray);
    //   setClicksPerMonthArray(dashboardData.clicksPerMonthArray);
    // Get current date and time
    const currentDate2 = new Date();

    // Calculate the start time and end time for the last 24 hours
    const startTime = new Date(currentDate2.getTime() - 24 * 60 * 60 * 1000);

    // Create an array of hours within the last 24 hours
    const hoursArray2 = [];
    let currentHour1 = new Date(startTime);
    while (currentHour1 <= currentDate2) {
      hoursArray2.push(new Date(currentHour1));
      currentHour1.setHours(currentHour1.getHours() + 1);
    }

    // Create an array to store the counts
    const clicksPerHourArray = [];

    // Iterate through the hours and retrieve the points count for each hour
    for (const hour of hoursArray2) {
      const startHour = new Date(hour);
      console.log(startHour);
      const endHour = new Date(hour.getTime() + 60 * 60 * 1000); // Add 1 hour

      const countQuery = `
    SELECT COUNT(*) AS count
    FROM Points
    WHERE  dateClickedAt >= ? AND dateClickedAt < ?;
  `;

      const countResults = await query(countQuery, [startHour, endHour]);
      const count = countResults[0].count || 0;

      clicksPerHourArray.push({
        hour: hour.toLocaleString("en-US", { hour: "numeric", hour12: true }),
        count,
      });
    }
    console.log(clicksPerHourArray);
    // Get points count within the last 30 days
    const countsArray30 = await query(
      `
  SELECT date_series.day, COALESCE(COUNT(Points.dateClickedAt), 0) AS count
  FROM (
    SELECT DATE_FORMAT(NOW() - INTERVAL (a.a + (10 * b.a) + (100 * c.a)) DAY, '%Y-%m-%d') AS day
    FROM (
      SELECT 0 AS a UNION ALL SELECT 1 UNION ALL SELECT 2 UNION ALL SELECT 3
      UNION ALL SELECT 4 UNION ALL SELECT 5 UNION ALL SELECT 6
      UNION ALL SELECT 7 UNION ALL SELECT 8 UNION ALL SELECT 9
    ) AS a
    CROSS JOIN (
      SELECT 0 AS a UNION ALL SELECT 1 UNION ALL SELECT 2 UNION ALL SELECT 3
      UNION ALL SELECT 4 UNION ALL SELECT 5 UNION ALL SELECT 6
      UNION ALL SELECT 7 UNION ALL SELECT 8 UNION ALL SELECT 9
    ) AS b
    CROSS JOIN (
      SELECT 0 AS a UNION ALL SELECT 1 UNION ALL SELECT 2 UNION ALL SELECT 3
      UNION ALL SELECT 4 UNION ALL SELECT 5 UNION ALL SELECT 6
      UNION ALL SELECT 7 UNION ALL SELECT 8 UNION ALL SELECT 9
    ) AS c
  ) AS date_series
  LEFT JOIN Points ON DATE_FORMAT(Points.dateClickedAt, '%Y-%m-%d') = date_series.day 
  WHERE date_series.day >= DATE_FORMAT(NOW() - INTERVAL 30 DAY, '%Y-%m-%d')
  GROUP BY date_series.day
  ORDER BY date_series.day ASC;
  `
    );

    // Get points count for the last 7 days within the last 30 days
    const clicksPerQuarterArray = await query(
      `
      SELECT DATE_FORMAT(dateClickedAt, '%m-%d') AS day, COUNT(*) AS count
      FROM Points
      WHERE dateClickedAt >= DATE_SUB(NOW(), INTERVAL 30 DAY)
      GROUP BY day
      ORDER BY day ASC
      LIMIT 23, 7;
    `
    );

    // Get points count within the last 12 months
    const countsArray12 = await query(
      `
      SELECT DATE_FORMAT(dateClickedAt, '%Y-%m') AS month, COUNT(*) AS count
      FROM Points
      WHERE dateClickedAt >= DATE_SUB(NOW(), INTERVAL 1 YEAR)
      GROUP BY month
      ORDER BY month ASC;
    `
    );

    // Create an array of dates within the last 30 days
    const clicksPerLast30DaysArray = [];
    let currentDate = new Date();
    for (let i = 0; i < 30; i++) {
      const formattedDate = currentDate.toISOString().split("T")[0];
      const matchingDay = countsArray30.find(
        (count) => count.day === formattedDate
      );
      const count = matchingDay ? matchingDay.count : 0;
      clicksPerLast30DaysArray.unshift({ day: formattedDate, count });
      currentDate.setDate(currentDate.getDate() - 1);
    }

    // Create the countsArray12 including zero counts for months without points
    const countsArray12WithZeros = [];
    const currentMonth = new Date();
    for (let i = 0; i < 12; i++) {
      const formattedMonth = currentMonth
        .toISOString()
        .split("-")
        .slice(0, 2)
        .join("-");
      const matchingMonth = countsArray12.find(
        (count) => count.month === formattedMonth
      );
      const count = matchingMonth ? matchingMonth.count : 0;
      countsArray12WithZeros.unshift({ month: formattedMonth, count });
      currentMonth.setMonth(currentMonth.getMonth() - 1);
    }

    return {
      clicksPerHourArray,
      clicksPerLast30DaysArray,
      clicksPerQuarterArray,
      clicksPerMonthArray: countsArray12WithZeros,
    };
  } catch (error) {
    console.error("Error fetching points details:", error);
    throw error;
  }
}

async function getFirstData() {
  try {
    const userCountQuery = "SELECT COUNT(*) AS totalRegisteredUsers FROM Users";
    const programCountQuery = "SELECT COUNT(*) AS totalPrograms FROM Programs";
    const clicksCountQuery = "SELECT COUNT(*) AS totalClicksCount FROM Points";

    const [userCountResult, programCountResult, clicksCountResult] =
      await Promise.all([
        query(userCountQuery),
        query(programCountQuery),
        query(clicksCountQuery),
      ]);

    const totalRegisteredUsers = userCountResult[0].totalRegisteredUsers;
    const totalPrograms = programCountResult[0].totalPrograms;
    const totalClicksCount = clicksCountResult[0].totalClicksCount;
    const totalLinks = totalRegisteredUsers * totalPrograms;
    const dashboardData = {
      totalRegisteredUsers,
      totalPrograms,
      totalLinks,
      totalClicksCount,
    };

    return dashboardData;
  } catch (error) {
    console.error(error);
    throw new Error("Error fetching dashboard data");
  }
}

const ObjectId = require("mongodb").ObjectId;

async function getPointsByProgramId(programId1) {
  const programId = programId1;

  try {
    // Get current date and time
    const currentDate2 = new Date();

    // Calculate the start time and end time for the last 24 hours
    const startTime = new Date(currentDate2.getTime() - 24 * 60 * 60 * 1000);

    // Create an array of hours within the last 24 hours
    const hoursArray2 = [];
    let currentHour1 = new Date(startTime);
    while (currentHour1 <= currentDate2) {
      hoursArray2.push(new Date(currentHour1));
      currentHour1.setHours(currentHour1.getHours() + 1);
    }

    // Create an array to store the counts
    const countsArray24 = [];

    // Iterate through the hours and retrieve the points count for each hour
    for (const hour of hoursArray2) {
      const startHour = new Date(hour);
      console.log(startHour);
      const endHour = new Date(hour.getTime() + 60 * 60 * 1000); // Add 1 hour

      const countQuery = `
    SELECT COUNT(*) AS count
    FROM Points
    WHERE programId = ? AND dateClickedAt >= ? AND dateClickedAt < ?;
  `;

      const countResults = await query(countQuery, [
        programId,
        startHour,
        endHour,
      ]);
      const count = countResults[0].count || 0;

      countsArray24.push({
        hour: hour.toLocaleString("en-US", { hour: "numeric", hour12: true }),
        count,
      });
    }
    console.log(countsArray24);
    // Get points count within the last 30 days
    const countsArray30 = await query(
      `
  SELECT date_series.day, COALESCE(COUNT(Points.dateClickedAt), 0) AS count
  FROM (
    SELECT DATE_FORMAT(NOW() - INTERVAL (a.a + (10 * b.a) + (100 * c.a)) DAY, '%Y-%m-%d') AS day
    FROM (
      SELECT 0 AS a UNION ALL SELECT 1 UNION ALL SELECT 2 UNION ALL SELECT 3
      UNION ALL SELECT 4 UNION ALL SELECT 5 UNION ALL SELECT 6
      UNION ALL SELECT 7 UNION ALL SELECT 8 UNION ALL SELECT 9
    ) AS a
    CROSS JOIN (
      SELECT 0 AS a UNION ALL SELECT 1 UNION ALL SELECT 2 UNION ALL SELECT 3
      UNION ALL SELECT 4 UNION ALL SELECT 5 UNION ALL SELECT 6
      UNION ALL SELECT 7 UNION ALL SELECT 8 UNION ALL SELECT 9
    ) AS b
    CROSS JOIN (
      SELECT 0 AS a UNION ALL SELECT 1 UNION ALL SELECT 2 UNION ALL SELECT 3
      UNION ALL SELECT 4 UNION ALL SELECT 5 UNION ALL SELECT 6
      UNION ALL SELECT 7 UNION ALL SELECT 8 UNION ALL SELECT 9
    ) AS c
  ) AS date_series
  LEFT JOIN Points ON DATE_FORMAT(Points.dateClickedAt, '%Y-%m-%d') = date_series.day AND Points.programId = ?
  WHERE date_series.day >= DATE_FORMAT(NOW() - INTERVAL 30 DAY, '%Y-%m-%d')
  GROUP BY date_series.day
  ORDER BY date_series.day ASC;
  `,
      [programId]
    );

    // Get points count for the last 7 days within the last 30 days
    const last7days = await query(
      `
      SELECT DATE_FORMAT(dateClickedAt, '%m-%d') AS day, COUNT(*) AS count
      FROM Points
      WHERE programId = ? AND dateClickedAt >= DATE_SUB(NOW(), INTERVAL 30 DAY)
      GROUP BY day
      ORDER BY day ASC
      LIMIT 23, 7;
    `,
      [programId]
    );

    // Get points count within the last 12 months
    const countsArray12 = await query(
      `
      SELECT DATE_FORMAT(dateClickedAt, '%Y-%m') AS month, COUNT(*) AS count
      FROM Points
      WHERE programId = ? AND dateClickedAt >= DATE_SUB(NOW(), INTERVAL 1 YEAR)
      GROUP BY month
      ORDER BY month ASC;
    `,
      [programId]
    );

    // Create an array of dates within the last 30 days
    const datesArray = [];
    let currentDate = new Date();
    for (let i = 0; i < 30; i++) {
      const formattedDate = currentDate.toISOString().split("T")[0];
      const matchingDay = countsArray30.find(
        (count) => count.day === formattedDate
      );
      const count = matchingDay ? matchingDay.count : 0;
      datesArray.unshift({ day: formattedDate, count });
      currentDate.setDate(currentDate.getDate() - 1);
    }

    // Create the countsArray12 including zero counts for months without points
    const countsArray12WithZeros = [];
    const currentMonth = new Date();
    for (let i = 0; i < 12; i++) {
      const formattedMonth = currentMonth
        .toISOString()
        .split("-")
        .slice(0, 2)
        .join("-");
      const matchingMonth = countsArray12.find(
        (count) => count.month === formattedMonth
      );
      const count = matchingMonth ? matchingMonth.count : 0;
      countsArray12WithZeros.unshift({ month: formattedMonth, count });
      currentMonth.setMonth(currentMonth.getMonth() - 1);
    }

    const totalQuery =
      "SELECT COUNT(*) AS total FROM Points where programId = ?";
    const totalPointsResult = await query(totalQuery, [programId]);
    const totalPoints = totalPointsResult[0].total;

    return {
      countsArray24,
      datesArray,
      last7days,
      countsArray12: countsArray12WithZeros,
      totalPoints,
    };
  } catch (error) {
    console.error("Error fetching points details:", error);
    throw error;
  }
}

// Function to get all program IDs
async function getAllProgramIds() {
  try {
    const programRows = await query(
      "SELECT programId, promotionLink, name FROM Programs"
    );
    return programRows.map((program) => {
      return {
        id: program.programId,
        link: program.promotionLink,
        name: program.name,
      };
    });
  } catch (error) {
    console.error("Error getting program IDs:", error);
    return [];
  }
}

async function getDetailByProgram(id) {
  const both = [];
  if (id == "All") {
    const getAllid = await getAllProgramIds();
    let i = 0;
    for (const idd of getAllid) {
      both[i] = await getPointsByProgramId(idd.id);
      i++;
    }
    console.log(both);
    return both;
  } else {
    console.log(id);
    const pointsDetail = await getPointsByProgramId(id);
    return pointsDetail;
  }
}

async function sendMailtomba(req, res) {
  const { message } = req.body;

  try {
    // Fetch users with mailNotification set to true
    const users = await query(
      "SELECT * FROM Users WHERE mailNotification = ?",
      [true]
    );

    // Configure your email transport
    const transporter = nodemailer.createTransport({
      // Set your email service provider and credentials
      service: "gmail",
      auth: {
        user: "brandambassador.ai@gmail.com",
        pass: "ncxrbwfhmqrtczzw",
      },
    });

    // Send email to each user
    for (const user of users) {
      const text = `
        <!DOCTYPE html>
        <html>
        <head>
          <style>
            /* CSS styles for the email */
            body {
              font-family: Arial, sans-serif;
              line-height: 1.5;
              color: #333333;
            }
            
            .container {
              max-width: 600px;
              margin: 0 auto;
              padding: 20px;
              border: 1px solid #dddddd;
              border-radius: 5px;
              background-color: #f9f9f9;
            }
            
            h1 {
              color: #555555;
            }
            
            hr {
              border: none;
              border-top: 1px solid #dddddd;
              margin: 20px 0;
            }
            
            p {
              margin: 0 0 10px;
            }
          </style>
        </head>
        <body>
          <div class="container">
           <p>Dear ${user.firstName + " " + user.lastName},</p>
          <hr>
            ${message}
            <hr>
            <p>Visit <a href="${config.brandSite}/signin">${
        config.brandSite
      }/signin</a></p>
            
            <p>Thank you for your participation! Keep sharing your links and earning points to increase your chances of winning the monthly and weekly rewards. The more you share, the more points you can accumulate. Good luck!</p>
            
            <p>Best regards,<br>${config.brandName} Brand Ambassadors</p>
          </div>
        </body>
        </html>
        `;

      const mailOptions = {
        from: config.brandName + " Brand Ambassadors",
        to: user.email,
        subject: config.brandName + " Brand Ambassadors",
        html: text,
      };

      // Send email
      const sendEmail = (mailOptions) => {
        return new Promise((resolve, reject) => {
          transporter.sendMail(mailOptions, (error, info) => {
            if (error) {
              reject(error);
            } else {
              resolve(info.response);
            }
          });
        });
      };

      // Usage
      try {
        const emailResponse = await sendEmail(mailOptions);
        console.log("Email sent:", emailResponse);
      } catch (error) {
        console.error("Error sending email:", error);
      }
    }

    return "Sent Successfully";
  } catch (error) {
    console.error(error);
    return "Error while sending mail";
  }
}

module.exports = {
  fetchAdminStats,
  getFirstData,

  getDetailByProgram,
  getAllProgramIds,
  sendMailtomba,
};
