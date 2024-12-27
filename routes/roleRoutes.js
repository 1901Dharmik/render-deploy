// routes/roleRoutes.js
// const express = require("express");
// const router = express.Router();
// const authMiddleware = require("../middlewares/authMiddleware");
// const rbacMiddleware = require("../middlewares/rbacMiddleware");
// const roleController = require("../controller/roleController");

// // Create a new role
// router.post(
//   "/",
//   authMiddleware,
//   rbacMiddleware({ resource: "roles", action: "create" }),
//   roleController.createRole  // <-- Use specific method
// );

// // Get all roles
// router.get(
//   "/",
//   authMiddleware,
//   rbacMiddleware({ resource: "roles", action: "read" }),
//   roleController.getAllRoles  // <-- Use specific method
// );

// // Get a specific role
// router.get(
//   "/:id",
//   authMiddleware,
//   rbacMiddleware({ resource: "roles", action: "read" }),
//   roleController.getRoleById  // <-- Use specific method
// );

// // Update a role
// router.patch(
//   "/:id",
//   authMiddleware,
//   rbacMiddleware({ resource: "roles", action: "update" }),
//   roleController.updateRole  // <-- Use specific method
// );

// // Delete a role
// router.delete(
//   "/:id",
//   authMiddleware,
//   rbacMiddleware({ resource: "roles", action: "delete" }),
//   roleController.deleteRole  // <-- Use specific method
// );

// module.exports = router;
const express = require("express");
const {
  createRole,
  getAllRoles,
  getRoleById,
  updateRole,
  deleteRole,
} = require("../controller/roleController");
const { authMiddleware, isAdmin } = require("../middlewares/authMiddleware");
const rbacMiddleware = require("../middlewares/rbacMiddleware");
const router = express.Router();

router.post("/", 
   authMiddleware,
  rbacMiddleware({ resource: "roles", action: "create" }),
   createRole);
router.patch(
  "/:id",
  authMiddleware,
  rbacMiddleware({ resource: "roles", action: "update" }),
  updateRole
);
router.delete(
  "/:id",
  authMiddleware,
  rbacMiddleware({ resource: "roles", action: "delete" }),
  deleteRole
);
router.get(
  "/:id",
  authMiddleware,
  rbacMiddleware({ resource: "roles", action: "read" }),
  getRoleById
);
router.get(
  "/",
  authMiddleware,
  rbacMiddleware({ resource: "roles", action: "read" }),
  getAllRoles
);

module.exports = router;
