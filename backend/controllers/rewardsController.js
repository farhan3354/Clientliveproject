const multer = require("multer");
const path = require("path");
const { promisify } = require("util");
const { pool, query } = require("../database"); // Replace with your database module
const fs = require("fs").promises; // Import the fs module

// Configure Multer storage
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, "uploads/"); // Specify your upload directory
  },
  filename: (req, file, cb) => {
    const uniqueSuffix = Date.now() + "-" + Math.round(Math.random() * 1e9);
    const fileExtension = path.extname(file.originalname);
    cb(null, uniqueSuffix + fileExtension);
  },
});

const upload = multer({ storage: storage }).single("image");

// Function to add a reward
exports.addReward = async (req, res) => {
  try {
    upload(req, res, async (err) => {
      if (err) {
        return res.status(500).json({ error: "Error uploading image" });
      }
      const { rewardType, rewardGift } = req.body;
      const image = req.file ? req.file.path : null;

      if (!rewardType || !rewardGift) {
        return res.status(400).json({ error: "Missing reward details" });
      }

      const insertRewardQuery =
        "INSERT INTO Rewards (rewardType, rewardGift, image) VALUES (?, ?, ?)";

      try {
        const insertResult = await query(insertRewardQuery, [
          rewardType,
          rewardGift,
          image,
        ]);

        if (insertResult.affectedRows === 1) {
          return res.status(201).json({ message: "Reward added successfully" });
        } else {
          return res.status(500).json({ error: "Failed to add reward" });
        }
      } catch (error) {
        console.error("Error adding reward:", error);
        return res.status(500).json({ error: "An error occurred" });
      }
    });
  } catch (error) {
    console.error("Error:", error);
    return res.status(500).json({ error: "An error occurred" });
  }
};

exports.deleteReward = async (req, res) => {
  const rewardId = req.params.id;

  try {
    // Fetch the reward details to get the image file path
    const fetchRewardQuery = "SELECT * FROM Rewards WHERE rewardId = ?";
    const rewardRows = await query(fetchRewardQuery, [rewardId]);

    if (rewardRows.length === 0) {
      return res.json({ success: false, message: "Reward not found" });
    }
    const results = await query("DELETE FROM Rewards WHERE rewardId = ?", [
      rewardId,
    ]);

    if (results.affectedRows === 1) {
      res.json({ success: true, message: "Reward deleted successfully" });
      const imagePath = rewardRows[0].image;
      if (imagePath) {
        await fs.unlink(imagePath);
        console.log("Image deleted successfully:", imagePath);
      }
    } else {
      res.json({ success: false, message: "Reward not found" });
    }
  } catch (error) {
    console.error("Error deleting reward:", error);
    res
      .status(500)
      .json({ error: "An error occurred while deleting the reward" });
  }
};

exports.getall = async (req, res) => {
  const query2 = "SELECT * FROM Rewards"; // Change table name if needed

  try {
    const results = await query(query2);
    const rewards = results;
    res.json(rewards);
  } catch (error) {
    console.error("Error fetching rewards:", error);
    res.status(500).json({ error: "Failed to fetch rewards" });
  }
};

exports.changeReward = (req, res) => {
  const { type, value } = req.params;

  // Find the rewards document and update the corresponding field
  Rewards.findOneAndUpdate(
    {},
    { [type]: value },
    { new: true, upsert: true },
    (err, updatedRewards) => {
      if (err) {
        console.error("Error changing reward:", err);
        res.status(500).json({ error: "Failed to change reward" });
      } else {
        // Update user records with notification
        const notificationMessage = `Reward ${type} is changed to "${value}"`;
        User.updateMany(
          {},
          {
            $set: {
              notification: notificationMessage,
              notificationAtive: true,
            },
          },
          (err) => {
            if (err) {
              console.error("Error updating user records:", err);
              res.status(500).json({ error: "Failed to update user records" });
            } else {
              res.json({ data: updatedRewards });
            }
          }
        );
      }
    }
  );
};

exports.changeImgReward = (req, res) => {
  const { type } = req.params;
  const image = req.file.path;

  // Find the rewards document and update the corresponding field
  Rewards.findOneAndUpdate(
    {},
    { [type]: image },
    { new: true, upsert: true },
    (err, updatedRewards) => {
      if (err) {
        console.error("Error changing reward:", err);
        res.status(500).json({ error: "Failed to change reward" });
      } else {
        // Update user records with notification
        const notificationMessage = `Image for Reward ${type} is Changed`;
        User.updateMany(
          {},
          {
            $set: {
              notification: notificationMessage,
              notificationAtive: true,
            },
          },
          (err) => {
            if (err) {
              console.error("Error updating user records:", err);
              res.status(500).json({ error: "Failed to update user records" });
            } else {
              res.json({ data: updatedRewards });
            }
          }
        );
      }
    }
  );
};
