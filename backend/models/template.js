const mongoose = require("mongoose");

// Define the schema for the post template
const postTemplateSchema = new mongoose.Schema({
  templateText: {
    type: String,
    required: true,
    trim: true, // Removes extra spaces from the beginning and end
  },
  programId: {
    type: String,
    required: true,
  },
});

// Create the PostTemplate model
const PostTemplate = mongoose.model("PostTemplate", postTemplateSchema);

// Export the model for use in other parts of your application
module.exports = PostTemplate;
