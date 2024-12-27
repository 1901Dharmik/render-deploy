const Product = require("../models/productModel");
const User = require("../models/userModel");
const asyncHandler = require("express-async-handler");
const slugify = require("slugify");
const validateMongoDbId = require("../utils/validateMongodbId");
//
const multer = require("multer");
const path = require("path");
const fs = require("fs");
const {
  cloudinaryUploadImg,
  cloudinaryDeleteImg,
} = require("../utils/cloudinary");

class APIFeatures {
  constructor(query, queryString) {
    this.query = query;
    this.queryString = queryString;
  }

  filter() {
    // Create a copy of query params, excluding special parameters
    const queryObj = { ...this.queryString };
    const excludeFields = ['page', 'sort', 'limit', 'fields', 'search'];
    excludeFields.forEach(field => delete queryObj[field]);

    // Advanced filtering for gte, gt, lte, lt
    const queryStr = JSON.stringify(queryObj).replace(
      /\b(gte|gt|lte|lt)\b/g,
      match => `$${match}`
    );

    this.query = this.query.find(JSON.parse(queryStr));
    return this;
  }

  sort() {
    if (this.queryString.sort) {
      const sortBy = this.queryString.sort.split(',').join(' ');
      this.query = this.query.sort(sortBy);
    } else {
      this.query = this.query.sort('-createdAt');
    }
    return this;
  }

  limitFields() {
    if (this.queryString.fields) {
      const fields = this.queryString.fields.split(',').join(' ');
      this.query = this.query.select(fields);
    } else {
      this.query = this.query.select('-__v');
    }
    return this;
  }

  paginate() {
    const page = parseInt(this.queryString.page, 10) || 1;
    const limit = parseInt(this.queryString.limit, 10) || 10;
    const skip = (page - 1) * limit;

    this.query = this.query.skip(skip).limit(limit);
    return this;
  }

  search() {
    if (this.queryString.search) {
      const searchQuery = {
        $or: [
          { name: { $regex: this.queryString.search, $options: 'i' } },
          { description: { $regex: this.queryString.search, $options: 'i' } }
        ]
      };
      this.query = this.query.find(searchQuery);
    }
    return this;
  }
}
const createProduct = asyncHandler(async (req, res) => {
  try {
    if (req.body.title) {
      req.body.slug = slugify(req.body.title);
    }

    if (!req.body.status) {
      req.body.status = "draft";
    }

    const newProduct = new Product(req.body);
    newProduct.discountPrice = Math.round(
      newProduct.price * (1 - newProduct.discountPercentage / 100)
    );
    const product = await newProduct.save();
    // const newProduct = await Product.create(req.body);
    // res.json(newProduct)
    res.json(product);
  } catch (error) {
    throw new Error(error);
  }
});

// const createNewProduct = asyncHandler(async (req, res) => {
//   try {
//     if (req.body.title) {
//       req.body.slug = slugify(req.body.title);
//     }

//     if (!req.body.status) {
//       req.body.status = "draft";
//     }

//     // Extract unique sizes and colors from variants
//     const uniqueSizes = [...new Set(req.body.variants.map(variant => variant.size))];
//     const uniqueColors = [...new Set(req.body.variants.map(variant => variant.color))];

//     // Add unique sizes and colors to the product
//     req.body.availableSizes = uniqueSizes;
//     req.body.availableColors = uniqueColors;

//     // Calculate base price (minimum variant price)
//     if (req.body.variants && req.body.variants.length > 0) {
//       req.body.basePrice = Math.min(...req.body.variants.map(variant => variant.price));
//     }

//     const newProduct = new Product(req.body);

//     // If discount percentage is provided, calculate discount price for each variant
//     if (req.body.discountPercentage) {
//       newProduct.variants = newProduct.variants.map(variant => ({
//         ...variant,
//         discountPrice: Math.round(variant.price * (1 - req.body.discountPercentage / 100))
//       }));
//     }

//     const product = await newProduct.save();
//     res.json(product);
//   } catch (error) {
//     throw new Error(error);
//   }
// });
// Draft a product
const draftProduct = async (req, res) => {
  try {
    const { id } = req.params;
    const product = await Product.findById(id);

    if (!product) {
      return res.status(404).json({ message: "Product not found" });
    }

    product.published = false;
    await product.save();

    res.status(200).json(product);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};
// Publish a product
exports.publishProduct = async (req, res) => {
  try {
    const { id } = req.params;
    const product = await Product.findById(id);

    if (!product) {
      return res.status(404).json({ message: "Product not found" });
    }

    product.published = true;
    await product.save();

    res.status(200).json(product);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};
// // Controller to set a product as draft
// const draftProduct = asyncHandler(async (req, res) => {
//   try {
//     const { id } = req.params;
//     const product = await Product.findByIdAndUpdate(
//       id,
//       { status: "draft" },
//       { new: true }
//     );

//     if (!product) {
//       res.status(404).json({ message: "Product not found" });
//     } else {
//       res.json(product);
//     }
//   } catch (error) {
//     throw new Error(error);
//   }
// });
// // Controller to publish a product
// const publishProduct = asyncHandler(async (req, res) => {
//   try {
//     const { id } = req.params;
//     const product = await Product.findByIdAndUpdate(
//       id,
//       { status: "published" },
//       { new: true }
//     );

//     if (!product) {
//       res.status(404).json({ message: "Product not found" });
//     } else {
//       res.json(product);
//     }
//   } catch (error) {
//     throw new Error(error);
//   }
// });

// const updateProduct = asyncHandler(async (req, res) => {
//   const id = req.params;
//   validateMongoDbId(id);
//   try {
//     if (req.body.title) {
//       req.body.slug = slugify(req.body.title);
//     }
//     const updateProduct = await Product.findOneAndUpdate({ id }, req.body, {
//       new: true,
//     });
//     res.json(updateProduct);
//   } catch (error) {
//     throw new Error(error);
//   }
// });
const updateProduct = asyncHandler(async (req, res) => {
  const { id } = req.params;
  console.log('Received ID:', id);
  validateMongoDbId(id);

  try {
    if (req.body.title) {
      req.body.slug = slugify(req.body.title);
    }

    const updatedProduct = await Product.findByIdAndUpdate(id, req.body, {
      new: true,
      runValidators: true
    });

    if (!updatedProduct) {
      return res.status(404).json({ status: 'fail', message: 'Product not found' });
    }

    res.json({
      status: 'success',
      data: updatedProduct
    });
  } catch (error) {
    res.status(400).json({
      status: 'fail',
      message: error.message
    });
  }
});
// const deleteProduct = asyncHandler(async (req, res) => {
//   const {id} = req.params;
//   validateMongoDbId(id);
//   try {
//     const deleteProduct = await Product.findOneAndDelete({id});
//     res.json(deleteProduct);
//     console.log(req.params);
//   } catch (error) {
//     throw new Error(error);
//   }
// });
const deleteProduct = asyncHandler(async (req, res) => {
  const { id } = req.params;
  validateMongoDbId(id);
  try {
    const deletedProduct = await Product.findByIdAndDelete(id);
    res.json(deletedProduct);
  } catch (error) {
    throw new Error(error);
  }
});

const getaProduct = asyncHandler(async (req, res) => {
  const { id } = req.params;
  validateMongoDbId(id);
  try {
    const findProduct = await Product.findById(id)
    .populate({
      path: 'ratings.postedby', // Populating the postedby field within the ratings array
      select: 'firstname lastname' // Selecting only the fields you need
    })
    // .populate("color");
    res.json(findProduct)
  } catch (error) {
    throw new Error(error);
  }
});
const getAllProduct = asyncHandler(async (req, res) => {
  try {
    // Filtering
    const queryObj = { ...req.query };
    const excludeFields = ["page", "sort", "limit", "fields"];
    excludeFields.forEach((el) => delete queryObj[el]);

    let queryStr = JSON.stringify(queryObj);
    queryStr = queryStr.replace(/\b(gte|gt|lte|lt)\b/g, (match) => `$${match}`);
    let query = Product.find(JSON.parse(queryStr));
  
    // Sorting
    if (req.query.sort) {
      const sortBy = req.query.sort.split(",").join(" ");
      query = query.sort(sortBy);
    } else {
      query = query.sort("-createdAt");
    }

    // Limiting fields
    if (req.query.fields) {
      const fields = req.query.fields.split(",").join(" ");
      query = query.select(fields);
    } else {
      query = query.select("-__v");
    }

    // Pagination
    const page = parseInt(req.query.page) || 1;
    const limit = parseInt(req.query.limit) || 10;
    const skip = (page - 1) * limit;
    query = query.skip(skip).limit(limit);

    if (req.query.page) {
      const productCount = await Product.countDocuments();
      if (skip >= productCount) throw new Error("This Page does not exist");
    }

    const product = await query;
    res.json(product);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
});

// const getAllProduct = asyncHandler(async (req, res) => {
//   try {
//     const features = new APIFeatures(Product.find(), req.query)
//       .filter()
//       .search()
//       .sort()
//       .limitFields()
//       .paginate();

//     // Execute query
//     const products = await features.query;
//     const total = await Product.countDocuments(features.query.getQuery());

//     res.status(200).json({
//       status: 'success',
//       results: products.length,
//       total,
//       totalPages: Math.ceil(total / (parseInt(req.query.limit, 10) || 10)),
//       currentPage: parseInt(req.query.page, 10) || 1,
//       data: products
//     });
//   } catch (error) {
//     res.status(400).json({
//       status: 'error',
//       message: error.message
//     });
//   }
// });
const addToWishlist = asyncHandler(async (req, res) => {
  const { _id } = req.user;
  const { prodId } = req.body;
  try {
    const user = await User.findById(_id);
    const alreadyadded = user.wishlist.find((id) => id.toString() === prodId);
    if (alreadyadded) {
      let user = await User.findByIdAndUpdate(
        _id,
        {
          $pull: { wishlist: prodId },
        },
        {
          new: true,
        }
      );
      res.json(user);
    } else {
      let user = await User.findByIdAndUpdate(
        _id,
        {
          $push: { wishlist: prodId },
        },
        {
          new: true,
        }
      );
      res.json(user);
    }
  } catch (error) {
    throw new Error(error);
  }
});

const rating = asyncHandler(async (req, res) => {
  const { _id } = req.user;
  const { star, prodId, comment } = req.body;
  try {
    const product = await Product.findById(prodId);
    let alreadyRated = product.ratings.find(
      (userId) => userId.postedby.toString() === _id.toString()
    );
    if (alreadyRated) {
      const updateRating = await Product.updateOne(
        {
          ratings: { $elemMatch: alreadyRated },
        },
        {
          $set: { "ratings.$.star": star, "ratings.$.comment": comment },
        },
        {
          new: true,
        }
      );
    } else {
      const rateProduct = await Product.findByIdAndUpdate(
        prodId,
        {
          $push: {
            ratings: {
              star: star,
              comment: comment,
              postedby: _id,
            },
          },
        },
        {
          new: true,
        }
      );
    }
    const getallratings = await Product.findById(prodId)
   
    let totalRating = getallratings.ratings.length;
    let ratingsum = getallratings.ratings
      .map((item) => item.star)
      .reduce((prev, curr) => prev + curr, 0);
    let actualRating = Math.round(ratingsum / totalRating);
    let finalproduct = await Product.findByIdAndUpdate(
      prodId,
      {
        totalrating: actualRating,
      },
      { new: true }
    )
    res.json(finalproduct);
  } catch (error) {
    throw new Error(error);
  }
});
// const getAllProduct = asyncHandler(async (req, res) => {
//   try {
//     // Get total count for pagination
//     const total = await Product.countDocuments();

//     // Create query builder instance
//     const features = new APIFeatures(Product.find(), req.query)
//       .search()
//       .filter()
//       .sort()
//       .limitFields()
//       .paginate();

//     // Execute query with lean() for better performance
//     const products = await features.query.lean();

//     // Calculate pagination info
//     const page = parseInt(req.query.page, 10) || 1;
//     const limit = parseInt(req.query.limit, 10) || 10;
//     const totalPages = Math.ceil(total / limit);
//     const hasMore = page < totalPages;

//     // Return response with metadata
//     res.status(200).json({
//       status: 'success',
//       data: {
//         products,
//         pagination: {
//           total,
//           page,
//           totalPages,
//           hasMore,
//           limit
//         }
//       }
//     });
//   } catch (error) {
//     res.status(400).json({
//       status: 'error',
//       message: error.message,
//       stack: process.env.NODE_ENV === 'development' ? error.stack : undefined
//     });
//   }
// });
// const updateProductIndex = asyncHandler(async (req, res) => {
//   try {
//     const { productId, newIndex } = req.body;

//     // Validate inputs
//     if (!productId || typeof newIndex !== 'number') {
//       return res.status(400).json({
//         status: false,
//         message: "Product ID and new index are required"
//       });
//     }

//     // Find the product to be moved
//     const productToMove = await Product.findById(productId);
//     if (!productToMove) {
//       return res.status(404).json({
//         status: false,
//         message: "Product not found"
//       });
//     }

//     const currentIndex = productToMove.index || 0;

//     // Update indexes of other products
//     if (newIndex > currentIndex) {
//       // Moving down: decrease index of products between current and new position
//       await Product.updateMany(
//         {
//           index: { $gt: currentIndex, $lte: newIndex },
//           _id: { $ne: productId }
//         },
//         { $inc: { index: -1 } }
//       );
//     } else if (newIndex < currentIndex) {
//       // Moving up: increase index of products between new and current position
//       await Product.updateMany(
//         {
//           index: { $gte: newIndex, $lt: currentIndex },
//           _id: { $ne: productId }
//         },
//         { $inc: { index: 1 } }
//       );
//     }

//     // Update the target product's index
//     productToMove.index = newIndex;
//     await productToMove.save();

//     res.json({
//       status: true,
//       message: "Product index updated successfully",
//       product: productToMove
//     });
//   } catch (error) {
//     throw new Error(error);
//   }
// });


// const uploadImages = asyncHandler(async (req, res) => {
//   const { id } = req.params;
//   validateMongoDbId(id);
//   try {
//     const uploader = (path) => cloudinaryUploadImg(path, "images");
//     const urls = [];
//     const files = req.files;
//     console.log(req.files);

//     for (const file of files) {
//       const { path } = file;
//       const newpath = await uploader(path);
//       console.log(newpath);
//       urls.push(newpath);
//       fs.unlinkSync(path);
//     }
//     // const images = urls.map((file) => {
//     //   return file;
//     // });
//     // res.json(images);
//     const findimages = await Product.findByIdAndUpdate(
//       id,
//       { images: urls },
//       { new: true }
//     );

//     res.json(findimages);
//   } catch (error) {
//     throw new Error(error);
//   }
// });

// const deleteImages = asyncHandler(async (req, res) => {
//   const { id } = req.params;
//   try {
//     const deleted = cloudinaryDeleteImg(id, "images");
//     res.json({ message: "Deleted" });
//   } catch (error) {
//     throw new Error(error);
//   }
// });

module.exports = {
  createProduct,
  getaProduct,
  getAllProduct,
  updateProduct,
  deleteProduct,
  addToWishlist,
  rating,
  draftProduct,
  // createNewProduct
  // updateProductIndex,

  // uploadImages,
  // deleteImages,
};
