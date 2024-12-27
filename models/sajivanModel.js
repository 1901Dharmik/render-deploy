// models/orderModel.js
const mongoose = require('mongoose');

// Define the Order schema
const sajivanorderSchema = new mongoose.Schema({
  prepaid: { type: String, default: "" },
  status: { type: String,  },
  source: { type: String,  },
  type: { type: String, },
  date: { type: String,  },
  agent: { type: String,  },
  customerName: { type: String,},
  customerNumber: { type: String,  },
  alternateNumber: { type: String, default: "" },
  price: { type: Number, },
  disease: { type: String, default: "" },
  gasofinePowder: { type: Number, default: 0 },
  refreshPowder: { type: Number, default: 0 },
  iceRosePowder: { type: Number, default: 0 },
  amrutamTablet: { type: Number, default: 0 },
  lexoliteTablet: { type: Number, default: 0 },
  constirelexPowder: { type: Number, default: 0 },
  courierName: { type: String, default: "" },
  trackingId: { type: String, default: "" }
});

// Create the Order model
const SajivanOrder = mongoose.model('Sajivan', sajivanorderSchema);

module.exports = SajivanOrder;
