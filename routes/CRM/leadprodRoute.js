const express = require("express");
const {
  createLeadProduct,
  updateLeadProduct,
  deleteLeadProduct,
  getLeadProduct,
  getallLeadProduct,
} = require("../../controller/crmCTRL/leadprodCtrl");
const { authMiddleware, isAdmin } = require("../../middlewares/authMiddleware");
const router = express.Router();

router.post("/", authMiddleware, isAdmin, createLeadProduct);
router.put("/:id", authMiddleware, isAdmin, updateLeadProduct);
router.delete("/:id", authMiddleware, isAdmin, deleteLeadProduct);
router.get("/:id", getLeadProduct);
router.get("/", getallLeadProduct);

module.exports = router;
