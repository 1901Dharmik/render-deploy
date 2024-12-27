const express = require("express");
const {
  createEvent,
  updateEvent,
  deleteEvent,
  getEvent,
  getallEvent,
} = require("../controller/eventCtrl");
const { authMiddleware, isAdmin } = require("../middlewares/authMiddleware");
const rbacMiddleware = require("../middlewares/rbacMiddleware");
const router = express.Router();

router.post("/", authMiddleware,
  // authMiddleware,  rbacMiddleware({ resource: "events", action: "create" }),
  createEvent);
router.put("/:id", authMiddleware, 
  // isAdmin,
   updateEvent);
router.delete("/:id", authMiddleware,
  //  isAdmin, 
   deleteEvent);
router.get("/:id", getEvent);
router.get("/", getallEvent);

module.exports = router;
