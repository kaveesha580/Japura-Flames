import { useState, useEffect } from 'react';
import styles from './Admin.module.css';
import { API_BASE } from '../config';

const API_URL = `${API_BASE}/api/projects`;
const BOOKING_API_URL = `${API_BASE}/api/bookings`;
const CREW_API_URL = `${API_BASE}/api/crew`;
const FACEBOOK_POSTS_API_URL = `${API_BASE}/api/facebook-posts`;

function Admin() {
  // ---------- Authentication State ----------
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [passwordInput, setPasswordInput] = useState('');
  const [authMessage, setAuthMessage] = useState('');
  
  // ---------- State Variables ----------
  const [projects, setProjects] = useState([]);
  const [bookings, setBookings] = useState([]);
  const [crew, setCrew] = useState([]);
  const [users, setUsers] = useState([]);
  const [facebookPosts, setFacebookPosts] = useState([]);
  const [loading, setLoading] = useState(false);
  const [editingId, setEditingId] = useState(null);
  const [message, setMessage] = useState('');
  const [activeTab, setActiveTab] = useState('projects');
  const [facebookPostUrl, setFacebookPostUrl] = useState('');
  
  // Cancel Popup States
  const [showCancelPopup, setShowCancelPopup] = useState(false);
  const [selectedBooking, setSelectedBooking] = useState(null);
  const [cancelMessage, setCancelMessage] = useState('');
  
  // Complete Popup States
  const [showCompletePopup, setShowCompletePopup] = useState(false);
  const [selectedCompleteBooking, setSelectedCompleteBooking] = useState(null);
  const [completeLink, setCompleteLink] = useState('');

  // Assign Crew Popup States
  const [showAssignCrewPopup, setShowAssignCrewPopup] = useState(false);
  const [selectedAssignBooking, setSelectedAssignBooking] = useState(null);
  const [selectedCrewIds, setSelectedCrewIds] = useState([]);
  const [paymentAccount, setPaymentAccount] = useState({ bankName: '', accountName: '', accountNumber: '', instructions: '' });
  const [selectedSlip, setSelectedSlip] = useState(null);
  const [showPricePopup, setShowPricePopup] = useState(false);
  const [selectedPriceBooking, setSelectedPriceBooking] = useState(null);
  const [priceInput, setPriceInput] = useState('');
  
  // Crew Form States
  const [showCrewForm, setShowCrewForm] = useState(false);
  const [crewFormData, setCrewFormData] = useState({
    name: '',
    unit: 'Photography',
    phone: '',
    email: '',
    role: 'Member',
    image: ''
  });
  const [editingCrewId, setEditingCrewId] = useState(null);
  
  // Form Data
  const [formData, setFormData] = useState({
    title: '',
    description: '',
    eventDate: '',
    eventLocation: '',
    githubLink: '',
    status: 'In Progress',
    image: ''
  });

  // ---------- Load Data ----------
  useEffect(() => {
    if (isAuthenticated) {
      fetchProjects();
      fetchBookings();
      fetchCrew();
      fetchUsers();
      fetchFacebookPosts();
    }
  }, [isAuthenticated]);

  // ---------- Fetch Users ----------
  const fetchUsers = async () => {
    setLoading(true);
    try {
      const res = await fetch(`${API_BASE}/api/auth/users`);
      const data = await res.json();
      if (Array.isArray(data)) {
        setUsers(data);
      } else if (data && data.users && Array.isArray(data.users)) {
        setUsers(data.users);
      } else {
        setUsers([]);
      }
    } catch (err) {
      console.error('Failed to load users:', err);
      setUsers([]);
    } finally {
      setLoading(false);
    }
  };

  const fetchFacebookPosts = async () => {
    try {
      const response = await fetch(FACEBOOK_POSTS_API_URL);
      const data = await response.json();
      setFacebookPosts(Array.isArray(data) ? data : []);
    } catch (error) {
      console.error('Failed to load Facebook posts:', error);
      setFacebookPosts([]);
    }
  };

  const handleFacebookPostSubmit = async (event) => {
    event.preventDefault();
    setLoading(true);
    setMessage('');
    try {
      const response = await fetch(FACEBOOK_POSTS_API_URL, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ url: facebookPostUrl })
      });
      const data = await response.json();
      if (!response.ok) throw new Error(data.message || 'Failed to add Facebook post');
      setFacebookPostUrl('');
      setMessage('✅ Facebook post added successfully!');
      fetchFacebookPosts();
    } catch (error) {
      setMessage(`❌ ${error.message}`);
    } finally {
      setLoading(false);
    }
  };

  const handleFacebookPostDelete = async (id) => {
    if (!window.confirm('Delete this Facebook post?')) return;
    try {
      const response = await fetch(`${FACEBOOK_POSTS_API_URL}/${id}`, { method: 'DELETE' });
      if (!response.ok) throw new Error('Failed to delete Facebook post');
      setMessage('✅ Facebook post deleted successfully!');
      fetchFacebookPosts();
    } catch (error) {
      setMessage(`❌ ${error.message}`);
    }
  };

  // ---------- Fetch Projects ----------
  const fetchProjects = async () => {
    setLoading(true);
    try {
      const response = await fetch(API_URL);
      const data = await response.json();
      
      if (Array.isArray(data)) {
        setProjects(data);
      } else if (data && typeof data === 'object') {
        if (data.data && Array.isArray(data.data)) {
          setProjects(data.data);
        } else if (data.projects && Array.isArray(data.projects)) {
          setProjects(data.projects);
        } else {
          setProjects([]);
        }
      } else {
        setProjects([]);
      }
    } catch (error) {
      console.error('Failed to load projects:', error);
      setMessage('❌ Failed to load projects');
      setProjects([]);
    } finally {
      setLoading(false);
    }
  };

  // ---------- Fetch Bookings ----------
  const fetchBookings = async () => {
    setLoading(true);
    try {
      const response = await fetch(BOOKING_API_URL);
      const data = await response.json();
      
      if (Array.isArray(data)) {
        setBookings(data);
      } else if (data && typeof data === 'object') {
        if (data.data && Array.isArray(data.data)) {
          setBookings(data.data);
        } else if (data.bookings && Array.isArray(data.bookings)) {
          setBookings(data.bookings);
        } else {
          setBookings([]);
        }
      } else {
        setBookings([]);
      }
    } catch (error) {
      console.error('Failed to load bookings:', error);
      setBookings([]);
    } finally {
      setLoading(false);
    }
  };

  // ---------- Fetch Crew ----------
  const fetchCrew = async () => {
    setLoading(true);
    try {
      const response = await fetch(CREW_API_URL);
      const data = await response.json();
      
      if (Array.isArray(data)) {
        setCrew(data);
      } else {
        setCrew([]);
      }
    } catch (error) {
      console.error('Failed to load crew:', error);
      setCrew([]);
    } finally {
      setLoading(false);
    }
  };

  // ---------- Crew Image Upload ----------
  const handleCrewImageUpload = (e) => {
    const file = e.target.files[0];
    if (file) {
      const MAX_SIZE = 5 * 1024 * 1024;
      if (file.size > MAX_SIZE) {
        setMessage('❌ Image size must be less than 5MB');
        return;
      }
      if (!file.type.startsWith('image/')) {
        setMessage('❌ Please select an image file');
        return;
      }
      const reader = new FileReader();
      reader.onloadend = () => {
        setCrewFormData({...crewFormData, image: reader.result});
        setMessage('✅ Image uploaded successfully!');
      };
      reader.onerror = () => {
        setMessage('❌ Failed to read image file');
      };
      reader.readAsDataURL(file);
    }
  };

  // ---------- Remove Crew Image ----------
  const removeCrewImage = () => {
    setCrewFormData({...crewFormData, image: ''});
  };

  // ---------- Add/Update Crew ----------
  const handleCrewSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setMessage('');

    try {
      if (editingCrewId) {
        const response = await fetch(`${CREW_API_URL}/${editingCrewId}`, {
          method: 'PUT',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(crewFormData)
        });
        
        if (response.ok) {
          setMessage('✅ Crew member updated successfully!');
        } else {
          const error = await response.json();
          setMessage(`❌ ${error.message || 'Failed to update'}`);
        }
      } else {
        const response = await fetch(CREW_API_URL, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(crewFormData)
        });
        
        if (response.ok) {
          setMessage('✅ Crew member added successfully!');
        } else {
          const error = await response.json();
          setMessage(`❌ ${error.message || 'Failed to add'}`);
        }
      }
      
      resetCrewForm();
      fetchCrew();
    } catch (error) {
      console.error('Error saving crew:', error);
      setMessage('❌ Failed to save crew member');
    } finally {
      setLoading(false);
    }
  };

  // ---------- Edit Crew ----------
  const handleEditCrew = (member) => {
    setEditingCrewId(member._id);
    setCrewFormData({
      name: member.name,
      unit: member.unit,
      phone: member.phone,
      email: member.email,
      role: member.role || 'Member',
      image: member.image || ''
    });
    setShowCrewForm(true);
  };

  // ---------- Delete Crew ----------
  const handleDeleteCrew = async (id) => {
    if (!window.confirm('Are you sure you want to delete this crew member?')) return;
    
    setLoading(true);
    try {
      const response = await fetch(`${CREW_API_URL}/${id}`, {
        method: 'DELETE'
      });
      
      if (response.ok) {
        setMessage('🗑️ Crew member deleted successfully!');
        fetchCrew();
      } else {
        setMessage('❌ Failed to delete crew member');
      }
    } catch (error) {
      console.error('Error deleting crew:', error);
      setMessage('❌ Failed to delete crew member');
    } finally {
      setLoading(false);
    }
  };

  // ---------- Reset Crew Form ----------
  const resetCrewForm = () => {
    setCrewFormData({
      name: '',
      unit: 'Photography',
      phone: '',
      email: '',
      role: 'Member',
      image: ''
    });
    setEditingCrewId(null);
    setShowCrewForm(false);
  };

  // ---------- Update Booking Status ----------
  const updateBookingStatus = async (id, status) => {
    setLoading(true);
    try {
      await fetch(`${BOOKING_API_URL}/${id}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ status })
      });
      setMessage(`✅ Booking ${status.toLowerCase()} successfully!`);
      fetchBookings();
    } catch (error) {
      setMessage('❌ Failed to update booking status');
    } finally {
      setLoading(false);
    }
  };

  const openPricePopup = (booking) => {
    setSelectedPriceBooking(booking);
    setPriceInput(String(booking.estimatedPrice || ''));
    setPaymentAccount({
      bankName: booking.paymentAccount?.bankName || '',
      accountName: booking.paymentAccount?.accountName || '',
      accountNumber: booking.paymentAccount?.accountNumber || '',
      instructions: booking.paymentAccount?.instructions || ''
    });
    setShowPricePopup(true);
  };

  const closePricePopup = () => {
    setShowPricePopup(false);
    setSelectedPriceBooking(null);
    setPriceInput('');
  };

  const sendPriceToUser = async () => {
    const price = Number(priceInput);
    if (!Number.isFinite(price) || price < 0) {
      alert('Please enter a valid price.');
      return;
    }
    if (!paymentAccount.bankName.trim() || !paymentAccount.accountName.trim() || !paymentAccount.accountNumber.trim()) {
      alert('Please enter the bank name, account name, and account number.');
      return;
    }

    setLoading(true);
    try {
      const response = await fetch(`${BOOKING_API_URL}/${selectedPriceBooking._id}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ estimatedPrice: price, status: 'Price Sent', paymentAccount })
      });
      const data = await response.json();
      if (!response.ok) throw new Error(data.message || 'Failed to send price');
      setMessage('✅ Price sent to the user successfully!');
      closePricePopup();
      fetchBookings();
    } catch (error) {
      setMessage(`❌ ${error.message}`);
    } finally {
      setLoading(false);
    }
  };

  // ---------- Assign Crew Popup ----------
  const openAssignCrewPopup = (booking) => {
    setSelectedAssignBooking(booking);
    setSelectedCrewIds(
      Array.isArray(booking.assignedCrew)
        ? booking.assignedCrew.map((member) => (member && member._id) || member)
        : []
    );
    setShowAssignCrewPopup(true);
  };

  const closeAssignCrewPopup = () => {
    setShowAssignCrewPopup(false);
    setSelectedAssignBooking(null);
    setSelectedCrewIds([]);
    setPaymentAccount({ bankName: '', accountName: '', accountNumber: '', instructions: '' });
  };

  const toggleCrewSelection = (crewId) => {
    setSelectedCrewIds((prev) =>
      prev.includes(crewId)
        ? prev.filter((id) => id !== crewId)
        : [...prev, crewId]
    );
  };

  const handleAssignCrew = async () => {
    if (selectedCrewIds.length === 0) {
      alert('Please select at least one crew member.');
      return;
    }

    const targetDate = selectedAssignBooking?.eventDate;
    if (targetDate) {
      const conflicts = [];

      bookings.forEach((b) => {
        if (!b || !b._id) return;
        if (b._id === selectedAssignBooking._id) return; 
        if (b.status === 'Cancelled' || b.status === 'cancelled') return; 
        const assignedIds = Array.isArray(b.assignedCrew)
          ? b.assignedCrew.map((m) => (m && (m._id || m)).toString())
          : [];

        if (b.eventDate === targetDate) {
          selectedCrewIds.forEach((cid) => {
            if (assignedIds.includes((cid || '').toString())) {
              const crewMember = crew.find((c) => (c._id || c).toString() === (cid || '').toString());
              conflicts.push({
                crewId: cid,
                crewName: crewMember ? crewMember.name : cid,
                bookingId: b._id,
                bookingName: b.eventName || b.name || 'Unnamed event',
                bookingDate: b.eventDate,
              });
            }
          });
        }
      });

      if (conflicts.length > 0) {
        const lines = conflicts.map((c) => `${c.crewName} → ${c.bookingName} (${c.bookingDate})`);
        const msg = `Cannot assign because these crew members are already assigned on ${targetDate}:\n- ${lines.join('\n- ')}`;
        alert(msg);
        return;
      }
    }

    setLoading(true);
    try {
      const response = await fetch(`${BOOKING_API_URL}/${selectedAssignBooking._id}/assign-crew`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ crewIds: selectedCrewIds })
      });

      const data = await response.json();
      if (response.ok) {
        setMessage(data.message || '✅ Crew assigned successfully!');
        closeAssignCrewPopup();
        fetchBookings();
      } else {
        setMessage(`❌ ${data.message || 'Failed to assign crew'}`);
      }
    } catch (error) {
      console.error('Error assigning crew:', error);
      setMessage('❌ Failed to assign crew');
    } finally {
      setLoading(false);
    }
  };

  // ---------- Cancel Popup ----------
  const openCancelPopup = (booking) => {
    setSelectedBooking(booking);
    setCancelMessage('');
    setShowCancelPopup(true);
  };

  const closeCancelPopup = () => {
    setShowCancelPopup(false);
    setSelectedBooking(null);
    setCancelMessage('');
  };

  const handleCancelWithMessage = async () => {
    if (!cancelMessage.trim()) {
      alert('Please enter a reason for cancellation');
      return;
    }

    setLoading(true);
    try {
      const response = await fetch(
        `${BOOKING_API_URL}/${selectedBooking._id}/cancel`,
        {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ cancelMessage: cancelMessage })
        }
      );

      if (response.ok) {
        setMessage('✅ Booking cancelled successfully!');
        closeCancelPopup();
        fetchBookings();
      } else {
        const error = await response.json();
        setMessage(`❌ ${error.message || 'Failed to cancel'}`);
      }
    } catch (error) {
      console.error('Error cancelling booking:', error);
      setMessage('❌ Error cancelling booking');
    } finally {
      setLoading(false);
    }
  };

  // ---------- Complete Popup ----------
  const openCompletePopup = (booking) => {
    setSelectedCompleteBooking(booking);
    setCompleteLink('');
    setShowCompletePopup(true);
  };

  const closeCompletePopup = () => {
    setShowCompletePopup(false);
    setSelectedCompleteBooking(null);
    setCompleteLink('');
  };

  const handleCompleteWithLink = async () => {
    if (!completeLink.trim()) {
      alert('Please enter a link (URL) for the completed work');
      return;
    }

    try {
      new URL(completeLink);
    } catch {
      alert('Please enter a valid URL');
      return;
    }

    setLoading(true);
    try {
      const response = await fetch(`${BOOKING_API_URL}/${selectedCompleteBooking._id}/complete`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ link: completeLink })
      });

      if (response.ok) {
        setMessage('✅ Booking completed successfully!');
        closeCompletePopup();
        fetchBookings();
      } else {
        const error = await response.json();
        setMessage(`❌ ${error.message || 'Failed to complete'}`);
      }
    } catch (error) {
      console.error('Error completing booking:', error);
      setMessage('❌ Error completing booking');
    } finally {
      setLoading(false);
    }
  };

  // ---------- Delete Booking ----------
  const handleDeleteBooking = async (id) => {
    if (!id) {
      setMessage('❌ Invalid booking ID');
      return;
    }
    
    if (!window.confirm('Are you sure you want to permanently delete this booking?')) return;
    
    setLoading(true);
    try {
      const response = await fetch(`${BOOKING_API_URL}/${id}`, {
        method: 'DELETE',
        headers: {
          'Content-Type': 'application/json'
        }
      });
      
      const data = await response.json();
      
      if (response.ok) {
        setMessage('🗑️ Booking deleted successfully!');
        fetchBookings();
      } else {
        setMessage(`❌ Failed to delete: ${data.message || 'Unknown error'}`);
      }
    } catch (error) {
      console.error('Error deleting booking:', error);
      setMessage('❌ Failed to delete booking');
    } finally {
      setLoading(false);
    }
  };

  // ---------- Password Verification ----------
  const handleLogin = async (e) => {
    e.preventDefault();
    try {
      const res = await fetch(`${API_BASE}/api/auth/admin-login`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ password: passwordInput }),
      });
      const data = await res.json();
      if (data.success) {
        setIsAuthenticated(true);
        setAuthMessage('');
        setPasswordInput('');
      } else {
        setAuthMessage(data.message || 'Incorrect password!');
        setPasswordInput('');
      }
    } catch {
      setAuthMessage('Failed to connect to server');
      setPasswordInput('');
    }
  };

  // ---------- Logout ----------
  const handleLogout = () => {
    setIsAuthenticated(false);
    setPasswordInput('');
  };

  // ---------- Project Image Upload ----------
  const handleImageUpload = (e) => {
    const file = e.target.files[0];
    if (file) {
      const MAX_SIZE = 5 * 1024 * 1024;
      if (file.size > MAX_SIZE) {
        setMessage('❌ Image size must be less than 5MB');
        return;
      }
      if (!file.type.startsWith('image/')) {
        setMessage('❌ Please select an image file');
        return;
      }
      const reader = new FileReader();
      reader.onloadend = () => {
        setFormData({...formData, image: reader.result});
        setMessage('');
      };
      reader.onerror = () => {
        setMessage('❌ Failed to read image file');
      };
      reader.readAsDataURL(file);
    }
  };

  // ---------- Add/Update Project ----------
  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setMessage('');

    const projectData = { ...formData };

    try {
      if (editingId) {
        await fetch(`${API_URL}/${editingId}`, {
          method: 'PUT',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(projectData)
        });
        setMessage('✅ Project updated!');
      } else {
        await fetch(API_URL, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(projectData)
        });
        setMessage('✅ Project added!');
      }

      resetForm();
      fetchProjects();
    } catch (error) {
      setMessage('❌ Failed to save project');
    } finally {
      setLoading(false);
    }
  };

  // ---------- Edit Project ----------
  const handleEdit = (project) => {
    setEditingId(project._id);
    setFormData({
      title: project.title,
      description: project.description,
      eventDate: project.eventDate || '',
      eventLocation: project.eventLocation || '',
      githubLink: project.githubLink || '',
      status: project.status,
      image: project.image || ''
    });
  };

  // ---------- Delete Project ----------
  const handleDelete = async (id) => {
    if (!window.confirm('Are you sure you want to delete this project?')) return;
    
    setLoading(true);
    try {
      await fetch(`${API_URL}/${id}`, { method: 'DELETE' });
      setMessage('🗑️ Project deleted!');
      fetchProjects();
    } catch (error) {
      setMessage('❌ Failed to delete');
    } finally {
      setLoading(false);
    }
  };

  // ---------- Reset Form ----------
  const resetForm = () => {
    setFormData({
      title: '',
      description: '',
      eventDate: '',
      eventLocation: '',
      githubLink: '',
      status: 'In Progress',
      image: ''
    });
    setEditingId(null);
  };

  // ---------- Get Status Color ----------
  const getStatusColor = (status) => {
    switch(status) {
      case 'Pending': return '#ed8936';
      case 'Confirmed': return '#48bb78';
      case 'In Progress': return '#4299e1';
      case 'Completed': return '#38a169';
      case 'Cancelled': return '#fc8181';
      default: return '#a0aec0';
    }
  };

  // ---------- Get Unit Icon ----------
  const getUnitIcon = (unit) => {
    const icons = {
      'Photography': '📸',
      'Videography': '🎥',
      'Broadcasting': '📡',
      'Graphic Design': '🎨',
      'Article Writing': '✍️',
      'Poetry': '📝',
      'IT & Marketing': '💻',
      'HR': '👨‍💼'
    };
    return icons[unit] || '👤';
  };

  // ---------- Render ----------
  if (!isAuthenticated) {
    return (
      <div className={styles.adminContainer}>
        <div className={styles.loginForm}>
          <h1>🔐 Admin Login</h1>
          <form onSubmit={handleLogin}>
            <div className={styles.formGroup}>
              <label>Password *</label>
              <input
                type="password"
                value={passwordInput}
                onChange={(e) => setPasswordInput(e.target.value)}
                placeholder="Enter admin password"
                required
              />
            </div>
            {authMessage && <div className={styles.message}>{authMessage}</div>}
            <button type="submit" className={styles.loginBtn}>Login</button>
          </form>
        </div>
      </div>
    );
  }

  return (
    <div className={styles.adminContainer}>
      <div className={styles.adminHeader}>
        <h1>📊 Admin Dashboard</h1>
        <button onClick={handleLogout} className={styles.logoutBtn}>🚪 Logout</button>
      </div>

      {message && <div className={styles.message}>{message}</div>}

      <div className={styles.adminTabs}>
        <button 
          className={`${styles.tabBtn} ${activeTab === 'projects' ? styles.active : ''}`}
          onClick={() => setActiveTab('projects')}
        >
          📁 Projects ({projects.length})
        </button>
        <button 
          className={`${styles.tabBtn} ${activeTab === 'bookings' ? styles.active : ''}`}
          onClick={() => setActiveTab('bookings')}
        >
          📅 Bookings ({bookings.length})
        </button>
        <button 
          className={`${styles.tabBtn} ${activeTab === 'crew' ? styles.active : ''}`}
          onClick={() => setActiveTab('crew')}
        >
          👥 Crew ({crew.length})
        </button>
        <button 
          className={`${styles.tabBtn} ${activeTab === 'users' ? styles.active : ''}`}
          onClick={() => setActiveTab('users')}
        >
          🧑‍💻 Users ({users.length})
        </button>
        <button 
          className={`${styles.tabBtn} ${activeTab === 'facebook' ? styles.active : ''}`}
          onClick={() => setActiveTab('facebook')}
        >
          📘 Facebook Posts ({facebookPosts.length})
        </button>
      </div>

      {/* ===== PROJECTS TAB ===== */}
      {activeTab === 'projects' && (
        <>
          <div className={styles.adminForm}>
            <h2>{editingId ? '✏️ Edit Project' : '➕ Add New Project'}</h2>
            <form onSubmit={handleSubmit}>
              <div className={styles.formGroup}>
                <label>Title *</label>
                <input
                  type="text"
                  value={formData.title}
                  onChange={(e) => setFormData({...formData, title: e.target.value})}
                  required
                />
              </div>
              <div className={styles.formGroup}>
                <label>Description *</label>
                <textarea
                  value={formData.description}
                  onChange={(e) => setFormData({...formData, description: e.target.value})}
                  required
                  rows="4"
                />
              </div>
              <div className={styles.formGroup}>
                <label>Event Date</label>
                <input
                  type="text"
                  value={formData.eventDate}
                  onChange={(e) => setFormData({...formData, eventDate: e.target.value})}
                  placeholder="2026-09-15"
                />
              </div>
              <div className={styles.formGroup}>
                <label>Event Location</label>
                <input
                  type="text"
                  value={formData.eventLocation}
                  onChange={(e) => setFormData({...formData, eventLocation: e.target.value})}
                  placeholder="Colombo Stadium"
                />
              </div>
              <div className={styles.formGroup}>
                <label>Image</label>
                <input type="file" accept="image/*" onChange={handleImageUpload} />
                {formData.image && (
                  <div className={styles.imagePreview}>
                    <img src={formData.image} alt="Preview" />
                  </div>
                )}
              </div>
              <div className={styles.formGroup}>
                <label>Facebook Link</label>
                <input
                  type="url"
                  value={formData.githubLink}
                  onChange={(e) => setFormData({...formData, githubLink: e.target.value})}
                  placeholder="https://www.facebook.com/YourPage"
                />
              </div>
              <div className={styles.formGroup}>
                <label>Status</label>
                <select
                  value={formData.status}
                  onChange={(e) => setFormData({...formData, status: e.target.value})}
                >
                  <option value="In Progress">🔄 In Progress</option>
                  <option value="Completed">✅ Completed</option>
                  <option value="Planned">📝 Planned</option>
                </select>
              </div>
              <div className={styles.formActions}>
                <button type="submit" disabled={loading} className={styles.submitBtn}>
                  {loading ? 'Saving...' : (editingId ? 'Update' : 'Add')}
                </button>
                {editingId && (
                  <button type="button" onClick={resetForm} className={styles.cancelBtn}>
                    Cancel
                  </button>
                )}
              </div>
            </form>
          </div>

          <div className={styles.projectsList}>
            <h2>📁 All Projects</h2>
            {projects.length === 0 ? (
              <p>No projects yet</p>
            ) : (
              <table className={styles.adminTable}>
                <thead>
                  <tr>
                    <th>#</th>
                    <th>Title</th>
                    <th>Event Date</th>
                    <th>Location</th>
                    <th>Status</th>
                    <th>Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {projects.map((project, index) => (
                    <tr key={project._id}>
                      <td>{index + 1}</td>
                      <td>{project.title}</td>
                      <td>{project.eventDate || 'TBD'}</td>
                      <td>{project.eventLocation || 'TBD'}</td>
                      <td>{project.status}</td>
                      <td>
                        <button 
                          className={`${styles.actionBtn} ${styles.edit}`}
                          onClick={() => handleEdit(project)}
                        >
                          ✏️ Edit
                        </button>
                        <button 
                          className={`${styles.actionBtn} ${styles.delete}`}
                          onClick={() => handleDelete(project._id)}
                        >
                          🗑️ Delete
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            )}
          </div>
        </>
      )}

      {/* ===== BOOKINGS TAB ===== */}
      {activeTab === 'facebook' && (
        <div className={styles.projectsList}>
          <h2>📘 Add Facebook Post</h2>
          <form onSubmit={handleFacebookPostSubmit}>
            <div className={styles.formGroup}>
              <label>Facebook post URL *</label>
              <input
                type="url"
                value={facebookPostUrl}
                onChange={(event) => setFacebookPostUrl(event.target.value)}
                placeholder="https://www.facebook.com/Page/posts/..."
                required
              />
            </div>
            <button type="submit" disabled={loading} className={styles.submitBtn}>
              {loading ? 'Adding...' : '➕ Add Facebook Post'}
            </button>
          </form>
          <h2>All Facebook Posts</h2>
          {facebookPosts.length === 0 ? <p>No Facebook posts added yet.</p> : (
            <table className={styles.adminTable}>
              <thead><tr><th>URL</th><th>Actions</th></tr></thead>
              <tbody>
                {facebookPosts.map((post) => (
                  <tr key={post._id}>
                    <td>{post.url}</td>
                    <td>
                      <button className={`${styles.actionBtn} ${styles.delete}`} onClick={() => handleFacebookPostDelete(post._id)}>
                        🗑️ Delete
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          )}
        </div>
      )}

      {/* ===== BOOKINGS TAB ===== */}
      {activeTab === 'bookings' && (
        <div className={styles.bookingsList}>
          <h2>📅 Booking Requests</h2>
          {bookings.length === 0 ? (
            <p>No bookings yet</p>
          ) : (
            <div className={styles.bookingsGrid}>
              {bookings.map((booking) => (
                <div className={styles.bookingCard} key={booking._id}>
                  <div className={styles.bookingHeader}>
                    <div>
                      <h3>{booking.name}</h3>
                      <p>{booking.email}</p>
                    </div>
                    <span style={{ background: getStatusColor(booking.status), color: 'white', padding: '4px 12px', borderRadius: '20px' }}>
                      {booking.status}
                    </span>
                  </div>
                  <div className={styles.bookingDetails}>
                    <p><strong>Event:</strong> {booking.eventName}</p>
                    <p><strong>Date:</strong> {booking.eventDate}</p>
                    <p><strong>Time:</strong> {booking.eventTime}</p>
                    <p><strong>Duration:</strong> {booking.duration}</p>
                    <p><strong>Location:</strong> {booking.eventLocation}</p>
                    <p><strong>Service:</strong> {Array.isArray(booking.serviceType) ? booking.serviceType.join(', ') : booking.serviceType}</p>
                    <p><strong>Price:</strong> LKR {Number(booking.estimatedPrice || 0).toLocaleString()}</p>
                    {booking.specialRequirements && (
                      <p><strong>Additional Requirements:</strong> {booking.specialRequirements}</p>
                    )}
                    {booking.message && (
                      <p><strong>Customer Message:</strong> {booking.message}</p>
                    )}
                    <p><strong>Assigned Crew:</strong> {booking.assignedCrew && booking.assignedCrew.length > 0 ? booking.assignedCrew.map(c => `${c.name} (${c.phone})`).join(', ') : '—'}</p>
                    {booking.paymentSlip?.data && (
                      <div className={styles.paymentSlip}>
                        <strong>Payment slip:</strong> {booking.paymentSlip.fileName || 'Uploaded slip'}<br />
                        <button type="button" className={styles.viewSlipBtn} onClick={() => setSelectedSlip(booking.paymentSlip)}>
                          View uploaded slip
                        </button>
                      </div>
                    )}
                  </div>
                  <div className={styles.bookingActions}>
                    {booking.status === 'Pending' && (
                      <>
                        <button 
                          className={`${styles.actionBtn} ${styles.confirm}`} 
                          onClick={() => openPricePopup(booking)}
                        >
                          💰 Set & Send Price
                        </button>
                        <button 
                          className={`${styles.actionBtn} ${styles.cancel}`} 
                          onClick={() => openCancelPopup(booking)}
                        >
                          ❌ Cancel
                        </button>
                      </>
                    )}
                    {booking.status === 'Price Sent' && (
                      booking.paymentSlip?.data ? (
                        <button 
                          className={`${styles.actionBtn} ${styles.confirm}`} 
                          onClick={() => openAssignCrewPopup(booking)}
                        >
                          👥 Assign & Confirm
                        </button>
                      ) : (
                        <span className={styles.assignedCrewBadge}>⏳ Waiting for payment slip</span>
                      )
                    )}
                    {booking.status === 'Confirmed' && (
                      <>
                        <button 
                          className={`${styles.actionBtn} ${styles.complete}`} 
                          onClick={() => updateBookingStatus(booking._id, 'In Progress')}
                        >
                          🔄 Start
                        </button>
                        {booking.assignedCrew && booking.assignedCrew.length > 0 && (
                          <span className={styles.assignedCrewBadge}>
                            👥 {booking.assignedCrew.map(c => c.name).join(', ')}
                          </span>
                        )}
                      </>
                    )}
                    {booking.status === 'In Progress' && (
                      <button 
                        className={`${styles.actionBtn} ${styles.complete}`} 
                        onClick={() => openCompletePopup(booking)}
                      >
                        ✅ Complete
                      </button>
                    )}
                    <button 
                      className={`${styles.actionBtn} ${styles.delete}`} 
                      onClick={() => handleDeleteBooking(booking._id)}
                    >
                      🗑️ Delete
                    </button>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      )}

      {/* ===== CREW TAB ===== */}
      {activeTab === 'crew' && (
        <div className={styles.crewContainer}>
          <div className={styles.crewHeader}>
            <h2>👥 Crew Members ({crew.length})</h2>
            <button className={styles.addCrewBtn} onClick={() => setShowCrewForm(!showCrewForm)}>
              {showCrewForm ? '✖ Close' : '➕ Add Crew Member'}
            </button>
          </div>

          {showCrewForm && (
            <div className={styles.crewForm}>
              <h3>{editingCrewId ? '✏️ Edit Crew Member' : '➕ Add New Crew Member'}</h3>
              <form onSubmit={handleCrewSubmit}>
                <div className={styles.formRow}>
                  <div className={styles.formGroup}>
                    <label>Name *</label>
                    <input
                      type="text"
                      value={crewFormData.name}
                      onChange={(e) => setCrewFormData({...crewFormData, name: e.target.value})}
                      required
                      placeholder="Full name"
                    />
                  </div>
                  <div className={styles.formGroup}>
                    <label>Unit *</label>
                    <select
                      value={crewFormData.unit}
                      onChange={(e) => setCrewFormData({...crewFormData, unit: e.target.value})}
                      required
                    >
                      <option value="Photography">📸 Photography</option>
                      <option value="Videography">🎥 Videography</option>
                      <option value="Broadcasting">📡 Broadcasting</option>
                      <option value="Graphic Design">🎨 Graphic Design</option>
                      <option value="Article Writing">✍️ Article Writing</option>
                      <option value="Poetry">📝 Poetry</option>
                      <option value="IT & Marketing">💻 IT & Marketing</option>
                      <option value="HR">👨‍💼 HR</option>
                    </select>
                  </div>
                </div>

                <div className={styles.formRow}>
                  <div className={styles.formGroup}>
                    <label>Phone *</label>
                    <input
                      type="tel"
                      value={crewFormData.phone}
                      onChange={(e) => setCrewFormData({...crewFormData, phone: e.target.value})}
                      required
                      placeholder="+94 77 123 4567"
                    />
                  </div>
                </div>

                <div className={styles.formRow}>
                  <div className={styles.formGroup}>
                    <label>Role</label>
                    <select
                      value={crewFormData.role}
                      onChange={(e) => setCrewFormData({...crewFormData, role: e.target.value})}
                    >
                      <option value="Member">Member</option>
                      <option value="VP">VP</option>
                      <option value="Head">Head</option>
                      <option value="President">President</option>
                      <option value="Secretary">Secretary</option>
                      <option value="Treasurer">Treasurer</option>
                    </select>
                  </div>
                  <div className={styles.formGroup}>
                    <label>Profile Image</label>
                    <div className={styles.imageUploadWrapper}>
                      <input
                        type="file"
                        accept="image/*"
                        onChange={handleCrewImageUpload}
                        className={styles.imageUploadInput}
                        id="crewImageUpload"
                      />
                      <label htmlFor="crewImageUpload" className={styles.imageUploadLabel}>
                        {crewFormData.image ? '📷 Change Photo' : '📷 Upload Photo'}
                      </label>
                      {crewFormData.image && (
                        <button type="button" onClick={removeCrewImage} className={styles.removeImageBtn}>
                          ✕ Remove
                        </button>
                      )}
                    </div>
                    {crewFormData.image && (
                      <div className={styles.imagePreview}>
                        <img src={crewFormData.image} alt="Preview" />
                      </div>
                    )}
                    <small className={styles.helpText}>JPG, PNG, GIF - Max 5MB</small>
                  </div>
                </div>

                <div className={styles.formActions}>
                  <button type="submit" disabled={loading} className={styles.submitBtn}>
                    {loading ? 'Saving...' : (editingCrewId ? 'Update' : 'Add')}
                  </button>
                  <button type="button" onClick={resetCrewForm} className={styles.cancelBtn}>
                    Cancel
                  </button>
                </div>
              </form>
            </div>
          )}

          <div className={styles.crewGrid}>
            {crew.map((member) => (
              <div className={styles.crewCard} key={member._id}>
                <div className={styles.crewCardHeader}>
                  <div className={styles.crewAvatar}>
                    {member.image ? (
                      <img src={member.image} alt={member.name} />
                    ) : (
                      <span className={styles.crewAvatarText}>
                        {member.name.charAt(0).toUpperCase()}
                      </span>
                    )}
                  </div>
                  <div className={styles.crewInfo}>
                    <h3>{member.name}</h3>
                    <span className={styles.crewRole}>{member.role}</span>
                  </div>
                </div>
                <div className={styles.crewCardBody}>
                  <p>{getUnitIcon(member.unit)} {member.unit}</p>
                  <p>📱 {member.phone}</p>
                  
                </div>
                <div className={styles.crewCardActions}>
                  <button className={styles.edit} onClick={() => handleEditCrew(member)}>✏️ Edit</button>
                  <button className={styles.delete} onClick={() => handleDeleteCrew(member._id)}>🗑️ Delete</button>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* ===== USERS TAB ===== */}
      {activeTab === 'users' && (
        <div className={styles.usersList}>
          <h2>🧑‍💻 Registered Users</h2>
          {users.length === 0 ? (
            <p>No users found</p>
          ) : (
            <table className={styles.adminTable}>
              <thead>
                <tr>
                  <th>#</th>
                  <th>Name</th>
                  <th>Email</th>
                  <th>Phone</th>
                  <th>Type</th>
                </tr>
              </thead>
              <tbody>
                {users.map((u, idx) => (
                  <tr key={u._id || u.id || idx}>
                    <td>{idx + 1}</td>
                    <td>{u.fullName || u.name || '—'}</td>
                    <td>{u.email || '—'}</td>
                    <td>{u.phone || '—'}</td>
                    <td>{u.accountType || 'personal'}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          )}
        </div>
      )}

      {/* ===== CANCEL POPUP ===== */}
      {showCancelPopup && selectedBooking && (
        <div className={styles.modalOverlay}>
          <div className={styles.modalContent}>
            <div className={styles.modalHeader}>
              <h2>❌ Cancel Booking</h2>
              <button className={styles.modalClose} onClick={closeCancelPopup}>✕</button>
            </div>
            <div className={styles.modalBody}>
              <p><strong>Event:</strong> {selectedBooking.eventName}</p>
              <p><strong>User:</strong> {selectedBooking.name}</p>
              <textarea
                value={cancelMessage}
                onChange={(e) => setCancelMessage(e.target.value)}
                placeholder="Reason for cancellation..."
                rows="4"
              />
            </div>
            <div className={styles.modalFooter}>
              <button onClick={handleCancelWithMessage} className={styles.confirmCancelBtn}>Confirm Cancel</button>
              <button onClick={closeCancelPopup} className={styles.modalCancelBtn}>Close</button>
            </div>
          </div>
        </div>
      )}

      {/* ===== COMPLETE POPUP ===== */}
      {showCompletePopup && selectedCompleteBooking && (
        <div className={styles.modalOverlay}>
          <div className={styles.modalContent}>
            <div className={styles.modalHeader}>
              <h2>✅ Complete Booking</h2>
              <button className={styles.modalClose} onClick={closeCompletePopup}>✕</button>
            </div>
            <div className={styles.modalBody}>
              <p><strong>Event:</strong> {selectedCompleteBooking.eventName}</p>
              <p><strong>User:</strong> {selectedCompleteBooking.name}</p>
              <input
                type="url" 
                className={styles.completeLinkInput}
                value={completeLink}
                onChange={(e) => setCompleteLink(e.target.value)}
                placeholder="https://example.com/completed-work"
              /><br/>
              <small>Enter the URL where the completed work can be viewed</small>
            </div>
            <div className={styles.modalFooter}>
              <button onClick={handleCompleteWithLink} className={styles.confirmCompleteBtn}>Complete</button>
              <button onClick={closeCompletePopup} className={styles.modalCancelBtn}>Close</button>
            </div>
          </div>
        </div>
      )}

      {showPricePopup && selectedPriceBooking && (
        <div className={styles.modalOverlay}>
          <div className={styles.modalContent}>
            <div className={styles.modalHeader}>
              <h2>💰 Send Event Price</h2>
              <button className={styles.modalClose} onClick={closePricePopup}>✕</button>
            </div>
            <div className={styles.modalBody}>
              <div className={styles.modalInfo}>
                <p><strong>Event:</strong> {selectedPriceBooking.eventName}</p>
                <p><strong>Duration:</strong> {selectedPriceBooking.duration}</p>
                <p><strong>User:</strong> {selectedPriceBooking.email}</p>
              </div>
              <div className={styles.assignCrewSection}>
                <h4>Final price</h4>
                <input
                  type="number"
                  min="0"
                  value={priceInput}
                  onChange={(e) => setPriceInput(e.target.value)}
                  placeholder="Enter price in LKR"
                />
                <p className={styles.assignNote}>The user will see this price before crew is assigned.</p>
              </div>
              <div className={styles.assignCrewSection}>
                <h4>Bank details</h4>
                <p className={styles.assignNote}>These details will be sent to the user with the price.</p>
                <input value={paymentAccount.bankName} onChange={(e) => setPaymentAccount({ ...paymentAccount, bankName: e.target.value })} placeholder="Bank name" />
                <input value={paymentAccount.accountName} onChange={(e) => setPaymentAccount({ ...paymentAccount, accountName: e.target.value })} placeholder="Account holder name" />
                <input value={paymentAccount.accountNumber} onChange={(e) => setPaymentAccount({ ...paymentAccount, accountNumber: e.target.value })} placeholder="Account number" />
                <textarea value={paymentAccount.instructions} onChange={(e) => setPaymentAccount({ ...paymentAccount, instructions: e.target.value })} placeholder="Payment instructions (optional)" rows="3" />
              </div>
            </div>
            <div className={styles.modalFooter}>
              <button onClick={sendPriceToUser} className={styles.confirmCompleteBtn} disabled={loading}>
                {loading ? 'Sending...' : '📨 Send Price'}
              </button>
              <button onClick={closePricePopup} className={styles.modalCancelBtn}>Cancel</button>
            </div>
          </div>
        </div>
      )}

      {/* ===== ASSIGN CREW POPUP ===== */}
      {showAssignCrewPopup && selectedAssignBooking && (
        <div className={styles.modalOverlay}>
          <div className={styles.modalContent}>
            <div className={styles.modalHeader}>
              <h2>👥 Assign Crew Members</h2>
              <button className={styles.modalClose} onClick={closeAssignCrewPopup}>✕</button>
            </div>
            <div className={styles.modalBody}>
              <div className={styles.modalInfo}>
                <p><strong>Event:</strong> {selectedAssignBooking.eventName}</p>
                <p><strong>Date:</strong> {selectedAssignBooking.eventDate}</p>
                <p><strong>Time:</strong> {selectedAssignBooking.eventTime}</p>
                <p><strong>Service:</strong> {Array.isArray(selectedAssignBooking.serviceType) ? selectedAssignBooking.serviceType.join(', ') : selectedAssignBooking.serviceType}</p>
              </div>

              <div className={styles.assignCrewSection}>
                <h4>Select Crew Members</h4>
                <p className={styles.assignNote}>
                  Select crew members for this event. They will be notified.
                </p>
                
                {crew.length === 0 ? (
                  <div className={styles.noCrewAvailable}>
                    <p>⚠️ No crew members available.</p>
                    <p className={styles.noCrewNote}>
                      Please add crew members first.
                    </p>
                  </div>
                ) : (
                  <div className={styles.crewCheckboxList}>
                    {crew.map((crewMember) => (
                      <label key={crewMember._id} className={styles.crewCheckboxItem}>
                        <input
                          type="checkbox"
                          checked={selectedCrewIds.includes(crewMember._id)}
                          onChange={() => toggleCrewSelection(crewMember._id)}
                        />
                        <span className={styles.crewCheckboxAvatar}>
                          {crewMember.image ? (
                            <img src={crewMember.image} alt={crewMember.name} />
                          ) : (
                            <span>{crewMember.name.charAt(0).toUpperCase()}</span>
                          )}
                        </span>
                        <span className={styles.crewCheckboxName}>{crewMember.name}</span>
                        <span className={styles.crewCheckboxUnit}>{crewMember.unit}</span>
                      </label>
                    ))}
                  </div>
                )}
              </div>
            </div>
            <div className={styles.modalFooter}>
              <button 
                onClick={handleAssignCrew} 
                className={styles.confirmCompleteBtn}
                disabled={loading || crew.length === 0}
              >
                {loading ? 'Assigning...' : '✅ Confirm & Assign'}
              </button>
              <button 
                onClick={closeAssignCrewPopup} 
                className={styles.modalCancelBtn}
              >
                Cancel
              </button>
            </div>
          </div>
        </div>
      )}
      {selectedSlip && (
        <div className={styles.modalOverlay} onClick={() => setSelectedSlip(null)}>
          <div className={styles.slipModal} onClick={(event) => event.stopPropagation()}>
            <div className={styles.modalHeader}>
              <h2>Payment Slip</h2>
              <button className={styles.modalClose} onClick={() => setSelectedSlip(null)}>×</button>
            </div>
            <img className={styles.slipPreview} src={selectedSlip.data} alt={selectedSlip.fileName || 'Payment slip'} />
          </div>
        </div>
      )}
    </div>
  );
}

export default Admin;
