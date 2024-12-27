const mongoose = require("mongoose"); // Erase if already required

// Declare the Schema of the Mongo model
var leadUserSchema = new mongoose.Schema(
  {
    Customer_Name: {
      type: String,
      required: true,
      unique: true,
      index: true,
    },
    Customer_No: {
      type: String,
      required: true,
      unique: true,
    },
    Alt_No: {
      type: String,
      // required:true,
      unique: true,
    },
    Source: {
      type: String,
      enum: ["New", "Old", "Incoming", "Resale", "Reference"],
      default: "New",
      // required: true,
    },
    Type: {
      type: String,
      enum: ["COD", "Online"],
      default: "COD",
      // required: true,
    },
    Status: {
      type: String,
      enum: [
        "RTO",
        "Delivered",
        "Canceled",
        "Pending",
        "Completed",
        "Not_Ordered",
      ],
      default: "Not_Ordered",
    },
    agent: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Agent",
      default:"Not_Asigned"
    },

    createdAt: { type: Date, default: Date.now },
    updatedAt: { type: Date, default: Date.now },
  },
  {
    timestamps: true, // Add timestamps to the schema
  }
);

//Export the model
module.exports = mongoose.model("LeadUser", leadUserSchema);
