const express = require('express');
const router = express.Router();
const sharp = require('sharp');
const Image = require('../models/imageModel');
const upload = require('../middlewares/upload');
const path = require('path');

// Create - Upload and optimize image
router.post('/upload', upload.single('image'), async (req, res) => {
  try {
    if (!req.file) {
      return res.status(400).json({ message: 'No image file provided' });
    }

    // Optimize image using sharp
    const optimizedImageBuffer = await sharp(req.file.buffer)
      .resize(800) // Resize to max width of 800px
      .jpeg({ quality: 80 }) // Convert to JPEG with 80% quality
      .toBuffer();

    // Generate a unique filename
    const uniqueFilename = `${Date.now()}-${req.file.originalname.replace(/\s+/g, '-')}`;
    
    const image = new Image({
      filename: uniqueFilename,
      originalname: req.file.originalname,
      mimetype: 'image/jpeg',
      size: optimizedImageBuffer.length,
      data: optimizedImageBuffer,
      urlPath: uniqueFilename
    });

    await image.save();
    
    // Return the URL for the uploaded image
    const imageUrl = `/images/${uniqueFilename}`;
    res.status(201).json({
      message: 'Image uploaded successfully',
      imageId: image._id,
      imageUrl: imageUrl,
      fullUrl: `${req.protocol}://${req.get('host')}/images/${uniqueFilename}`
    });
  } catch (error) {
    console.error('Upload error:', error);
    res.status(500).json({ message: error.message });
  }
});

// Read - Get all images with URLs
router.get('/images', async (req, res) => {
  try {
    const images = await Image.find({}, '-data'
    //    {
    //   data: 0, // Exclude the binary data
    //   _id: 1,
    //   filename: 1,
    //   originalname: 1,
    //   mimetype: 1,
    //   size: 1,
    //   urlPath: 1,
    //   createdAt: 1
    // }
  );

    // Add URL to each image
    const imagesWithUrls = images.map(image => ({
      ...image.toObject(),
      imageUrl: `/images/${image.filename}`,
      fullUrl: `${req.protocol}://${req.get('host')}/api/images/images/${image.filename}`
    }));

    res.json(imagesWithUrls);
  } catch (error) {
    console.error('List images error:', error);
    res.status(500).json({ message: error.message });
  }
});

// Serve images - This route should be registered at the root level
router.get('/images/:filename', async (req, res) => {
  try {
    const image = await Image.findOne({ filename: req.params.filename });
    
    if (!image) {
      console.log('Image not found:', req.params.filename);
      return res.status(404).sendFile(path.join(__dirname, '../public/placeholder.jpg'));
    }

    // Set appropriate headers
    res.set({
      'Content-Type': image.mimetype,
      'Content-Length': image.size,
      'Cache-Control': 'public, max-age=31557600', // Cache for 1 year
      'Last-Modified': image.createdAt.toUTCString()
    });

    // Check if the browser has a cached version
    const ifModifiedSince = req.get('if-modified-since');
    if (ifModifiedSince) {
      const clientCacheDate = new Date(ifModifiedSince);
      if (clientCacheDate >= image.createdAt) {
        return res.status(304).end(); // Not Modified
      }
    }

    // Send the image data
    res.end(image.data);

  } catch (error) {
    console.error('Serve image error:', error);
    res.status(500).send('Error serving image');
  }
});

// Update - Update image by ID
router.put('/images/:id', upload.single('image'), async (req, res) => {
  try {
    if (!req.file) {
      return res.status(400).json({ message: 'No image file provided' });
    }

    const optimizedImageBuffer = await sharp(req.file.buffer)
      .resize(800)
      .jpeg({ quality: 80 })
      .toBuffer();

    const uniqueFilename = `${Date.now()}-${req.file.originalname.replace(/\s+/g, '-')}`;

    const updatedImage = await Image.findByIdAndUpdate(
      req.params.id,
      {
        filename: uniqueFilename,
        originalname: req.file.originalname,
        mimetype: 'image/jpeg',
        size: optimizedImageBuffer.length,
        data: optimizedImageBuffer,
        urlPath: uniqueFilename
      },
      { new: true }
    );

    if (!updatedImage) {
      return res.status(404).json({ message: 'Image not found' });
    }

    res.json({ 
      message: 'Image updated successfully',
      imageUrl: `/images/${uniqueFilename}`,
      fullUrl: `${req.protocol}://${req.get('host')}/images/${uniqueFilename}`
    });
  } catch (error) {
    console.error('Update error:', error);
    res.status(500).json({ message: error.message });
  }
});

// Delete - Delete image by ID
router.delete('/images/:id', async (req, res) => {
  try {
    const deletedImage = await Image.findByIdAndDelete(req.params.id);
    if (!deletedImage) {
      return res.status(404).json({ message: 'Image not found' });
    }
    res.json({ message: 'Image deleted successfully' });
  } catch (error) {
    console.error('Delete error:', error);
    res.status(500).json({ message: error.message });
  }
});

module.exports = router;