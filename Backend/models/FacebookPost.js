const mongoose = require('mongoose');

const facebookPostSchema = new mongoose.Schema({
  url: {
    type: String,
    required: true,
    trim: true
  },
  height: {
    type: Number,
    default: 808
  }
}, { timestamps: true });

module.exports = mongoose.model('FacebookPost', facebookPostSchema);
