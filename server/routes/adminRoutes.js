const express = require('express');
const router = express.Router();
const Admin = require('../models/Admin');
const User = require('../models/User');
const Author = require('../models/Author');

// Middleware to verify admin
const verifyAdmin = async (req, res, next) => {
  try {
    const adminEmail = req.headers.email;
    const admin = await Admin.findOne({ email: adminEmail });
    if (!admin) {
      return res.status(403).json({ message: 'Not authorized as admin' });
    }
    next();
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

// Get user counts
router.get('/user-counts', verifyAdmin, async (req, res) => {
  try {
    const users = await User.countDocuments();
    const authors = await Author.countDocuments();
    const admins = await Admin.countDocuments();

    console.log('Counts:', { users, authors, admins }); // Debug log

    res.json({
      message: 'success',
      payload: { users, authors, admins }
    });
  } catch (err) {
    console.error('Error in user-counts:', err);
    res.status(500).json({ message: err.message });
  }
});

// Make admin
router.post('/make-admin', verifyAdmin, async (req, res) => {
  try {
    const { email } = req.body;
    const existingAdmin = await Admin.findOne({ email });
    
    if (existingAdmin) {
      return res.status(400).json({ message: 'User is already an admin' });
    }

    const newAdmin = new Admin({ email, role: 'admin' });
    await newAdmin.save();

    res.json({ message: 'success', payload: newAdmin });
  } catch (err) {
    console.error('Error in make-admin:', err);
    res.status(500).json({ message: err.message });
  }
});

module.exports = router;
