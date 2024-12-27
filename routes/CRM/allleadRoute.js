const express = require("express");
const {
  createAllLead,
  updateAllLead,
  deleteAllLead,
  getAllLead,
  getallAllLead,
  assignLead,
} = require("../../controller/crmCTRL/AllLeadCtrl");
const { authMiddleware, isAdmin } = require("../../middlewares/authMiddleware");
const router = express.Router();

router.post("/", authMiddleware, createAllLead);
router.put("/:id", authMiddleware, updateAllLead);
router.delete("/:id", authMiddleware, isAdmin, deleteAllLead);
router.get("/:id", getAllLead);
router.get("/", getallAllLead);
router.patch("/:id/assign", assignLead);

module.exports = router;
