const mongoose = require("mongoose");

const programSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true,
  },
  points: {
    type: Number,
    required: true,
  },
  images: {
    type: String,
  },
  description: {
    type: String,
  },
  totalMembers: {
    type: Number,
    required: true,
  },
  dateCreated: {
    type: Date,
    default: Date.now,
  },
  promotionLink: {
    type: String,
    required: true, // adjust the required option based on your needs
  },
});

const Program = mongoose.model("Program", programSchema);

module.exports = Program;
