const express = require('express');
const router = express.Router();
const Booking = require('../models/Booking');
const Crew = require('../models/Crew');

// ============================================
// 🟢 GET /api/bookings - Get all bookings
// ============================================
router.get('/', async (req, res) => {
  try {
    const { email, date, time, status } = req.query;
    let query = {};
    
    if (email) {
      query.email = email;
    }
    if (date) {
      query.eventDate = date;
    }
    if (time) {
      query.eventTime = time;
    }
    if (status) {
      const statusArray = status.split(',');
      query.status = { $in: statusArray };
    }
    
    const bookings = await Booking.find(query)
      .populate('assignedCrew')
      .sort({ createdAt: -1 });
    
    res.json(bookings);
  } catch (error) {
    console.error('Error fetching bookings:', error);
    res.status(500).json({ message: error.message });
  }
});

// ============================================
// 🟢 GET /api/bookings/:id - Get single booking
// ============================================
router.get('/:id', async (req, res) => {
  try {
    const booking = await Booking.findById(req.params.id).populate('assignedCrew');
    if (!booking) {
      return res.status(404).json({ message: 'Booking not found' });
    }
    res.json(booking);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// ============================================
// 🟢 POST /api/bookings - Create new booking
// ============================================
router.post('/', async (req, res) => {
  try {
    const bookingData = {
      ...req.body,
      status: 'Pending',
      assignedCrew: []
    };
    const booking = new Booking(bookingData);
    const savedBooking = await booking.save();
    res.status(201).json(savedBooking);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
});

// ============================================
// 🟢 PUT /api/bookings/:id - Update booking
// ============================================
router.put('/:id', async (req, res) => {
  try {
    const booking = await Booking.findByIdAndUpdate(
      req.params.id,
      req.body,
      { new: true, runValidators: true }
    );
    if (!booking) {
      return res.status(404).json({ message: 'Booking not found' });
    }
    res.json(booking);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
});

// ============================================
// 🟢 DELETE /api/bookings/:id - PERMANENTLY DELETE booking
// ============================================
router.delete('/:id', async (req, res) => {
  try {
    console.log('🗑️ Deleting booking ID:', req.params.id);
    
    const booking = await Booking.findByIdAndDelete(req.params.id);
    
    if (!booking) {
      console.log('❌ Booking not found:', req.params.id);
      return res.status(404).json({ 
        success: false,
        message: 'Booking not found' 
      });
    }
    
    console.log('✅ Booking deleted:', booking._id);
    
    res.json({ 
      success: true,
      message: 'Booking deleted successfully',
      booking: booking
    });
    
  } catch (error) {
    console.error('❌ Error deleting booking:', error);
    res.status(500).json({ 
      success: false,
      message: error.message 
    });
  }
});

// ============================================
// 🟢 POST /api/bookings/:id/cancel - CANCEL booking (status update)
// ============================================
router.post('/:id/cancel', async (req, res) => {
  try {
    const { cancelMessage } = req.body;
    const booking = await Booking.findById(req.params.id);
    
    if (!booking) {
      return res.status(404).json({ 
        success: false,
        message: 'Booking not found' 
      });
    }

    booking.status = 'Cancelled';
    booking.cancelMessage = cancelMessage || 'Booking was cancelled by admin.';
    await booking.save();

    res.json({ 
      success: true,
      message: 'Booking cancelled successfully!',
      booking: booking
    });

  } catch (error) {
    console.error('Error cancelling booking:', error);
    res.status(500).json({ 
      success: false,
      message: error.message 
    });
  }
});

// ============================================
// 🟢 POST /api/bookings/:id/complete - Complete booking with link
// ============================================
router.post('/:id/complete', async (req, res) => {
  try {
    const { link } = req.body;
    
    if (!link) {
      return res.status(400).json({ message: 'Link is required' });
    }

    const booking = await Booking.findById(req.params.id);
    
    if (!booking) {
      return res.status(404).json({ message: 'Booking not found' });
    }

    booking.status = 'Completed';
    booking.completeLink = link;
    await booking.save();

    res.json({ 
      success: true,
      message: 'Booking completed successfully!',
      booking: booking
    });

  } catch (error) {
    console.error('Error completing booking:', error);
    res.status(500).json({ message: error.message });
  }
});

// ============================================
// 🟢 POST /api/bookings/:id/assign-crew - Assign crew to booking
// ============================================
router.post('/:id/payment-slip', async (req, res) => {
  try {
    const { data, fileName } = req.body;
    if (!data || !fileName || !data.startsWith('data:image/')) return res.status(400).json({ message: 'Please upload a valid image slip' });
    const booking = await Booking.findById(req.params.id);
    if (!booking) return res.status(404).json({ message: 'Booking not found' });
    if (booking.status !== 'Confirmed') return res.status(400).json({ message: 'Payment slips can only be uploaded for confirmed bookings' });
    booking.paymentSlip = { data, fileName, uploadedAt: new Date() };
    await booking.save();
    res.json({ success: true, message: 'Payment slip uploaded successfully', booking });
  } catch (error) { res.status(400).json({ message: error.message }); }
});

router.post('/:id/assign-crew', async (req, res) => {
  try {
    const { crewIds, paymentAccount = {} } = req.body;
    
    if (!crewIds || crewIds.length === 0) {
      return res.status(400).json({ message: 'Please select at least one crew member' });
    }

    const booking = await Booking.findById(req.params.id);
    if (!booking) {
      return res.status(404).json({ message: 'Booking not found' });
    }

    if (booking.status === 'Confirmed' || booking.status === 'In Progress') {
      return res.status(400).json({ message: 'Booking is already confirmed or in progress' });
    }

    const bookedCrew = await Booking.find({
      _id: { $ne: booking._id },
      eventDate: booking.eventDate,
      eventTime: booking.eventTime,
      status: { $in: ['Confirmed', 'In Progress'] },
      assignedCrew: { $in: crewIds }
    });

    if (bookedCrew.length > 0) {
      const bookedCrewIds = bookedCrew.flatMap(b => b.assignedCrew.map(id => id.toString()));
      const conflictingCrew = await Crew.find({ _id: { $in: bookedCrewIds } });
      const conflictingNames = conflictingCrew.map(c => c.name).join(', ');
      
      return res.status(409).json({
        message: `The following crew members are already booked at this time: ${conflictingNames}`,
        conflictingCrew: conflictingCrew
      });
    }

    const crewMembers = await Crew.find({ _id: { $in: crewIds } });
    if (crewMembers.length !== crewIds.length) {
      return res.status(400).json({ message: 'One or more crew members not found' });
    }

    booking.assignedCrew = crewIds;
    booking.paymentAccount = {
      bankName: paymentAccount.bankName || '', accountName: paymentAccount.accountName || '',
      accountNumber: paymentAccount.accountNumber || '', instructions: paymentAccount.instructions || ''
    };
    booking.status = 'Confirmed';
    await booking.save();

    const populatedBooking = await Booking.findById(booking._id).populate('assignedCrew');

    res.json({
      success: true,
      message: 'Crew assigned successfully!',
      booking: populatedBooking
    });

  } catch (error) {
    console.error('Error assigning crew:', error);
    res.status(500).json({ message: error.message });
  }
});

// ============================================
// 🟢 GET /api/bookings/:id/crew - Get assigned crew for booking
// ============================================
router.get('/:id/crew', async (req, res) => {
  try {
    const booking = await Booking.findById(req.params.id).populate('assignedCrew');
    if (!booking) {
      return res.status(404).json({ message: 'Booking not found' });
    }
    res.json(booking.assignedCrew);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// ============================================
// 🟢 DELETE /api/bookings/:id/crew/:crewId - Remove crew from booking
// ============================================
router.delete('/:id/crew/:crewId', async (req, res) => {
  try {
    const booking = await Booking.findById(req.params.id);
    if (!booking) {
      return res.status(404).json({ message: 'Booking not found' });
    }

    booking.assignedCrew = booking.assignedCrew.filter(
      id => id.toString() !== req.params.crewId
    );
    await booking.save();

    const populatedBooking = await Booking.findById(booking._id).populate('assignedCrew');

    res.json({
      success: true,
      message: 'Crew removed successfully!',
      booking: populatedBooking
    });
  } catch (error) {
    console.error('Error removing crew:', error);
    res.status(500).json({ message: error.message });
  }
});

module.exports = router;
