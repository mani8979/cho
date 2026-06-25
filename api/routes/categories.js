const express = require('express');
const router = express.Router();
const Category = require('../models/Category');
const { protectAdmin } = require('./auth');

// Get all categories
router.get('/', async (req, res) => {
  try {
    const categories = await Category.find().sort({ displayOrder: 1, name: 1 });
    res.json(categories);
  } catch (error) {
    res.status(500).json({ message: 'Server error', error: error.message });
  }
});

// Create category (Admin only)
router.post('/', protectAdmin, async (req, res) => {
  try {
    const { name, displayOrder, minOrder, maxOrder, image } = req.body;
    const newCategory = new Category({
      name,
      displayOrder: Number(displayOrder || 0),
      minOrder: Number(minOrder || 0),
      maxOrder: Number(maxOrder || 0),
      image
    });
    const saved = await newCategory.save();
    res.status(201).json(saved);
  } catch (error) {
    res.status(400).json({ message: 'Bad request', error: error.message });
  }
});

// Update category (Admin only)
router.put('/:id', protectAdmin, async (req, res) => {
  try {
    const { name, displayOrder, minOrder, maxOrder, image } = req.body;
    const category = await Category.findById(req.params.id);
    if (!category) {
      return res.status(404).json({ message: 'Category not found' });
    }

    category.name = name || category.name;
    category.displayOrder = displayOrder !== undefined ? Number(displayOrder) : category.displayOrder;
    category.minOrder = minOrder !== undefined ? Number(minOrder) : category.minOrder;
    category.maxOrder = maxOrder !== undefined ? Number(maxOrder) : category.maxOrder;
    if (image !== undefined) category.image = image;

    const updated = await category.save();
    res.json(updated);
  } catch (error) {
    res.status(400).json({ message: 'Bad request', error: error.message });
  }
});

// Delete category (Admin only)
router.delete('/:id', protectAdmin, async (req, res) => {
  try {
    const category = await Category.findByIdAndDelete(req.params.id);
    if (!category) {
      return res.status(404).json({ message: 'Category not found' });
    }
    res.json({ message: 'Category deleted successfully' });
  } catch (error) {
    res.status(500).json({ message: 'Server error', error: error.message });
  }
});

module.exports = router;
