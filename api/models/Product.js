const mongoose = require('mongoose');

const ProductSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true,
    trim: true
  },
  price: {
    type: Number,
    required: true
  },
  mrp: {
    type: Number
  },
  image: {
    type: String,
    default: ''
  },
  galleryImages: {
    type: [String],
    default: []
  },
  description: {
    type: String,
    default: ''
  },
  category: {
    type: String,
    required: true
  },
  weight: {
    type: String,
    default: ''
  },
  length: {
    type: Number,
    default: 10
  },
  breadth: {
    type: Number,
    default: 10
  },
  height: {
    type: Number,
    default: 5
  },
  stockQuantity: {
    type: Number,
    default: 0
  },
  adminRating: {
    type: Number,
    default: 5.0
  },
  meeshoLink: {
    type: String,
    default: ''
  },
  createdAt: {
    type: Date,
    default: Date.now
  }
});

module.exports = mongoose.model('Product', ProductSchema);
