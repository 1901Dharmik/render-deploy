const mongoose = require("mongoose"); // Erase if already required
const bcrypt = require("bcrypt");
const crypto = require("crypto");
const { Schema } = mongoose;
const Role = require("./Role");
// Declare the Schema of the Mongo model
var userSchema = new mongoose.Schema(
  {
    firstname: {
      type: String,
      // required: true,
    },
    displayName: {
      type: String,
      // required: true,
    },
    lastname: {
      type: String,
      // required: true,
    },
    email: {
      type: String,
      required: true,
      // unique: true,
    },
    mobile: {
      type: String,
      // required: true,
      unique: true,
    },
    password: {
      type: String,
      // required: true,
    },
    // role: {
    //   type: String,
    //   default: "user",
    // },
    // role: { type: mongoose.Schema.Types.ObjectId, ref: 'Role' , default: '6729fabe515246fd06602c9e'},
    role: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Role",
     
    },
    // role: {
    //   type: String,
    //   enum: ["user", "editor", "admin", "super_admin"],
    //   default: "user",
    // },
    isBlocked: {
      type: Boolean,
      default: false,
    },
    cart: {
      type: Array,
      default: [],
    },

    address: {
      type: Array,
      default: [],
    },
    status: {
      type: String,
      enum: ["draft", "published"],
      default: "draft",
    },
    isActive: { type: Boolean, default: false },
    // addresses: { type: [Schema.Types.Mixed] },
    wishlist: [{ type: mongoose.Schema.Types.ObjectId, ref: "Product" }],
    googleId: {
      type: String,
      unique: true,
      sparse: true
    },
    isGoogleUser: {
      type: Boolean,
      default: false
    },
    otp: {
      type: String,
    },
    otpExpiry: {
      type: Date,
    },
    refreshToken: {
      type: String,
    },
    passwordChangedAt: Date,
    passwordResetToken: String,
    passwordResetExpires: Date,
  },

  {
    timestamps: true,
  }
);
// Encrypt password before saving using bcrypt js
// userSchema.pre('save', async function (next) {
//   if (!this.isModified('password')) return next();
//   this.password = await bcrypt.hash(this.password, 10);
//   next();
// });
userSchema.pre("save", async function (next) {
  if (!this.isModified("password")) {
    next();
  }
  const salt = await bcrypt.genSaltSync(10);
  this.password = await bcrypt.hash(this.password, salt);
  next();
});

// Set default role if not provided
userSchema.pre("save", async function (next) {
  if (!this.role) {
    const defaultRole = await Role.findOne({ name: "User" });
    if (defaultRole) {
      this.role = defaultRole._id;
    }
  }
  next();
});

// compare password
userSchema.methods.isPasswordMatched = async function (enteredPassword) {
  return await bcrypt.compare(enteredPassword, this.password);
};


  // Generate a password reset token.
  // * This method generates a random 32 byte hex string and stores it
  // * as `passwordResetToken` in the user document. The token is hashed
  // * with SHA256 and stored in the user document. The token is valid for
  // * 10 minutes.
userSchema.methods.createPasswordResetToken = async function () {
  const resettoken = crypto.randomBytes(32).toString("hex");
  this.passwordResetToken = crypto
    .createHash("sha256")
    .update(resettoken)
    .digest("hex");
  this.passwordResetExpires = Date.now() + 30 * 60 * 1000; // 10 minutes
  return resettoken;
};

//Export the model
module.exports = mongoose.model("User", userSchema);
