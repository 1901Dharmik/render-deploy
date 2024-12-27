const mongoose = require('mongoose');

// const allLeadSchema = new mongoose.Schema({
//   leadUser: {
//     type: mongoose.Schema.Types.ObjectId,
//     ref: 'LeadUser',
//     // required: true,
//   },
//   leadOrder: {
//     type: mongoose.Schema.Types.ObjectId,
//     ref: 'LeadOrder',
//     // required: true,
//   },
//   agent: {
//     type: mongoose.Schema.Types.ObjectId,
//     ref: 'Agent',
//     default:"Not_Asigned"
//     // required: true,
//   },
// }, { timestamps: true });

// module.exports = mongoose.model('AllLead', allLeadSchema);
const allLeadSchema = new mongoose.Schema({
  title: { type: String, required: true },
  description: String,
  status: { 
      type: String, 
      enum: ['new', 'assigned', 'in-progress', 'completed'], 
      default: 'new' 
  },
  createdBy: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
  assignedTo: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
  createdAt: { type: Date, default: Date.now },
  updatedAt: { type: Date, default: Date.now }
});
module.exports = mongoose.model('AllLead', allLeadSchema);
// const Lead = mongoose.model('AllLead', allLeadSchema);