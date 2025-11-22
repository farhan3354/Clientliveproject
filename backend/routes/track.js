// routes/customerRoutes.js
const express = require("express");
const router = express.Router();
const { query } = require("../database"); // Make sure this points to your MySQL query function

// Middleware to ensure the user is logged in
function isLoggedIn(req, res, next) {
  if (req.session && req.session.user) {
    return next();
  }
  res.status(401).json({ message: "Unauthorized" });
}

// GET /api/customerDetails - fetches tracking details for the logged in user
router.get("/api/track", isLoggedIn, async (req, res) => {
  try {
    // Get the logged-in user's ID from session
    const userId = req.session.user.userId;

    // Query the CustomerTracking table for this user
    const sql = "SELECT * FROM CustomerTracking WHERE userId = ?";
    const results = await query(sql, [userId]);

    if (results.length === 0) {
      return res.status(404).json({ message: "No tracking details found." });
    }

    res.json(results);
  } catch (error) {
    console.error("Error fetching customer details:", error);
    res.status(500).json({ message: "Server error while retrieving customer details." });
  }
});

module.exports = router;
