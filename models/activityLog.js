// models/activityLog.js
const mongoose = require("mongoose");

const activityLogSchema = new mongoose.Schema({
  userId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    // required: true
  },
  action: {
    type: String,
    required: true,
    enum: ['create', 'update', 'delete']
  },
  modelName: {
    type: String,
    required: true
  },
  documentId: {
    type: mongoose.Schema.Types.ObjectId,
    required: true
  },
  details: {
    type: Object
  },
  createdAt: {
    type: Date,
    default: Date.now
  }
});
const ActivityLog = mongoose.model("ActivityLog", activityLogSchema);

module.exports = ActivityLog;