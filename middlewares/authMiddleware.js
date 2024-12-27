// const User = require("../models/user");
// const jwt = require("jsonwebtoken");
// const asyncHandler = require("express-async-handler");

// const authMiddleware = asyncHandler(async (req, res, next) => {
//   let token;
//   if (req?.header?.authorization?.startWith("Bearer")) {
//     token = req.header.authorization.split(" ")[1];
//     try {
//       if (token) {
//         const decoded = jwt.verify(token, process.env.JWT_SECRET);
//         console.log(decoded);
//         const user = await User.findById(decoded?.id);
//         req.user = user;
//         next();
//       }
//     } catch (error) {
//       throw new Error("Not Authorized token Expired, please login");
//     }
//   } else {
//     throw new Error(" There is No Token Attached to the Header");
//   }
// });


const jwt = require("jsonwebtoken");
const asyncHandler = require("express-async-handler");
const User = require("../models/userModel");

// Middleware to authenticate user
const authMiddleware = asyncHandler(async (req, res, next) => {
  const authorizationHeader = req.headers.authorization;

  if (!authorizationHeader || !authorizationHeader.startsWith("Bearer ")) {
    res.status(401);
    throw new Error("No token attached to the header");
  }

  const token = authorizationHeader.split(" ")[1];

  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    console.log("Decoded User :", decoded);
    const user = await User.findById(decoded?.id).populate('role')
    // const user = await User.findOne(decoded?.id).populate('role');
    if (!user) {
      res.status(404);
      throw new Error("User not found");
    }

    req.user = user;
    next();
  } catch (error) {
    res.status(401);
    throw new Error("Not authorized. Token expired or invalid. Please login.");
  }
});



const isAdmin = asyncHandler(async (req, res, next) => {
    console.log(req.user);
    if (!req.user) {
      throw new Error("User not found");
    }
  
    const { email } = req.user;
    const adminUser = await User.findOne({ email });
  
    if (!adminUser || adminUser.role !== "admin") {
      return res.status(403).send("You are not authorized to access this route");
    }
  
    next();
  });

  const isEditor = asyncHandler(async (req, res, next) => {
    console.log(req.user);
    if (!req.user) {
      throw new Error("User not found");
    }
  
    const { email } = req.user;
    const editorUser = await User.findOne({ email });
  
    if (!editorUser || editorUser.role !== "editor") {
      return res.status(403).send("You are not authorized to access this route");
    }
  
    next();
  });

  // const checkPermission = (requiredPermission) => {
  //   return asyncHandler(async (req, res, next) => {
  //     if (!req.user) {
  //       return res.status(401).json({ message: "User not found", redirect: "/login" });
  //     }
  
  //     const userRole = await Role.findById(req.user.role);
  //     if (!userRole) {
  //       return res.status(403).json({ message: "Role not found", redirect: "/login" });
  //     }
  
  //     if (userRole.permissions.includes(requiredPermission)) {
  //       next();
  //     } else {
  //       return res.status(403).json({ message: "You don't have permission to access this route", redirect: "/login" });
  //     }
  //   });
  // };
module.exports = { authMiddleware, isAdmin,isEditor };


