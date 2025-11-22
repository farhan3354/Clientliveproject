const mongoose = require("mongoose");

const userSchema = new mongoose.Schema({
  firstName: {
    type: String,
    required: true,
  },
  uniqueLink: {
    type: String,
  },
  lastName: {
    type: String,
    required: true,
  },
  email: {
    type: String,
    required: true,
    unique: true,
  },
  password: {
    type: String,
    required: true,
  },
  role: {
    type: String,
    enum: ["mba", "admin"],
    required: true,
  },
  phoneNumber: {
    type: String,
  },
  city: {
    type: String,
  },
  state: {
    type: String,
  },
  records: [
    {
      programId: String,
      programLink: String,
      programPoints: Number,
      dateCreated: {
        type: Date,
        default: Date.now,
      },
    },
  ],
  dateCreated: {
    type: Date,
    default: Date.now,
  },
  notification: {
    type: String,
  },
  notificationAtive: {
    type: Boolean,
  },
  mailNotification: {
    type: Boolean,
  },
});

const User = mongoose.model("user", userSchema);
module.exports = User;
