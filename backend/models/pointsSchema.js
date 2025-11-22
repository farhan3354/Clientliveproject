const mongoose = require("mongoose");

const pointSchema = new mongoose.Schema({
  userId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "User",
    required: true,
  },
  programLink: {
    type: String,
    required: true,
  },
  ipAddress: {
    type: String,
    required: true,
  },
  dateClickedAt: {
    type: Date,
    default: Date.now,
  },
  pointsGiven: {
    type: Number,
    required: true,
  },
  programId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Program",
    required: true,
  },
});

const Point = mongoose.model("Point", pointSchema);

module.exports = Point;
