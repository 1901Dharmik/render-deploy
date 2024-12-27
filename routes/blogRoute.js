const express = require("express");
const {
  createBlog,
  updateBlog,
  getBlog,
  getAllBlogs,
  deleteBlog,
  liketheBlog,
  disliketheBlog,
  uploadImages,
  deleteImages,
  draftBlog,
  publishBlog,
} = require("../controller/blogCtrl");
const { authMiddleware, isAdmin } = require("../middlewares/authMiddleware");
const { uploadPhoto, blogImgResize } = require("../middlewares/uploadImage");
const rbacMiddleware = require("../middlewares/rbacMiddleware");
const router = express.Router();

router.post("/", authMiddleware, rbacMiddleware({ resource: "blog", action: "create" }), createBlog);
// router.put(
//   "/upload/:id",
//   authMiddleware,
//   isAdmin,
//   uploadPhoto.array("images", 2),
//   blogImgResize,
//   uploadImages
// );
router.put("/likes", authMiddleware, liketheBlog);
router.put("/dislikes", authMiddleware, disliketheBlog);

router.put("/:id", authMiddleware, rbacMiddleware({ resource: "blog", action: "update" }), updateBlog);

router.get("/:id", getBlog);
router.get("/", getAllBlogs);
router.patch("/:id/draft", authMiddleware,isAdmin,draftBlog);
router.patch("/:id/publish", authMiddleware,isAdmin,publishBlog);

router.delete("/:id", authMiddleware, rbacMiddleware({ resource: "blog", action: "delete" }), deleteBlog);
router.delete("/delete-image", authMiddleware,rbacMiddleware({ resource: "blog", action: "delete" }), deleteImages);
module.exports = router;
