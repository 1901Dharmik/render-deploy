const express = require('express');
const ActivityLog = require('../models/activityLog');

// Get Activity Logs
const getActivityLogs = async (req, res) => {
  try {
    // Check if pagination is requested via query parameters
    const isPaginated = req.query.page || req.query.limit;
    
    // Date filtering parameters
    const { startDate, endDate } = req.query;
    
    // Construct date filter
    const dateFilter = {};
    if (startDate && endDate) {
      dateFilter.createdAt = {
        $gte: new Date(startDate),
        $lte: new Date(endDate)
      };
    } else if (startDate) {
      dateFilter.createdAt = { $gte: new Date(startDate) };
    } else if (endDate) {
      dateFilter.createdAt = { $lte: new Date(endDate) };
    }

    if (isPaginated) {
      // Pagination parameters
      const page = parseInt(req.query.page) || 1;
      const limit = parseInt(req.query.limit) || 10;
      const skip = (page - 1) * limit;

      // Fetch total count for pagination
      const totalLogs = await ActivityLog.countDocuments(dateFilter);

      // Fetch paginated and filtered logs
      const logs = await ActivityLog.find(dateFilter)
        .populate('userId', 'firstname lastname')
        .sort('-createdAt')
        .skip(skip)
        .limit(limit);

      // Prepare pagination metadata
      const pagination = {
        currentPage: page,
        totalPages: Math.ceil(totalLogs / limit),
        totalLogs: totalLogs,
        logsPerPage: limit
      };

      return res.status(200).json({
        logs,
        pagination
      });
    } else {
      // Fetch all logs without pagination
      const logs = await ActivityLog.find(dateFilter)
        .populate('userId', 'firstname lastname')
        .sort('-createdAt');

      return res.status(200).json({
        logs,
        pagination: {
          totalLogs: logs.length
        }
      });
    }
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

// Example usage:
// Without pagination: GET /api/activity-logs
// With pagination: GET /api/activity-logs?page=1&limit=10
// With date filter: GET /api/activity-logs?startDate=2024-01-01&endDate=2024-12-31
// Combined: GET /api/activity-logs?page=1&limit=10&startDate=2024-01-01&endDate=2024-12-31
  const deleteOldActivityLogs = async (req, res) => {
    try {
      // Calculate the date 3 months ago
      const threeMonthsAgo = new Date();
      threeMonthsAgo.setMonth(threeMonthsAgo.getMonth() - 3);
  
      // Delete logs older than 3 months
      const result = await ActivityLog.deleteMany({ createdAt: { $lt: threeMonthsAgo } });
  
      res.status(200).json({
        message: 'Old activity logs deleted successfully',
        deletedCount: result.deletedCount,
      });
    } catch (error) {
      res.status(500).json({ error: error.message });
    }
  };
  module.exports = { getActivityLogs,deleteOldActivityLogs };