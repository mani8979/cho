const mongoose = require('mongoose');

const OrderSchema = new mongoose.Schema({
  productName: {
    type: String,
    required: true
  },
  productId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Product'
  },
  phone: {
    type: String,
    required: true
  },
  price: {
    type: Number,
    required: true
  },
  quantity: {
    type: Number,
    required: true,
    default: 1
  },
  address: {
    type: String,
    required: true
  },
  pincode: {
    type: String,
    default: ''
  },
  email: {
    type: String,
    default: ''
  },
  totalPrice: {
    type: Number,
    required: true
  },
  status: {
    type: String,
    default: 'Wait for WhatsApp'
  },
  paymentScreenshot: {
    type: String,
    default: ''
  },
  createdAt: {
    type: Date,
    default: Date.now
  }
});

module.exports = mongoose.model('Order', OrderSchema);
