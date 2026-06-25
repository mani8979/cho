const express = require('express');
const router = express.Router();
const { upload } = require('../utils/cloudinary');

// Upload a single file to Cloudinary
router.post('/', upload.single('file'), (req, res) => {
  try {
    if (!req.file) {
      return res.status(400).json({ success: false, message: 'No file uploaded' });
    }
    
    // Multer-storage-cloudinary automatically sets path as Cloudinary URL
    res.json({
      success: true,
      url: req.file.path,
      filename: req.file.filename
    });
  } catch (error) {
    res.status(500).json({ success: false, message: 'Upload failed', error: error.message });
  }
});

module.exports = router;
