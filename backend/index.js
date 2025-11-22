const express = require("express");
const app = express();
const bodyParser = require("body-parser");
const cors = require("cors");
const session = require("express-session");
const cookieParser = require("cookie-parser");
const { pool, query, query2 } = require("./database"); // Import the database connection pool
const config = require("./env");
const schedule = require("node-schedule");
const { sendMailToMba, calculateRecordsLast7Days } = require("./mails.js"); // Replace with the correct path to your script
const trackUserMiddleware = require("./middleware/trackMiddleware.js");
const axios = require("axios"); // For API requests

app.use(trackUserMiddleware);

// Schedule the tasks to run at 9 AM on Monday mornings
const sendMailJob = schedule.scheduleJob(
  { hour: 9, minute: 0, dayOfWeek: 1 },
  sendMailToMba
);
const calculateRecordsJob = schedule.scheduleJob(
  { hour: 9, minute: 0, dayOfWeek: 1 },
  calculateRecordsLast7Days
);

// Console log to indicate that the tasks are scheduled
console.log("Tasks scheduled to run at 9 AM on Monday mornings");


app.set('trust proxy', true);


app.use(
  cors({
    origin: ["http://localhost:3000", config.brandSite, config.corsSite],
    credentials: true,
    methods: ["GET", "POST", "PUT", "DELETE"], // Allowed request methods

  })
);

// app.use(
//   cors()
// );

app.use(
  session({
    key: "userId",
    secret: "thisismysecrctekeyfhrgfgrfrty84fwir767",
    resave: false, // Set to false to avoid unnecessary session saves
    saveUninitialized: true, // Set to true to ensure the session is stored even if it is new
    cookie: {
      maxAge: 31536000000, // 1 year
      httpOnly: true,
      secure: false, // Set to true in production when using HTTPS
      sameSite: "lax",
    },
  })
);

app.use(cookieParser());

app.use(bodyParser.json({ limit: "50mb" }));
app.use(bodyParser.urlencoded({ extended: true }));
app.use("/uploads", express.static("uploads"));

const routes = require("./routes/allRoutes");
app.use("/", routes);

app.get("/api/destroy", async (req, res) => {
  if (req.session && req.session.user) {
    req.session.destroy();
    res.json({ message: "done" });
  }
});

app.get("/api/check-session", async (req, res) => {
  if (req.session && req.session.user) {
    const userRole = req.session.user.role;
    const userId = req.session.user.userId;

    // Your logic to check the user's role and respond accordingly
    if (userRole === "admin") {
      res.status(200).json({ isLoggedIn: true, role: "admin" });
    } else if (userRole === "mba") {
      res.status(200).json({ isLoggedIn: true, role: "mba", userId: userId });
    } else {
      res.status(401).json({ isLoggedIn: true, role: "unknown" });
    }
  } else {
    res.status(200).json({ isLoggedIn: false });
  }
});
// app.use((req, res, next) => {
//   console.log("Current Session:", req.session);
//   next();
// });

// Function to fetch location data from IP
async function fetchLocation(ip) {
  try {
    const response = await axios.get(`http://ip-api.com/json/${ip}`);
    if (response.data.status === "fail") return null; // If failed, return null

    return {
      country: response.data.country || "Unknown",
      region: response.data.regionName || "Unknown",
      city: response.data.city || "Unknown",
      latitude: response.data.lat || null,
      longitude: response.data.lon || null
    };
  } catch (error) {
    console.error("Error fetching location:", error);
    return null;
  }
}

app.post("/api/customer_detail", async (req, res) => {
  const userData = req.body;

  if (!userData || Object.keys(userData).length === 0) {
    return res.status(400).json({ error: "Invalid data received" });
  }

  console.log("Received Data:", JSON.stringify(userData, null, 2));

  const {
    ipAddress,
    deviceType,
    browser,
    sessionStartTime,
    email,
    currentUrl,
    timeSpent,
    maid,
    utmInfo,
    userKey,
    userValue,
    eventType,
  } = userData;

  try {
    // Fetch user location
    const locationData = await fetchLocation(ipAddress);

    // Check if user session exists
    const results = await query2("SELECT * FROM customer_details WHERE ip_address = ?", [ipAddress]);

    if (results.length > 0) {
      // User exists, update data
      const existingData = results[0];

      // Merge Emails (Prevent duplicates)
      let existingEmails = JSON.parse(existingData.emails || "[]");
      if (!existingEmails.includes(email)) {
        existingEmails.push(email);
      }

      // Merge URLs (Prevent duplicates)
      let existingUrls = JSON.parse(existingData.urls || "[]");
      if (!existingUrls.includes(currentUrl)) {
        existingUrls.push(currentUrl);
      }

      // Retrieve existing event history
      let eventHistory = JSON.parse(existingData.event_history || "[]");

      // Add new event to history
      eventHistory.push({
        eventType,
        timestamp: Date.now(),
      });

      // Calculate new timeSpent (previous timeSpent + new session timeSpent)
      let totalTimeSpent = existingData.time_spent + timeSpent;

      // Count how many times "pageExit" occurred
      const exitCount = eventHistory.filter(event => event.eventType === "pageExit").length;
      const intervalPingCount = eventHistory.filter(event => event.eventType === "intervalPing").length;

      // Update user session data
      await query2(
        `UPDATE customer_details 
         SET emails = ?, urls = ?, time_spent = ?, event_history = ?, 
             country = ?, region = ?, city = ?, latitude = ?, longitude = ?, updated_at = NOW()
         WHERE ip_address = ?`,
        [
          JSON.stringify(existingEmails),
          JSON.stringify(existingUrls),
          totalTimeSpent,
          JSON.stringify(eventHistory),
          locationData?.country,
          locationData?.region,
          locationData?.city,
          locationData?.latitude,
          locationData?.longitude,
          ipAddress
        ]
      );

      // Handle daily time spent tracking
      const currentDate = new Date().toISOString().split('T')[0];  // Format as YYYY-MM-DD

      // Check if there's already an entry for today's date
      const dailyResults = await query2("SELECT * FROM daily_time_spent WHERE ip_address = ? AND date = ?", [ipAddress, currentDate]);

      if (dailyResults.length > 0) {
        // If the entry exists, update the time spent for today
        await query2(
          `UPDATE daily_time_spent 
           SET time_spent = time_spent + ? 
           WHERE ip_address = ? AND date = ?`,
          [timeSpent, ipAddress, currentDate]
        );
      } else {
        // If the entry does not exist, insert a new record
        await query2(
          `INSERT INTO daily_time_spent (ip_address, date, time_spent) 
           VALUES (?, ?, ?)`,
          [ipAddress, currentDate, timeSpent]
        );
      }

      return res.json({
        message: "User data updated successfully",
        exitCount,
        intervalPingCount,
        totalTimeSpent,
        location: locationData,
        eventHistory
      });

    } else {
      // Insert new record if user does not exist
      const newEventHistory = JSON.stringify([{ eventType, timestamp: Date.now() }]);

      await query2(
        `INSERT INTO customer_details 
         (ip_address, device_type, browser, session_start_time, emails, urls, time_spent, maid, 
          utm_source, utm_medium, utm_campaign, utm_term, utm_content, user_key, user_value, event_type, 
          event_history, country, region, city, latitude, longitude) 
         VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`,
        [
          ipAddress,
          deviceType,
          browser,
          sessionStartTime,
          JSON.stringify([email]),
          JSON.stringify([currentUrl]),
          timeSpent,
          maid,
          utmInfo?.utm_source,
          utmInfo?.utm_medium,
          utmInfo?.utm_campaign,
          utmInfo?.utm_term,
          utmInfo?.utm_content,
          userKey,
          userValue,
          eventType,
          newEventHistory,
          locationData?.country,
          locationData?.region,
          locationData?.city,
          locationData?.latitude,
          locationData?.longitude
        ]
      );

      // Handle daily time spent tracking for new user
      const currentDate = new Date().toISOString().split('T')[0];

      await query2(
        `INSERT INTO daily_time_spent (ip_address, date, time_spent) 
         VALUES (?, ?, ?)`,
        [ipAddress, currentDate, timeSpent]
      );

      return res.json({
        message: "User data inserted successfully",
        exitCount: 0,
        intervalPingCount: eventType === "intervalPing" ? 1 : 0,
        totalTimeSpent: timeSpent,
        location: locationData,
        eventHistory: JSON.parse(newEventHistory)
      });
    }
  } catch (error) {
    console.error("Database error:", error);
    return res.status(500).json({ error: "Database operation failed" });
  }
});

// Fetch all user location data (for example purpose, you can adjust based on your requirements)
app.get("/api/user_locations", async (req, res) => {
  try {
    const results = await query2("SELECT latitude, longitude, region, country, city FROM customer_details WHERE latitude IS NOT NULL AND longitude IS NOT NULL");
    res.json(results);
  } catch (error) {
    console.error("Error fetching user locations:", error);
    res.status(500).json({ error: "Failed to fetch location data" });
  }
});


app.get("/api/dashboard-stats", async (req, res) => {
  try {
    // Get total unique visitors (Distinct IPs)
    const visitorsResult = await query2("SELECT COUNT(DISTINCT ip_address) AS totalVisitors FROM customer_details");
    const totalVisitors = visitorsResult[0].totalVisitors;

    // Get total time spent
    const timeSpentResult = await query2("SELECT SUM(time_spent) AS totalTimeSpent FROM customer_details");
    const totalTimeSpent = timeSpentResult[0].totalTimeSpent || 0;

    // Get all event histories to properly count occurrences of different events
    const allEvents = await query2("SELECT event_history FROM customer_details");

    let totalEvents = 0;
    let totalPageExits = 0;
    let totalIntervalPings = 0;
    let totalEmailSubmits = 0;

    allEvents.forEach((record) => {
      if (record.event_history) {
        try {
          const eventsArray = JSON.parse(record.event_history);
          totalPageExits += eventsArray.filter(event => event.eventType === "pageExit").length;
          totalIntervalPings += eventsArray.filter(event => event.eventType === "intervalPing").length;
          totalEmailSubmits += eventsArray.filter(event => event.eventType === "emailSubmit").length;
        } catch (error) {
          console.error("Error parsing event history JSON:", error);
        }
      }
    });

    // Total Events (Summing all event types)
    totalEvents = totalPageExits + totalIntervalPings + totalEmailSubmits;

    // Calculate average time spent per user
    const avgTimePerUser = totalVisitors > 0 ? (totalTimeSpent / totalVisitors).toFixed(2) : 0;

    // Fetch user activity per day for the current month
    const timeSpentChartResult = await query2(`
      SELECT DATE(updated_at) AS date,
             SUM(time_spent) AS total_time_spent
      FROM customer_details
      WHERE updated_at >= DATE_FORMAT(NOW(), '%Y-%m-01')  -- Get data for the current month
      GROUP BY DATE(updated_at)
      ORDER BY DATE(updated_at)
    `);

    // Format data for chart
    const timeSpentChartData = timeSpentChartResult.map(row => ({
      date: row.date,
      total_time_spent: row.total_time_spent
    }));

    res.json({
      totalVisitors,
      totalTimeSpent,
      totalEvents,
      totalPageExits,
      totalIntervalPings,
      totalEmailSubmits,
      avgTimePerUser,
      timeSpentChartData // Sending the new chart data
    });

  } catch (error) {
    console.error("Dashboard stats error:", error);
    res.status(500).json({ error: "Failed to fetch dashboard statistics" });
  }
});

app.get("/api/timeSpent-graph", async (req, res) => {
  try {
    const { filter } = req.query;
    const today = new Date();
    const formatDate = (date) => date.toISOString().split("T")[0];

    let startDate, endDate;
    switch (filter) {
      case "today":
        startDate = endDate = formatDate(today);
        break;
      case "yesterday":
        let yesterday = new Date(today);
        yesterday.setDate(today.getDate() - 1);
        startDate = endDate = formatDate(yesterday);
        break;
      case "last_week":
        let lastWeek = new Date(today);
        lastWeek.setDate(today.getDate() - 7);
        startDate = formatDate(lastWeek);
        endDate = formatDate(today);
        break;
      case "last_15_days":
        let last15Days = new Date(today);
        last15Days.setDate(today.getDate() - 15);
        startDate = formatDate(last15Days);
        endDate = formatDate(today);
        break;
      case "last_1_month":
        let lastMonth = new Date(today);
        lastMonth.setMonth(today.getMonth() - 1);
        startDate = formatDate(lastMonth);
        endDate = formatDate(today);
        break;
      default:
        startDate = endDate = formatDate(today);
    }

    // Fetch daily time spent for the selected date range
    const results = await query2(
      "SELECT date, SUM(time_spent) AS total_time_spent FROM daily_time_spent WHERE date BETWEEN ? AND ? GROUP BY date ORDER BY date ASC",
      [startDate, endDate]
    );

    // Format response
    const timeSpentChartData = results.map((row) => ({
      date: row.date,
      total_time_spent: row.total_time_spent || 0,
    }));

    res.json({ timeSpentChartData });
  } catch (error) {
    console.error("Error fetching time spent data:", error);
    res.status(500).json({ error: "Failed to fetch time spent data" });
  }
});

app.get("/api/customers", async (req, res) => {
  try {
    const results = await query2("SELECT * FROM customer_details ORDER BY created_at DESC");
    res.json({ message: "All users fetched successfully", data: results });
  } catch (error) {
    console.error("Database error:", error);
    res.status(500).json({ error: "Failed to fetch user data" });
  }
});

app.get("/api/customers/:id", async (req, res) => {
  const { id } = req.params;

  if (!id) {
    return res.status(400).json({ error: "Customer ID is required" });
  }

  try {
    // Fetch user details from the database
    const results = await query2("SELECT * FROM customer_details WHERE id = ?", [id]);

    if (results.length === 0) {
      return res.status(404).json({ error: "Customer not found" });
    }

    // Parse JSON fields
    const customer = results[0];
    customer.emails = JSON.parse(customer.emails || "[]");
    customer.urls = JSON.parse(customer.urls || "[]");
    customer.event_history = JSON.parse(customer.event_history || "[]");

    // Count occurrences of specific event types
    const emailSubmitCount = customer.event_history.filter(event => event.eventType === "emailSubmit").length;
    const pageExitCount = customer.event_history.filter(event => event.eventType === "pageExit").length;

    return res.json({
      success: true,
      customer,
      emailSubmitCount,
      pageExitCount
    });
  } catch (error) {
    console.error("Database error:", error);
    return res.status(500).json({ error: "Failed to fetch customer data" });
  }
});


app.get("/api/customers/filter", async (req, res) => {
  const { ip, country, city, minTimeSpent } = req.query2;
  let conditions = [];
  let values = [];

  if (ip) {
    conditions.push("ip_address LIKE ?");
    values.push(`%${ip}%`);
  }
  if (country) {
    conditions.push("country LIKE ?");
    values.push(`%${country}%`);
  }
  if (city) {
    conditions.push("city LIKE ?");
    values.push(`%${city}%`);
  }
  if (minTimeSpent) {
    conditions.push("time_spent >= ?");
    values.push(parseInt(minTimeSpent, 10));
  }

  let sql = "SELECT * FROM customer_details";
  if (conditions.length > 0) {
    sql += " WHERE " + conditions.join(" AND ");
  }

  try {
    const results = await query2(sql, values);

    // Calculate event counts for each user
    const usersWithEvents = results.map((user) => {
      let eventHistory = [];
      let pageExitCount = 0;
      let emailSubmitCount = 0;

      if (user.event_history) {
        try {
          eventHistory = JSON.parse(user.event_history);
          pageExitCount = eventHistory.filter(event => event.eventType === "pageExit").length;
          emailSubmitCount = eventHistory.filter(event => event.eventType === "emailSubmit").length;
        } catch (error) {
          console.error("Error parsing event history JSON:", error);
        }
      }

      return {
        ...user,
        pageExitCount,
        emailSubmitCount
      };
    });

    res.json({ message: "Filtered user data fetched successfully", data: usersWithEvents });
  } catch (error) {
    console.error("Database error:", error);
    res.status(500).json({ error: "Failed to fetch filtered user data" });
  }
});


const port = 3001;
app.listen(port, () => {
  console.log(`Server listening on ${port}`);
});
