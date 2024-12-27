const LeadProduct = require("../../models/crmModels/leadProductModel");
const asyncHandler = require("express-async-handler");
const validateMongoDbId = require("../../utils/validateMongodbId");

const createLeadProduct = asyncHandler(async (req, res) => {
  try {
    const newLeadProduct = await LeadProduct.create(req.body);
    res.json(newLeadProduct);
  } catch (error) {
    throw new Error(error);
  }
});
const updateLeadProduct = asyncHandler(async (req, res) => {
  const { id } = req.params;
  validateMongoDbId(id);
  try {
    const updatedLeadProduct = await LeadProduct.findByIdAndUpdate(id, req.body, {
      new: true,
    });
    res.json(updatedLeadProduct);
  } catch (error) {
    throw new Error(error);
  }
});
const deleteLeadProduct = asyncHandler(async (req, res) => {
  const { id } = req.params;
  validateMongoDbId(id);
  try {
    const deletedLeadProduct = await LeadProduct.findByIdAndDelete(id);
    res.json(deletedLeadProduct);
  } catch (error) {
    throw new Error(error);
  }
});
const getLeadProduct = asyncHandler(async (req, res) => {
  const { id } = req.params;
  validateMongoDbId(id);
  try {
    const getaLeadProduct = await LeadProduct.findById(id);
    res.json(getaLeadProduct);
  } catch (error) {
    throw new Error(error);
  }
});
const getallLeadProduct = asyncHandler(async (req, res) => {
  try {
    const getallLeadProduct = await LeadProduct.find();
    res.json(getallLeadProduct);
  } catch (error) {
    throw new Error(error);
  }
});
module.exports = {
  createLeadProduct,
  updateLeadProduct,
  deleteLeadProduct,
  getLeadProduct,
  getallLeadProduct,
};
