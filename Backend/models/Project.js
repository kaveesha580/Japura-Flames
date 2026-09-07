const mongoose = require('mongoose');


const projectSchema = new mongoose.Schema({
  title: {
    type: String,
    required: true,
    trim: true
  },
  description: {
    type: String,
    required: true
  },
  eventDate: {
    type: String,
    default: ''
  },
  eventLocation: {
    type: String,
    default: ''
  },
  githubLink: {
    type: String,
    default: ''
  },
  status: {
    type: String,
    enum: ['Completed', 'In Progress', 'Planned'],
    default: 'In Progress'
  },
  image: {
    type: String,
    default: ''
  },
  
},{timestamps: true});

module.exports = mongoose.model('Project', projectSchema);