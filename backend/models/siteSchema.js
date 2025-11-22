const mongoose = require("mongoose");

// Define the site schema
const siteSchema = new mongoose.Schema({
  site: {
    type: String,
    required: true,
  },
});

// Create the Site model
const Site = mongoose.model("Site", siteSchema);
module.exports = Site;
