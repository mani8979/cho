const express = require('express');
const router = express.Router();
const InstagramPhoto = require('../models/InstagramPhoto');
const { protectAdmin } = require('./auth');
const { cacheMiddleware, invalidateCache } = require('../utils/cache');

// Get all Instagram photos
router.get('/', cacheMiddleware(3600), async (req, res) => {
  try {
    const photos = await InstagramPhoto.find().sort({ createdDate: -1 }).limit(8);
    res.json(photos);
  } catch (error) {
    res.status(500).json({ message: 'Server error', error: error.message });
  }
});

// Add Instagram photo (Admin only)
router.post('/', protectAdmin, async (req, res) => {
  try {
    const { imagePath, link } = req.body;
    const newPhoto = new InstagramPhoto({
      imagePath,
      link: link || 'https://www.instagram.com/love.melt_91?utm_source=qr&igsh=Nzg0bnNyN3MweXh2'
    });
    const saved = await newPhoto.save();
    invalidateCache(['/api/instagram']);
    res.status(201).json(saved);
  } catch (error) {
    res.status(400).json({ message: 'Bad request', error: error.message });
  }
});

// Delete Instagram photo (Admin only)
router.delete('/:id', protectAdmin, async (req, res) => {
  try {
    const photo = await InstagramPhoto.findByIdAndDelete(req.params.id);
    if (!photo) {
      return res.status(404).json({ message: 'Photo not found' });
    }
    invalidateCache(['/api/instagram']);
    res.json({ message: 'Instagram photo deleted successfully' });
  } catch (error) {
    res.status(500).json({ message: 'Server error', error: error.message });
  }
});

module.exports = router;
