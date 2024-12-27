const mongoose = require('mongoose');

var orderSchema = new mongoose.Schema(
  {
    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: true,
    },
    shippingInfo: {
      firstName: {
        type: String,
        required: true,
      },
      lastName: {
        type: String,
        required: true,
      },
      phone:{
        type: Number,
        required: true,
      },
      address: {
        type: String,
        required: true,
      },
      city: {
        type: String,
        required: true,
      },
      state: {
        type: String,
        required: true,
      },
      landmark: {
        type: String,
        // required: true,
      },
      pincode: {
        type: Number,
        required: true,
      },
    },
    paymentInfo: {
      razorpayOrderId: String,
      razorpayPaymentId: String,
      stripePaymentIntentId: String,
      stripePaymentStatus: String,
    },
    paymentMethod: {
      type: String,
      required: true,
      enum: ['COD', 'Razorpay','Stripe'],
    },
    orderItems: [
      {
        product: {
          type: mongoose.Schema.Types.ObjectId,
          ref: 'Product',
          required: true,
        },
        // color: {
        //   type: mongoose.Schema.Types.ObjectId,
        //   ref: 'Color',
        //   required: true,
        // },
        quantity: {
          type: Number,
          required: true,
        },
        price: {
          type: Number,
          required: true,
        },
      },
    ],
    paidAt: {
      type: Date,
      default: Date.now,
    },
    month: {
      type: String,
      default: () => new Date().getMonth().toString(),
    },
    totalPrice: {
      type: Number,
      required: true,
    },
    totalPriceAfterDiscount: {
      type: Number,
      required: true,
    },
    coupon: {
      type: String,
      default: null
    },
    orderStatus: {
      type: String,
      default: 'Ordered',
    },
    courier: {
      courierName: { type: String },
      trackingId: { type: String },
      postedby: { type: mongoose.Schema.Types.ObjectId, ref: "User" },
    },
    // courier:{
    //   type: String,
    //   default:'DHL',
    // },

  },
  
  {
    timestamps: true,
  }
);

module.exports = mongoose.model('Order', orderSchema);
