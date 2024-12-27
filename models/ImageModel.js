// // models/Image.js
// const mongoose = require("mongoose");

// const imageSchema = new mongoose.Schema({
//   filename: {
//     type: String,
//     required: true,
//   },
//   contentType: {
//     type: String,
//     required: true,
//   },
//   uploadDate: {
//     type: Date,
//     default: Date.now,
//   },
//   length: Number,
//   aliases: String,
//   md5: String,
//   metadata: {
//     type: mongoose.Schema.Types.Mixed, // Store additional information
//   },
//   uploadedBy: {
//     type: mongoose.Schema.Types.ObjectId,
//     ref: "User", // Reference to the user who uploaded the file (if needed)
//   },
// });

// module.exports = mongoose.model("Image", imageSchema);
// models/Image.js


// models/Image.js
const mongoose = require('mongoose');

const imageSchema = new mongoose.Schema({
  filename: String,
  originalname: String,
  mimetype: String,
  size: Number,
  data: Buffer,
  urlPath: String,  
  // Add this field
}, { timestamps: true });

module.exports = mongoose.model('Image', imageSchema);
