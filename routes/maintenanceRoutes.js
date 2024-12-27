// src/routes/maintenanceRoutes.js
const express = require('express');
const {getMaintenanceSettings,updateMaintenanceSettings } = require('../controller/maintenanceController');
const {authMiddleware } = require('../middlewares/authMiddleware');

const router = express.Router();

// Get current maintenance settings (admin only)
router.get('/settings', getMaintenanceSettings);

// Update maintenance settings (admin only)
router.put('/settings', authMiddleware, updateMaintenanceSettings);

module.exports = router;