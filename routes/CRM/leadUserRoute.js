const express = require("express");
const {
  createLeadUser,
  updateLeadUser,
  deleteLeadUser,
  getLeadUser,
  getallLeadUser,
} = require("../../controller/crmCTRL/leadUserCtrl");
const { authMiddleware, isAdmin } = require("../../middlewares/authMiddleware");
const router = express.Router();

router.post("/", authMiddleware, isAdmin, createLeadUser);
router.put("/:id", authMiddleware, isAdmin, updateLeadUser);
router.delete("/:id", authMiddleware, isAdmin, deleteLeadUser);
router.get("/:id", getLeadUser);
router.get("/", getallLeadUser);

module.exports = router;
