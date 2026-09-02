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