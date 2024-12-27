// controllers/roleController.js
const Role = require("../models/Role");
const asyncHandler = require("express-async-handler");
const createRole = asyncHandler( async (req, res) => {
  try {
    const role = new Role(req.body);
    await role.save();
    res.status(201).send(role);
  } catch (error) {
    res.status(400).send(error);
  }
});
// const createRole = asyncHandler(async (req, res) => {
//   try {
//     const role = new Role({
//       ...req.body,
//       createdBy: req.user._id  // Assuming req.user contains the authenticated user
//     });
//     await role.save();
//     res.status(201).send({
//       message: "Role created successfully",
//       role: role
//     });
//   } catch (error) {
//     res.status(400).send(error);
//   }
// });
const getAllRoles = asyncHandler(async (req, res) => {
  try {
    const roles = await Role.find({});
    res.send(roles);
  } catch (error) {
    res.status(500).send(error);
  }
});

const getRoleById = asyncHandler(async (req, res) => {
  try {
    const role = await Role.findById(req.params.id);
    if (!role) {
      return res.status(404).send();
    }
    res.send(role);
  } catch (error) {
    res.status(500).send(error);
  }
});

const updateRole = asyncHandler(async (req, res) => {
  try {
    const role = await Role.findByIdAndUpdate(req.params.id, req.body, {
      new: true,
      runValidators: true,
    });
    if (!role) {
      return res.status(404).send();
    }
    res.send(role);
  } catch (error) {
    res.status(400).send(error);
  }
});
const deleteRole = asyncHandler(async (req, res) => {
  try {
    const role = await Role.findByIdAndDelete(req.params.id);
    if (!role) {
      return res.status(404).send({ message: "Role not found" });
    }
    res.status(200).send({ 
      message: "Role deleted successfully",
      deletedRole: role 
    });
  } catch (error) {
    res.status(500).send(error);
  }
});
module.exports = {
  createRole,
  getAllRoles,
  getRoleById,
  updateRole,
  deleteRole
};
