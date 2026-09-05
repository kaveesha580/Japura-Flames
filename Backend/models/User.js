const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');

const UserSchema = new mongoose.Schema({
  fullName: {
    type: String,
    required: true,
  },
  email: {
    type: String,
    required: true,
    unique: true,
    lowercase: true,
    trim: true,
  },
  phone: {
    type: String,
    required: true,
  },
 
  password: {
    type: String,
    required: true,
    select: false,
  },
  accountType: {
    type: String,
    enum: ['personal', 'organizer'],
    default: 'personal',
  },
  organization: {
    type: String,
    default: null,
  },
  isActive: {
    type: Boolean,
    default: true,
  },
  createdAt: {
    type: Date,
    default: Date.now,
  },
  lastLogin: {
    type: Date,
    default: null,
  }
});

// Hash password before saving
UserSchema.pre('save', async function(next) {
  if (!this.isModified('password')) return next();
  
  try {
    const salt = await bcrypt.genSalt(10);
    this.password = await bcrypt.hash(this.password, salt);
    next();
  } catch (error) {
    next(error);
  }
});

// Compare password method
UserSchema.methods.comparePassword = async function(candidatePassword) {
  return await bcrypt.compare(candidatePassword, this.password);
};

// Static methods
UserSchema.statics.emailExists = async function(email) {
  const user = await this.findOne({ email });
  return !!user;
};

//Removed the `usernameExists` method as well (it is not needed)
UserSchema.statics.getProfile = async function(id) {
  return await this.findById(id).select('-password');
};

UserSchema.statics.updateLastLogin = async function(id) {
  await this.findByIdAndUpdate(id, { lastLogin: new Date() });
};

UserSchema.statics.getAllUsers = async function() {
  return await this.find().select('-password').sort({ createdAt: -1 });
};

module.exports = mongoose.model('User', UserSchema);