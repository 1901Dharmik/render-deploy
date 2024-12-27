const Brand = require("../models/brandModel");
const asyncHandler = require("express-async-handler");
const validateMongoDbId = require("../utils/validateMongodbId");

const createBrand = asyncHandler(async (req, res) => {
  // try {
  //   const newBrand = await Brand.create(req.body);
  //   res.json(newBrand);
  // } catch (error) {
  //   throw new Error(error);
  // }
  // const { userId } = req.user;
  try {
    // Add user ID to the brand document
    const brandData = {
      ...req.body,
      user: req.user.id // Assuming you have user info in req.user
    };

    const brand = new Brand(brandData);
    await brand.save();

    res.status(201).json(brand);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});
const updateBrand = asyncHandler(async (req, res) => {
  const { id } = req.params;
  validateMongoDbId(id);
  try {
    const updatedBrand = await Brand.findByIdAndUpdate(id, req.body, {
      
      new: true,
      user: req.user.id
    });
    res.json(updatedBrand);
  } catch (error) {
    throw new Error(error);
  }
});
const deleteBrand = asyncHandler(async (req, res) => {
  const { id } = req.params;
  validateMongoDbId(id);
  try {
    const deletedBrand = await Brand.findByIdAndDelete(id,{
      user: req.user.id  // Added user ID in options
    });
    res.json(deletedBrand);
  } catch (error) {
    throw new Error(error);
  }
});
const getBrand = asyncHandler(async (req, res) => {
  const { id } = req.params;
  validateMongoDbId(id);
  try {
    const getaBrand = await Brand.findById(id,  {
      user: req.user.id  // Added user ID in options
    });
    res.json(getaBrand);
  } catch (error) {
    throw new Error(error);
  }
});
const getallBrand = asyncHandler(async (req, res) => {
  try {
    const getallBrand = await Brand.find();
    res.json(getallBrand);
  } catch (error) {
    throw new Error(error);
  }
});
module.exports = {
  createBrand,
  updateBrand,
  deleteBrand,
  getBrand,
  getallBrand,
};
