const express = require('express');
const router = express.Router();
const { getActivityLogs ,deleteOldActivityLogs} = require('../controller/activityLogController');

// GET /api/activity-logs - Fetch activity logs
router.get('/', getActivityLogs);
router.delete('/delete-old-logs', deleteOldActivityLogs)
module.exports = router;
