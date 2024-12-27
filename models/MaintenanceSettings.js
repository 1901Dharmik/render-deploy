// src/models/MaintenanceSettings.js
const mongoose = require('mongoose');

const MaintenanceSettingsSchema = new mongoose.Schema({
  isMaintenanceModeActive: {
    type: Boolean,
    default: false
  },
  maintenanceMessage: {
    type: String,
    default: 'Our site is currently undergoing maintenance. Please check back soon.'
  },
  estimatedDowntime: {
    type: Date,
    default: null
  },
  lastUpdated: {
    type: Date,
    default: Date.now
  },
  updatedBy: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User'
  }
}, {
  timestamps: true
});

// Ensure only one maintenance settings document exists
MaintenanceSettingsSchema.pre('save', async function(next) {
  if (this.isNew) {
    const existingSettings = await this.constructor.countDocuments();
    if (existingSettings > 0) {
      return next(new Error('Only one maintenance settings document is allowed'));
    }
  }
  next();
});

module.exports = mongoose.model('MaintenanceSettings', MaintenanceSettingsSchema);