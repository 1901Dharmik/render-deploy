const User = require("../models/userModel");
const Product = require("../models/productModel");
const Cart = require("../models/cartModel");
const Coupon = require("../models/couponModel");
const uniqid = require("uniqid");
const nodemailer = require("nodemailer");
const generateInvoice = require("../utils/invoiceGenerator");
var htmlPdfNode = require("html-pdf-node");
const fs = require("fs");
const path = require("path");
const { parseISO, isValid, endOfDay } = require("date-fns");
const generateInvoiceTemplate = require("./Mail");
const { generateOTP, sendOTPEmail } = require("../utils/otpUtils");
const Stripe = require("stripe");
// const stripe = Stripe(process.env.STRIPE_SECRET_KEY);
const stripe = require("stripe")(
  "sk_test_51M2BexSIZcM1iqYUjf7pgri2p602o4cYn0tE4EbRUnPqtuYgzYO5HcVYZQQk1LtYPLdCj7ts8iqEB0v45W14UfCW0071UedSa8"
);
const asyncHandler = require("express-async-handler");
const { generateToken } = require("../config/jwtToken");
const validateMongoDbId = require("../utils/validateMongodbId");
const { generateRefreshToken } = require("../config/refreshtoken");
const crypto = require("crypto");
const jwt = require("jsonwebtoken");
const sendEmail = require("./emailCtrl");
const Order = require("../models/orderModel");
const Role = require("../models/Role");

// Create a User ----------------------------------------------
const createUser = asyncHandler(async (req, res) => {
  /**
   * TODO:Get the email from req.body
   */
  const email = req.body.email;
  /**
   * TODO:With the help of email find the user exists or not
   */
  const findUser = await User.findOne({ email: email });

  if (!findUser) {
    /**
     * TODO:if user not found user create a new user
     */
    const newUser = await User.create(req.body);
    res.json(newUser);
  } else {
    /**
     * TODO:if user found then thow an error: User already exists
     */
    throw new Error("User Already Exists");
  }
});

// Login a user
const loginUserCtrl = asyncHandler(async (req, res) => {
  const { email, password } = req.body;
  // check if user exists or not
  const findUser = await User.findOne({ email });
  if (findUser && (await findUser.isPasswordMatched(password))) {
    // Check if user is blocked
    if (findUser.isBlocked) {
      res.status(403);
      throw new Error("Your account has been blocked. Please contact support.");
    }

    const refreshToken = await generateRefreshToken(findUser?._id);
    const updateuser = await User.findByIdAndUpdate(
      findUser.id,
      {
        refreshToken: refreshToken,
      },
      { new: true }
    );
    res.cookie("refreshToken", refreshToken, {
      httpOnly: true,
      // maxAge: 72 * 60 * 60 * 1000,
      maxAge: 20 * 60 * 1000 // 20 minutes
    });
    res.json({
      _id: findUser?._id,
      firstname: findUser?.firstname,
      lastname: findUser?.lastname,
      email: findUser?.email,
      mobile: findUser?.mobile,
      token: generateToken(findUser?._id),
      redirectTo: "/",
      // redirectTo: req.query.redirect || "/", // Redirect to previous location or homepage
    });
  } else {
    throw new Error("Invalid Credentials");
  }
});

// admin login

// const loginAdmin = asyncHandler(async (req, res) => {
//   const { email, password } = req.body;
//   // check if user exists or not
//   const findAdmin = await User.findOne({ email }).populate('role')

//   const userRole = await User.findOne();
//   console.log("role",userRole);

//   if (!userRole) {
//     throw new Error("Invalid Credentials");
//   }
//   if (userRole.role === '6729fabe515246fd06602c9e') throw new Error("Not Authorised");
//   // if (findAdmin.role !== "admin") throw new Error("Not Authorised");
//   if (findAdmin && (await findAdmin.isPasswordMatched(password))) {
//     // Check if admin is blocked
//     if (findAdmin.isBlocked) {
//       res.status(403);
//       throw new Error("Your account has been blocked. Please contact support.");
//     }

//     const refreshToken = await generateRefreshToken(findAdmin?._id);
//     const updateuser = await User.findByIdAndUpdate(
//       findAdmin.id,
//       {
//         refreshToken: refreshToken,
//       },
//       { new: true }
//     );
//     res.cookie("refreshToken", refreshToken, {
//       httpOnly: true,
//       maxAge: 72 * 60 * 60 * 1000,
//     });
//     res.json({
//       _id: findAdmin?._id,
//       firstname: findAdmin?.firstname,
//       lastname: findAdmin?.lastname,
//       email: findAdmin?.email,
//       mobile: findAdmin?.mobile,
//       token: generateToken(findAdmin?._id),
//       redirectTo: "/admin",
//     });
//   } else {
//     throw new Error("Invalid Credentials");
//   }
// });

const loginAdmin = asyncHandler(async (req, res) => {
  const { email, password } = req.body;

  // Fetch the "User" role dynamically
  const userRole = await Role.findOne({ name: "User" });

  if (!userRole) {
    throw new Error("Role not found");
  }

  // Check if user exists or not
  const findAdmin = await User.findOne({ email }).populate("role");

  if (!findAdmin) {
    throw new Error("Invalid Credentials");
  }

  // Check if user has the "User" role and prevent admin login
  if (
    findAdmin.role &&
    findAdmin.role._id.toString() === userRole._id.toString()
  ) {
    res.status(401);
    throw new Error("Not Authorized - Admin access required");
  }

  // Validate password
  if (await findAdmin.isPasswordMatched(password)) {
    // Check if admin is blocked
    if (findAdmin.isBlocked) {
      res.status(403);
      throw new Error("Your account has been blocked. Please contact support.");
    }

    // Generate and update refresh token
    const refreshToken = generateRefreshToken(findAdmin._id);
    await User.findByIdAndUpdate(
      findAdmin._id,
      { refreshToken },
      { new: true }
    );

    res.cookie("refreshToken", refreshToken, {
      httpOnly: true,
      // maxAge: 72 * 60 * 60 * 1000,
      maxAge: 20 * 60 * 1000 // 20 minutes
    });

    res.json({
      _id: findAdmin._id,
      firstname: findAdmin.firstname,
      lastname: findAdmin.lastname,
      email: findAdmin.email,
      mobile: findAdmin.mobile,
      role: findAdmin.role || "null", // Include the role in the response
      token: generateToken(findAdmin._id),
      redirectTo: "/admin",
    });
  } else {
    throw new Error("Invalid Credentials");
  }
});

// const loginAdmin = asyncHandler(async (req, res) => {
//   const { email, password } = req.body;
//   const findAdmin = await User.findOne({ email });

//   if (!findAdmin || findAdmin.role !== "admin") {
//     throw new Error("Not Authorised");
//   }

//   if (await findAdmin.isPasswordMatched(password)) {
//     const otp = generateOTP();
//     const otpExpiry = Date.now() + 10 * 60 * 1000; // OTP valid for 10 minutes

//     await User.findByIdAndUpdate(findAdmin._id, { otp, otpExpiry });
//     await sendOTPEmail(email, otp);

//     res.json({ message: "OTP sent to your email" });
//   } else {
//     throw new Error("Invalid Credentials");
//   }
// });
// const verifyOTP = asyncHandler(async (req, res) => {
//   const { email, otp } = req.body;
//   const findAdmin = await User.findOne({ email });

//   if (!findAdmin || findAdmin.role !== "admin") {
//     throw new Error("Not Authorised");
//   }

//   if (findAdmin.otp === otp && findAdmin.otpExpiry > Date.now()) {
//     const refreshToken = await generateRefreshToken(findAdmin._id);
//     await User.findByIdAndUpdate(
//       findAdmin._id,
//       {
//         refreshToken,
//         otp: null, // Clear OTP
//         otpExpiry: null, // Clear OTP expiry
//       },
//       { new: true }
//     );

//     res.cookie("refreshToken", refreshToken, {
//       httpOnly: true,
//       maxAge: 72 * 60 * 60 * 1000,
//     });

//     res.json({
//       _id: findAdmin._id,
//       firstname: findAdmin.firstname,
//       lastname: findAdmin.lastname,
//       email: findAdmin.email,
//       mobile: findAdmin.mobile,
//       token: generateToken(findAdmin._id),
//     });
//   } else {
//     throw new Error("Invalid or expired OTP");
//   }
// });

// check user is active or not
const checkUserIsActive = asyncHandler(async (req, res) => {
  const userId = req.params.id;

  try {
    const user = await User.findById(userId);
    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    res.json({ isActive: user.isActive });
  } catch (error) {
    res.status(500).json({ message: "Server error", error });
  }
});

// Route to change user role
// Controller to change user role
const changeUserRole = asyncHandler(async (req, res) => {
  const { userId, newRole } = req.body;

  if (!userId || !newRole) {
    res.status(400);
    throw new Error("Please provide both userId and newRole");
  }

  const user = await User.findById(userId);

  if (!user) {
    res.status(404);
    throw new Error("User not found");
  }

  user.role = newRole;
  await user.save();

  res.status(200).json({
    message: "User role updated successfully",
    user,
  });
});
// const changeUserRole = asyncHandler(async (req, res) => {
//   const { userId, newRole } = req.body;

//   // Validate input
//   if (!userId || !newRole) {
//     res.status(400);
//     throw new Error("Please provide both userId and newRole");
//   }

//   // Find the user
//   const user = await User.findById(userId);
//   if (!user) {
//     res.status(404);
//     throw new Error("User not found");
//   }

//   // Find the new role
//   const role = await Role.findById(newRole);
//   if (!role) {
//     res.status(404);
//     throw new Error("Role not found");
//   }

//   // Update the user's role
//   user.role = newRole;
//   await user.save();

//   res.status(200).json({
//     message: "User role updated successfully",
//     user,
//   });
// });
// --------------------- handle refresh token ------------------------
const handleRefreshToken = asyncHandler(async (req, res) => {
  const cookie = req.cookies;
  if (!cookie?.refreshToken) throw new Error("No Refresh Token in Cookies");
  const refreshToken = cookie.refreshToken;
  console.log(refreshToken);
  const user = await User.findOne({ refreshToken });
  if (!user) throw new Error(" No Refresh token present in db or not matched");
  jwt.verify(refreshToken, process.env.JWT_SECRET, (err, decoded) => {
    if (err || user.id !== decoded.id) {
      throw new Error("There is something wrong with refresh token");
    }
    const accessToken = generateToken(user?._id);
    res.json({ accessToken });
  });
});

// ------------------------  logout ----------------------------------
const logout = asyncHandler(async (req, res) => {
  const cookie = req.cookies;
  if (!cookie?.refreshToken) throw new Error("No Refresh Token in Cookies");
  const refreshToken = cookie.refreshToken;
  const user = await User.findOne({ refreshToken });
  if (!user) {
    res.clearCookie("refreshToken", {
      httpOnly: true,
      secure: true,
    });
    return res.sendStatus(204); // forbidden
  }
  await User.findOneAndUpdate(refreshToken, {
    refreshToken: "",
  });
  res.clearCookie("refreshToken", {
    httpOnly: true,
    secure: true,
  });
  res.sendStatus(204); // forbidden
});
// const logout = asyncHandler(async (req, res) => {
//   const cookie = req.cookies;
//   if (!cookie?.refreshToken) throw new Error("No Refresh Token in Cookies");
//   const refreshToken = cookie.refreshToken;
//   const user = await User.findOne({ refreshToken });
//   if (!user) {
//     res.clearCookie("refreshToken", {
//       httpOnly: true,
//       secure: true,
//     });
//     return res.sendStatus(204); // forbidden
//   }
//   await User.findOneAndUpdate(refreshToken, {
//     refreshToken: "",
//   });
//   res.clearCookie("refreshToken", {
//     httpOnly: true,
//     secure: true,
//   });
//   res.sendStatus(204); // forbidden
// });

// ----------------- Update a user --------------------------

const updatedUser = asyncHandler(async (req, res) => {
  const { _id } = req.user;
  validateMongoDbId(_id);

  try {
    const updatedUser = await User.findByIdAndUpdate(
      _id,
      {
        firstname: req?.body?.firstname,
        lastname: req?.body?.lastname,
        email: req?.body?.email,
        mobile: req?.body?.mobile,
        role: req?.body?.role,
      },
      {
        new: true,
      }
    );
    res.json(updatedUser);
  } catch (error) {
    throw new Error(error);
  }
});

// ------------------- save user Addres ----------------

const saveAddress = asyncHandler(async (req, res, next) => {
  const { _id } = req.user;
  validateMongoDbId(_id);

  try {
    const updatedUser = await User.findByIdAndUpdate(
      _id,
      {
        address: req?.body?.address,
      },
      {
        new: true,
      }
    );
    res.json(updatedUser);
  } catch (error) {
    throw new Error(error);
  }
});

// Get all users

// const getallUser = asyncHandler(async (req, res) => {
//   try {
//     const getUsers = await User.find().populate("wishlist", "cart");
//     res.json(getUsers);
//   } catch (error) {
//     throw new Error(error);
//   }
// });

// const getallUser = asyncHandler(async (req, res) => {
//   const { firstname, mobile } = req.query;

//   try {
//     // Define a query object to hold search criteria
//     const query = {};

//     // Add search conditions if query parameters are provided
//     if (firstname) {
//       // query.firstname = { $regex: firstname, $options: "i" };
//       query.firstname = { $eq: firstname.toLowerCase() };

//       // case-insensitive search
//     }
//     //  $options: "i" flag makes the search case-insensitive.
//     if (mobile) {
//       query.mobile = mobile;
//     }

//     // Fetch users based on query
//     const getUsers = await User.find(query).populate("wishlist", "cart");
//     res.json(getUsers);
//   } catch (error) {
//     throw new Error(error);
//   }
// });
const getallUser = asyncHandler(async (req, res) => {
  const { fullname, mobile, page = 1, limit = 10, role } = req.query;

  try {
    const query = {};

    if (fullname) {
      const nameParts = fullname.toLowerCase().split(" ");
      query.$or = [
        { firstname: { $regex: nameParts[0], $options: "i" } },
        {
          lastname: { $regex: nameParts[nameParts.length - 1], $options: "i" },
        },
      ];
    }

    if (mobile) {
      query.mobile = mobile;
    }

    // Convert page and limit to numbers
    const pageNum = parseInt(page);
    const limitNum = parseInt(limit);

    // Calculate the number of documents to skip
    const skip = (pageNum - 1) * limitNum;

    // Get total count of users matching the query
    const totalUsers = await User.countDocuments(query);

    // Get paginated users
    const getUsers = await User.find(query)
      .populate("wishlist")
      .populate("cart")
      .populate("role")
      .sort({ createdAt: -1 }) // Sort by creation date, newest first
      .skip(skip)
      .limit(limitNum);

    res.json({
      users: getUsers,
      currentPage: pageNum,
      totalPages: Math.ceil(totalUsers / limitNum),
      totalUsers: totalUsers,
      limit: limitNum,
    });
  } catch (error) {
    throw new Error(error);
  }
});

// Get a single user
const getaUser = asyncHandler(async (req, res) => {
  const { id } = req.params;
  // validateMongoDbId(id);

  try {
    const getaUser = await User.findById(id).populate("role");
    res.json({
      getaUser,
    });
  } catch (error) {
    throw new Error(error);
  }
});
const refreshUserData = asyncHandler(async (req, res) => {
  try {
    const user = await User.findById(req.user.id).populate("role");
    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }
    res.json(user);
  } catch (error) {
    res.status(500).json({ message: "Server error" });
  }
});
// Get a single user

const deleteaUser = asyncHandler(async (req, res) => {
  const { id } = req.params;
  validateMongoDbId(id);

  try {
    const deleteaUser = await User.findByIdAndDelete(id);
    res.json({
      deleteaUser,
    });
  } catch (error) {
    throw new Error(error);
  }
});

const blockUser = asyncHandler(async (req, res) => {
  const { id } = req.params;
  validateMongoDbId(id);

  try {
    const blockusr = await User.findByIdAndUpdate(
      id,
      {
        isBlocked: true,
      },
      {
        new: true,
      }
    );
    res.json(blockusr);
  } catch (error) {
    throw new Error(error);
  }
});

const unblockUser = asyncHandler(async (req, res) => {
  const { id } = req.params;
  validateMongoDbId(id);

  try {
    const unblock = await User.findByIdAndUpdate(
      id,
      {
        isBlocked: false,
      },
      {
        new: true,
      }
    );
    res.json({
      message: "User UnBlocked",
    });
  } catch (error) {
    throw new Error(error);
  }
});

const updatePassword = asyncHandler(async (req, res) => {
  const { _id } = req.user;
  const { password } = req.body;
  validateMongoDbId(_id);
  const user = await User.findById(_id);
  if (password) {
    user.password = password;
    const updatedPassword = await user.save();
    res.json(updatedPassword);
  } else {
    res.json(user);
  }
});

const forgotPasswordToken = asyncHandler(async (req, res) => {
  const { email } = req.body;
  const user = await User.findOne({ email });
  if (!user) throw new Error("User not found with this email");
  try {
    const token = await user.createPasswordResetToken();
    await user.save();
    const resetURL = `Hi, Please follow this link to reset Your Password. This link is valid till 10 minutes from now. <a href='http://localhost:5174/reset-password/${token}'>Click Here</>`;
    const data = {
      to: email,
      text: "Hey User",
      subject: "Forgot Password Link",
      htm: resetURL,
    };
    sendEmail(data);
    res.json(token);
  } catch (error) {
    throw new Error(error);
  }
});

const resetPassword = asyncHandler(async (req, res) => {
  const { password } = req.body;
  const { token } = req.params;
  const hashedToken = crypto.createHash("sha256").update(token).digest("hex");
  const user = await User.findOne({
    passwordResetToken: hashedToken,
    passwordResetExpires: { $gt: Date.now() },
  });
  if (!user) throw new Error(" Token Expired, Please try again later");
  user.password = password;
  user.passwordResetToken = undefined;
  user.passwordResetExpires = undefined;
  await user.save();
  res.json(user);
});

const getWishlist = asyncHandler(async (req, res) => {
  const { _id } = req.user;
  try {
    const findUser = await User.findById(_id).populate("wishlist");
    res.json(findUser);
  } catch (error) {
    throw new Error(error);
  }
});

// const userCart = asyncHandler(async (req, res) => {
//   const { cart } = req.body;
//   const { _id } = req.user;
//   validateMongoDbId(_id);
//   try {
//     let products = [];
//     const user = await User.findById(_id);
//     // check if user already have product in cart
//     const alreadyExistCart = await Cart.findOne({ orderby: user._id });
//     if (alreadyExistCart) {
//       alreadyExistCart.remove();
//     }
//     for (let i = 0; i < cart.length; i++) {
//       let object = {};
//       object.product = cart[i]._id;
//       object.count = cart[i].count;
//       object.color = cart[i].color;
//       let getPrice = await Product.findById(cart[i]._id).select("price").exec();
//       object.price = getPrice.price;
//       products.push(object);
//     }
//     let cartTotal = 0;
//     for (let i = 0; i < products.length; i++) {
//       cartTotal = cartTotal + products[i].price * products[i].count;
//     }
//     let newCart = await new Cart({
//       products,
//       cartTotal,
//       orderby: user?._id,
//     }).save();
//     res.json(newCart);
//   } catch (error) {
//     throw new Error(error);
//   }
// });
// const userCart = asyncHandler(async (req, res) => {
//   const { productId, color, quantity, price } = req.body;
//   const { _id } = req.user;
//   validateMongoDbId(_id);
//   try {
//     let newCart = await new Cart({
//       userId: _id,
//       productId,
//       color,
//       quantity,
//       price,
//       // orderby: user?._id,
//     }).save();
//     res.json(newCart);
//   } catch (error) {
//     throw new Error(error);
//   }
// });

// ---------- last edit 21 sept & 16-11 ------------------------------------------------
// const userCart = asyncHandler(async (req, res) => {
//   const { productId, quantity, price } = req.body;
//   const { _id } = req.user;

//   // Validate user ID
//   validateMongoDbId(_id);

//   try {
//     // Check if product is already in cart
//     let existingCartItem = await Cart.findOne({ userId: _id, productId });

//     if (existingCartItem) {
//       // Update the quantity if the product is already in the cart
//       existingCartItem.quantity += quantity;
//       await existingCartItem.save();

//       res.json({
//         success: true,
//         message: "Cart updated successfully",
//         cartItem: existingCartItem,
//       });
//     } else {
//       // Create a new cart item
//       let newCartItem = new Cart({
//         userId: _id,
//         productId,
//         quantity,
//         price,
//       });

//       await newCartItem.save();
//       res.json({
//         success: true,
//         message: "Product added to cart",
//         cartItem: newCartItem,
//       });
//     }
//   } catch (error) {
//     res.status(500).json({
//       success: false,
//       message: "Unable to add product to cart",
//       error: error.message,
//     });
//   }
// });
const userCart = asyncHandler(async (req, res) => {
  const { productId, quantity, price } = req.body;
  const { _id } = req.user;

  // Validate user ID
  validateMongoDbId(_id);

  try {
    // Check if product is already in cart
    const existingCartItem = await Cart.findOne({ userId: _id, productId });

    if (existingCartItem) {
      return res.status(400).json({
        success: false,
        message: "Product is already in cart",
        cartItem: existingCartItem,
      });
    }

    // Create a new cart item
    const newCartItem = new Cart({
      userId: _id,
      productId,
      quantity,
      price,
    });

    await newCartItem.save();
    res.json({
      success: true,
      message: "Product added to cart",
      cartItem: newCartItem,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: "Unable to add product to cart",
      error: error.message,
    });
  }
});
const buyNow = asyncHandler(async (req, res) => {
  const { productId, quantity, price } = req.body;
  const { _id } = req.user;

  // Validate user ID
  validateMongoDbId(_id);

  try {
    // Check if product is already in cart
    const existingCartItem = await Cart.findOne({ userId: _id, productId });

    if (existingCartItem) {
      // If product exists in cart, redirect to checkout
      return res.json({
        success: true,
        message: "Product found in cart",
        redirect: "/checkout",
        cartItem: existingCartItem,
      });
    }

    // If product is not in cart, add it first
    const newCartItem = new Cart({
      userId: _id,
      productId,
      quantity,
      price,
    });

    await newCartItem.save();

    // Then redirect to checkout
    res.json({
      success: true,
      message: "Product added to cart",
      redirect: "/checkout",
      cartItem: newCartItem,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: "Unable to process buy now request",
      error: error.message,
    });
  }
});
const getUserCart = asyncHandler(async (req, res) => {
  const { _id } = req.user;
  validateMongoDbId(_id);
  try {
    const cart = await Cart.find({ userId: _id }).populate("productId");
    // .populate("color");
    res.json(cart);
  } catch (error) {
    throw new Error(error);
  }
});
const removeProductFromCart = asyncHandler(async (req, res) => {
  const { _id } = req.user;
  validateMongoDbId(_id);
  const { cartItemId } = req.params;

  try {
    const deleteProductFromCart = await Cart.deleteOne({
      userId: _id,
      _id: cartItemId,
    });
    res.json(deleteProductFromCart);
  } catch (error) {
    throw new Error(error);
  }
});
const updateProductQuantityFromCart = asyncHandler(async (req, res) => {
  const { _id } = req.user;
  validateMongoDbId(_id);
  const { cartItemId, newQuantity } = req.params;
  try {
    const cartItem = await Cart.findOne({ userId: _id, _id: cartItemId });
    cartItem.quantity = newQuantity;
    cartItem.save();
    res.json(cartItem);
  } catch (error) {
    throw new Error(error);
  }
});

// dharmik vaghela last edit 24-9
// const createOrder = asyncHandler(async (req, res) => {
//   const { _id } = req.user;
//   const {
//     shippingInfo,
//     paymentInfo,
//     orderItems,
//     totalPrice,
//     paymentMethod,
//     totalPriceAfterDiscount,
//   } = req.body;

//   validateMongoDbId(_id);
//   try {
//     if (
//       paymentMethod === "Razorpay" &&
//       (!paymentInfo.razorpayOrderId || !paymentInfo.razorpayPaymentId)
//     ) {
//       res.status(400);
//       throw new Error("Razorpay payment information is missing");
//     }
//     const order = await Order.create({
//       shippingInfo,
//       paymentInfo,
//       orderItems,
//       totalPrice,
//       paymentMethod,
//       totalPriceAfterDiscount,
//       user: _id,
//     });

//     // Generate Invoice
//     const invoicePath = path.join(
//       __dirname,
//       `../invoices/invoice-${order._id}.pdf`
//     );
//     generateInvoice(order, invoicePath);

//     const transporter = nodemailer.createTransport({
//       // service: 'your-email-service-provider',
//       // e.g., 'gmail'
//       host: "smtp.gmail.com",
//       port: 587,
//       secure: false,
//       auth: {
//         user: process.env.MAIL_ID,
//         pass: process.env.MAIL_PASSWORD,
//       },
//     });

//     const mailOptions = {
//       from: "200670107123.dharmikvaghela50@gmail.com",
//       to: "dharmikvaghela2003@gmail.com",
//       subject: `New Order: `,
//       text: `A new order has been created. Here are the details:\n\n
//         Order ID: ${order._id}\n
//         User ID: ${_id}\n
//         Shipping Info: ${JSON.stringify(shippingInfo, null, 2)}\n
//         Payment Info: ${JSON.stringify(paymentInfo, null, 2)}\n
//         Order Items: ${JSON.stringify(orderItems, null, 2)}\n

//         Total Price: ${totalPrice}\n
//         Total Price After Discount: ${totalPriceAfterDiscount}\n
//       `,
//       attachments: [
//         {
//           filename: `invoice-${order._id}.pdf`,
//           path: invoicePath,
//         },
//       ],
//     };

//     transporter.sendMail(mailOptions, (error, info) => {
//       if (error) {
//         console.log(error);
//       } else {
//         console.log("Email sent: " + info.response);
//       }
//     });

//     res.json({
//       order,
//       invoicePath,
//     });
//   } catch (error) {
//     throw new Error(error);
//   }
// });

// const createOrder = asyncHandler(async (req, res) => {
//   const { _id } = req.user;
//   const {
//     shippingInfo,
//     paymentInfo,
//     orderItems,
//     totalPrice,
//     paymentMethod,
//     totalPriceAfterDiscount,
//   } = req.body;

//   validateMongoDbId(_id);

//   try {
//     // Handle Razorpay-specific checks
//     if (
//       paymentMethod === "Razorpay" &&
//       (!paymentInfo.razorpayOrderId || !paymentInfo.razorpayPaymentId)
//     ) {
//       res.status(400);
//       throw new Error("Razorpay payment information is missing");
//     }

//     // Handle Stripe payment
//     if (paymentMethod === "Stripe") {
//       if (!paymentInfo.stripePaymentIntentId) {
//         res.status(400);
//         throw new Error("Stripe payment information is missing");
//       }

//       // Verify payment intent status
//       const paymentIntent = await stripe.paymentIntents.retrieve(
//         paymentInfo.stripePaymentIntentId
//       );

//       if (paymentIntent.status !== "succeeded") {
//         res.status(400);
//         throw new Error("Stripe payment was not successful");
//       }
//     }

//     // Create order in the database
//     const order = await Order.create({
//       shippingInfo,
//       paymentInfo,
//       orderItems,
//       totalPrice,
//       paymentMethod,
//       totalPriceAfterDiscount,
//       user: _id,
//     });

//     // Update product quantities and sold count
//     const updateOperations = orderItems.map((item) => ({
//       updateOne: {
//         filter: { _id: item.product },
//         update: {
//           $inc: {
//             quantity: -item.quantity,
//             sold: +item.quantity,
//           },
//         },
//       },
//     }));

//     await Product.bulkWrite(updateOperations, {});

//     // Generate HTML for the invoice
//     const invoiceHTML = generateInvoiceTemplate({
//       orderId: order._id,
//       userId: _id,
//       shippingInfo,
//       paymentInfo,
//       orderItems,
//       totalPrice,
//       totalPriceAfterDiscount,
//     });

//     // Generate PDF using html-pdf-node
//     const pdfBuffer = await htmlPdfNode.generatePdf(
//       { content: invoiceHTML },
//       { format: "A4" }
//     );

//     const invoicePath = path.join(
//       __dirname,
//       `../invoices/invoice-${order._id}.pdf`
//     );
//     fs.writeFileSync(invoicePath, pdfBuffer);

//     // Send email with the invoice attached
//     const transporter = nodemailer.createTransport({
//       host: "smtp.gmail.com",
//       port: 587,
//       secure: false,
//       auth: {
//         user: process.env.MAIL_ID,
//         pass: process.env.MAIL_PASSWORD,
//       },
//     });

//     const mailOptions = {
//       from: process.env.MAIL_ID,
//       to: "dharmikvaghela2003@gmail.com",
//       subject: `New Order: INV-${order._id}`,
//       html: invoiceHTML,
//       attachments: [
//         {
//           filename: `invoice-${order._id}.pdf`,
//           path: invoicePath,
//         },
//       ],
//     };

//     transporter.sendMail(mailOptions, (error, info) => {
//       if (error) {
//         console.log(error);
//       } else {
//         console.log("Email sent: " + info.response);
//       }
//     });

//     res.json({
//       success: true,
//       message: "Order placed successfully",
//       order,
//       invoicePath,
//     });
//   } catch (error) {
//     throw new Error(error.message || "Order creation failed");
//   }
// });

// Email template for user order confirmation

const baseUrl = "http://localhost:5173";
const createUserEmailTemplate = (order, baseUrl) => {
  const itemsList = order.orderItems
    .map(
      (item) => `
      <tr>
        <td style="padding: 8px; border-bottom: 1px solid #eee;">${
          item.product._id || item.product.id || item.product.title 
        }</td>
        <td style="padding: 8px; border-bottom: 1px solid #eee;">${
          item.quantity
        }</td>
        <td style="padding: 8px; border-bottom: 1px solid #eee;">₹ ${item.price.toFixed(
          2
        )}</td>
      </tr>
      `
    )
    .join("");

  return `
    <!DOCTYPE html>
    <html>
    <body style="font-family: Arial, sans-serif; line-height: 1.6; color: #333; max-width: 600px; margin: 0 auto; padding: 20px;">
      <div style="background-color: #f8f9fa; padding: 20px; border-radius: 5px; margin-bottom: 20px;">
        <h2 style="color: #2c3e50; margin: 0;">Thank You for Your Order!</h2>
      </div>

      <p>Dear Customer,</p>
      
      <div style="background-color: #ffffff; padding: 20px; border-radius: 5px; border: 1px solid #eee; margin-bottom: 20px;">
        <h3 style="color: #2c3e50; margin-top: 0;">Order Details</h3>
        <p><strong>Order ID:</strong> ${order._id}</p>
        <p><strong>Order Date:</strong> ${new Date(
          order.createdAt
        ).toLocaleDateString()}</p>
        
        <table style="width: 100%; border-collapse: collapse; margin-top: 15px;">
          <thead>
            <tr style="background-color: #f8f9fa;">
              <th style="padding: 8px; text-align: left;">Item</th>
              <th style="padding: 8px; text-align: left;">Quantity</th>
              <th style="padding: 8px; text-align: left;">Price</th>
            </tr>
          </thead>
          <tbody>
            ${itemsList}
          </tbody>
        </table>

        <div style="margin-top: 15px; text-align: right;">
          <p><strong>Total Amount:</strong> $${order.totalPrice.toFixed(2)}</p>
          ${
            order.totalPriceAfterDiscount
              ? `<p style="color: #27ae60;"><strong>Discounted Total:</strong> $${order.totalPriceAfterDiscount.toFixed(
                  2
                )}</p>`
              : ""
          }
        </div>
      </div>

      <div style="background-color: #ffffff; padding: 20px; border-radius: 5px; border: 1px solid #eee; margin-bottom: 20px;">
        <h3 style="color: #2c3e50; margin-top: 0;">Shipping Information</h3>
        <p>${order.shippingInfo.address}</p>
        <p>${order.shippingInfo.city}, ${order.shippingInfo.state}</p>
        <p>${order.shippingInfo.pincode}</p>
        <p>${order.shippingInfo.country}</p>
        <p>${order.shippingInfo.phone}</p>
      </div>

      <div style="background-color: #ffffff; padding: 20px; border-radius: 5px; border: 1px solid #eee;">
        <p><strong>Payment Method:</strong> ${order.paymentMethod}</p>
      </div>

      <p style="margin-top: 20px;">We'll notify you once your order is shipped.</p>
      <p style="margin-bottom: 0;">Best regards,<br>Your Store Team</p>
    </body>
    </html>
  `;
};

// Email template for admin notification
const createAdminEmailTemplate = (order, baseUrl) => {
  const itemsList = order.orderItems
    .map(
      (item) => `
      <tr>
      <td style="padding: 8px; border-bottom: 1px solid #eee;">${item.product.title}</td>
        <td style="padding: 8px; border-bottom: 1px solid #eee;">${item.quantity}</td>
        <td style="padding: 8px; border-bottom: 1px solid #eee;">₹ ${item.price.toFixed(2)}</td>
      </tr>
      `
    )
    .join("");

  return `
    <!DOCTYPE html>
    <html>
    <body style="font-family: Arial, sans-serif; line-height: 1.6; color: #333; max-width: 600px; margin: 0 auto; padding: 20px;">
      <div style="background-color: #2c3e50; padding: 20px; border-radius: 5px; margin-bottom: 20px;">
        <h2 style="color: #ffffff; margin: 0;">New Order Received!</h2>
      </div>

      <div style="background-color: #ffffff; padding: 20px; border-radius: 5px; border: 1px solid #eee; margin-bottom: 20px;">
        <h3 style="color: #2c3e50; margin-top: 0;">Order Details</h3>
        <p><strong>Order ID:</strong> ${order._id}</p>
        <p><strong>Customer ID:</strong> ${order.user}</p>
        <p><strong>Order Date:</strong> ${new Date(
          order.createdAt
        ).toLocaleDateString()}</p>
        
        <div style="margin-top: 10px;">
          <a href="${baseUrl}/admin/order-list/${order._id}" 
             style="background-color: #3498db; color: white; padding: 10px 15px; text-decoration: none; border-radius: 5px; display: inline-block;">
            View Order Details
          </a>
        </div>

        <table style="width: 100%; border-collapse: collapse; margin-top: 15px;">
          <thead>
            <tr style="background-color: #f8f9fa;">
              <th style="padding: 8px; text-align: left;">Product</th>
              <th style="padding: 8px; text-align: left;">Quantity</th>
              <th style="padding: 8px; text-align: left;">Price</th>
            </tr>
          </thead>
          <tbody>
            ${itemsList}
          </tbody>
        </table>

        <div style="margin-top: 15px; text-align: right;">
          <p><strong>Total Amount:</strong> $${order.totalPrice.toFixed(2)}</p>
          ${
            order.totalPriceAfterDiscount
              ? `<p style="color: #27ae60;"><strong>Discounted Total:</strong> $${order.totalPriceAfterDiscount.toFixed(
                  2
                )}</p>`
              : ""
          }
        </div>
      </div>

      <div style="background-color: #ffffff; padding: 20px; border-radius: 5px; border: 1px solid #eee; margin-bottom: 20px;">
        <h3 style="color: #2c3e50; margin-top: 0;">Shipping Information</h3>
        <p><strong>Name:</strong> ${order.shippingInfo.firstName } ${order.shippingInfo.lastName}</p>
        <p><strong>Address:</strong> ${order.shippingInfo.address}</p>
        <p><strong>City:</strong> ${order.shippingInfo.city}</p>
        <p><strong>State:</strong> ${order.shippingInfo.state}</p>
        <p><strong>Zip Code:</strong> ${order.shippingInfo.pincode}</p>
        <p><strong>Phone:</strong> ${order.shippingInfo.phone}</p>
      </div>

      <div style="background-color: #ffffff; padding: 20px; border-radius: 5px; border: 1px solid #eee;">
        <h3 style="color: #2c3e50; margin-top: 0;">Payment Details</h3>
        <p><strong>Method:</strong> ${order.paymentMethod}</p>
        <p><strong>Status:</strong> ${order.paymentInfo.status || "Pending"}</p>
      </div>

      <p style="margin-top: 20px; color: #e74c3c;"><strong>Please process this order as soon as possible.</strong></p>
    </body>
    </html>
  `;
};

const createOrder = asyncHandler(async (req, res) => {
  const { _id } = req.user;
  const {
    shippingInfo,
    paymentInfo,
    orderItems,
    totalPrice,
    paymentMethod,
    totalPriceAfterDiscount,
    
  } = req.body;

  validateMongoDbId(_id);

  try {
    // Handle Razorpay-specific checks
    if (
      paymentMethod === "Razorpay" &&
      (!paymentInfo.razorpayOrderId || !paymentInfo.razorpayPaymentId)
    ) {
      res.status(400);
      throw new Error("Razorpay payment information is missing");
    }

    // // Handle Stripe payment
    // if (paymentMethod === "Stripe") {
    //   if (!paymentInfo.stripePaymentIntentId) {
    //     res.status(400);
    //     throw new Error("Stripe payment information is missing");
    //   }

    //   // Verify payment intent status
    //   const paymentIntent = await stripe.paymentIntents.retrieve(
    //     paymentInfo.stripePaymentIntentId
    //   );

    //   if (paymentIntent.status !== "succeeded") {
    //     res.status(400);
    //     throw new Error("Stripe payment was not successful");
    //   }
    // }
    if (paymentMethod === "Stripe") {
      if (!paymentInfo.stripePaymentIntentId) {
        return res
          .status(400)
          .json({ message: "Stripe payment information is missing" });
      }

      const paymentIntent = await stripe.paymentIntents.retrieve(
        paymentInfo.stripePaymentIntentId
      );

      if (paymentIntent.status !== "succeeded") {
        return res
          .status(400)
          .json({ message: "Stripe payment was not successful" });
      }
    }
    // Create order in the database
    const order = await Order.create({
      shippingInfo,
      paymentInfo,
      orderItems,
      totalPrice,
      paymentMethod,
      totalPriceAfterDiscount,
      user: _id,
    });

    // Update product quantities and sold count
    const updateOperations = orderItems.map((item) => ({
      updateOne: {
        filter: { _id: item.product },
        update: {
          $inc: {
            quantity: -item.quantity,
            sold: +item.quantity,
          },
        },
      },
    }));

    await Product.bulkWrite(updateOperations, {});

    // Fetch user details for email
    const user = await User.findById(_id).select("email");

    // Send order confirmation email to user
    await generateInvoiceTemplate({
      email: user.email,
      subject: "Order Confirmation - Your Order Has Been Placed",
      html: createUserEmailTemplate(order, baseUrl),
    });

    // Send notification email to admin
    await generateInvoiceTemplate({
      email: process.env.ADMIN_EMAIL,
      subject: "New Order Received",
      html: createAdminEmailTemplate(order, baseUrl),
    });

    res.json({
      success: true,
      message: "Order placed successfully",
      order,
    });
  } catch (error) {
    throw new Error(error.message || "Order creation failed");
  }
});
const createPaymentIntent = asyncHandler(async (req, res) => {
  const { amount } = req.body;

  try {
    const { amount, description } = req.body;

    const paymentIntent = await stripe.paymentIntents.create({
      amount: Math.round(amount * 100), // Convert to smallest currency unit (e.g., paise for INR)
      currency: "inr",
      payment_method_types: ["card"],
      description: description || "Export transaction", // Include a description
    });

    res.status(200).send({ clientSecret: paymentIntent.client_secret });
  } catch (error) {
    console.error("Stripe Error:", error.message); // Log the exact error for debugging
    res.status(500).json({ error: "Failed to initialize payment" });
    // res.status(400).send({ error: error.message });
  }
});
//----------------------- dharmik ---------------
// const createOrder = asyncHandler(async (req, res) => {
//   const { _id } = req.user;
//   const {
//     shippingInfo,
//     paymentInfo,
//     orderItems,
//     totalPrice,
//     paymentMethod,
//     totalPriceAfterDiscount,
//   } = req.body;

//   validateMongoDbId(_id);
//   try {
//     if (
//       paymentMethod === "Razorpay" &&
//       (!paymentInfo.razorpayOrderId || !paymentInfo.razorpayPaymentId)
//     ) {
//       res.status(400);
//       throw new Error("Razorpay payment information is missing");
//     }

//     const order = await Order.create({
//       shippingInfo,
//       paymentInfo,
//       orderItems,
//       totalPrice,
//       paymentMethod,
//       totalPriceAfterDiscount,
//       user: _id,
//     });

//     // Generate Invoice PDF
//     const invoicePath = path.join(
//       __dirname,
//       `../invoices/invoice-${order._id}.pdf`
//     );
//     generateInvoice(order, invoicePath); // Assuming this function generates a PDF

//     // Send email
//     const transporter = nodemailer.createTransport({
//       host: "smtp.gmail.com",
//       port: 587,
//       secure: false,
//       auth: {
//         user: process.env.MAIL_ID,
//         pass: process.env.MAIL_PASSWORD,
//       },
//     });

//     const emailHTML = generateInvoiceTemplate({
//       orderId: order._id,
//       userId: _id,
//       shippingInfo,
//       paymentInfo,
//       orderItems,
//       totalPrice,
//       totalPriceAfterDiscount,
//     });

//     const mailOptions = {
//       from: process.env.MAIL_ID,
//       to: "dharmikvaghela2003@gmail.com",
//       subject: `New Order: INV-${order._id}`,
//       html: emailHTML,
//       attachments: [
//         {
//           filename: `invoice-${order._id}.pdf`,
//           path: invoicePath,
//         },
//       ],
//     };

//     transporter.sendMail(mailOptions, (error, info) => {
//       if (error) {
//         console.log(error);
//       } else {
//         console.log("Email sent: " + info.response);
//       }
//     });

//     res.json({
//       order,
//       invoicePath,
//     });
//   } catch (error) {
//     throw new Error(error);
//   }
// });
// last edit 24-924
// const createOrder = asyncHandler(async (req, res) => {
//   const { _id } = req.user;
//   const {
//     shippingInfo,
//     orderItems,
//     totalPrice,
//     totalPriceAfterDiscount,
//     paymentMethod,
//     paymentInfo,
//   } = req.body;

//   try {
//     if (
//       paymentMethod === "Razorpay" &&
//       (!paymentInfo.razorpayOrderId || !paymentInfo.razorpayPaymentId)
//     ) {
//       res.status(400);
//       throw new Error("Razorpay payment information is missing");
//     }
//     const order = await Order.create({
//       shippingInfo,
//       orderItems,
//       totalPrice,
//       totalPriceAfterDiscount,
//       paymentInfo,
//       paymentMethod,
//       user: _id,
//     })
//     sendMail({html:invoiceTemplate(order)})
//     res.json({ order, success: true });
//   } catch (error) {
//     throw new Error(error);
//   }
// });
const getMyOrders = asyncHandler(async (req, res) => {
  const { _id } = req.user;
  try {
    const orders = await Order.find({ user: _id })
      .populate("user")
      .populate("orderItems.product");
    // .populate("orderItems.color");
    res.json({ orders });
  } catch (error) {
    throw new Error(error);
  }
});

// const getAllOrders = asyncHandler(async (req, res) => {
//   try {
//     const orders = await Order.find().populate('user');
//     res.json({ orders });
//   } catch (error) {
//     throw new Error(error);
//   }
// });
// const getAllOrders = asyncHandler(async (req, res) => {
//   const { startDate, endDate } = req.query;

//   try {
//     let filter = {};

//     // If both startDate and endDate are provided, add date filtering to the query
//     if (startDate && endDate) {
//       filter = {
//         createdAt: {
//           $gte: new Date(startDate),
//           $lte: new Date(endDate),
//         },
//       };
//     }

//     const orders = await Order.find(filter).populate('user');
//     res.json({ orders });
//   } catch (error) {
//     throw new Error(error);
//   }
// });
// last edited
// const getAllOrders = asyncHandler(async (req, res) => {
//   const { startDate, endDate } = req.query;

//   try {
//     let filter = {};

//     // If both startDate and endDate are provided, add date filtering to the query
//     if (startDate && endDate) {
//       // Convert startDate and endDate to Date objects and handle timezones
//       const start = new Date(startDate);
//       const end = new Date(endDate);

//       // Ensure end date includes the whole day
//       end.setHours(23, 59, 59, 999);

//       filter = {
//         createdAt: {
//           $gte: start,
//           $lte: end,
//         },
//       };
//     }

//     const orders = await Order.find(filter).populate('user');
//     res.json({ orders });
//   } catch (error) {
//     throw new Error(error);
//   }
// });
// const getAllOrders = asyncHandler(async (req, res) => {
//   const {
//     startDate,
//     endDate,
//     user,
//     orderStatus,
//     firstname,
//     lastname,
//     page,
//     limit,
//   } = req.query;

//   try {
//     let filter = {};

//     // Date filtering
//     if (startDate && endDate) {
//       const start = new Date(startDate);
//       const end = new Date(endDate);
//       end.setHours(23, 59, 59, 999);
//       filter.createdAt = {
//         $gte: start,
//         $lte: end,
//       };
//     }

//     // Order status filtering
//     if (orderStatus) {
//       filter.orderStatus = orderStatus;
//     }

//     // Pagination parameters
//     // const pageNumber = parseInt(page, 10) || 1;
//     // const limitNumber = parseInt(limit, 10) || 10;
//     // const skip = (pageNumber - 1) * limitNumber;

//     // Aggregation for searching by user details
//     let orders;
//     if (firstname || lastname) {
//       orders = await Order.aggregate([
//         {
//           $lookup: {
//             from: "users",
//             localField: "user",
//             foreignField: "_id",
//             as: "user",
//           },
//         },
//         {
//           $match: {
//             "user.firstname": firstname
//               ? { $regex: firstname, $options: "i" }
//               : { $exists: true },
//             "user.lastname": lastname
//               ? { $regex: lastname, $options: "i" }
//               : { $exists: true },
//             ...filter,
//           },
//         },
//         {
//           $project: {
//             user: { $arrayElemAt: ["$user", 0] },
//             createdAt: 1,
//             orderStatus: 1,
//             // Add other fields you need
//           },
//         },
//         // { $skip: skip },
//         // { $limit: limitNumber },
//       ]);
//     } else {
//       orders = await Order.find(filter)
//         .populate("user")
//         .skip((page - 1) * limit)
//         .limit(parseInt(limit));
//     }

//     // Calculate total number of orders
//     const totalOrders = await Order.countDocuments(filter);
//     const totalPages = Math.ceil(totalOrders / limit);

//     res.json({
//       orders,
//       totalOrders,
//       totalPages,
//       page: parseInt(page),
//       limit: parseInt(limit),
//     });
//   } catch (error) {
//     throw new Error(error);
//   }
// });
const getAllOrders = asyncHandler(async (req, res) => {
  const {
    startDate,
    endDate,
    user,
    orderStatus,
    firstname,
    lastname,
    page,
    limit,
  } = req.query;

  try {
    let filter = {};

    // Date filtering
    if (startDate && endDate) {
      const start = new Date(startDate);
      const end = new Date(endDate);
      end.setHours(23, 59, 59, 999);
      filter.createdAt = {
        $gte: start,
        $lte: end,
      };
    }

    // Order status filtering
    if (orderStatus) {
      filter.orderStatus = orderStatus;
    }

    let orders;
    if (firstname || lastname) {
      orders = await Order.aggregate([
        {
          $sort: { createdAt: -1 }, // Add this stage to sort by createdAt in descending order
        },
        {
          $lookup: {
            from: "users",
            localField: "user",
            foreignField: "_id",
            as: "user",
          },
        },
        {
          $lookup: {
            from: "products",
            localField: "orderItems.product",
            foreignField: "_id",
            as: "productDetails",
          },
        },
        // {
        //   $lookup: {
        //     from: "colors",
        //     localField: "orderItems.color",
        //     foreignField: "_id",
        //     as: "colorDetails",
        //   },
        // },
        {
          $match: {
            "user.firstname": firstname
              ? { $regex: firstname, $options: "i" }
              : { $exists: true },
            "user.lastname": lastname
              ? { $regex: lastname, $options: "i" }
              : { $exists: true },
            ...filter,
          },
        },
        {
          $project: {
            user: { $arrayElemAt: ["$user", 0] },
            orderItems: {
              product: 1,
              // color: 1,
              quantity: 1,
              price: 1,
              productDetails: 1,
              // colorDetails: 1,
            },
            createdAt: 1,
            orderStatus: 1,
            totalPrice: 1,
            totalPriceAfterDiscount: 1,
            paymentMethod: 1,
            paidAt: 1,
            // Add other fields you need
          },
        },
        // { $skip: skip },
        // { $limit: limitNumber },
      ]);
    } else {
      orders = await Order.find(filter)
        .sort({ createdAt: -1 })
        .populate("user")
        .populate("orderItems.product")
        // .populate("orderItems.color")
        .skip((page - 1) * limit)
        .limit(parseInt(limit));
    }

    // Calculate total number of orders
    const totalOrders = await Order.countDocuments(filter);
    const totalPages = Math.ceil(totalOrders / limit);

    res.json({
      orders,
      totalOrders,
      totalPages,
      page: parseInt(page),
      limit: parseInt(limit),
    });
  } catch (error) {
    throw new Error(error);
  }
});

const getSingleOrder = asyncHandler(async (req, res) => {
  const { id } = req.params;
  try {
    const orders = await Order.findOne({ _id: id })
      .populate("orderItems.product")
      .populate("user");
    // .populate("orderItems.color");
    res.json({ orders });
  } catch (error) {
    throw new Error(error);
  }
});
const updateOrder = asyncHandler(async (req, res) => {
  const { id } = req.params;
  try {
    const orders = await Order.findById(id);
    orders.orderStatus = req.body.status;
    orders.save();
    res.json({ orders });
  } catch (error) {
    throw new Error(error);
  }
});
const emptyCart = asyncHandler(async (req, res) => {
  const { _id } = req.user;
  validateMongoDbId(_id);

  try {
    const deleteCart = await Cart.deleteMany({
      userId: _id,
    });

    res.json(deleteCart);
  } catch (error) {
    throw new Error(error);
  }
});

const applyCoupon = asyncHandler(async (req, res) => {
  const { coupon } = req.body;
  const { _id } = req.user;
  validateMongoDbId(_id);
  const validCoupon = await Coupon.findOne({ name: coupon });
  if (validCoupon === null) {
    throw new Error("Invalid Coupon");
  }
  const user = await User.findOne({ _id });
  let { cartTotal } = await Cart.findOne({
    orderby: user._id,
  }).populate("products.product");
  let totalAfterDiscount = (
    cartTotal -
    (cartTotal * validCoupon.discount) / 100
  ).toFixed(2);
  await Cart.findOneAndUpdate(
    { orderby: user._id },
    { totalAfterDiscount },
    { new: true }
  );
  res.json(totalAfterDiscount);
});

// const createOrder = asyncHandler(async (req, res) => {
//   const { COD, couponApplied } = req.body;
//   const { _id } = req.user;
//   validateMongoDbId(_id);
//   try {
//     if (!COD) throw new Error("Create cash order failed");
//     const user = await User.findById(_id);
//     let userCart = await Cart.findOne({ orderby: user._id });
//     let finalAmout = 0;
//     if (couponApplied && userCart.totalAfterDiscount) {
//       finalAmout = userCart.totalAfterDiscount;
//     } else {
//       finalAmout = userCart.cartTotal;
//     }

//     let newOrder = await new Order({
//       products: userCart.products,
//       paymentIntent: {
//         id: uniqid(),
//         method: "COD",
//         amount: finalAmout,
//         status: "Cash on Delivery",
//         created: Date.now(),
//         currency: "inr",
//       },
//       orderby: user._id,
//       orderStatus: "Cash on Delivery",
//     }).save();
//     let update = userCart.products.map((item) => {
//       return {
//         updateOne: {
//           filter: { _id: item.product._id },
//           update: { $inc: { quantity: -item.count, sold: +item.count } },
//         },
//       };
//     });
//     const updated = await Product.bulkWrite(update, {});
//     res.json({ message: "success" });
//   } catch (error) {
//     throw new Error(error);
//   }
// });

const getOrders = asyncHandler(async (req, res) => {
  const { _id } = req.user;
  validateMongoDbId(_id);
  try {
    const userorders = await Order.findOne({ orderby: _id })
      .populate("products.product")
      // .populate('orderItems.product')
      .populate("orderby")
      .exec();
    console.log(userorders);
    res.json(userorders);
  } catch (error) {
    throw new Error(error);
  }
});

// const getAllOrders = asyncHandler(async (req, res) => {
//   try {
//     const alluserorders = await Order.find()
//       .populate("products.product")
//       .populate("orderby")
//       .exec();
//     res.json(alluserorders);
//   } catch (error) {
//     throw new Error(error);
//   }
// });
// ----------------------- Done -----------------------------
const getUsersWithMaxOrders = asyncHandler(async (req, res) => {
  try {
    const usersWithOrders = await Order.aggregate([
      {
        // Grouping orders by the `orderby` field (assuming it holds the user reference)
        $group: {
          _id: "$user", // Group by user
          totalOrders: { $sum: 1 }, // Count the number of orders for each user
        },
      },
      {
        // Sorting the results to get users with the most orders first
        $sort: { totalOrders: -1 },
      },
      {
        // Populating the user details
        $lookup: {
          from: "users", // Assuming the collection for users is called 'users'
          localField: "_id",
          foreignField: "_id",
          as: "userDetails",
        },
      },
      // {
      //   // Unwind the user details for easier formatting
      //   $unwind: "$userDetails",
      // },
      // {
      //   // Project the fields you want in the response
      //   $project: {
      //     _id: 0,
      //     userId: "$userDetails._id",
      //     name: "$userDetails.firstname",
      //     mobile: "$userDetails.mobile",
      //     orderCount: 1,
      //   },
      // },
    ]);

    res.json(usersWithOrders);
  } catch (error) {
    throw new Error(error);
  }
});

// Route to get orders by month for a specific year ---Done
const ordersbyeachmonthbysingleyear = asyncHandler(async (req, res) => {
  try {
    const year = parseInt(req.params.year, 10); // Extract the year from the URL parameter

    const result = await Order.aggregate([
      {
        $addFields: {
          month: { $month: "$createdAt" },
          year: { $year: "$createdAt" },
        },
      },
      {
        $match: {
          year: year, // Use the dynamic year parameter
        },
      },
      {
        $facet: {
          monthlyData: [
            {
              $group: {
                _id: "$month",
                totalOrders: { $sum: 1 },
                totalRevenue: { $sum: "$totalPrice" },
              },
            },
            {
              $sort: { _id: 1 },
            },
            {
              $project: {
                month: "$_id",
                totalOrders: 1,
                totalRevenue: 1,
                _id: 0,
              },
            },
          ],
          yearlyTotal: [
            {
              $group: {
                _id: null,
                totalOrdersYear: { $sum: 1 },
                totalRevenueYear: { $sum: "$totalPrice" },
              },
            },
            {
              $project: {
                _id: 0,
                totalOrdersYear: 1,
                totalRevenueYear: 1,
              },
            },
          ],
        },
      },
      {
        $project: {
          monthlyData: 1,
          yearlyTotal: { $arrayElemAt: ["$yearlyTotal", 0] },
        },
      },
    ]);

    res.status(200).json({
      success: true,
      data: result,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
});

const getRevenueByProduct = asyncHandler(async (req, res) => {
  try {
    const results = await Order.aggregate([
      { $unwind: "$orderItems" }, // Process each order item separately
      {
        $group: {
          _id: "$orderItems.product", // Group by product ID
          totalOrders: { $sum: "$orderItems.quantity" },
          totalRevenue: {
            $sum: { $multiply: ["$orderItems.quantity", "$orderItems.price"] }, // Calculate revenue
          },
        },
      },
      {
        $lookup: {
          from: "products", // Collection name for products
          localField: "_id", // Field in Order collection
          foreignField: "_id", // Field in Products collection
          as: "productDetails",
        },
      },
      { $unwind: "$productDetails" }, // Unwind to access product details
      {
        $project: {
          productName: "$productDetails.title", // Project the product name
          totalOrders: 1,
          totalRevenue: 1,
        },
      },
    ]);

    res.json(results);
  } catch (err) {
    console.error("Error processing pipeline:", err);
    res.status(500).json({ message: "Internal Server Error" });
  }
});

const cretedOrderedByLastMonth = asyncHandler(async (req, res) => {
  try {
    const currentDate = new Date();
    const lastMonthStartDate = new Date(
      currentDate.getFullYear(),
      currentDate.getMonth() - 1,
      1
    );
    const lastMonthEndDate = new Date(
      currentDate.getFullYear(),
      currentDate.getMonth(),
      0
    );

    const result = await Order.aggregate([
      {
        $match: {
          createdAt: {
            $gte: lastMonthStartDate,
            $lte: lastMonthEndDate,
          },
        },
      },
      {
        $sort: {
          "_id.year": 1,
          "_id.month": 1,
        },
      },
      {
        $group: {
          _id: null,
          totalOrders: { $sum: 1 },
          totalRevenue: { $sum: "$totalPrice" },
          orders: { $push: "$$ROOT" },
        },
      },
      {
        $project: {
          _id: 0,
          totalOrders: 1,
          totalRevenue: 1,
          orders: 1,
        },
      },
    ]);

    if (result.length === 0) {
      return res.json({
        totalOrders: 0,
        totalRevenue: 0,
        orders: [],
      });
    }

    res.json(result[0]);
  } catch (error) {
    res.status(500).json({
      success: false,
      message: "Error fetching last month's orders",
      error: error.message,
    });
  }
});
const newOrderDetails = asyncHandler(async (req, res) => {
  try {
    // MongoDB aggregation pipeline
    const result = await Order.aggregate([
      {
        $group: {
          _id: {
            year: { $year: "$createdAt" },
            month: { $month: "$createdAt" },
          },
          totalOrders: { $sum: 1 },
          totalRevenue: { $sum: "$totalPrice" },
        },
      },
      {
        $sort: { "_id.year": 1, "_id.month": 1 }, // Sort by year and month in ascending order
      },
      {
        $project: {
          year: "$_id.year",
          month: "$_id.month",
          totalOrders: 1,
          totalRevenue: 1,
          _id: 0, // Exclude the default _id field from the result
        },
      },
    ]);

    res.status(200).json({
      success: true,
      data: result,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
});
// const getOederBymonthAndYear = asyncHandler(async(req,res) =>{
//   const { year, month } = req.params;
//   try {
//     const date = new Date(parseInt(year, 10), parseInt(month, 10) - 1, 1);
//     const endDate = new Date(parseInt(year, 10), parseInt(month, 10), 0);
//     const orders = await Order.find({
//       createdAt: { $gte: date, $lt: endDate },
//     }).exec();
//     res.json(orders);
//   } catch (error) {
//     throw new Error(error);
//   }
// })
const getOederBymonthAndYear = asyncHandler(async (req, res) => {
  try {
    const data = await Order.aggregate([
      {
        $group: {
          _id: {
            year: { $year: "$createdAt" },
            month: { $month: "$createdAt" },
          },
          totalOrders: { $sum: 1 },
          totalRevenue: { $sum: "$totalPrice" },
        },
      },
      {
        $sort: { " _id.year": 1, "_id.month": 1 },
      },
    ]);
    res.json(data);
  } catch (error) {
    throw new Error(error);
  }
});

const getOrderBySingleYear = asyncHandler(async (req, rep) => {
  const data = await Order.aggregate([
    {
      $group: {
        _id: {
          year: { $year: "$createdAt" },
        },
        totalOrders: { $sum: 1 },
        totalRevenue: { $sum: "$totalPrice" },
      },
    },
    {
      $sort: { "_id.year": 1 },
    },
  ]);
});

const ordersByEachState = asyncHandler(async (req, res) => {
  try {
    // const results = await Order.aggregate([
    //   { $unwind: "$orderItems" },
    //   {
    //     $group: {
    //       _id: "$orderItems.state",
    //       totalOrders: { $sum: "$orderItems.quantity" },
    //       totalRevenue: {
    //         $sum: { $multiply: ["$orderItems.quantity", "$orderItems.price"] },
    //       },
    //     },
    //   },
    // ]);
    const results = await Order.aggregate([
      {
        $group: {
          _id: "$shippingInfo.state",
          orders: {
            $push: "$$ROOT",
          },
        },
      },
    ]);
    res.json(results);
  } catch (err) {
    console.error("Error processing pipeline:", err);
    res.status(500).json({ message: "Internal Server Error" });
  }
});

const getOrdryByorderStatus = asyncHandler(async (req, res) => {
  try {
    const data = await Order.aggregate([
      {
        $group: {
          _id: "$orderStatus",
          totalOrders: { $sum: 1 },
          orders: { $push: "$$ROOT" },
        },
      },
      {
        $sort: { _id: -1 },
      },
    ]);
    res.json(data);
  } catch (error) {
    throw new Error(error);
  }
});

const eachProductWithRevenue = asyncHandler(async (req, res) => {
  try {
    const data = await Order.aggregate([
      {
        $unwind: "$orderItems",
      },
      {
        $group: {
          _id: "$orderItems.product",
          totalOrders: { $sum: "$orderItems.quantity" },
          totalRevenue: {
            $sum: { $multiply: ["$orderItems.price", "$orderItems.quantity"] },
          },
        },
      },
      {
        $lookup: {
          from: "products",
          localField: "_id",
          foreignField: "_id",
          as: "productDetails",
        },
      },
      {
        $unwind: "$productDetails",
      },
      {
        $project: {
          productName: "$productDetails.title",
          totalOrders: 1,
          totalRevenue: 1,
        },
      },
    ]);
    res.json(data);
  } catch (error) {}
});

const getOrderByUserId = asyncHandler(async (req, res) => {
  const { id } = req.params;
  validateMongoDbId(id);
  try {
    const userorders = await Order.findOne({ orderby: id })
      .populate("products.product")
      .populate("orderby")
      .exec();
    res.json(userorders);
  } catch (error) {
    throw new Error(error);
  }
});

const updateOrderStatus = asyncHandler(async (req, res) => {
  const { status } = req.body;
  const { id } = req.params;
  validateMongoDbId(id);
  try {
    const updateOrderStatus = await Order.findByIdAndUpdate(
      id,
      {
        orderStatus: status,
        paymentIntent: {
          status: status,
        },
      },
      { new: true }
    );
    res.json(updateOrderStatus);
  } catch (error) {
    throw new Error(error);
  }
});
const getMonthWiseOrderIncome = asyncHandler(async (req, res) => {
  let monthNames = [
    "January",
    "February",
    "March",
    "April",
    "May",
    "June",
    "July",
    "August",
    "September",
    "October",
    "November",
    "December",
  ];
  let d = new Date();
  let endDate = "";
  d.setDate(1);
  for (let index = 0; index < 11; index++) {
    d.setMonth(d.getMonth() - 1);
    endDate = monthNames[d.getMonth()] + " " + d.getFullYear();
    console.log(endDate);
  }

  const data = await Order.aggregate([
    {
      $match: {
        createdAt: {
          $lte: new Date(),
          $gte: new Date(endDate),
        },
      },
    },
    {
      $group: {
        _id: {
          month: "$month",
        },
        amount: { $sum: "$totalPriceAfterDiscount" },
        count: { $sum: 1 },
      },
    },
  ]);

  res.json(data);
});

const getYearlyTotalOrder = asyncHandler(async (req, res) => {
  let monthNames = [
    "January",
    "February",
    "March",
    "April",
    "May",
    "June",
    "July",
    "August",
    "September",
    "October",
    "November",
    "December",
  ];
  let d = new Date();
  let endDate = "";
  d.setDate(1);
  for (let index = 0; index < 11; index++) {
    d.setMonth(d.getMonth() - 1);
    endDate = monthNames[d.getMonth()] + " " + d.getFullYear();
  }

  const data = await Order.aggregate([
    {
      $match: {
        createdAt: {
          $lte: new Date(),
          $gte: new Date(endDate),
        },
      },
    },
    {
      $group: {
        _id: null,
        count: { $sum: 1 },
        amount: { $sum: "$totalPriceAfterDiscount" },
      },
    },
  ]);

  res.json(data);
});

const getOrdersByDateRange = asyncHandler(async (req, res) => {
  const { startDate, endDate } = req.query;

  if (!startDate || !endDate) {
    res.status(400);
    throw new Error("Start date and end date are required");
  }

  // Convert string dates to Date objects
  const start = new Date(startDate);
  const end = new Date(endDate);
  console.log("start:", start, "end:", end);

  // Ensure the end date is inclusive of the entire day
  end.setHours(23, 59, 59, 999);

  if (isNaN(start.getTime()) || isNaN(end.getTime())) {
    res.status(400);
    throw new Error("Invalid date format");
  }

  const data = await Order.aggregate([
    {
      $match: {
        createdAt: {
          $gte: start,
          $lte: end,
        },
      },
    },
    {
      $group: {
        _id: null,
        count: { $sum: 1 },
        amount: { $sum: "$totalPriceAfterDiscount" },
      },
    },
  ]);

  res.json(data);
});

const getAllOrdersByDate = asyncHandler(async (req, res) => {
  const { startDate, endDate } = req.query;
  const { _id } = req.user;

  validateMongoDbId(_id);

  try {
    if (startDate && endDate) {
      // Convert string dates to Date objects
      const start = new Date(startDate);
      const end = new Date(endDate);
      console.log("start:", start, "end:", end);

      // Ensure the end date is inclusive of the entire day
      end.setHours(23, 59, 59, 999);

      if (isNaN(start.getTime()) || isNaN(end.getTime())) {
        res.status(400);
        throw new Error("Invalid date format");
      }

      const data = await Order.aggregate([
        {
          $match: {
            createdAt: {
              $gte: start,
              $lte: end,
              orderby: _id,
            },
          },
        },
        {
          $group: {
            _id: null,
            count: { $sum: 1 },
            amount: { $sum: "$totalPriceAfterDiscount" },
          },
        },
      ]);

      res.json(data);
    } else {
      const userorders = await Order.find({ orderby: _id })
        .populate("products.product")
        .populate("orderby")
        .exec();
      res.json(userorders);
    }
  } catch (error) {
    throw new Error(error);
  }
});

const getAllOrdersByTrands = asyncHandler(async (req, res) => {
  try {
    // Get the period parameter from the query string
    const { period } = req.query;

    // Determine the group format based on the period
    let groupFormat;
    switch (period) {
      case "daily":
        groupFormat = {
          year: { $year: "$createdAt" },
          month: { $month: "$createdAt" },
          day: { $dayOfMonth: "$createdAt" },
        };
        break;
      case "weekly":
        groupFormat = {
          year: { $year: "$createdAt" },
          week: { $week: "$createdAt" },
        };
        break;
      case "monthly":
        groupFormat = {
          year: { $year: "$createdAt" },
          month: { $month: "$createdAt" },
        };
        break;
      default:
        return res.status(400).json({
          success: false,
          message:
            "Invalid period. Choose between 'daily', 'weekly', or 'monthly'.",
        });
    }

    // MongoDB aggregation pipeline
    const trends = await Order.aggregate([
      {
        $group: {
          _id: groupFormat,
          totalOrders: { $sum: 1 },
          totalRevenue: { $sum: "$totalPrice" },
        },
      },
      {
        $sort: {
          "_id.year": 1,
          ...(period !== "weekly" && { "_id.month": 1 }),
          ...(period === "daily" && { "_id.day": 1 }),
        },
      },
      {
        $project: {
          year: "$_id.year",
          ...(period === "daily" && { month: "$_id.month", day: "$_id.day" }),
          ...(period === "monthly" && { month: "$_id.month" }),
          ...(period === "weekly" && { week: "$_id.week" }),
          totalOrders: 1,
          totalRevenue: 1,
          _id: 0,
        },
      },
    ]);

    res.status(200).json({
      success: true,
      data: trends,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
});
const getAllOrderssincelastmonth = asyncHandler(async (req, res) => {
  try {
    const currentDate = new Date(); // Today's date
    const lastMonthDate = new Date(
      currentDate.setMonth(currentDate.getMonth() - 1)
    ); // Last month date

    const orders = await Order.aggregate([
      {
        $match: {
          createdAt: { $gte: lastMonthDate, $lte: new Date() }, // Filter by creation date between last month and today
        },
      },
      {
        $group: {
          _id: {
            day: { $dayOfMonth: "$createdAt" },
            month: { $month: "$createdAt" },
            year: { $year: "$createdAt" },
          },
          totalOrders: { $sum: 1 },
          totalRevenue: { $sum: "$totalPriceAfterDiscount" }, // Calculate total revenue
          orders: { $push: "$$ROOT" }, // Include complete order details in each group
        },
      },
      {
        $sort: { "_id.year": 1, "_id.month": 1, "_id.day": 1 }, // Sort by date
      },
    ]);

    res.status(200).json({ success: true, data: orders });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
});

module.exports = {
  createUser,
  loginUserCtrl,
  getallUser,
  getaUser,
  deleteaUser,
  updatedUser,
  blockUser,
  unblockUser,
  handleRefreshToken,
  logout,
  updatePassword,
  forgotPasswordToken,
  resetPassword,
  loginAdmin,
  getWishlist,
  saveAddress,
  userCart,
  getUserCart,
  emptyCart,
  applyCoupon,
  createOrder,
  getOrders,
  updateOrderStatus,
  getAllOrders,
  getOrderByUserId,
  removeProductFromCart,
  updateProductQuantityFromCart,
  getSingleOrder,
  getMyOrders,
  updateOrder,
  getMonthWiseOrderIncome,
  getYearlyTotalOrder,
  getOrdersByDateRange,
  getAllOrdersByDate,
  // verifyOTP,
  checkUserIsActive,
  changeUserRole,
  getUsersWithMaxOrders,
  ordersbyeachmonthbysingleyear,
  getRevenueByProduct,
  cretedOrderedByLastMonth,
  getOederBymonthAndYear,
  ordersByEachState,
  getOrdryByorderStatus,
  eachProductWithRevenue,
  newOrderDetails,
  getAllOrdersByTrands,
  getAllOrderssincelastmonth,
  buyNow,
  createPaymentIntent,
  refreshUserData
};
