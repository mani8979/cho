const express = require('express');
const router = express.Router();
const Order = require('../models/Order');
const Product = require('../models/Product');
const Category = require('../models/Category');
const Review = require('../models/Review');
const { protectAdmin } = require('./auth');

// Create new order (Public)
router.post('/', async (req, res) => {
  try {
    const { productName, productId, phone, price, quantity, address, pincode, email, paymentScreenshot } = req.body;
    
    const totalPrice = Number(price) * Number(quantity || 1);

    const newOrder = new Order({
      productName,
      productId: productId || null,
      phone,
      price: Number(price),
      quantity: Number(quantity || 1),
      address,
      pincode: pincode || '',
      email: email || '',
      totalPrice,
      status: 'Wait for WhatsApp',
      paymentScreenshot: paymentScreenshot || ''
    });

    const saved = await newOrder.save();
    res.status(201).json({ success: true, order: saved });
  } catch (error) {
    res.status(400).json({ message: 'Bad request', error: error.message });
  }
});

// Get all orders (Admin only)
router.get('/', protectAdmin, async (req, res) => {
  try {
    const orders = await Order.find().sort({ createdAt: -1 });
    res.json(orders);
  } catch (error) {
    res.status(500).json({ message: 'Server error', error: error.message });
  }
});

// Admin stats overview (Admin only)
router.get('/stats', protectAdmin, async (req, res) => {
  try {
    const totalProducts = await Product.countDocuments();
    const totalCategories = await Category.countDocuments();
    const totalOrders = await Order.countDocuments();
    const totalReviews = await Review.countDocuments();
    const pendingReviews = await Review.countDocuments({ status: 'pending' });

    res.json({
      totalProducts,
      totalCategories,
      totalOrders,
      totalReviews,
      pendingReviews
    });
  } catch (error) {
    res.status(500).json({ message: 'Server error', error: error.message });
  }
});

module.exports = router;
