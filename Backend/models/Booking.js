const mongoose = require('mongoose');

const BookingSchema = new mongoose.Schema({
  // Client Details
  name: {
    type: String,
    required: true,
  },
  email: {
    type: String,
    required: true,
  },
  phone: {
    type: String,
    required: true,
  },
  
  // User identification
  userEmail: {
    type: String,
    default: '',
  },
  
  // Event Details
  eventName: {
    type: String,
    required: true,
  },
  eventType: {
    type: String,
    enum: [ 'Party', 'Corporate', 'Concert', 'Sports', 'Other'],
    required: true,
  },
  eventDate: {
    type: String,
    required: true,
  },
  eventTime: {
    type: String,
    required: true,
  },
  eventLocation: {
    type: String,
    required: true,
  },
  
  serviceType: {
    type: [String],
    enum: ['Photographer', 'Videographer', 'Broadcaster', 'All'],
    required: true,
  },
  
  
  duration: {
    type: String,
    enum: ['1 Hours', '2 Hours', '4 Hours', '6 Hours', '8 Hours', 'Full Day'],
    required: true,
  },
  specialRequirements: {
    type: String,
    default: '',
  },
  message: {
    type: String,
    default: '',
  },
  

  status: {
    type: String,
    enum: ['Pending', 'Price Sent', 'Confirmed', 'In Progress', 'Completed', 'Cancelled'],
    default: 'Pending'
  },
  
  
  cancelMessage: {
    type: String,
    default: ''
  },
   completeLink: {
    type: String,
    default: ''
  },
  assignedCrew: [{
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Crew'
  }],
  
  
  estimatedPrice: {
    type: Number,
    default: 0,
  },
  paymentAccount: {
    bankName: { type: String, default: '' },
    accountName: { type: String, default: '' },
    accountNumber: { type: String, default: '' },
    instructions: { type: String, default: '' }
  },
  paymentSlip: {
    data: { type: String, default: '' },
    fileName: { type: String, default: '' },
    uploadedAt: { type: Date }
  },
  
  createdAt: {
    type: Date,
    default: Date.now,
  }
});

module.exports = mongoose.model('Booking', BookingSchema);