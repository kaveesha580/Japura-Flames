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


  
  const servicePrices = {
    'Photographer': { '2 Hours': 15000, '4 Hours': 25000, '6 Hours': 35000, '8 Hours': 45000, 'Full Day': 60000 },
    'Videographer': { '2 Hours': 20000, '4 Hours': 35000, '6 Hours': 50000, '8 Hours': 65000, 'Full Day': 85000 },
    'Broadcaster': { '2 Hours': 25000, '4 Hours': 40000, '6 Hours': 55000, '8 Hours': 70000, 'Full Day': 90000 },
    'All': { '2 Hours': 40000, '4 Hours': 65000, '6 Hours': 90000, '8 Hours': 115000, 'Full Day': 150000 }
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const getEstimatedPrice = () => {
    const { serviceType, duration } = formData;
    const selected = Array.isArray(serviceType) ? serviceType : [serviceType];

    if (selected.includes('All')) {
      return servicePrices['All']?.[duration] || 0;
    }

    return selected.reduce((sum, s) => {
      return sum + (servicePrices[s]?.[duration] || 0);
    }, 0);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setMessage('');

    const token = localStorage.getItem('token');
    const loggedInEmail = localStorage.getItem('userEmail');

    // Booking data - Email එක localStorage එකෙන් ගන්න
    const bookingData = {
      name: formData.name,
      email: loggedInEmail || '',
      phone: formData.phone,
      userEmail: loggedInEmail || '',
      eventName: formData.eventName,
      eventType: formData.eventType,
      eventDate: formData.eventDate,
      eventTime: formData.eventTime,
      eventLocation: formData.eventLocation,
      serviceType: formData.serviceType,
      duration: formData.duration,
      specialRequirements: formData.specialRequirements,
      message: formData.message,
      estimatedPrice: getEstimatedPrice()
    };

    try {
      const response = await fetch(BOOKING_API_URL, {
        method: 'POST',
        headers: { 
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify(bookingData)
      });

      if (response.ok) {
        setSuccess(true);
        setMessage('✅ Booking request submitted successfully!');
        // Reset form
        setFormData({
          name: '',
          phone: '',
          eventName: '',
          eventType: 'Wedding',
          eventDate: '',
          eventTime: '',
          eventLocation: '',
          serviceType: ['Photographer'],
          duration: '4 Hours',
          specialRequirements: '',
          message: '',
        });
      } else {
        const error = await response.json();
        setMessage(`❌ Failed to submit booking: ${error.message || 'Unknown error'}`);
      }
    } catch (error) {
      console.error('Error submitting booking:', error);
      setMessage('❌ Error submitting booking');
    } finally {
      setLoading(false);
    }
  };


}

export default Booking;