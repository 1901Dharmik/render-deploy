const LeadOrder = require("../../models/crmModels/leadOrderModel");
const asyncHandler = require("express-async-handler");
const validateMongoDbId = require("../../utils/validateMongodbId");

const createLeadOrder = asyncHandler(async (req, res) => {
  try {
    const newLeadOrder = await LeadOrder.create(req.body);
    res.json(newLeadOrder);
  } catch (error) {
    throw new Error(error);
  }
});
const updateLeadOrder = asyncHandler(async (req, res) => {
  const { id } = req.params;
  validateMongoDbId(id);
  try {
    const updatedLeadOrder = await LeadOrder.findByIdAndUpdate(id, req.body, {
      new: true,
    });
    res.json(updatedLeadOrder);
  } catch (error) {
    throw new Error(error);
  }
});
const deleteLeadOrder = asyncHandler(async (req, res) => {
  const { id } = req.params;
  validateMongoDbId(id);
  try {
    const deletedLeadOrder = await LeadOrder.findByIdAndDelete(id);
    res.json(deletedLeadOrder);
  } catch (error) {
    throw new Error(error);
  }
});
const getLeadOrder = asyncHandler(async (req, res) => {
  const { id } = req.params;
  validateMongoDbId(id);
  try {
    const getaLeadOrder = await LeadOrder.findById(id);
    res.json(getaLeadOrder);
  } catch (error) {
    throw new Error(error);
  }
});
const getallLeadOrder = asyncHandler(async (req, res) => {
  try {
    const getallLeadOrder = await LeadOrder.find()
    .populate("orderItems.leadproduct")
    res.json(getallLeadOrder);
  } catch (error) {
    throw new Error(error);
  }
});
module.exports = {
  createLeadOrder,
  updateLeadOrder,
  deleteLeadOrder,
  getLeadOrder,
  getallLeadOrder,
};
