// middleware/rbacMiddleware.js
const rbacMiddleware = (requiredPermission) => {
    return (req, res, next) => {
      const userRole = req.user.role;
      const hasPermission = userRole.permissions.some(permission => 
        permission.resource === requiredPermission.resource &&
        (permission.actions.includes('all') || permission.actions.includes(requiredPermission.action))
      );
  
      if (hasPermission) {
        next();
      } else {
        res.status(403).send({ error: 'Access denied.',redirect: "/NotFound"  });
      }
    };
  };
  
  module.exports = rbacMiddleware;