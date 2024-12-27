const express = require("express");
const {
  createProduct,
  getaProduct,
  getAllProduct,
  updateProduct,
  deleteProduct,
  addToWishlist,
  rating,
  // createNewProduct

  // updateProductIndex,
} = require("../controller/productCtrl");
const { isAdmin, authMiddleware } = require("../middlewares/authMiddleware");
const rbacMiddleware = require("../middlewares/rbacMiddleware");
const router = express.Router();

router.post(
  "/",
  authMiddleware,
  rbacMiddleware({ resource: "product", action: "create" }),
  createProduct
);
// router.post("/product",createNewProduct);
router.get("/:id", getaProduct);
router.put("/wishlist", authMiddleware, addToWishlist);
router.put("/rating", authMiddleware, rating);
// router.put('/update-index', updateProductIndex);
router.put(
  "/:id",
  authMiddleware,
  rbacMiddleware({ resource: "product", action: "update" }),
  updateProduct
);
router.delete("/:id", authMiddleware, isAdmin, deleteProduct);

router.get("/", getAllProduct);

//
// router.put(
//   "/upload",
//   authMiddleware,
//   isAdmin,
//   uploadPhoto.array("images", 10),
//   // productImgResize,
//   uploadImages
// );
// router.delete("/delete-image", authMiddleware, isAdmin, deleteImages);

module.exports = router;
