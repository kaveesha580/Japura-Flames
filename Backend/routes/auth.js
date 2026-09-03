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

    {/*Password comparison and JWT token generation */}
    const isMatch = await user.comparePassword(password);
    if (!isMatch) {
      return res.status(401).json({
        success: false,
        message: 'Invalid Credentials'
      });
    }

    await User.updateLastLogin(user._id);

    const payload = {
      user: {
        id: user._id,
        email: user.email,
        accountType: user.accountType
      }
    };

    const token = jwt.sign(
      payload,
      process.env.JWT_SECRET || 'your_secret_key',
      { expiresIn: '7d' }
    );

     const userData = await User.getProfile(user._id);

    console.log(`✅ User logged in: ${email}`);

    res.json({
      success: true,
      token,
      message: 'Login Successful!',
      user: {
        id: userData._id,
        email: userData.email,
        fullName: userData.fullName,  
        phone: userData.phone,
        accountType: userData.accountType,
        organization: userData.organization
      }
    });

    } catch (err) {
    console.error('❌ Login Error:', err.message);
    res.status(500).json({
      success: false,
      message: 'Server Error'
    });
  }
});

//-------------------------------------
// *POST /api/auth/Register
//-------------------------------------

router.post('/register', async (req, res) => {
  const {
    fullName,
    email,
    phone,
    password,
    accountType,
    organization
  } = req.body;

  try {
    // 1. Validate input
    if (!fullName || !email || !phone || !password) {
      return res.status(400).json({
        success: false,
        message: 'All required fields must be filled'
      });
    }

    if (password.length < 6) {
      return res.status(400).json({
        success: false,
        message: 'Password must be at least 6 characters'
      });
    }

    // 2. Check if email already exists
    const emailExists = await User.emailExists(email);
    if (emailExists) {
      return res.status(409).json({
        success: false,
        message: 'Email already registered. Please use a different email.'
      });
    }

    // 3. Create new user
    const user = new User({
      fullName,
      email,
      phone,
      password,
      accountType: accountType || 'personal',
      organization: organization || null
    });

    await user.save();

    // 4. Generate JWT Token
    const token = jwt.sign(
      {
        user: {
          id: user._id,
          email: user.email,
          accountType: user.accountType
        }
      },
      process.env.JWT_SECRET || 'your_secret_key',
      { expiresIn: '7d' }
    );

    const userData = await User.getProfile(user._id);

    console.log(`✅ User registered: ${email} (ID: ${user._id})`);

    res.status(201).json({
      success: true,
      message: 'Registration successful!',
      token,
      user: {
        id: userData._id,
        email: userData.email,
        fullName: userData.fullName,  // 🟢 Name එක add කරන්න
        phone: userData.phone,
        accountType: userData.accountType,
        organization: userData.organization
      }
    });

  } catch (err) {
    console.error('❌ Registration Error:', err.message);
    
    if (err.code === 11000) {
      return res.status(409).json({
        success: false,
        message: 'Email already registered. Please use a different email.'
      });
    }
    
    res.status(500).json({
      success: false,
      message: 'Server Error'
    });
  }
});