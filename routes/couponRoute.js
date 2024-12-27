const express = require("express");
const {
  createCoupon,
  getAllCoupons,
  updateCoupon,
  deleteCoupon,
  getCoupon
} = require("../controller/couponCtrl");
const { authMiddleware, isAdmin } = require("../middlewares/authMiddleware");
const rbacMiddleware = require("../middlewares/rbacMiddleware");
const router = express.Router();

router.post("/", 
  // authMiddleware,   rbacMiddleware({ resource: "coupon", action: "create" }), 
  createCoupon);
router.get("/",
  //  authMiddleware,   rbacMiddleware({ resource: "coupon", action: "read" }), 
   getAllCoupons);
router.get("/:id", authMiddleware,  rbacMiddleware({ resource: "coupon", action: "read" }), getCoupon);
router.put("/:id", authMiddleware,  rbacMiddleware({ resource: "coupon", action: "update" }), updateCoupon);
router.delete("/:id", authMiddleware,   rbacMiddleware({ resource: "coupon", action: "delete" }), deleteCoupon);

module.exports = router;
