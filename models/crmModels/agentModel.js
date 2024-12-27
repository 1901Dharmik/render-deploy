const mongoose = require("mongoose");

var agentSchema = new mongoose.Schema(
  {
    name: { type: String , default: "Not_Asigned",},
    email: { type: String, unique: true },
    phone: { type: String },
    // remarks: { type: String,},
    // note: { type: String },
    createdAt: { type: Date, default: Date.now },
    updatedAt: { type: Date, default: Date.now },
  },
  { timestamps: true }
);

module.exports = mongoose.model("Agent", agentSchema);
