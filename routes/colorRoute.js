const express = require("express");
const {
  createColor,
  updateColor,
  deleteColor,
  getColor,
  getallColor,
} = require("../controller/colorCtrl");
const { authMiddleware, isAdmin } = require("../middlewares/authMiddleware");
const rbacMiddleware = require("../middlewares/rbacMiddleware");
const router = express.Router();

router.post("/", authMiddleware,  rbacMiddleware({ resource: "color", action: "create" }), createColor);
router.put("/:id", authMiddleware, rbacMiddleware({ resource: "color", action: "update" }), updateColor);
router.delete("/:id", authMiddleware, rbacMiddleware({ resource: "color", action: "delete" }), deleteColor);
router.get("/:id", getColor);
router.get("/", getallColor);

module.exports = router;
