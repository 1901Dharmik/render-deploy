const cloudinary = require("cloudinary");
const sharp = require("sharp");
cloudinary.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET,
});

const cloudinaryUploadImg = async (fileToUploads) => {
  return new Promise((resolve) => {
    cloudinary.uploader.upload(
      fileToUploads,

      (result) => {
        resolve(
          {
            url: result.secure_url,
            asset_id: result.asset_id,
            public_id: result.public_id,
          },
          {
            resource_type: "auto",
          }
        );
      }
    );
  });
};
// Function to upload image in AVIF format
// const cloudinaryUploadImg = async (fileToUploads) => {
//   try {
//     // Convert the image to AVIF format using Sharp
//     const avifBuffer = await sharp(fileToUploads)
//       .avif({ quality: 80 }) // Set desired quality
//       .toBuffer();

//     // Upload the converted image to Cloudinary
//     return new Promise((resolve, reject) => {
//       cloudinary.uploader.upload_stream(
//         {  resource_type: "auto", format: "avif" },
//         (error, result) => {
//           if (error) {
//             return reject(error);
//           }
//           resolve({
//             url: result.secure_url,
//             asset_id: result.asset_id,
//             public_id: result.public_id,
//           });
//         }
//       ).end(avifBuffer); // Pipe the AVIF buffer to Cloudinary
//     });
//   } catch (error) {
//     console.error("Error uploading image:", error);
//     throw error; // Rethrow to handle it in your application
//   }
// };
const cloudinaryDeleteImg = async (fileToDelete) => {
  return new Promise((resolve) => {
    cloudinary.uploader.destroy(fileToDelete, (result) => {
      resolve(
        {
          url: result.secure_url,
          asset_id: result.asset_id,
          public_id: result.public_id,
        },
        {
          resource_type: "auto",
        }
      );
    });
  });
};

module.exports = { cloudinaryUploadImg, cloudinaryDeleteImg };
