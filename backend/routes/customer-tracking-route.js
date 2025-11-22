const express = require("express");
const app = express();
const {query } = require("../database"); 
const config = require("../env");
const axios = require("axios"); 

const router = express.Router();

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
  
  // API Endpoint to receive and update user session details
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
      const results = await query("SELECT * FROM customer_details WHERE ip_address = ?", [ipAddress]);
  
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
        await query(
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
  
        await query(
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
  
  app.get("/api/dashboard-stats", async (req, res) => {
    try {
      // Get total unique visitors (Distinct IPs)
      const visitorsResult = await query("SELECT COUNT(DISTINCT ip_address) AS totalVisitors FROM customer_details");
      const totalVisitors = visitorsResult[0].totalVisitors;
  
      // Get total time spent
      const timeSpentResult = await query("SELECT SUM(time_spent) AS totalTimeSpent FROM customer_details");
      const totalTimeSpent = timeSpentResult[0].totalTimeSpent || 0;
  
      // Get all event histories to properly count occurrences of "pageExit" and "intervalPing"
      const allEvents = await query("SELECT event_history FROM customer_details");
      
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
            totalEmailSubmits += eventsArray.filter(event => event.eventType === "emailSubmit").length
          } catch (error) {
            console.error("Error parsing event history JSON:", error);
          }
        }
      });
  
      // Total Events (Summing both event types)
      totalEvents = totalPageExits + totalIntervalPings + totalEmailSubmits;
  
      // Calculate average time spent per user
      const avgTimePerUser = totalVisitors > 0 ? (totalTimeSpent / totalVisitors).toFixed(2) : 0;
  
      // Fetch user activity for chart
      const chartDataResult = await query(`
        SELECT HOUR(FROM_UNIXTIME(session_start_time / 1000)) AS hour,
        COUNT(DISTINCT ip_address) AS users, 
        SUM(time_spent) AS totalTimeSpent
        FROM customer_details
        GROUP BY hour
        ORDER BY hour
      `);
  
      const chartData = chartDataResult.map(row => ({
        time: `${row.hour}:00`,
        users: row.users,
        totalTimeSpent: row.totalTimeSpent,
      }));
  
      res.json({ 
        totalVisitors, 
        totalTimeSpent, 
        totalEvents, 
        totalPageExits, 
        totalIntervalPings,
        avgTimePerUser, 
        chartData 
      });
  
    } catch (error) {
      console.error("Dashboard stats error:", error);
      res.status(500).json({ error: "Failed to fetch dashboard statistics" });
    }
  });
  
  
  app.get("/api/customers", async (req, res) => {
    try {
      const results = await query("SELECT * FROM customer_details ORDER BY created_at DESC");
      res.json({ message: "All users fetched successfully", data: results });
    } catch (error) {
      console.error("Database error:", error);
      res.status(500).json({ error: "Failed to fetch user data" });
    }
  });
  
  
  app.get("/api/customers/filter", async (req, res) => {
    const { ip, country, city, minTimeSpent } = req.query;
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
      const results = await query(sql, values);
  
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

  module.exports = router;
