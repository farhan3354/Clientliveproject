const nodemailer = require("nodemailer");
const { query } = require("./database"); // Import the query function from your database file
const config = require("./env");

function sendMailToMba() {
  const getUsersQuery = "SELECT * FROM Users WHERE mailNotification = 1";

  query(getUsersQuery)
    .then((userResults) => {
      const transporter = nodemailer.createTransport({
        service: "gmail",
        auth: {
          user: "brandambassador.ai@gmail.com",
          pass: "ncxrbwfhmqrtczzw",
        },
      });
      // console.log(userResults);
      // return;
      for (const user of userResults) {
        const userId = user.userId;

        const getCurrentWeekPointsQuery = `
        SELECT DATE_FORMAT(dates.day, '%Y-%m-%d') AS day, COALESCE(SUM(p.pointsGiven), 0) AS dayPoints
FROM (
  SELECT CURDATE() - INTERVAL (a.a + (10 * b.a) + (100 * c.a)) DAY AS day
  FROM (SELECT 0 AS a UNION ALL SELECT 1 UNION ALL SELECT 2 UNION ALL SELECT 3 UNION ALL SELECT 4 UNION ALL SELECT 5 UNION ALL SELECT 6 UNION ALL SELECT 7 UNION ALL SELECT 8 UNION ALL SELECT 9) AS a
  CROSS JOIN (SELECT 0 AS a UNION ALL SELECT 1 UNION ALL SELECT 2 UNION ALL SELECT 3 UNION ALL SELECT 4 UNION ALL SELECT 5 UNION ALL SELECT 6 UNION ALL SELECT 7 UNION ALL SELECT 8 UNION ALL SELECT 9) AS b
  CROSS JOIN (SELECT 0 AS a UNION ALL SELECT 1 UNION ALL SELECT 2 UNION ALL SELECT 3 UNION ALL SELECT 4 UNION ALL SELECT 5 UNION ALL SELECT 6 UNION ALL SELECT 7 UNION ALL SELECT 8 UNION ALL SELECT 9) AS c
) AS dates
LEFT JOIN Points AS p ON DATE_FORMAT(p.dateClickedAt, '%Y-%m-%d') = DATE_FORMAT(dates.day, '%Y-%m-%d') AND p.userId = '${userId}'
WHERE dates.day >= DATE_SUB(CURDATE(), INTERVAL 7 DAY)
GROUP BY dates.day
ORDER BY dates.day;

        `;

        const getCurrentYearPointsQuery = `
          SELECT userId, SUM(pointsGiven) AS yearPoints
          FROM Points
          WHERE userId = '${userId}' AND YEAR(dateClickedAt) = YEAR(CURDATE())
          GROUP BY userId
          ORDER BY yearPoints DESC
        `;

        query(getCurrentWeekPointsQuery)
          .then((weekPointsResults) => {
            // console.log(weekPointsResults);
            const totalWeekPoints = weekPointsResults.reduce(
              (total, row) => total + row.dayPoints,
              0
            );

            const pointsByDay = weekPointsResults.map((row) => ({
              day: row.day,
              points: row.dayPoints,
            }));

            const getCurrentMonthPointsQuery = `
              SELECT userId, SUM(pointsGiven) AS monthPoints
              FROM Points
              WHERE MONTH(dateClickedAt) = MONTH(CURDATE())
              GROUP BY userId
              ORDER BY monthPoints DESC
            `;

            query(getCurrentMonthPointsQuery, (error, monthPointsResults) => {
              if (error) {
                console.error("Error fetching month points:", error);
                return;
              }

              // Calculate the total points for each user
              const userTotalPoints = monthPointsResults.reduce((acc, row) => {
                acc[row.userId] = row.monthPoints;
                return acc;
              }, {});

              // Sort the results in descending order
              const sortedMonthPoints = [...monthPointsResults].sort(
                (a, b) => b.monthPoints - a.monthPoints
              );

              // Find the rank and points needed for the current user
              const userIndex = sortedMonthPoints.findIndex(
                (record) => record.userId === userId
              );
              const userMonthPoints = userTotalPoints[userId] || 0;
              const monthRank = userIndex + 1;
              const pointsNeededForMonthTop =
                monthRank > 0
                  ? sortedMonthPoints[0].monthPoints - userMonthPoints
                  : 0;

              // Now you have userTotalPoints, userMonthPoints, monthRank, and pointsNeededForMonthTop
              console.log(monthRank);
              console.log(pointsNeededForMonthTop);

              const getCurrentYearPointsQuery = `
              SELECT userId, SUM(pointsGiven) AS yearPoints
              FROM Points
              WHERE YEAR(dateClickedAt) = YEAR(CURDATE())
              GROUP BY userId
              ORDER BY yearPoints DESC
            `;

              const getUserYearPointsAndRank = () => {
                return new Promise((resolve, reject) => {
                  query(
                    getCurrentYearPointsQuery,
                    (error, yearPointsResults) => {
                      if (error) {
                        console.error("Error fetching year points:", error);
                        reject(error);
                        return;
                      }

                      const userYearPointsRecord = yearPointsResults.find(
                        (record) => record.userId === userId
                      );
                      const userYearPoints = userYearPointsRecord
                        ? userYearPointsRecord.yearPoints
                        : 0;
                      const userYearRank =
                        yearPointsResults.findIndex(
                          (record) => record.userId === userId
                        ) + 1;

                      // Calculate points needed to be on top
                      let pointsNeededForYearTop = 0;
                      if (
                        userYearRank > 0 &&
                        userYearRank <= yearPointsResults.length
                      ) {
                        const topPersonPoints = yearPointsResults[0].yearPoints;
                        pointsNeededForYearTop =
                          topPersonPoints - userYearPoints;
                      }

                      resolve({ userYearRank, pointsNeededForYearTop });
                    }
                  );
                });
              };

              getUserYearPointsAndRank()
                .then(({ pointsNeededForYearTop, userYearRank }) => {
                  console.log(pointsNeededForYearTop);
                  console.log(userYearRank);
                  const emailContent = `
                    <!DOCTYPE html>
                    <html>
                    <head>
                      <style>
                        /* CSS styles for the email */
                        /* Add your styles here */
                      </style>
                    </head>
                    <body>
                      <div class="container">
                        <h1>Weekly Point Summary</h1>
                        <p>Dear ${user.firstName + " " + user.lastName},</p>
      
                        <p>This is the summary of this week's points:</p>
                        <hr>
                         <p>Points in this week: ${totalWeekPoints} </p>
                        <!-- Add breakdown of points for each day -->
                        <ul>
                          ${pointsByDay
                            .map(
                              (dayPoints) =>
                                `<li>${dayPoints.day}: ${dayPoints.points} points</li>`
                            )
                            .join("")}
                        </ul>
                        <p>Your rank for the month: ${monthRank}</p>
                        <p>Points needed to be number 1 for the month: ${pointsNeededForMonthTop}</p>
                        <p>Your rank for the year: ${userYearRank}</p>
                        <p>Points needed to be number 1 for the year: ${pointsNeededForYearTop}</p>
                        <!-- Add more content as needed -->
                      </div>
                    </body>
                    </html>
                    `;

                  console.log(emailContent);
                  // return;

                  const mailOptions = {
                    from: `${config.brandName} Brand Ambassadors`,
                    to: user.email,
                    subject: `Points Summary by ${config.brandName} Brand Ambassadors (${config.siteName})`,
                    html: emailContent,
                  };

                  transporter.sendMail(mailOptions, (error, info) => {
                    if (error) {
                      console.error("Error sending email:", error);
                    } else {
                      console.log("Email sent:", info.response);
                    }
                  });
                })
                .catch((error) => {
                  console.error("Error fetching year points:", error);
                });
            }).catch((error) => {
              console.error("Error fetching month points:", error);
            });
          })
          .catch((error) => {
            console.error("Error fetching week points:", error);
          });
      }
    })
    .catch((error) => {
      console.error("Error fetching users:", error);
    });
}

const calculateRecordsLast7Days = async () => {
  const today = new Date();
  const sevenDaysAgo = new Date(today);
  sevenDaysAgo.setDate(today.getDate() - 6);

  const daysOfWeek = [
    "Sunday",
    "Monday",
    "Tuesday",
    "Wednesday",
    "Thursday",
    "Friday",
    "Saturday",
  ];

  try {
    const records = await query(
      'SELECT DAYOFWEEK(dateClickedAt) AS day, DATE_FORMAT(dateClickedAt, "%d/%m") AS date, COUNT(*) AS clicks ' +
        "FROM Points " +
        "WHERE dateClickedAt BETWEEN ? AND ? " +
        "GROUP BY day, date " +
        "ORDER BY day",
      [sevenDaysAgo, today]
    );

    const sortedRecords = [];
    let total = 0;
    for (let dayIndex = 0; dayIndex <= 6; dayIndex++) {
      const matchedRecord = records.find(
        (record) => record.day - 1 === dayIndex
      );
      const dayOfWeek = daysOfWeek[dayIndex];
      const currentDay = new Date(sevenDaysAgo);
      currentDay.setDate(sevenDaysAgo.getDate() + dayIndex); // Increment the correct date
      const dateString = `${currentDay.getDate()}/${currentDay.getMonth() + 1}`;
      // Get the day of the week as an integer (0 = Sunday, 1 = Monday, etc.)
      const dayOfWeekIndex = currentDay.getDay();

      // Get the day name based on the day of the week index
      const dayName = daysOfWeek[dayOfWeekIndex];

      const clicks = matchedRecord ? matchedRecord.clicks : 0;
      total += clicks;
      sortedRecords.push({
        dayName,
        date: dateString,
        clicks,
      });
    }

    let eachPrgram = "";

    // Fetch programs using MySQL query
    let programs = await query("SELECT * FROM Programs");

    for (const program of programs) {
      console.log(1);
      eachPrgram += `<p>Traffic for program ${program.name} - ${program.promotionLink}</p><ul>`;

      // Fetch records for each program's promotion link using MySQL query
      let programRecords = await query(
        'SELECT DAYOFWEEK(dateClickedAt) AS day, DATE_FORMAT(dateClickedAt, "%d/%m") AS date, COUNT(*) AS clicks ' +
          "FROM Points " +
          "WHERE dateClickedAt BETWEEN ? AND ? AND programId = ? " +
          "GROUP BY day, date " +
          "ORDER BY day",
        [sevenDaysAgo, today, program.programId]
      );

      let tt = 0;
      for (let dayIndex = 0; dayIndex <= 6; dayIndex++) {
        const matchedRecord = programRecords.find(
          (record) => record.day - 1 === dayIndex
        );
        const dayOfWeek = daysOfWeek[dayIndex];
        const currentDay = new Date(sevenDaysAgo);
        currentDay.setDate(sevenDaysAgo.getDate() + dayIndex);
        const dateString = `${currentDay.getDate()}/${
          currentDay.getMonth() + 1
        }`;

        const clicks = matchedRecord ? matchedRecord.clicks : 0;
        const dayOfWeekIndex = currentDay.getDay();

        // Get the day name based on the day of the week index
        const dayName = daysOfWeek[dayOfWeekIndex];
        tt += clicks;
        eachPrgram += `<li>${dayName} [${dateString}]: ${clicks} visitors</li>`;
      }
      eachPrgram += `</ul><p>Total : ${tt} visitors</p><hr>`;
    }

    // ... (same as before)
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
          <h1>Weekly Traffic Summary</h1>
          <p>Here is the summary for this week's traffic</p>
          <hr>
          <p>Overall Traffic for all programs in this week: ${total} visitors</p>
          <ul>
            ${sortedRecords
              .map(
                (elem) =>
                  `<li>${elem.dayName} [${elem.date}]: ${elem.clicks} visitors</li>`
              )
              .join("")}
          </ul>
          <hr>

         ${eachPrgram}

          <p>For more detailed analysis, visit <a href="${
            config.brandSite
          }/signin">${config.brandSite}/signin</a></p>

          <p>Best regards,<br>${config.brandName} Brand Ambassadors</p>
        </div>
      </body>
      </html>
      `;

    console.log(text);
    // Configure your email transport
    const transporter = nodemailer.createTransport({
      // Set your email service provider and credentials
      service: "gmail",
      auth: {
        user: "brandambassador.ai@gmail.com",
        pass: "ncxrbwfhmqrtczzw",
      },
    });

    // Send email
    const sendEmail = (mailOptions) => {
      return new Promise((resolve, reject) => {
        const mailOptions = {
          from: `${config.brandName} Brand Ambassadors`,
          to: config.adminMail,
          subject: `Traffic Detail Summary by ${config.brandName} Brand Ambassadors (${config.brandSite})`,
          html: text,
        };
        transporter.sendMail(mailOptions, (error, info) => {
          if (error) {
            reject(error);
          } else {
            resolve(info.response);
          }
        });
      });
    };
    sendEmail();
  } catch (error) {
    console.error("Error:", error);
    return;
  }
};
// calculateRecordsLast7Days();
module.exports = {
  sendMailToMba,
  calculateRecordsLast7Days,
};
