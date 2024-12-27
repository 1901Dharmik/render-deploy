const AllLead = require("../../models/crmModels/allLeadModel");
const asyncHandler = require("express-async-handler");
const validateMongoDbId = require("../../utils/validateMongodbId");
const User = require("../../models/userModel");
const createAllLead = asyncHandler(async (req, res) => {
  // try {
  //   const newAllLead = await AllLead.create(req.body);
  //   res.json(newAllLead);
  // } catch (error) {
  //   throw new Error(error);
  // }
  try {
    // Add user ID to the brand document
    const newAllLead = {
      ...req.body,
      user: req.user.id // Assuming you have user info in req.user
    };

    const brand = new AllLead(newAllLead);
    await brand.save();

    res.status(201).json(newAllLead);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});
// Assign Lead
const assignLead = asyncHandler(async (req, res) => {
  try {
      const { userId } = req.body;
      const { id } = req.params;
      // validateMongoDbId(id);
      // Check if user exists
      const userToAssign = await User.findById(userId);
      if (!userToAssign) {
          return res.status(404).json({ error: 'User not found' });
      }
      
      // Update lead
      const lead = await AllLead.findById(id);
      if (!lead) {
          return res.status(404).json({ error: 'Lead not found' });
      }
      
      lead.assignedTo = userId;
      lead.status = 'assigned';
      lead.updatedAt = Date.now();
      
      await lead.save();
      
      res.json(lead);
  } catch (error) {
      res.status(400).json({ error: error.message });
  }
});
const updateAllLead = asyncHandler(async (req, res) => {
  const { id } = req.params;
  validateMongoDbId(id);
  try {
    const updatedAllLead = await AllLead.findByIdAndUpdate(id, req.body, {
      new: true,
    });
    res.json(updatedAllLead);
  } catch (error) {
    throw new Error(error);
  }
});
const deleteAllLead = asyncHandler(async (req, res) => {
  const { id } = req.params;
  validateMongoDbId(id);
  try {
    const deletedAllLead = await AllLead.findByIdAndDelete(id);
    res.json(deletedAllLead);
  } catch (error) {
    throw new Error(error);
  }
});
const getAllLead = asyncHandler(async (req, res) => {
  const { id } = req.params;
  validateMongoDbId(id);
  try {
    const getaAllLead = await AllLead.findById(id);
    res.json(getaAllLead);
  } catch (error) {
    throw new Error(error);
  }
});
const getallAllLead = asyncHandler(async (req, res) => {
  try {
    const getallAllLead = await AllLead.find()
    // .populate("agent")
    // .populate("leadUser")
    // .populate('leadOrder')
    res.json(getallAllLead);
  } catch (error) {
    throw new Error(error);
  }
});
module.exports = {
  createAllLead,
  updateAllLead,
  deleteAllLead,
  getAllLead,
  getallAllLead,
  assignLead
};
