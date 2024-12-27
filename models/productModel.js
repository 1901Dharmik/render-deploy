const mongoose = require("mongoose"); // Erase if already required

// Declare the Schema of the Mongo model
const ingredientsSchema = new mongoose.Schema({
  title: {
    type: String,
    required: true,
  },
  description: {
    type: String,
    required: true,
  },
});
const problemToCareSchema = new mongoose.Schema({
  title: {
    type: String,
    required: true,
  },
  description: {
    type: String,
    required: true,
  },
  images: [
    {
      public_id: String,
      url: String,
    },
  ],
});
var productSchema = new mongoose.Schema(
  {
    title: {
      type: String,
      required: true,
      trim: true,
    },
    slug: {
      type: String,
      required: true,
      unique: true,
      lowercase: true,
    },
    description: {
      type: String,
      required: true,
    },
    price: {
      type: Number,
      required: true,
    },
    // category: {
    //   type: String,
    //   required: true,
    // },
    category: {
      type: [String], // Array of strings
      required: true,
    },
    brand: {
      type: String,
      required: true,
    },
    quantity: {
      type: Number,
      required: true,
    },
    sold: {
      type: Number,
      default: 0,
    },
    images: [
      {
        public_id: String,
        url: String,
      },
    ],
    publish: { type: String, enum: ["draft", "published"], default: "draft" },
    // color: [
    //   {
    //     type: mongoose.Schema.Types.ObjectId,
    //     ref: "Color",
    //   },
    // ],

    index: {
      type: Number,
      default: 0
    },
    tags: [String],
    care_for: [String],

    who_should_use: [String],
    dosage: [String],
    problem_to_cure: [problemToCareSchema],

    ingredients: [ingredientsSchema],
    // ingredients: [
    //   {
    //     title: String,
    //     description: String,
    //   },
    // ],
    ratings: [
      {
        star: Number,
        comment: String,
        postedby: { type: mongoose.Schema.Types.ObjectId, ref: "User" },
        createdAt: { type: Date, default: Date.now },
        updatedAt: { type: Date, default: Date.now },
      },
    ],
    totalrating: {
      type: String,
      default: 0,
    },
  },
  { timestamps: true }
);

//Export the model
module.exports = mongoose.model("Product", productSchema);
// const mongoose = require("mongoose");

// // Variant Schema for different size and color combinations
// const variantSchema = new mongoose.Schema({
//   size: {
//     type: String,
//     required: true,
//   },
//   color: {
//     type: String,
//     required: true,
//   },
//   price: {
//     type: Number,
//     required: true,
//   },
//   quantity: {
//     type: Number,
//     required: true,
//     default: 0,
//   },
//   sold: {
//     type: Number,
//     default: 0,
//   }
// });

// const ingredientsSchema = new mongoose.Schema({
//   title: {
//     type: String,
//     required: true,
//   },
//   description: {
//     type: String,
//     required: true,
//   },
// });

// const problemToCareSchema = new mongoose.Schema({
//   title: {
//     type: String,
//     required: true,
//   },
//   description: {
//     type: String,
//     required: true,
//   },
//   images: [
//     {
//       public_id: String,
//       url: String,
//     },
//   ],
// });

// var productSchema = new mongoose.Schema(
//   {
//     title: {
//       type: String,
//       required: true,
//       trim: true,
//     },
//     slug: {
//       type: String,
//       required: true,
//       unique: true,
//       lowercase: true,
//     },
//     description: {
//       type: String,
//       required: true,
//     },
//     basePrice: {  // Changed from price to basePrice
//       type: Number,
//       required: true,
//     },
//     category: {
//       type: String,
//       required: true,
//     },
//     brand: {
//       type: String,
//       required: true,
//     },
//     variants: [variantSchema],  // Add variants array
//     availableSizes: [{  // Add available sizes for easy filtering
//       type: String,
//     }],
//     availableColors: [{  // Add available colors for easy filtering
//       type: String,
//     }],
//     images: [
//       {
//         public_id: String,
//         url: String,
//       },
//     ],
//     publish: { 
//       type: String, 
//       enum: ["draft", "published"], 
//       default: "draft" 
//     },
//     index: {
//       type: Number,
//       default: 0
//     },
//     tags: [String],
//     care_for: [String],
//     who_should_use: [String],
//     dosage: [String],
//     problem_to_cure: [problemToCareSchema],
//     ingredients: [ingredientsSchema],
//     ratings: [
//       {
//         star: Number,
//         comment: String,
//         postedby: { type: mongoose.Schema.Types.ObjectId, ref: "User" },
//         createdAt: { type: Date, default: Date.now },
//         updatedAt: { type: Date, default: Date.now },
//       },
//     ],
//     totalrating: {
//       type: String,
//       default: 0,
//     },
//   },
//   { timestamps: true }
// );

// module.exports = mongoose.model("Product", productSchema);