// middlewares/rbacMiddleware.js

const Role = require("../models/roleModel"); // Adjust path as needed

const rbacMiddleware = ({ resource, action, allowPublicRead = false }) => {
  return async (req, res, next) => {
    try {
      // Allow public read access if specified and it's a GET request
      if (allowPublicRead && req.method === "GET" && !req.user) {
        return next();
      }

      // If no user or role, deny access
      if (!req.user || !req.user.role) {
        return res.status(401).json({
          success: false,
          message: "Authentication required"
        });
      }

      // Get role permissions from database
      const role = await Role.findOne({ name: req.user.role });
      if (!role) {
        return res.status(403).json({
          success: false,
          message: "Role not found"
        });
      }

      // Find the resource permissions
      const resourcePermission = role.permissions.find(
        (p) => p.resource === resource
      );

      if (!resourcePermission) {
        return res.status(403).json({
          success: false,
          message: `No permissions defined for ${resource}`
        });
      }

      // Check if the role has the required action permission
      const hasPermission = resourcePermission.actions.includes(action);
      
      if (!hasPermission) {
        return res.status(403).json({
          success: false,
          message: `Permission denied: ${action} on ${resource}`
        });
      }

      next();
    } catch (error) {
      return res.status(500).json({
        success: false,
        message: "Error checking permissions",
        error: error.message
      });
    }
  };
};

module.exports = rbacMiddleware;