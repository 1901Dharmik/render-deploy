// models/Role.js
const mongoose = require('mongoose');

const RoleSchema = new mongoose.Schema({
  name: { type: String, required: true, unique: true },
  // createdBy: {
  //   type: mongoose.Schema.Types.ObjectId,
  //   ref: 'User',
  //   required: true
  // },
  // createdBy:{
  //   type: mongoose.Schema.Types.ObjectId,
  //   ref: "User",
  // },
  permissions: [{
    resource: { type: String, required: true },
    actions: [{ type: String, enum: ['create', 'read', 'update', 'delete', 'all','menuVisible','export'] }]
  }]
});

module.exports = mongoose.model('Role', RoleSchema);
