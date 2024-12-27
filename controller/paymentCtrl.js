const Razorpay = require("razorpay");
const instance = new Razorpay({
  key_id: "rzp_test_Z39iNGufE6LzVy",
  key_secret: "puU6bMBAkCDetLymEQyTDZ5n",
});

const checkout = async (req, res) => {
    const { amount } = req.body;
  try {
    const options = {
        // amount: 50000,
      amount: amount * 100, // amount in the smallest currency unit
        // amount: req.body.amount,

      // amount in the smallest currency unit
      currency: "INR",
    //   receipt: "", //the id generated after payment approval
    };
    const order = await instance.orders.create(options);
    res.json(order);
  } catch (error) {
    console.log(error);
  }
};

const paymentVerification = async (req, res) => {
  const { razorpayOrderId, razorpayPaymentId } = req.body;
  res.json({
    
    razorpayOrderId,
    razorpayPaymentId,
    status: "success",
  });
};
module.exports = {
  checkout,
  paymentVerification,
};
