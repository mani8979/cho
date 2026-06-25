const express = require('express');
const router = express.Router();
const InstagramPhoto = require('../models/InstagramPhoto');
const { protectAdmin } = require('./auth');

// Get all Instagram photos
router.get('/', async (req, res) => {
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
      link: link || 'https://www.instagram.com/pallom369?igsh=eXcwZTdqejFlcnVm'
    });
    const saved = await newPhoto.save();
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
    res.json({ message: 'Instagram photo deleted successfully' });
  } catch (error) {
    res.status(500).json({ message: 'Server error', error: error.message });
  }
});

module.exports = router;
