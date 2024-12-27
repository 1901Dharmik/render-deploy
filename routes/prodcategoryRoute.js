// const express = require("express");
// const {
//   createCategory,
//   updateCategory,
//   deleteCategory,
//   getCategory,
//   getallCategory,
// } = require("../controller/prodcategoryCtrl");
// const { authMiddleware, isAdmin } = require("../middlewares/authMiddleware");
// const rbacMiddleware = require("../middlewares/rbacMiddleware");
// const router = express.Router();

// router.post("/", authMiddleware,  rbacMiddleware({ resource: "category", action: "create" }), createCategory);
// router.put("/:id", authMiddleware, rbacMiddleware({ resource: "category", action: "update" }), updateCategory);
// router.delete("/:id", authMiddleware,  rbacMiddleware({ resource: "category", action: "delete" }), deleteCategory);
// router.get("/:id", getCategory);
// router.get("/", getallCategory);

// module.exports = router;
const express = require("express");
const {
  createCategory,
  updateCategory,
  deleteCategory,
  getCategory,
  getallCategory,

} = require("../controller/prodcategoryCtrl");
const { authMiddleware, isAdmin } = require("../middlewares/authMiddleware");
const rbacMiddleware = require("../middlewares/rbacMiddleware");
const router = express.Router();

router.post(
  "/",
  authMiddleware,
  rbacMiddleware({ resource: "category", action: "create" }),
  createCategory
);
router.put(
  "/:id",
  authMiddleware,
  rbacMiddleware({ resource: "category", action: "update" }),
  updateCategory
);
router.delete(
  "/:id",
  authMiddleware,
  rbacMiddleware({ resource: "category", action: "delete" }),
  deleteCategory
);
router.get(
  "/:id",
  //  authMiddleware,
  // rbacMiddleware({ resource: "category", action: "read" }),
  getCategory
);
// router.get(
//   "/get-user",
//   authMiddleware,
//   // rbacMiddleware({ resource: "category", action: "read" }),
//   getCategory
// );
router.get(
  "/",
  // authMiddleware,
  // rbacMiddleware({ resource: "category", action: "read" }),
  getallCategory
);

module.exports = router;
// refreshUserData
