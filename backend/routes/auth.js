const express = require('express');
const router = express.Router();
const jwt = require('jsonwebtoken');

// Admin login route
router.post('/login', async (req, res) => {
  const { username, password } = req.body;
  const adminUser = process.env.ADMIN_USER || 'admin';
  const adminPass = process.env.ADMIN_PASS || 'admin123';

  if (username === adminUser && password === adminPass) {
    const token = jwt.sign(
      { username, isAdmin: true },
      process.env.JWT_SECRET || 'tripatee_super_secret_jwt_key_12345',
      { expiresIn: process.env.JWT_EXPIRES_IN || '7d' }
    );

    return res.json({
      success: true,
      token,
      admin: { username, whatsapp: process.env.ADMIN_WHATSAPP || '9063454241' }
    });
  }

  return res.status(401).json({ success: false, message: 'Invalid credentials' });
});

// Admin verify token
router.get('/verify', (req, res) => {
  const authHeader = req.headers.authorization;
  if (!authHeader || !authHeader.startsWith('Bearer ')) {
    return res.status(401).json({ success: false, message: 'No token provided' });
  }

  const token = authHeader.split(' ')[1];
  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET || 'tripatee_super_secret_jwt_key_12345');
    return res.json({ success: true, user: decoded });
  } catch (error) {
    return res.status(401).json({ success: false, message: 'Invalid or expired token' });
  }
});

// Middleware to protect admin routes
const protectAdmin = (req, res, next) => {
  const authHeader = req.headers.authorization;
  if (!authHeader || !authHeader.startsWith('Bearer ')) {
    return res.status(401).json({ success: false, message: 'Unauthorized' });
  }

  const token = authHeader.split(' ')[1];
  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET || 'tripatee_super_secret_jwt_key_12345');
    req.user = decoded;
    next();
  } catch (error) {
    return res.status(401).json({ success: false, message: 'Unauthorized' });
  }
};

module.exports = {
  router,
  protectAdmin
};
