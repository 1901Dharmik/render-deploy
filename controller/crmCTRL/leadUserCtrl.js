const LeadUser = require("../../models/crmModels/leadUserModel");
const asyncHandler = require("express-async-handler");
const validateMongoDbId = require("../../utils/validateMongodbId");

const createLeadUser = asyncHandler(async (req, res) => {
  try {
    const newLeadUser = await LeadUser.create(req.body);
    res.json(newLeadUser);
  } catch (error) {
    throw new Error(error);
  }
});
const updateLeadUser = asyncHandler(async (req, res) => {
  const { id } = req.params;
  validateMongoDbId(id);
  try {
    const updatedLeadUser = await LeadUser.findByIdAndUpdate(id, req.body, {
      new: true,
    });
    res.json(updatedLeadUser);
  } catch (error) {
    throw new Error(error);
  }
});
const deleteLeadUser = asyncHandler(async (req, res) => {
  const { id } = req.params;
  validateMongoDbId(id);
  try {
    const deletedLeadUser = await LeadUser.findByIdAndDelete(id);
    res.json(deletedLeadUser);
  } catch (error) {
    throw new Error(error);
  }
});
const getLeadUser = asyncHandler(async (req, res) => {
  const { id } = req.params;
  validateMongoDbId(id);
  try {
    const getaLeadUser = await LeadUser.findById(id)
   
    res.json(getaLeadUser);
  } catch (error) {
    throw new Error(error);
  }
});
const getallLeadUser = asyncHandler(async (req, res) => {
  try {
    const getallLeadUser = await LeadUser.find()
    .populate('agent', 'name email phone');
    res.json(getallLeadUser);
  } catch (error) {
    throw new Error(error);
  }
});
module.exports = {
  createLeadUser,
  updateLeadUser,
  deleteLeadUser,
  getLeadUser,
  getallLeadUser,
};
