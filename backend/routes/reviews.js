const express = require('express');
const router = express.Router();
const Review = require('../models/Review');
const { protectAdmin } = require('./auth');
const { cacheMiddleware, invalidateCache } = require('../utils/cache');
const rateLimiter = require('../utils/rateLimiter');

const reviewRateLimiter = rateLimiter({
  windowMs: 15 * 60 * 1000,
  max: 15,
  message: 'Too many review submissions, please try again in 15 minutes.'
});

// Get all approved reviews for a product
router.get('/product/:productId', cacheMiddleware(60), async (req, res) => {
  try {
    const reviews = await Review.find({
      product: req.params.productId,
      status: 'approved'
    }).sort({ createdAt: -1 });
    res.json(reviews);
  } catch (error) {
    res.status(500).json({ message: 'Server error', error: error.message });
  }
});

// Submit a review (Public)
router.post('/', reviewRateLimiter, async (req, res) => {
  try {
    const { product, userName, rating, comment, reviewImages } = req.body;
    
    const newReview = new Review({
      product,
      userName: userName || 'Anonymous',
      rating: Number(rating),
      comment: comment || '',
      reviewImages: reviewImages || [],
      status: 'pending', // Requires admin approval
      isAdmin: false
    });

    const saved = await newReview.save();
    invalidateCache(['/api/reviews', '/api/products']);
    res.status(201).json(saved);
  } catch (error) {
    res.status(400).json({ message: 'Bad request', error: error.message });
  }
});

// Submit an official admin review (Admin only)
router.post('/admin-review', protectAdmin, async (req, res) => {
  try {
    const { product, userName, rating, comment, reviewImages } = req.body;
    
    const newReview = new Review({
      product,
      userName: userName || 'Anonymous',
      rating: Number(rating),
      comment: comment || '',
      reviewImages: reviewImages || [],
      status: 'approved', // Auto approved
      isAdmin: true
    });

    const saved = await newReview.save();
    invalidateCache(['/api/reviews', '/api/products']);
    res.status(201).json(saved);
  } catch (error) {
    res.status(400).json({ message: 'Bad request', error: error.message });
  }
});

// Get all reviews for admin moderation (Admin only)
router.get('/', protectAdmin, async (req, res) => {
  try {
    const reviews = await Review.find()
      .populate('product', 'name')
      .sort({ createdAt: -1 });
    res.json(reviews);
  } catch (error) {
    res.status(500).json({ message: 'Server error', error: error.message });
  }
});

// Approve/Reject a review (Admin only)
router.put('/:id/status', protectAdmin, async (req, res) => {
  try {
    const { status } = req.body;
    if (!['approved', 'rejected', 'pending'].includes(status)) {
      return res.status(400).json({ message: 'Invalid status' });
    }

    const review = await Review.findById(req.params.id);
    if (!review) {
      return res.status(404).json({ message: 'Review not found' });
    }

    review.status = status;
    const updated = await review.save();
    invalidateCache(['/api/reviews', '/api/products']);
    res.json(updated);
  } catch (error) {
    res.status(400).json({ message: 'Bad request', error: error.message });
  }
});

// Delete a review (Admin only)
router.delete('/:id', protectAdmin, async (req, res) => {
  try {
    const review = await Review.findByIdAndDelete(req.params.id);
    if (!review) {
      return res.status(404).json({ message: 'Review not found' });
    }
    invalidateCache(['/api/reviews', '/api/products']);
    res.json({ message: 'Review deleted successfully' });
  } catch (error) {
    res.status(500).json({ message: 'Server error', error: error.message });
  }
});

module.exports = router;
