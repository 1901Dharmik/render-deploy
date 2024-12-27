const express = require("express");
const {
  createCategory,
  updateCategory,
  deleteCategory,
  getCategory,
  getallCategory,
} = require("../controller/blogCatCtrl");
const { authMiddleware, isAdmin } = require("../middlewares/authMiddleware");
const rbacMiddleware = require("../middlewares/rbacMiddleware");
const router = express.Router();

router.post("/", authMiddleware, rbacMiddleware({ resource: "blog-category", action: "create" }), createCategory);
router.put("/:id", authMiddleware, rbacMiddleware({ resource: "blog-category", action: "update" }), updateCategory);
router.delete("/:id", authMiddleware, rbacMiddleware({ resource: "blog-category", action: "delete" }), deleteCategory);
router.get("/:id", getCategory);
router.get("/", getallCategory);

module.exports = router;
