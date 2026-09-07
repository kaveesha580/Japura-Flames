const mongoose = require('mongoose');

const CrewSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true,
    trim: true
  },
  unit: {
    type: String,
    required: true,
    enum: ['Photography', 'Videography', 'Broadcasting', 'Graphic Design', 'Article Writing', 'Poetry', 'IT & Marketing', 'HR'],
    default: 'Photography'
  },
  phone: {
    type: String,
    required: true,
    trim: true
  },
  email: {
    type: String,
     default: ''
  },
  role: {
    type: String,
    enum: ['Member', 'VP', 'Head', 'President', 'Secretary', 'Treasurer'],
    default: 'Member'
  },
  image: {
    type: String,
    default: ''
  },
  isActive: {
    type: Boolean,
    default: true
  },
  createdAt: {
    type: Date,
    default: Date.now
  }
});

module.exports = mongoose.model('Crew', CrewSchema);