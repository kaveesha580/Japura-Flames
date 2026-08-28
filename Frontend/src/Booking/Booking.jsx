import React, { useState, useEffect } from 'react';
import './Booking.css';

const BOOKING_API_URL = 'http://localhost:5000/api/bookings';

function Booking() {
  const [formData, setFormData] = useState({
    // Personal Details (Email එක අයින් කරලා)
    name: '',
    phone: '',
    
    // Event Details
    eventName: '',
    eventType: 'Wedding',
    eventDate: '',
    eventTime: '',
    eventLocation: '',
    
    // Service Type (allow multiple selections)
    serviceType: ['Photographer'],
    duration: '4 Hours',
    specialRequirements: '',
    message: '',
  });
  
  // Logged in user ගේ email එක store කරන්න
  const [userEmail, setUserEmail] = useState('');
  
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState('');
  const [success, setSuccess] = useState(false);

  // Component load වෙද්දි user email එක ගන්න
  useEffect(() => {
    const email = localStorage.getItem('userEmail');
    const name = localStorage.getItem('userName') || '';
    const phone = localStorage.getItem('userPhone') || '';
    
    if (email) {
      setUserEmail(email);
      setFormData(prev => ({
        ...prev,
        name: name || prev.name,
        phone: phone || prev.phone,
      }));
    }
  }, []);
}

export default Booking;