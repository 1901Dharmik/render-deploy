const mongoose = require("mongoose");

const invoiceSchema = new mongoose.Schema({
  invoiceNumber: { type: String, required: true },
  invoiceFrom: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "AddressBook",
    required: true,
  },
  invoiceTo: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "AddressBook",
    required: true,
  },
  status: {
    type: String,
    enum: ["paid", "pending", "overdue", "draft"],
    required: true,
  },
  taxes: { type: Number, required: true },
  discount: { type: Number, required: true },
  //   shipping: { type: Number, required: true },
  subtotal: { type: Number, required: true },
  totalAmount: { type: Number, required: true },
  items: [
    {
      title: String,
      // description: String,
      price: Number,
      // service: String,
      quantity: Number,
      total: Number,
    },
  ],
  sent: { type: Number, required: true },
  createDate: { type: Date, required: true },
  dueDate: { type: Date, required: true },
});

module.exports = mongoose.model("Invoice", invoiceSchema);
