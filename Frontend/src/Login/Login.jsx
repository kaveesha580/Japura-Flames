//-----------------------------------
// * Basic login component skeleton
//-----------------------------------
import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import styles from './Login.module.css';
import myLogo from '../assets/logo.png';

const Login = () => {
  const navigate = useNavigate();
  // * Form state //
  const [formData, setFormData] = useState({ email: '', password: '' });
  const [showPassword, setShowPassword] = useState(false);
  const [isForgotView, setIsForgotView] = useState(false);
  const [resetData, setResetData] = useState({ 
    email: '', 
    oldPassword: '', 
    newPassword: '', 
    confirmPassword: '' 
  });


  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const [loading, setLoading] = useState(false);

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };
  const handleForgotPhoneChange = (e) => {
    setForgotPhoneData({ ...forgotPhoneData, [e.target.name]: e.target.value });
  };
   // * Password toggle state //
   const togglePasswordVisibility = () => {
    setShowPassword(!showPassword);
  };

//* Handle Login   //
  const handleLoginSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setSuccess('');
    setLoading(true);
    
    // *Frontend Validation  //
    if (!formData.email) {
      setError('Please enter your email address');
      setLoading(false);
      return;
    }
    
    if (!formData.password) {
      setError('Please enter your password');
      setLoading(false);
      return;
    }
    
    try {
      const res = await axios.post('http://localhost:5000/api/auth/login', {
        email: formData.email,
        password: formData.password
      });

      console.log('Login Response:', res.data);
      
      if (res.data.success) {
        setSuccess(res.data.message || 'Login Successful!');
        
        
        const user = res.data.user || {};
        
        localStorage.setItem('token', res.data.token);
        localStorage.setItem('userEmail', user.email || formData.email);
        localStorage.setItem('userId', user.id || '');
        localStorage.setItem('userName', user.fullName || formData.email.split('@')[0]); // 🟢 Fix: res.data.user.fullName
        localStorage.setItem('userPhone', user.phone || '');
        
        console.log('Token saved:', res.data.token);
        console.log('User Email:', user.email || formData.email);
        console.log('User Name:', user.fullName || formData.email.split('@')[0]);
        
        setTimeout(() => {
          navigate('/');
        }, 1500);
      } else {
        setError(res.data.message || 'Login failed');
      }

      } catch (err) {
      console.error('Login Error:', err);
      
      if (err.response) {
        setError(err.response.data?.message || 'Login failed. Please check your credentials.');
      } else if (err.request) {
        setError('Cannot connect to server. Please check your connection.');
      } else {
        setError('An error occurred. Please try again.');
      }
    } finally {
      setLoading(false);
    }
  };

  const switchToForgotView = (e) => {
    e.preventDefault();
    setIsForgotView(true);
    setError('');
    setSuccess('');
  };

  const switchToLoginView = () => {
    setIsForgotView(false);
    setError('');
    setSuccess('');
  };


   //* Go to Registration //
  const goToRegistration = () => {
    navigate('/register');
  };

  return (
    <div className={styles.loginContainer}>
     {/* Added glass card and header section */}
     <div className={styles.loginGlassCard}>
        <div className={styles.loginHeader}>
          <h2 className={styles.title}>Japura Flames</h2>
          <p className={styles.subtitle}>Welcome back! Please login to your account.</p>
        </div>

         {/* status messages UI */}
       {error && <div className={styles.errorMessage}>{error}</div>}
       {success && <div className={styles.successMessage}>{success}</div>}


   <form onSubmit={handleLoginSubmit} className={styles.loginForm}>
            <div className={styles.inputGroup}>
              <label htmlFor="email">Email</label>
              <input 
                type="email" 
                id="email"
                name="email" 
                placeholder="Enter your email"
                value={formData.email}
                onChange={handleChange}
                required 
              />
            </div>
            
            <div className={styles.inputGroup}>
              <label htmlFor="password">Password</label>
              <div className={styles.passwordInputContainer}>
                <input 
                  type={showPassword ? "text" : "password"} 
                  id="password"
                  name="password" 
                  placeholder="Enter your password"
                  value={formData.password}
                  onChange={handleChange}
                  required 
                />
                {/* Password visibility toggle UI */}
                <span className={styles.passwordToggleIcon} onClick={togglePasswordVisibility}>
                  {showPassword ? (
                    <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                      <path d="M17.94 17.94A10.07 10.07 0 0 1 12 20c-7 0-11-8-11-8a18.45 18.45 0 0 1 5.06-5.94M9.9 4.24A9.12 9.12 0 0 1 12 4c7 0 11 8 11 8a18.5 18.5 0 0 1-2.16 3.19m-6.72-1.07a3 3 0 1 1-4.24-4.24"></path>
                      <line x1="1" y1="1" x2="23" y2="23"></line>
                    </svg>
                  ) : (
                    <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                      <path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z"></path>
                      <circle cx="12" cy="12" r="3"></circle>
                    </svg>
                  )}
                </span>
              </div>
              </div>

              {/* Form Actions and Button */}
              <div className={styles.formActions}>
              <label className={styles.rememberMe}>
                <input type="checkbox" /> Remember me
              </label>
              <a href="#" className={styles.forgotPassword} onClick={switchToForgotView}>
                Forgot Password?
              </a>
            </div>
            
            <button type="submit" className={styles.loginBtn} disabled={loading}>
              {loading ? 'Logging in...' : 'Log In'}
            </button>

            <div className={styles.divider}>
              <span>OR</span>
            </div>

            <button 
              type="button" 
              className={styles.createAccountBtn}
              onClick={goToRegistration}
            >
              Create an Account
            </button>
            </form>
          
        </div>
    </div>
  );
};        
export default Login;