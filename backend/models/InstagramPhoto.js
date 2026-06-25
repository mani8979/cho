const mongoose = require('mongoose');

const InstagramPhotoSchema = new mongoose.Schema({
  imagePath: {
    type: String,
    required: true
  },
  link: {
    type: String,
    default: ''
  },
  createdDate: {
    type: Date,
    default: Date.now
  }
});

module.exports = mongoose.model('InstagramPhoto', InstagramPhotoSchema);
