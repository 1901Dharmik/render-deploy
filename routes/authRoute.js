const express = require("express");
const {
  createUser,
  loginUserCtrl,
  getallUser,
  getaUser,
  deleteaUser,
  updatedUser,
  blockUser,
  unblockUser,
  handleRefreshToken,
  logout,
  updatePassword,
  forgotPasswordToken,
  resetPassword,
  loginAdmin,
  getWishlist,
  saveAddress,
  userCart,
  getUserCart,
  emptyCart,
  applyCoupon,
  createOrder,
  getOrders,
  updateOrderStatus,
  getAllOrders,
  removeProductFromCart,
  updateProductQuantityFromCart,
  getMyOrders,
  updateOrder,
  getSingleOrder,
  getMonthWiseOrderIncome,
  getYearlyTotalOrder,
  // verifyOTP,
  changeUserRole,
  getOrdersByDateRange,
  getAllOrdersByDate,
  checkUserIsActive,
  getUsersWithMaxOrders,
  ordersbyeachmonthbysingleyear,
  getRevenueByProduct,
  cretedOrderedByLastMonth,
  getOederBymonthAndYear,
  ordersByEachState,
  getOrdryByorderStatus,
  eachProductWithRevenue,
  newOrderDetails,
  getAllOrdersByTrands,
  getAllOrderssincelastmonth,
  createPaymentIntent,
  refreshUserData,
  
} = require("../controller/userCtrl");
const { authMiddleware, isAdmin } = require("../middlewares/authMiddleware");
const rbacMiddleware = require("../middlewares/rbacMiddleware");
const { checkout, paymentVerification } = require("../controller/paymentCtrl");
const router = express.Router();

router.post("/register", createUser);
router.post("/forgot-password-token", forgotPasswordToken);

router.put("/reset-password/:token", resetPassword);
router.put("/change-role", changeUserRole);
router.put("/password", authMiddleware, updatePassword);
router.post("/login", loginUserCtrl);
router.post("/admin-login", loginAdmin);
router.post("/cart", authMiddleware, userCart);
router.post("/order/checkout", authMiddleware, checkout);
router.post("/order/paymentVerification", authMiddleware, paymentVerification);
router.post("/cart/create-order", authMiddleware, createOrder);
// router.post('/verify-otp',verifyOTP);
router.post("/cart/applycoupon", authMiddleware, applyCoupon);
router.post("/order/create-payment-intent", authMiddleware,createPaymentIntent)

router.get("/all-users", getallUser);
router.get("/getmyorders", authMiddleware, getMyOrders);
router.get("/getallorders", authMiddleware, getAllOrders);
router.post("/getorderbyuser/:id", authMiddleware, getAllOrders);
router.get("/getaorder/:id", authMiddleware, getSingleOrder);
router.get("/:id/isActive", authMiddleware, checkUserIsActive);
router.put("/updateorder/:id", authMiddleware, updateOrder);

router.get("/refresh", handleRefreshToken);
router.get("/logout", logout);
router.get("/wishlist", authMiddleware, getWishlist);
router.get("/cart", authMiddleware, getUserCart);
router.delete("/empty-cart", authMiddleware, emptyCart);
router.get("/:id", authMiddleware, getaUser);
router.get("/getuser/refreshuser", authMiddleware,refreshUserData )
router.get("/orders", authMiddleware, getOrders);

//---------------------- Analysis ---------------------------------
router.get(
  "/getuser/maxorders",
  authMiddleware,

  getUsersWithMaxOrders
);
router.get("/monthly-summary/:year", ordersbyeachmonthbysingleyear);
router.get("/products/revenue", authMiddleware, getRevenueByProduct);
router.get("/getordersByDate", authMiddleware, getOrdersByDateRange);
router.get("/getAllOrdersByDate", authMiddleware, getAllOrdersByDate);
router.get(
  "/orderby/getMonthWiseOrderIncome",
  authMiddleware,
  getMonthWiseOrderIncome
);
router.get("/orderby/getyearlyorders", authMiddleware, getYearlyTotalOrder);
router.get("/orderby/lastmonth", cretedOrderedByLastMonth);
router.get("/getorder/monthandyear", getOederBymonthAndYear);
router.get("/getorders/eachstate", ordersByEachState);
router.get("/getorders/orderstatus", getOrdryByorderStatus);
router.get("/getorder/eachproduct", eachProductWithRevenue);
router.get("/getorder/neworderdetails", newOrderDetails);
router.get("/getorder/getallordersbytrands", getAllOrdersByTrands);
router.get("/getorder/getallorderssincelastmonth", getAllOrderssincelastmonth);
router.delete(
  "/delete-product-cart/:cartItemId",
  authMiddleware,
  removeProductFromCart
);
router.delete(
  "/update-product-cart/:cartItemId/:newQuantity",
  authMiddleware,
  updateProductQuantityFromCart
);
router.delete("/:id", deleteaUser);

router.put(
  "/order/update-order/:id",
  authMiddleware,
  isAdmin,
  updateOrderStatus
);

router.put("/edit-user", authMiddleware, updatedUser);
router.put("/save-address", authMiddleware, saveAddress);
router.put("/block-user/:id", authMiddleware,blockUser);
router.put("/unblock-user/:id", authMiddleware,unblockUser);

module.exports = router;
