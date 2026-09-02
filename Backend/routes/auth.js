//-------------------------------------
// * Router set up for authentication
//-------------------------------------
const express = require('express');
const router = express.Router();
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const User = require('../models/User');

//-------------------------------------
// *POST /api/auth/login
//-------------------------------------

{/*Login route input validation */}
router.post('/login', async (req, res) => {
  const { email, password } = req.body;

  try {
    if (!email || !password) {
      return res.status(400).json({
        success: false,
        message: 'Email and password are required'
      });
    }

    const user = await User.findOne({ email }).select('+password');
    if (!user) {
      return res.status(401).json({
        success: false,
        message: 'Invalid Credentials'
      });
    }

    if (!user.isActive) {
      return res.status(403).json({
        success: false,
        message: 'Account is deactivated. Please contact support.'
      });
    }
    } catch (err) {
    console.error('❌ Login Error:', err.message);
    res.status(500).json({
      success: false,
      message: 'Server Error'
    });
  }
});