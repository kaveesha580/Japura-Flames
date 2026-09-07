import { useState, useEffect } from 'react';
import './Booking.css';
import { API_BASE } from '../config';

const BOOKING_API_URL = `${API_BASE}/api/bookings`;

function Booking() {
  const [formData, setFormData] = useState({
   
    name: '',
    phone: '',
    eventName: '',
    eventType: 'Party',
    eventDate: '',
    eventTime: '',
    eventLocation: '',  
    serviceType: ['Photographer'],
    duration: '4 Hours',
    specialRequirements: '',
    message: '',
  });
  
  
  const [userEmail, setUserEmail] = useState('');
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState('');
  const [success, setSuccess] = useState(false);

 
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

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setMessage('');

    const token = localStorage.getItem('token');
    const loggedInEmail = localStorage.getItem('userEmail');


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
          eventType: 'Party',
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

  return (
    <div className="booking-container">
      <div className="booking-form-wrapper">
        <h1>📸 Book Your Event Coverage</h1>
        <p className="subtitle">Professional Photographer, Videographer & Broadcasting Services</p>
       
         {userEmail && (
          <div className="user-info-box">
            <div className="user-info-icon">👤</div>
            <div className="user-info-details">
              <div className="user-info-label">Booking as:</div>
              <div className="user-info-email">{userEmail}</div>
              <div className="user-info-note">✓ You are logged in with this email</div>
            </div>
          </div>
        )}
      
       

        <form onSubmit={handleSubmit}>
          {/* ===== PERSONAL DETAILS ===== */}
          <h3>👤 Personal Details</h3>
          
          <div className="form-group">
            <label>Full Name *</label>
            <input
              type="text"
              name="name"
              value={formData.name}
              onChange={handleChange}
              required
              placeholder="Enter your full name"
            />
          </div>

         

          <div className="form-group">
            <label>Phone Number *</label>
            <input
              type="tel"
              name="phone"
              value={formData.phone}
              onChange={handleChange}
              required
              placeholder="Enter your phone number"
            />
          </div>

          {/* ===== EVENT DETAILS ===== */}
          <h3>🎯 Event Details</h3>

          <div className="form-group">
            <label>Event Name *</label>
            <input
              type="text"
              name="eventName"
              value={formData.eventName}
              onChange={handleChange}
              required
              placeholder="e.g.,Dara 2026, Tech Conference 2024"
            />
          </div>

          <div className="form-group">
            <label>Event Type *</label>
            <select
              name="eventType"
              value={formData.eventType}
              onChange={handleChange}
              required
            >
             
              <option value="Party">🎉 Party</option>
              <option value="Corporate">🏢 Corporate</option>
              <option value="Concert">🎵 Concert</option>
              <option value="Sports">⚽ Sports</option>
              <option value="Other">📌 Other</option>
            </select>
          </div>

          <div className="form-row">
            <div className="form-group">
              <label>Event Date *</label>
              <input
                type="date"
                name="eventDate"
                value={formData.eventDate}
                onChange={handleChange}
                required
                min={new Date().toISOString().split('T')[0]}
              />
            </div>
            <div className="form-group">
              <label>Event Time *</label>
              <input
                type="time"
                name="eventTime"
                value={formData.eventTime}
                onChange={handleChange}
                required
              />
            </div>
          </div>

          <div className="form-group">
            <label>Event Location *</label>
            <input
              type="text"
              name="eventLocation"
              value={formData.eventLocation}
              onChange={handleChange}
              required
              placeholder="e.g., Hotel Galadari, Colombo"
            />
          </div>

          {/* ===== SERVICE SELECTION ===== */}
          <h3>📹 Select Service</h3>

          <div className="service-cards">
            <div 
              className={`service-card ${formData.serviceType.includes('Photographer') ? 'active' : ''}`}
              onClick={() => {
                setFormData(prev => ({
                  ...prev,
                  serviceType: prev.serviceType.includes('Photographer')
                    ? prev.serviceType.filter(s => s !== 'Photographer')
                    : [...prev.serviceType, 'Photographer']
                }));
              }}
            >
              <div className="service-icon">📸</div>
              <div className="service-name">Photographer</div>
            </div>
            
            <div 
              className={`service-card ${formData.serviceType.includes('Videographer') ? 'active' : ''}`}
              onClick={() => {
                setFormData(prev => ({
                  ...prev,
                  serviceType: prev.serviceType.includes('Videographer')
                    ? prev.serviceType.filter(s => s !== 'Videographer')
                    : [...prev.serviceType, 'Videographer']
                }));
              }}
            >
              <div className="service-icon">🎥</div>
              <div className="service-name">Videographer</div>
            </div>
            
            <div 
              className={`service-card ${formData.serviceType.includes('Broadcaster') ? 'active' : ''}`}
              onClick={() => {
                setFormData(prev => ({
                  ...prev,
                  serviceType: prev.serviceType.includes('Broadcaster')
                    ? prev.serviceType.filter(s => s !== 'Broadcaster')
                    : [...prev.serviceType, 'Broadcaster']
                }));
              }}
            >
              <div className="service-icon">📡</div>
              <div className="service-name">Broadcaster</div>
            </div>
            
            <div 
              className={`service-card ${formData.serviceType.includes('All') ? 'active' : ''}`}
              onClick={() => {
                setFormData(prev => ({
                  ...prev,
                  
                  serviceType: prev.serviceType.includes('All') ? [] : ['All']
                }));
              }}
            >
              <div className="service-icon">🌟</div>
              <div className="service-name">All Services</div>
            </div>
          </div>

          <div className="form-group">
            <label>Duration *</label>
            <select
              name="duration"
              value={formData.duration}
              onChange={handleChange}
              required
            >
              <option value="1 Hours">1 Hours</option>
              <option value="2 Hours">2 Hours</option>
              <option value="4 Hours">4 Hours</option>
              <option value="6 Hours">6 Hours</option>
              <option value="8 Hours">8 Hours</option>
              <option value="Full Day">Full Day</option>
            </select>
          </div>

          {/* ===== ADDITIONAL DETAILS ===== */}
          <h3>📝 Additional Details</h3>

          <div className="form-group">
            <label>Special Requirements</label>
            <textarea
              name="specialRequirements"
              value={formData.specialRequirements}
              onChange={handleChange}
              rows="3"
              placeholder="e.g., Drone coverage, Live streaming, Multiple cameras..."
            />
          </div>

          <div className="form-group">
            <label>Message</label>
            <textarea
              name="message"
              value={formData.message}
              onChange={handleChange}
              rows="3"
              placeholder="Any additional information about your event..."
            />
          </div>
          {message && (
          <div className={`message ${success ? 'success' : 'error'}`}>
            {message}
          </div>
        )}

          <button type="submit" disabled={loading} className="submit-btn">
            {loading ? '⏳ Submitting...' : '📅 Submit Booking Request'}
          </button>
        </form>
      </div>
    </div>
  );
}

export default Booking;