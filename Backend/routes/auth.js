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
//-------------------------------------
// *POST /api/auth/reset - password
//-------------------------------------

router.post('/reset-password', async (req, res) => {
  const { email, oldPassword, newPassword } = req.body;

  try {
    if (!email || !oldPassword || !newPassword) {
      return res.status(400).json({
        success: false,
        message: 'All fields are required'
      });
    }

    if (newPassword.length < 6) {
      return res.status(400).json({
        success: false,
        message: 'New password must be at least 6 characters'
      });
    }

    const user = await User.findOne({ email }).select('+password');
    if (!user) {
      return res.status(404).json({
        success: false,
        message: 'User with this email does not exist.'
      });
    }

    const isMatch = await user.comparePassword(oldPassword);
    if (!isMatch) {
      return res.status(400).json({
        success: false,
        message: 'Incorrect old password.'
      });
    }

    user.password = newPassword;
    await user.save();

    console.log(`✅ Password reset for: ${email}`);

    res.json({
      success: true,
      message: 'Password has been successfully changed! You can now login.'
    });

  } catch (err) {
    console.error('❌ Password Reset Error:', err.message);
    res.status(500).json({
      success: false,
      message: 'Server Error'
    });
  }
});

//-------------------------------------
// *POST /api/auth/forgot-by-phone
//-------------------------------------
router.post('/forgot-by-phone', async (req, res) => {
  try {
    const { email, phone, newPassword } = req.body;

    if (!email || !phone || !newPassword) {
      return res.status(400).json({ success: false, message: 'Email, phone and newPassword are required' });
    }

    if (newPassword.length < 6) {
      return res.status(400).json({ success: false, message: 'New password must be at least 6 characters' });
    }

    const user = await User.findOne({ email: email.toLowerCase().trim() }).select('+password');
    if (!user) {
      return res.status(404).json({ success: false, message: 'User with this email does not exist' });
    }

    if (!user.phone || user.phone.trim() !== phone.trim()) {
      return res.status(400).json({ success: false, message: 'Phone number does not match the provided email' });
    }

    user.password = newPassword;
    await user.save();

    console.log(`✅ Password reset by phone for: ${email}`);

    res.json({ success: true, message: 'Password has been reset successfully. You can now login.' });

  } catch (error) {
    console.error('❌ Forgot By Phone Error:', error.message);
    res.status(500).json({ success: false, message: 'Server Error' });
  }
});

//-------------------------------------
// *POST /api/auth/me -Get current User
//-------------------------------------

router.get('/me', async (req, res) => {
  try {
    const token = req.headers.authorization?.split(' ')[1];

    if (!token) {
      return res.status(401).json({
        success: false,
        message: 'No token provided'
      });
    }

    const decoded = jwt.verify(token, process.env.JWT_SECRET || 'your_secret_key');

    const user = await User.getProfile(decoded.user.id);

    if (!user) {
      return res.status(404).json({
        success: false,
        message: 'User not found'
      });
    }

    res.json({
      success: true,
      user: {
        id: user._id,
        email: user.email,
        fullName: user.fullName,
        phone: user.phone,
        accountType: user.accountType,
        organization: user.organization
      }
    });

  } catch (error) {
    console.error('❌ Get User Error:', error.message);
    
    if (error.name === 'JsonWebTokenError') {
      return res.status(401).json({
        success: false,
        message: 'Invalid token'
      });
    }
    
    res.status(500).json({
      success: false,
      message: 'Server Error'
    });
  }
});

//-------------------------------------------------
// *POST /api/auth/me -Update current user profile
//-------------------------------------------------
router.put('/me', async (req, res) => {
  try {
    const token = req.headers.authorization?.split(' ')[1];

    if (!token) {
      return res.status(401).json({
        success: false,
        message: 'No token provided'
      });
    }

    const decoded = jwt.verify(token, process.env.JWT_SECRET || 'your_secret_key');
    const { fullName, phone } = req.body;

    if (!fullName || !phone) {
      return res.status(400).json({
        success: false,
        message: 'Full name and phone are required'
      });
    }

    const updatedUser = await User.findByIdAndUpdate(
      decoded.user.id,
      { fullName: fullName.trim(), phone: phone.trim() },
      { new: true, select: '-password' }
    );

    if (!updatedUser) {
      return res.status(404).json({
        success: false,
        message: 'User not found'
      });
    }

    res.json({
      success: true,
      message: 'Profile updated successfully',
      user: {
        id: updatedUser._id,
        email: updatedUser.email,
        fullName: updatedUser.fullName,
        phone: updatedUser.phone,
        accountType: updatedUser.accountType,
        organization: updatedUser.organization
      }
    });

  } catch (error) {
    console.error('❌ Update Profile Error:', error.message);

    if (error.name === 'JsonWebTokenError') {
      return res.status(401).json({
        success: false,
        message: 'Invalid token'
      });
    }

    res.status(500).json({
      success: false,
      message: 'Server Error'
    });
  }
});