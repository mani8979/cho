const express = require('express');
const router = express.Router();
const Product = require('../models/Product');
const Category = require('../models/Category');
const { protectAdmin } = require('./auth');

// Get search suggestions (matches search-suggestions.php logic)
router.get('/search-suggestions', async (req, res) => {
  try {
    const q = req.query.q ? req.query.q.trim() : '';
    if (q.length < 1) {
      return res.json([]);
    }

    const regex = new RegExp(q, 'i');
    
    // 1. Search categories
    const categories = await Category.find({ name: regex }).limit(3);
    const catSuggestions = categories.map(cat => ({
      text: cat.name,
      type: 'category',
      icon: 'fas fa-th-large'
    }));

    // 2. Search products
    const products = await Product.find({
      $or: [
        { name: regex },
        { category: regex }
      ]
    }).limit(7);
    const prodSuggestions = products.map(prod => ({
      id: prod._id,
      text: prod.name,
      type: 'product',
      image: prod.image,
      price: prod.price,
      mrp: prod.mrp,
      icon: 'fas fa-image'
    }));

    // Combine suggestions and filter duplicates
    const combined = [...catSuggestions, ...prodSuggestions];
    const unique = [];
    const seen = new Set();

    for (const item of combined) {
      if (!seen.has(item.text)) {
        unique.push(item);
        seen.add(item.text);
      }
    }

    res.json(unique);
  } catch (error) {
    res.status(500).json({ message: 'Server error', error: error.message });
  }
});

// Get all products (with category filter and search search query)
router.get('/', async (req, res) => {
  try {
    const { category, q } = req.query;
    const filter = {};

    if (category) {
      filter.category = category;
    }

    if (q) {
      const regex = new RegExp(q.trim(), 'i');
      filter.$or = [
        { name: regex },
        { category: regex }
      ];
    }

    const products = await Product.find(filter).sort({ createdAt: -1 });
    res.json(products);
  } catch (error) {
    res.status(500).json({ message: 'Server error', error: error.message });
  }
});

// Get single product details
router.get('/:id', async (req, res) => {
  try {
    const product = await Product.findById(req.params.id);
    if (!product) {
      return res.status(404).json({ message: 'Product not found' });
    }
    res.json(product);
  } catch (error) {
    res.status(500).json({ message: 'Server error', error: error.message });
  }
});

// Create product (Admin only)
router.post('/', protectAdmin, async (req, res) => {
  try {
    const {
      name, price, mrp, image, galleryImages, description,
      category, weight, length, breadth, height, stockQuantity, adminRating, meeshoLink
    } = req.body;

    const newProduct = new Product({
      name,
      price: Number(price),
      mrp: mrp ? Number(mrp) : undefined,
      image,
      galleryImages: galleryImages || [],
      description,
      category,
      weight,
      length: length ? Number(length) : 10,
      breadth: breadth ? Number(breadth) : 10,
      height: height ? Number(height) : 5,
      stockQuantity: stockQuantity ? Number(stockQuantity) : 0,
      adminRating: adminRating ? Number(adminRating) : 5.0,
      meeshoLink
    });

    const saved = await newProduct.save();
    res.status(201).json(saved);
  } catch (error) {
    res.status(400).json({ message: 'Bad request', error: error.message });
  }
});

// Update product (Admin only)
router.put('/:id', protectAdmin, async (req, res) => {
  try {
    const {
      name, price, mrp, image, galleryImages, description,
      category, weight, length, breadth, height, stockQuantity, adminRating, meeshoLink
    } = req.body;

    const product = await Product.findById(req.params.id);
    if (!product) {
      return res.status(404).json({ message: 'Product not found' });
    }

    product.name = name || product.name;
    product.price = price !== undefined ? Number(price) : product.price;
    product.mrp = mrp !== undefined ? Number(mrp) : product.mrp;
    if (image !== undefined) product.image = image;
    if (galleryImages !== undefined) product.galleryImages = galleryImages;
    product.description = description !== undefined ? description : product.description;
    product.category = category || product.category;
    product.weight = weight !== undefined ? weight : product.weight;
    product.length = length !== undefined ? Number(length) : product.length;
    product.breadth = breadth !== undefined ? Number(breadth) : product.breadth;
    product.height = height !== undefined ? Number(height) : product.height;
    product.stockQuantity = stockQuantity !== undefined ? Number(stockQuantity) : product.stockQuantity;
    product.adminRating = adminRating !== undefined ? Number(adminRating) : product.adminRating;
    product.meeshoLink = meeshoLink !== undefined ? meeshoLink : product.meeshoLink;

    const updated = await product.save();
    res.json(updated);
  } catch (error) {
    res.status(400).json({ message: 'Bad request', error: error.message });
  }
});

// Delete product (Admin only)
router.delete('/:id', protectAdmin, async (req, res) => {
  try {
    const product = await Product.findByIdAndDelete(req.params.id);
    if (!product) {
      return res.status(404).json({ message: 'Product not found' });
    }
    res.json({ message: 'Product deleted successfully' });
  } catch (error) {
    res.status(500).json({ message: 'Server error', error: error.message });
  }
});

module.exports = router;
