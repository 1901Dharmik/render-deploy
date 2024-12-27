const express = require("express");
const {
  createEnquiry,
  updateEnquiry,
  deleteEnquiry,
  getEnquiry,
  getallEnquiry,
} = require("../controller/enqCtrl");
const { authMiddleware, isAdmin } = require("../middlewares/authMiddleware");
const rbacMiddleware = require("../middlewares/rbacMiddleware");
const router = express.Router();

router.post("/", createEnquiry);
router.patch("/:id", authMiddleware,  rbacMiddleware({ resource: "enquiry", action: "update" }), updateEnquiry);
router.delete("/:id", authMiddleware,  rbacMiddleware({ resource: "enquiry", action: "delete" }), deleteEnquiry);
router.get("/:id",rbacMiddleware({ resource: "enquiry", action: "read" }), getEnquiry);
router.get("/", getallEnquiry);

module.exports = router;
