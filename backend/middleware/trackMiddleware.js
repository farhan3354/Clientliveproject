const axios = require("axios");
const { query } = require("../database");

const trackUserMiddleware = async (req, res, next) => {
    if (!req.session || !req.session.user) {
        return next();
    }

    const userId = req.session.user.userId;
    const ipAddress = req.ip || req.headers["x-forwarded-for"] || req.connection.remoteAddress;
    const timeSpent = parseInt(req.headers["x-time-spent"] || "0", 10);

    try {
        const existingUser = await query("SELECT * FROM CustomerTracking WHERE userId = ? AND ipAddress = ?", [userId, ipAddress]);

        if (existingUser.length > 0) {
            const updateTrackingQuery = `
                UPDATE CustomerTracking 
                SET visitCount = visitCount + 1, 
                    totalTimeSpent = totalTimeSpent + ?, 
                    lastVisited = NOW()
                WHERE userId = ? AND ipAddress = ?
            `;
            await query(updateTrackingQuery, [timeSpent, userId, ipAddress]);
        } else {
            const locationRes = await axios.get(`http://ip-api.com/json/${ipAddress}`);
            const locationData = locationRes.data;

            const insertTrackingQuery = `
                INSERT INTO CustomerTracking (userId, ipAddress, city, region, country, longitude, latitude, timezone, visitCount, totalTimeSpent) 
                VALUES (?, ?, ?, ?, ?, ?, ?, ?, 1, ?)
            `;
            await query(insertTrackingQuery, [
                userId,
                ipAddress,
                locationData.city,
                locationData.region,
                locationData.country,
                locationData.lon,
                locationData.lat,
                locationData.timezone,
                timeSpent
            ]);
        }

        console.log(`User ${userId} visit tracked`);
    } catch (error) {
        console.error("Error tracking user visit:", error);
    }

    next();
};

module.exports = trackUserMiddleware;
