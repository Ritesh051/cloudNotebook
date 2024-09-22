const express = require('express');
const User = require('../models/User'); 
const router = express.Router();
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const { body, validationResult } = require('express-validator');
const fetchuser = require('../Middleware/fetchuser');
require('dotenv').config();

// JWT Secret
const JWT_SECRET = process.env.JWT_SECRET || "Riteshdontlikeanythinginthisw0rl$";

// Route 1: Create a user (Signup)
router.post('/createuser', [
  body('name').notEmpty().withMessage('Name is empty'),
  body('email')
      .isEmail().withMessage('Invalid email format')
      .notEmpty().withMessage('Email is empty')
      .custom(async (value) => {
          const user = await User.findOne({ email: value });
          if (user) {
              throw new Error('E-mail already in use');
          }
          return true;
      }),
  body('password')
      .isLength({ min: 6 }).withMessage('Password must be at least 6 characters long')
      .notEmpty().withMessage('Please enter the password'),
], async (req, res) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
  }

  try {
      // Hash the password
      const salt = await bcrypt.genSalt(10);
      const secPass = await bcrypt.hash(req.body.password, salt);

      // Create the user
      const user = await User.create({
          username: req.body.name,
          email: req.body.email,
          password: secPass,
      });

      // Prepare data for JWT
      const data = {
          user: {
              id: user.id,
          },
      };

      // Sign JWT token
      const authToken = jwt.sign(data, JWT_SECRET);
      res.json({ success: true, authToken }); // Ensure success is defined
  } catch (error) {
      console.error('Error creating user:', error.message);
      res.status(500).json({ error: 'Server error' });
  }
});


// Route 2: Authenticate a user (Login)
router.post('/login', [
  body('email').isEmail().withMessage('Invalid email format').notEmpty().withMessage('Email is empty'),
  body('password').notEmpty().withMessage('Please enter the password'),
], async (req, res) => {
  let success = false;
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
  }

  const { email, password } = req.body;
  try {
      const user = await User.findOne({ email });
      if (!user) {
          return res.status(400).json({ success, error: 'Invalid credentials' });
      }

      const isMatch = await bcrypt.compare(password, user.password);
      if (!isMatch) {
          return res.status(400).json({ success, error: 'Invalid credentials' });
      }

      const data = {
          user: {
              id: user.id,
          },
      };

      const authToken = jwt.sign(data, JWT_SECRET);
      success = true;
      res.json({ success, authToken });
  } catch (error) {
      console.error('Error logging in:', error.message);
      res.status(500).json({ error: 'Server error' });
  }
});

// Route 3: Get logged-in user details (POST "/api/auth/getuser") - Requires JWT Authentication
router.post('/getuser', fetchuser, async (req, res) => {
  try {
    const userId = req.user.id;
    const user = await User.findById(userId).select('-password');
    if (!user) {
      return res.status(404).json({ error: 'User not found' });
    }
    res.json(user);
  } catch (error) {
    console.error('Error fetching user details:', error.message);
    res.status(500).json({ error: 'Server error' });
  }
});

module.exports = router;
