import { useState, useEffect, useRef } from "react";
import './Home.css';
import { Swiper, SwiperSlide } from "swiper/react";
import { Autoplay, Navigation } from "swiper/modules";
import { useReveal } from "./Home.js";
import { useNavigate } from "react-router-dom";
import { API_BASE } from '../config';
import "swiper/css";
import "swiper/css/navigation";

// User icons
import { 
  FaYoutube, FaFacebookF, FaInstagram, FaTiktok, 
  FaWhatsapp, FaEnvelope, FaPhone, FaLocationDot,
  FaUser, FaRightFromBracket, FaClock, FaHourglassHalf
} from 'react-icons/fa6';
import { 
   FaCalendarAlt,
  FaCheckCircle,
  FaTimesCircle
} from 'react-icons/fa';

const API_URL = `${API_BASE}/api/projects`;
const BOOKING_API_URL = `${API_BASE}/api/bookings`;



const facebookPosts = [
  {
    url: "https://www.facebook.com/Jpuraflames/posts/pfbid0dP62V9BcBEEdTrPGbo6RqbYhZYxFi5ULnMXUEHESZw1kEiPdTrRjqUjxupapqP12l",
    height: 808,
  },
  {
    url: "https://www.facebook.com/Jpuraflames/posts/pfbid02VSL2xs4HxEb4M1Myxzw3dvbNjuYdiDi7ZFnzqseJMTpSBegQmngjZw9StAhfyWFhl",
    height: 808,
  },
  {
    url: "https://www.facebook.com/Jpuraflames/posts/pfbid032MZNcfofnBQAozjstAsUiVy5xa5vbuEQuUDaL1oGSJhZNJexC1HXMXUio4eh9Exjl",
    height: 808,
  },
  {
    url: "https://www.facebook.com/Jpuraflames/posts/pfbid0265FRgvfcuQ1Mm8zfifTqkWsY6sbvQ9oobr8qQbKLoVmMYy538ZWyzm6zfy94iGcBl",
    height: 808,
  },
  {
    url: "https://web.facebook.com/Jpuraflames/posts/pfbid0C6BG69DvA1dCozbXEKihP29SeGgT94LUb9BKdRWa9hoGBonpW7VUf9jAhSpaHFK3l",
    height: 808,
  },
  {
    url: "https://web.facebook.com/Jpuraflames/posts/pfbid031ADAXyYnGLM9CBxJX7UKMrp4a3T3mWiQ7pYmNoG5FSKsUXJD1ULCeXyZ3EWbA1e8l",
    height: 808,
  },
  {
    url: "https://web.facebook.com/Jpuraflames/posts/pfbid0ES2xs2UTD51jPMt2XMd8UM8UoCe1NiW9y27PVY5DHgGLdC4uQiJoagXzCz9HXuUel",
    height: 808,
  
  },
  {
    url: "https://web.facebook.com/media/set/?set=a.1621734422643686&type=3&ref=embed_post",
    height: 808,
  
  },
  {
    url: "https://web.facebook.com/media/set/?set=a.1628088238674971&type=3&ref=embed_post",
    height: 808,
  
  },
{
  url :"https://www.facebook.com/media/set?vanity=Jpuraflames&set=a.1641951533955308",
  height: 808,
}
];

const prideMembers = [
  {
    name: "Hasaru Nawarathna",
    role: "PRESIDENT",
    image: "/praide/1.jpg",
  
  },
  {
    name: "Hiruni Randeniya",
    role: "SECRETARY",
    image: "/praide/2.jpg",
    
  },
  { 
    name: "Nethmi Nimasha", 
    role: "ASSISTANT SECRETARY", 
    image: "/praide/3.jpg",
     
  },
  { 
    name: "Natara Shihanza", 
    role: "ASSISTANT SECRETARY", 
    image: "/praide/4.jpg",
  },
  { 
    name: "Methsara Dilshan", 
    role: "TREASURER", 
    image: "/praide/5.jpg",
  },
  { 
    name: "Manuka Methsara", 
    role: "VP PHOTOGRAPHY", 
    image: "/praide/6.jpg" 
  },
  { 
    name: "Kavindu Dhananjaya", 
    role: "VP PHOTOGRAPHY", 
    image: "/praide/7.jpg" 
  },
  { 
    name: "Isira Gajanayake", 
    role: "VP PHOTOGRAPHY", 
    image: "/praide/8.jpg" 
  },
  { 
    name: "Angana Pawansara", 
    role: "VP VIDEOGRAPHY", 
    image: "/praide/9.jpg" 
  },
  { 
    name: "Wasitha Sadesa", 
    role: "VP VIDEOGRAPHY", 
    image: "/praide/10.jpg" 
  },
  { 
    name: "Senitha vidusahan", 
    role: "VP BROADCASTING", 
    image: "/praide/11.jpg" 
  },
  { 
    name: "Apsara Medurangi", 
    role: "GRAPHIC DESIGNING", 
    image: "/praide/12.jpg" 
  },
  { 
    name: "REV.Wathuruwila Saddananda", 
    role: "GRAPHIC DESIGNING", 
    image: "/praide/13.jpg" 
  },
  { 
    name: "Oshan Lakshika", 
    role: "HUMAN RESOURCES", 
    image: "/praide/14.jpg" 
  },
  { 
    name: "Kemaya perera", 
    role: "HUMAN RESOURCES", 
    image: "/praide/15.jpg" 
  },
  { 
    name: "Kasun Kalhara", 
    role: "IT & MARKETING", 
    image: "/praide/16.jpg" 
  },
];

function Home() {
  const navigate = useNavigate();
  
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [userEmail, setUserEmail] = useState('');
  const [userName, setUserName] = useState('');
  const [showMySection, setShowMySection] = useState(false);
  const [bookingRequests, setBookingRequests] = useState([]);
  const [bookingLoading, setBookingLoading] = useState(false);
  const [slipUploadingId, setSlipUploadingId] = useState('');
  const [showProfileEdit, setShowProfileEdit] = useState(false);
  const [profileForm, setProfileForm] = useState({ fullName: '', phone: '' });
  const [profileMessage, setProfileMessage] = useState('');
  const [profileLoading, setProfileLoading] = useState(false);
  const mySectionRef = useRef(null);
  const projectorContainerRef = useRef(null);
const vtopRef = useRef(null);

  useEffect(() => {
    const token = localStorage.getItem('token');
    if (token) {
      setIsLoggedIn(true);
      const email = localStorage.getItem('userEmail') || 'User';
      const name = localStorage.getItem('userName') || email.split('@')[0];
      const phone = localStorage.getItem('userPhone') || '';
      setUserName(name);
      setUserEmail(email);
      setProfileForm({ fullName: name, phone });
    }
  }, []);

  // 🟢 MY section open වෙද්දි booking requests fetch කරන්න
  useEffect(() => {
    if (showMySection && isLoggedIn) {
      fetchBookingRequests();
    }
  }, [showMySection, isLoggedIn]);

  // 🟢 Booking requests fetch කරන function එක
  const fetchBookingRequests = async () => {
    setBookingLoading(true);
    try {
      const token = localStorage.getItem('token');
      const userEmail = localStorage.getItem('userEmail');
        
      const response = await fetch(`${BOOKING_API_URL}?email=${encodeURIComponent(userEmail)}`, {
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json'
        }
      });
      
      if (response.ok) {
        const data = await response.json();
        setBookingRequests(data);
      } else {
        console.error('Failed to fetch bookings');
        setBookingRequests([]);
      }
    } catch (error) {
      console.error('Error fetching bookings:', error);
      setBookingRequests([]);
    } finally {
      setBookingLoading(false);
    }
  };

  // ඔයාගේ තියෙන useEffect ටිකට පස්සේ මේ useEffect එක add කරන්න
useEffect(() => {
  const handleProjectorScroll = () => {
    const container = projectorContainerRef.current;
    const vtop = vtopRef.current;
    
    if (!container || !vtop) return;
    
    const rect = container.getBoundingClientRect();
    const containerTop = rect.top;
    const containerHeight = container.offsetHeight;
    const windowHeight = window.innerHeight;
    
    // container එක viewport එකේ තියෙනවද කියලා check කරන්න
    const isVisible = containerTop < windowHeight && containerTop + containerHeight > 0;
    
    if (isVisible) {
      // container එක viewport එකට ඇතුල් වෙන ප්‍රමාණය ගණනය කරන්න
      // scroll progress එක 0 සිට 1 දක්වා
      const scrollProgress = Math.max(0, Math.min(1, 
        (windowHeight - containerTop) / (windowHeight + containerHeight)
      ));
      
      // වමට යන distance එක (0% සිට -100% දක්වා)
      // මෙතන 100 වෙනුවට 80 දාලා අඩුවෙන් යන්නත් පුළුවන්
      const translateX = -scrollProgress *30;
      
      // smooth transition එකක් සඳහා
      vtop.style.transform = `translateX(${translateX}%)`;
    }
  };

  window.addEventListener('scroll', handleProjectorScroll);
  window.addEventListener('resize', handleProjectorScroll);
  
  // Initial call
  handleProjectorScroll();
  
  return () => {
    window.removeEventListener('scroll', handleProjectorScroll);
    window.removeEventListener('resize', handleProjectorScroll);
  };
}, []);
 
  const getStatusIcon = (status) => {
    switch(status?.toLowerCase()) {
      case 'confirmed':
        return <FaCheckCircle style={{ color: '#4CAF50' }} />;
      case 'pending':
        return <FaHourglassHalf style={{ color: '#FFA500' }} />;
      case 'cancelled':
        return <FaTimesCircle style={{ color: '#f44336' }} />;
      case 'completed':
        return <FaCheckCircle style={{ color: '#2196F3' }} />;
      default:
        return <FaClock style={{ color: '#FFA500' }} />;
    }
  };

  const uploadPaymentSlip = (bookingId, file) => {
    if (!file) return;
    if (!file.type.startsWith('image/')) return alert('Please select an image file.');
    if (file.size > 5 * 1024 * 1024) return alert('Slip image must be smaller than 5MB.');
    const reader = new FileReader();
    setSlipUploadingId(bookingId);
    reader.onload = async () => {
      try {
        const response = await fetch(`${BOOKING_API_URL}/${bookingId}/payment-slip`, {
          method: 'POST', headers: { 'Content-Type': 'application/json', 'Authorization': `Bearer ${localStorage.getItem('token')}` },
          body: JSON.stringify({ data: reader.result, fileName: file.name })
        });
        const data = await response.json();
        if (!response.ok) throw new Error(data.message);
        await fetchBookingRequests();
      } catch (error) { alert(error.message || 'Unable to upload the payment slip.'); }
      finally { setSlipUploadingId(''); }
    };
    reader.onerror = () => { setSlipUploadingId(''); alert('Unable to read the selected file.'); };
    reader.readAsDataURL(file);
  };

  const goToLogin = () => {
    navigate('/Login');
  };

  const handleLogout = () => {
    localStorage.removeItem('token');
    localStorage.removeItem('userEmail');
    localStorage.removeItem('userName');
    setIsLoggedIn(false);
    setUserEmail('');
    setUserName('');
    setShowMySection(false);
    alert('You have been logged out successfully!');
  };

  const handleBookingClick = (e) => {
    e.preventDefault();
    const token = localStorage.getItem('token');
    if (token) {
      navigate('/Booking');
    } else {
      navigate('/Login');
    }
  };

  const toggleProfileEdit = () => {
    setShowProfileEdit((prev) => !prev);
    setProfileMessage('');
  };

  const handleProfileChange = (e) => {
    const { name, value } = e.target;
    setProfileForm((prev) => ({ ...prev, [name]: value }));
  };

  const handleProfileSubmit = async (e) => {
    e.preventDefault();
    if (!profileForm.fullName.trim()) {
      setProfileMessage('Please enter your name.');
      return;
    }
    if (!profileForm.phone.trim()) {
      setProfileMessage('Please enter your phone number.');
      return;
    }

    setProfileLoading(true);
    setProfileMessage('');

    try {
      const token = localStorage.getItem('token');
      const response = await fetch(`${API_BASE}/api/auth/me`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({
          fullName: profileForm.fullName,
          phone: profileForm.phone,
        }),
      });

      const data = await response.json();
      if (response.ok && data.success) {
        setUserName(data.user.fullName);
        setUserEmail(data.user.email);
        localStorage.setItem('userName', data.user.fullName);
        localStorage.setItem('userPhone', data.user.phone || '');
        setProfileMessage('Profile updated successfully.');
        setShowProfileEdit(false);
      } else {
        setProfileMessage(data.message || 'Failed to update profile.');
      }
    } catch (error) {
      console.error('Error updating profile:', error);
      setProfileMessage('Server error while updating profile.');
    } finally {
      setProfileLoading(false);
    }
  };

  const heroRef = useReveal();
  const homeRef = useReveal();
  const servicesRef = useReveal();
  const aboutRef = useReveal();
  const prideRef = useReveal();
  const projectsRef = useReveal();
  const galleryRef = useReveal();
  const footerRef = useReveal();

  const [projects, setProjects] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    fetchProjects();
  }, []);

  const fetchProjects = async () => {
    setLoading(true);
    try {
      const response = await fetch(API_URL);
      const data = await response.json();
      
      if (Array.isArray(data)) {
        setProjects(data);
      } else if (data.data && Array.isArray(data.data)) {
        setProjects(data.data);
      } else {
        setProjects([]);
      }
    } catch (error) {
      console.error('Failed to load projects:', error);
      setError('Failed to load projects');
      setProjects([]);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div>
      <div className="backtop reveal-section" ref={heroRef}></div>
      
      {/* Header */}
      <header>
        <div className="header-container">
          
            <img src="/image/white-logo.png" alt="J'pura Flames Logo" className="logo-img"/>
         
          <nav>
            <ul className="nav-links">
              <li><a href="#home">Home</a></li>
              <li><a href="#about">About</a></li>
              <li><a href="#pride">Pride</a></li>
              <li><a href="#projects">Projects</a></li>
              <li><a href="#gallary">Gallery</a></li>
              <li><a href="#contact">Contact</a></li>
              {isLoggedIn && (
                <li>
                  <a 
                    href="#my" 
                    className={`my-tab-link ${showMySection ? 'active' : ''}`}
                    onClick={(e) => {
                      e.preventDefault();
                      if (isLoggedIn) {
                        setShowMySection(!showMySection);
                      if (!showMySection) {
                        setTimeout(() => {
                          document.getElementById('my')?.scrollIntoView({
                            behavior: 'auto',
                            block: 'start',
                          });
                        }, 150);
                      }
                      } else {
                        navigate('/Login');
                      }
                    }}
                  >
                    MY
                  </a>
                </li>
              )}
            </ul>
          </nav>
          
          {isLoggedIn ? (
            <div className="user-profile">
              <button className="user-profile-btn">
                <FaUser />
                <span className="user-email">
                  {userName.length > 15 ? userName.substring(0, 15) + '...' : userName}
                </span>
              </button>
              <button className="logout-nav-btn" onClick={handleLogout}>
                <FaRightFromBracket />
                Logout
              </button>
            </div>
          ) : (
            <button className="login-nav-btn" onClick={goToLogin}>
              <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <path d="M15 3h4a2 2 0 0 1 2 2v14a2 2 0 0 1-2 2h-4"/>
                <polyline points="10 17 15 12 10 7"/>
                <line x1="15" y1="12" x2="3" y2="12"/>
              </svg>
              Login
            </button>
          )}
        </div>
      </header>

      {/*MY SECTION */}
      {showMySection && isLoggedIn && (
        <section className="my-section" id="my" ref={mySectionRef}>
          <div className="my-section-header">
            <h2>
              <FaUser /> Welcome, {userName}
            </h2>
            <button className="close-my-section" onClick={() => setShowMySection(false)}>
              ✕
            </button>
          </div>

          <div className="my-dashboard">
            

            {/* Quick Actions */}
            <div className="my-quick-actions">
              <h3>Quick Actions</h3>
              <div className="my-actions-grid">
                <button className="my-action-btn" onClick={handleBookingClick}>
                  <FaCalendarAlt /> Book a Session
                </button>
               
                <button className="my-action-btn" onClick={toggleProfileEdit}>
                  <FaUser /> Edit Profile
                </button>
              </div>
            </div>
            {showProfileEdit && (
              <div className="profile-edit-card">
                <h3>Edit Profile</h3>
                <form onSubmit={handleProfileSubmit} className="profile-edit-form">
                  <div className="form-group">
                    <label>Name</label>
                    <input
                      type="text"
                      name="fullName"
                      value={profileForm.fullName}
                      onChange={handleProfileChange}
                      required
                    />
                  </div>
                  <div className="form-group">
                    <label>Phone</label>
                    <input
                      type="text"
                      name="phone"
                      value={profileForm.phone}
                      onChange={handleProfileChange}
                      required
                    />
                  </div>
                  <div className="form-group">
                    <label>Email</label>
                    <input type="email" value={userEmail} disabled />
                  </div>
                  <div className="profile-action-row">
                    <button type="submit" className="my-action-btn" disabled={profileLoading}>
                      {profileLoading ? 'Saving...' : 'Save Profile'}
                    </button>
                    <button type="button" className="my-action-btn" onClick={() => setShowProfileEdit(false)}>
                      Cancel
                    </button>
                  </div>
                  {profileMessage && <p className="profile-message">{profileMessage}</p>}
                </form>
              </div>
            )}

            {/* 🟢 Booking Requests with Cancel Message */}
           {/* 🟢 Booking Requests with Cancel Message & Complete Link */}
<div className="my-recent-activity">
  
  <h3>
    <FaCalendarAlt /> Booking Requests
    {bookingRequests.length > 0 && (
      <span className="booking-count">{bookingRequests.length}</span>
    )}
  </h3>
  
  {bookingLoading ? (
    <div className="booking-loading">
      <p>Loading bookings...</p>
    </div>
  ) : bookingRequests.length > 0 ? (
    <div className="my-activity-list">
      {bookingRequests.slice(0, 5).map((booking, index) => (
        <div className="my-activity-item" key={booking._id || index}>
          <span className="my-activity-dot"></span>
          <div className="booking-info">
            <div className="booking-header">
              <p className="booking-title">
                <strong>{booking.eventName || 'Event'}</strong>
              </p>
              <span className={`booking-status ${booking.status?.toLowerCase() || 'pending'}`}>
                {getStatusIcon(booking.status)}
                {booking.status || 'Pending'}
              </span>
            </div>
            <div className="booking-details">
              <small>
                <FaCalendarAlt /> {booking.eventDate || 'N/A'}
                {' • '}
                <FaClock /> {booking.eventTime || 'N/A'}
              </small>
              <br />
              <small className="booking-user">
                {booking.email || userEmail}
              </small>
            </div>
            
            {/* 🟢 CANCEL MESSAGE - Show when booking is cancelled */}
            {booking.status?.toLowerCase() === 'cancelled' && booking.cancelMessage && (
              <div className="cancel-message-box">
                <div className="cancel-message-header">
                  <span className="cancel-icon">🚫</span>
                  <span className="cancel-title">Booking Cancelled</span>
                </div>
                <p className="cancel-message-text">
                  <strong>Reason:</strong> {booking.cancelMessage}
                </p>
              </div>
            )}
            
            {/* 🟢🟢🟢 COMPLETE LINK - Show when booking is completed 🟢🟢🟢 */}
            {booking.status?.toLowerCase() === 'confirmed' && (
              <div className="payment-card">
                <strong>Payment Details</strong>
                {booking.paymentAccount?.bankName || booking.paymentAccount?.accountNumber ? (
                  <div className="payment-account-details">
                    <span>Bank: {booking.paymentAccount.bankName || '—'}</span>
                    <span>Account name: {booking.paymentAccount.accountName || '—'}</span>
                    <span>Account number: {booking.paymentAccount.accountNumber || '—'}</span>
                    {booking.paymentAccount.instructions && <span>{booking.paymentAccount.instructions}</span>}
                  </div>
                ) : <p>Please contact us for payment details.</p>}
                {booking.paymentSlip?.data ? (
                  <div className="slip-uploaded">Payment slip uploaded: {booking.paymentSlip.fileName}</div>
                ) : (
                  <label className="slip-upload-btn">
                    {slipUploadingId === booking._id ? 'Uploading slip...' : 'Upload payment slip'}
                    <input type="file" accept="image/*" disabled={slipUploadingId === booking._id} onChange={(e) => uploadPaymentSlip(booking._id, e.target.files[0])} />
                  </label>
                )}
              </div>
            )}

            {booking.status?.toLowerCase() === 'completed' && booking.completeLink && (
              <div className="complete-link-box">
                <div className="complete-link-header">
                  <span className="complete-icon">✅</span>
                  <span className="complete-title">Project Completed!</span>
                </div>
                <a 
                  href={booking.completeLink} 
                  target="_blank" 
                  rel="noopener noreferrer"
                  className="complete-link"
                >
                  🔗 View Completed Work
                </a>
              </div>
            )}
          </div>
        </div>
      ))}
      
      {bookingRequests.length > 5 && (
        <div className="my-activity-item view-all">
          <button 
            className="view-all-btn"
            onClick={() => navigate('/Bookings')}
          >
            View all {bookingRequests.length} bookings →
          </button>
        </div>
      )}
    
    
    
    </div>
  ) : (
    <div className="no-bookings">
      <p>No booking requests yet.</p>
      <button className="my-action-btn" onClick={handleBookingClick}>
        <FaCalendarAlt /> Make a Booking
      </button>
    </div>
  )}
</div>


    
        </div>
        </section>
      )}

      {/* ===== HOME SECTION ===== */}
      <div className="home reveal-section" id="home" ref={homeRef}>
        <div className="video-background">
          <video autoPlay muted loop playsInline>
            <source src="/videos/home1.mp4" type="video/mp4" />
          </video>
          <div className="video-overlay">
            <div className="logo">JAPURA FLAMES</div></div>
        </div>

        <div className="home-content">
          <div className="home-text">
            <span className="line1">
              — Official Media Unit — University of Sri Jayewardenepura —
            </span>
            <span className="line2">THE LENS BEHIND EVERY SPARK OF J'PURA</span>
            <p className="line3">
              Photography, videography, live broadcast, design and words — J'pura
              Flames turns campus matches, ceremonies and late
              <br /> nights into stories worth watching{" "}
            </p>
            <br />
            <div className="hero-actions">
              <a href="#gallary" className="viewGalleryBtn">
                View Gallery
              </a>
              <a 
                href="" 
                className="bookingBtn"
                onClick={handleBookingClick}
              >
                Booking
              </a>
            </div>
          </div>
        </div>
      </div>

      

    <div className="projector-container" ref={projectorContainerRef}>
  <div className="vtop" ref={vtopRef}></div>
  <video autoPlay muted loop playsInline>
    <source src="/videos/home2.mp4" type="video/webm" />
  </video>
  
</div>
  

      {/* Contact Section */}
      <section id="contact">
        <div className="contact-info-item">
          <div className="icon"><FaEnvelope /></div>
          <div className="details">
            <div className="label">Email</div>
            <a href="mailto:info@jpuraflames.lk" className="value">info@jpuraflames.lk</a>
          </div>
        </div>
        <div className="contact-info-item">
          <div className="icon"><FaPhone /></div>
          <div className="details">
            <div className="label">Phone</div>
            <a href="tel:+94771234567" className="value">+94 77 123 4567</a>
          </div>
        </div>
        <div className="contact-info-item">
          <div className="icon"><FaWhatsapp /></div>
          <div className="details">
            <div className="label">WhatsApp</div>
            <a href="https://wa.me/94771234567" className="value" target="_blank" rel="noopener noreferrer">+94 77 123 4567</a>
          </div>
        </div>
        <div className="contact-info-item">
          <div className="icon"><FaLocationDot /></div>
          <div className="details">
            <div className="label">Location</div>
            <span className="value">University of Sri Jayewardenepura</span>
          </div>
        </div>
        <div className="social-icons">
          <a href="https://www.youtube.com/@JpuraFlames" className="social-icon youtube" target="_blank" rel="noopener noreferrer"><FaYoutube /> YouTube</a>
          <a href="https://www.facebook.com/Jpuraflames" className="social-icon facebook" target="_blank" rel="noopener noreferrer"><FaFacebookF /> Facebook</a>
          <a href="https://www.instagram.com/jpuraflames" className="social-icon instagram" target="_blank" rel="noopener noreferrer"><FaInstagram /> Instagram</a>
          <a href="https://www.tiktok.com/@jpuraflames" className="social-icon tiktok" target="_blank" rel="noopener noreferrer"><FaTiktok /> TikTok</a>
        </div>
      </section>

      {/* Footer */}
      <footer className="site-footer">
        <div className="footer-brand">
          <h2>J'PURA FLAMES</h2>
          <p>Official Media Unit of the University of Sri Jayewardenepura.</p>
        </div>
        <div className="footer-links">
          <a href="#home">Home</a>
          <a href="#about">About</a>
          <a href="#projects">Projects</a>
          <a href="#gallary">Gallery</a>
        </div>
        <p className="footer-copy">© 2026 J'Pura Flames. All rights reserved.</p>
      </footer>
    </div>
  );
}

export default Home;
