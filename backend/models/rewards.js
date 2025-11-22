// Define the rewards schema
const mongoose = require("mongoose");

const rewardsSchema = new mongoose.Schema({
  monthly: String,
  yearly: String,
  monthlyImage: String,
  yearlyImage: String,
});

// Create the rewards model
const Rewards = mongoose.model("Rewards", rewardsSchema);
module.exports = Rewards;
