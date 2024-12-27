// const express = require("express");
// const {
//   createAgent,
//   updateAgent,
//   deleteAgent,
//   getAgent,
//   getallAgent,
// } = require("../../controller/crmCTRL/agentCtrl");
// const authMiddleware = require("../../middlewares/authMiddleware");
// const router = express.Router();
// const rbacMiddleware = require("../../middlewares/rbacMiddleware")

// router.post(  "/",
//   authMiddleware,
//   rbacMiddleware({ resource: "agents", action: "create" }),
//   createAgent 
// );
// router.put("/:id", authMiddleware, isAdmin, updateAgent);
// router.delete("/:id", authMiddleware, isAdmin, deleteAgent);
// router.get("/:id", getAgent);
// router.get("/", getallAgent);

// module.exports = router;


const express = require("express");
const {
  createAgent,
  updateAgent,
  deleteAgent,
  getAgent,
  getallAgent,
} = require("../../controller/crmCTRL/agentCtrl");
const { authMiddleware, isAdmin } = require("../../middlewares/authMiddleware");
const rbacMiddleware = require("../../middlewares/rbacMiddleware");
const router = express.Router();

router.post("/", 
   authMiddleware,
  rbacMiddleware({ resource: "agents", action: "create" }),
  createAgent);
router.patch(
  "/:id",
  authMiddleware,
  rbacMiddleware({ resource: "agents", action: "delete" }),
  updateAgent
);
router.delete(
  "/:id",
  authMiddleware,
  rbacMiddleware({ resource: "agents", action: "delete" }),
  deleteAgent
);
router.get(
  "/:id",
  authMiddleware,
  rbacMiddleware({ resource: "agents", action: "read" }),
  getAgent
);
router.get(
  "/",
  authMiddleware,
  rbacMiddleware({ resource: "agents", action: "read" }),
  getallAgent
);

module.exports = router;
