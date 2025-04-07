// routes/authRoutes.js
const express = require('express');
const router = express.Router();
const User = require('../models/user');
const Email = require('../models/Email');

// 🔐 Signup Route
router.post('/signup', async (req, res) => {
  try {
    const { name, email, password } = req.body;
    
    if (!name || !email || !password) {
      return res.status(400).json({ success: false, message: 'All fields are required' });
    }

    const existingUser = await User.findOne({ email });
    if (existingUser) {
      return res.status(400).json({ success: false, message: 'User already exists' });
    }

    const user = new User({ name, email, password });
    await user.save();

    res.json({ success: true, message: 'Signup successful', user });
  } catch (error) {
    console.error('Signup error:', error);
    res.status(500).json({ success: false, message: 'Server error during signup' });
  }
});

// 🔑 Login Route
router.post('/login', async (req, res) => {
  try {
    const { email, password } = req.body;
    
    if (!email || !password) {
      return res.status(400).json({ success: false, message: 'Email and password are required' });
    }

    const user = await User.findOne({ email, password });
    if (!user) {
      return res.status(401).json({ success: false, message: 'Invalid credentials' });
    }

    res.json({ success: true, message: 'Login successful', user });
  } catch (error) {
    console.error('Login error:', error);
    res.status(500).json({ success: false, message: 'Server error during login' });
  }
});

// 📩 Get Emails
router.get('/mails/:userId', async (req, res) => {
  try {
    const { userId } = req.params;

    const emails = await Email.find({ userId });
    res.json({ success: true, mails: emails });
  } catch (error) {
    console.error('Get emails error:', error);
    res.status(500).json({ success: false, message: 'Server error fetching emails' });
  }
});

// ➕ Add Email
router.post('/add-email', async (req, res) => {
  try {
    const { userId, sender, subject, body } = req.body;
    
    if (!userId || !sender || !subject || !body) {
      return res.status(400).json({ success: false, message: 'All email fields are required' });
    }

    const newEmail = new Email({ userId, sender, subject, body });
    await newEmail.save();

    res.json({ success: true, message: 'Email added' });
  } catch (error) {
    console.error('Add email error:', error);
    res.status(500).json({ success: false, message: 'Server error adding email' });
  }
});

module.exports = router;
