// controllers/ImageController.js
const Image = require('../models/ImageModel');
const ImageKit = require('imagekit');
const sharp = require('sharp');

const imagekit = new ImageKit({
    publicKey: "public_aNO4izB7jINm6YC5L0K5zmETqZ0=",
    privateKey: "private_I1JgSy/zHWRRTd4onc8jM4EQEas=",
    urlEndpoint: "https://ik.imagekit.io/9jd9xw7k5y",
});

// Upload Image
const uploadImage = async (req, res) => {
    try {
      if (!req.files || req.files.length === 0) {
        return res.status(400).json({ error: 'No files uploaded' });
      }
  
      let uploadResults = [];
  
      // Loop through all files and upload them
      for (let file of req.files) {
        const fileBase64 = file.buffer.toString('base64');
  
        const result = await new Promise((resolve, reject) => {
          imagekit.upload(
            {
              file: fileBase64,
              fileName: file.originalname,
            },
            (error, result) => {
              if (error) {
                reject(error);
              } else {
                resolve(result);
              }
            }
          );
        });
  
        // Save image details to DB
        const image = new Image({
          fileName: result.name,
          fileId: result.fileId,
          url: result.url,
        });
        await image.save();
  
        uploadResults.push({
          fileName: result.name,
          fileId: result.fileId,
          url: result.url,
        });
      }
  
      res.status(200).json({
        status: 'success',
        message: 'Files uploaded successfully',
        data: uploadResults,
      });
    } catch (error) {
      res.status(500).json({ message: 'Server Error', error });
    }
  };
const uploadToImageKit = async (file) => {
    return new Promise((resolve, reject) => {
      const fileBase64 = file.buffer.toString('base64');
      
      imagekit.upload(
        {
          file: fileBase64,
          fileName: file.originalname,
        },
        (error, result) => {
          if (error) {
            reject(error);
          } else {
            resolve({
              fileName: result.name,
              fileId: result.fileId,
              url: result.url,
            });
          }
        }
      );
    });
  };
  

// Get All Images
const getImages = async (req, res) => {
  try {
    const images = await Image.find();
    res.status(200).json(images);
  } catch (error) {
    res.status(500).json({ message: 'Server Error', error });
  }
};

// Get Single Image
const getImage = async (req, res) => {
  try {
    const image = await Image.findById(req.params.id);
    if (!image) {
      return res.status(404).json({ message: 'Image not found' });
    }
    res.status(200).json(image);
  } catch (error) {
    res.status(500).json({ message: 'Server Error', error });
  }
};

// Delete Image
const deleteImage = async (req, res) => {
  try {
    const image = await Image.findById(req.params.id);
    if (!image) {
      return res.status(404).json({ message: 'Image not found' });
    }

    imagekit.deleteFile(image.fileId, async (error) => {
      if (error) {
        return res.status(500).json({
          status: 'error',
          message: 'Error while deleting image',
          error: error,
        });
      }

      await image.remove();
      res.status(200).json({ message: 'Image deleted successfully' });
    });
  } catch (error) {
    res.status(500).json({ message: 'Server Error', error });
  }
};

module.exports = {
  uploadImage,
  getImages,
  getImage,
  deleteImage,
  uploadToImageKit,
};
