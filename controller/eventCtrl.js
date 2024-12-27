const Event = require("../models/eventModel");
const asyncHandler = require("express-async-handler");
const validateMongoDbId = require("../utils/validateMongodbId");

const createEvent = asyncHandler(async (req, res) => {
  try {
    const newEvent = await Event.create(req.body);
    res.json(newEvent);
  } catch (error) {
    throw new Error(error);
  }
});
// const createEvent = asyncHandler(async (req, res) => {
//   try {
//     // Ensure that `req.user.id` contains the user ID (from authentication middleware)
//     const eventData = {
//       ...req.body,
//       // createdBy: req.user.id, // Add the `createdBy` field with the user ID
//     };

//     const newEvent = await Event.create(eventData);
//     res.json(newEvent);
//   } catch (error) {
//     throw new Error(error);
//   }
// });
const updateEvent = asyncHandler(async (req, res) => {
  const { id } = req.params;
  validateMongoDbId(id);
  try {
    const updatedEvent = await Event.findByIdAndUpdate(id, req.body, {
      new: true,
    });
    res.json(updatedEvent);
  } catch (error) {
    throw new Error(error);
  }
});
const deleteEvent = asyncHandler(async (req, res) => {
  const { id } = req.params;
  validateMongoDbId(id);
  try {
    const deletedEvent = await Event.findByIdAndDelete(id);
    res.json(deletedEvent);
  } catch (error) {
    throw new Error(error);
  }
});
const getEvent = asyncHandler(async (req, res) => {
  const { id } = req.params;
  validateMongoDbId(id);
  try {
    const getaEvent = await Event.findById(id);
    res.json(getaEvent);
  } catch (error) {
    throw new Error(error);
  }
});
const getallEvent = asyncHandler(async (req, res) => {
  try {
    const getallEvent = await Event.find();
    res.json(getallEvent);
  } catch (error) {
    throw new Error(error);
  }
});
module.exports = {
  createEvent,
  updateEvent,
  deleteEvent,
  getEvent,
  getallEvent,
};
