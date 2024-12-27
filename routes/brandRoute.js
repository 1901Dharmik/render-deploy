const express = require("express");
const {
  createBrand,
  updateBrand,
  deleteBrand,
  getBrand,
  getallBrand,
} = require("../controller/brandCtrl");
const { authMiddleware, isAdmin } = require("../middlewares/authMiddleware");
const rbacMiddleware = require("../middlewares/rbacMiddleware");
const router = express.Router();

router.post(
  "/",
  authMiddleware,
  rbacMiddleware({ resource: "brands", action: "create" }),
  createBrand
);
router.put(
  "/:id",
  authMiddleware,
  rbacMiddleware({ resource: "brands", action: "update" }),
  updateBrand
);
router.delete(
  "/:id",
  authMiddleware,
  rbacMiddleware({ resource: "brands", action: "delete" }),
  deleteBrand
);
router.get("/:id", 
  //  authMiddleware,
  // rbacMiddleware({ resource: "brands", action: "read" }),
   getBrand);
router.get(
  "/",
  // authMiddleware,
  // rbacMiddleware({ resource: "brands", action: "read" }),
  getallBrand
);

module.exports = router;
