const express = require("express");
const {
  createLeadOrder,
  updateLeadOrder,
  deleteLeadOrder,
  getLeadOrder,
  getallLeadOrder,
} = require("../../controller/crmCTRL/leadOrderCtrl");
const { authMiddleware, isAdmin } = require("../../middlewares/authMiddleware");
const router = express.Router();

router.post("/", authMiddleware, isAdmin, createLeadOrder);
router.put("/:id", authMiddleware, isAdmin, updateLeadOrder);
router.delete("/:id", authMiddleware, isAdmin, deleteLeadOrder);
router.get("/:id", getLeadOrder);
router.get("/", getallLeadOrder);

module.exports = router;
