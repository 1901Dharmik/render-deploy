const express = require("express");
const { uploadImages, deleteImages } = require("../controller/uploadCtrl");
const { isAdmin, authMiddleware } = require("../middlewares/authMiddleware");
const { uploadPhoto, productImgResize } = require("../middlewares/uploadImage");
const rbacMiddleware = require("../middlewares/rbacMiddleware");
const router = express.Router();

router.post(
  "/",
  authMiddleware,
  rbacMiddleware({ resource: "upload", action: "create" }),
  uploadPhoto.array("images", 10),
  productImgResize,
  uploadImages
);

router.delete("/delete-img/:id", authMiddleware, 
// isAdmin,
 deleteImages);

module.exports = router;
