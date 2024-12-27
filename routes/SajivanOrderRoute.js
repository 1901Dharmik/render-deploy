// routes/orderRoutes.js
const express = require('express');
const {
  sajivancreateOrder,
  getAllOrders,
  getOrderById,
  updateOrder,
  deleteOrder,
  sajivanAnalytics,
} = require('../controller/orderController');

const router = express.Router();

router.route('/').post(sajivancreateOrder).get(getAllOrders);
router.route('/:id').get(getOrderById).put(updateOrder).delete(deleteOrder);
router.route('/sajivan/analytics').get(sajivanAnalytics);

module.exports = router;
