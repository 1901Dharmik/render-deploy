const mongoose = require("mongoose"); // Erase if already required
const createLoggingMiddleware = require('../middlewares/loggingMiddleware');
// Declare the Schema of the Mongo model
var brandSchema = new mongoose.Schema(
  {
    title: {
      type: String,
      required: true,
      unique: true,
      index: true,
    },
    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: true
    },
  },
  {
    timestamps: true,
  }
);

// Apply logging middleware
createLoggingMiddleware(brandSchema, 'Brand');
//Export the model
module.exports = mongoose.model("Brand", brandSchema);
