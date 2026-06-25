const mongoose = require('mongoose');

const CategorySchema = new mongoose.Schema({
  name: {
    type: String,
    required: true,
    unique: true,
    trim: true
  },
  displayOrder: {
    type: Number,
    default: 0
  },
  minOrder: {
    type: Number,
    default: 0
  },
  maxOrder: {
    type: Number,
    default: 0
  },
  image: {
    type: String,
    default: null
  }
});

module.exports = mongoose.model('Category', CategorySchema);
