const fs = require("fs");
const asyncHandler = require("express-async-handler");

const {
  cloudinaryUploadImg,
  cloudinaryDeleteImg,
} = require("../utils/cloudinary");

const uploadImages = asyncHandler(async (req, res) => {
  try {
    const uploader = (path) => cloudinaryUploadImg(path, "images");
    const urls = [];
    const files = req.files;
    for (const file of files) {
      const { path } = file;
      const newpath = await uploader(path);
      console.log(newpath);
      urls.push(newpath);
      fs.unlinkSync(path);
    }
    const images = urls.map((file) => {
      return file;
    });
    res.json(images);
  } catch (error) {
    throw new Error(error);
  }
});

// const deleteImages = asyncHandler(async (req, res) => {
//   const { id } = req.params;
//   try {
//     const deleted = cloudinaryDeleteImg(id, "images");
//     res.json({ message: "Deleted" });
//   } catch (error) {
//     throw new Error(error);
//   }
// });
// const deleteImages = asyncHandler(async (req, res) => {  
//   const { id } = req.params;  
//   try {  
//    await cloudinaryDeleteImg(id, "images"); // Add await here  
//    res.json({ message: "Deleted" });  
//   } catch (error) {  
//    throw new Error(error);  
//   }  
// }); 
const deleteImages = asyncHandler( async (req, res) => {
  try {
    const { id } = req.params;
    if (!id) {
      return res.status(400).json({ error: "Image ID is required" });
    }
    // Logic to delete the image from storage (e.g., Cloudinary)
    await cloudinaryDeleteImg(id, "images");
    return res.status(200).json({ success: true, message: "Image deleted" });
  } catch (error) {
    return res.status(500).json({ error: "Failed to delete image" });
  }
});

module.exports = {
  uploadImages,
  deleteImages,
};


