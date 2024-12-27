const mongoose = require('mongoose');

const addressBookSchema = new mongoose.Schema({
  name: { type: String, required: true },
//   email: { type: String, required: true },
  address: { type: String, required: true },
  mobile: { type: String, required: true },
//   company: { type: String, required: true },
  addressType: { type: String, enum: ['Home', 'Office'], required: true },
  primary: { type: Boolean, default: false },
});

module.exports = mongoose.model('AddressBook', addressBookSchema);
