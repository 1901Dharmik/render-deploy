// src/controllers/maintenanceController.js
const MaintenanceSettings = require('../models/MaintenanceSettings');

class MaintenanceController {
  // Get current maintenance settings
  static async getMaintenanceSettings(req, res) {
    try {
      const settings = await MaintenanceSettings.findOne({}).select('-__v');
      
      // If no settings exist, create default
      if (!settings) {
        const defaultSettings = new MaintenanceSettings();
        await defaultSettings.save();
        return res.json(defaultSettings);
      }
      
      res.json(settings);
    } catch (error) {
      res.status(500).json({ message: 'Error fetching maintenance settings', error: error.message });
    }
  }

  // Update maintenance settings
  static async updateMaintenanceSettings(req, res) {
    try {
      const { 
        isMaintenanceModeActive, 
        maintenanceMessage, 
        estimatedDowntime 
      } = req.body;

      // Find and update existing settings or create new
      let settings = await MaintenanceSettings.findOne({});
      
      if (!settings) {
        settings = new MaintenanceSettings();
      }

      // Update fields
      settings.isMaintenanceModeActive = isMaintenanceModeActive;
      settings.maintenanceMessage = maintenanceMessage || settings.maintenanceMessage;
      settings.estimatedDowntime = estimatedDowntime || null;
      settings.updatedBy = req.user._id; // Assuming authenticated admin user
      settings.lastUpdated = new Date();

      await settings.save();

      res.json(settings);
    } catch (error) {
      res.status(500).json({ 
        message: 'Error updating maintenance settings', 
        error: error.message 
      });
    }
  }
}

module.exports = MaintenanceController;