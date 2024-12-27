const mongoose = require('mongoose');

var leadorderSchema = new mongoose.Schema(
  {
    // leaduser: {
    //   type: mongoose.Schema.Types.ObjectId,
    //   ref: 'LeadUser',
    //   required: true,
    // },
    shippingInfo: {
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
    paymentMethod: {
      type: String,
      required: true,
      enum: ['COD', 'Online'],
    },
    orderItems: [
      {
        leadproduct: {
          type: mongoose.Schema.Types.ObjectId,
          ref: 'LeadProduct',
          required: true,
        },
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
    // month: {
    //   type: String,
    //   default: () => new Date().getMonth().toString(),
    // },
    // totalPrice: {
    //   type: Number,
    //   required: true,
    // },
    // totalPriceAfterDiscount: {
    //   type: Number,
    //   required: true,
    // },
    orderStatus: {
      type: String,
      default: 'Ordered',
    },
    Courier:{
      type: String,
      required: true,
      enum: ['Delivery','Ecom','Bluedart','Anjani','Maruti'],
      default:'Delivery'
    },
    Tracking_id:{
      type:String,
      default:'',
    }
  },
  {
    timestamps: true,
  }
);

module.exports = mongoose.model('LeadOrder', leadorderSchema);
