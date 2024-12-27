// src/middleware/maintenanceMode.js
const MaintenanceSettings = require('../models/MaintenanceSettings');

const maintenanceMiddleware = async (req, res, next) => {
  try {
    // Skip maintenance check for admin routes or login
    if (req.path.startsWith('/api/admin') || req.path === '/api/auth/login') {
      return next();
    }

    // Fetch maintenance settings
    const settings = await MaintenanceSettings.findOne({});
    
    // If maintenance mode is active
    if (settings && settings.isMaintenanceModeActive) {
      return res.status(503).json({
        message: settings.maintenanceMessage || 'Site is currently under maintenance.',
        estimatedDowntime: settings.estimatedDowntime
      });
    }

    // Continue to the next middleware if not in maintenance mode
    next();
  } catch (error) {
    console.error('Maintenance mode check error:', error);
    next(error);
  }
};

module.exports = maintenanceMiddleware;