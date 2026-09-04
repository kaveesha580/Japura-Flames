import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { API_BASE } from '../config';

export function useRegistration() {
  const navigate = useNavigate();
  
  const [formData, setFormData] = useState({
    fullName: '',
    email: '',
    phone: '',
    password: '',
    confirmPassword: '',
    accountType: 'personal',
    organization: '',
  });

  const [errors, setErrors] = useState({});
  const [isSubmitted, setIsSubmitted] = useState(false);
  const [loading, setLoading] = useState(false);
  const [serverError, setServerError] = useState('');
  
  //  Email check state
  const [emailChecking, setEmailChecking] = useState(false);
  const [emailExists, setEmailExists] = useState(false);
  const [emailCheckMessage, setEmailCheckMessage] = useState('');

 // Check when the email is being changed
  useEffect(() => {
    const checkEmail = async () => {
      const email = formData.email.trim();
      
      // Do not check if the email is empty or invalid
      if (!email || !/\S+@\S+\.\S+/.test(email)) {
        setEmailExists(false);
        setEmailCheckMessage('');
        return;
      }

      setEmailChecking(true);
      
      try {
        const response = await fetch(
          `${API_BASE}/api/auth/check-email?email=${encodeURIComponent(email)}`
        );
        
        const data = await response.json();
        
        if (response.ok) {
          setEmailExists(data.exists);
          setEmailCheckMessage(data.message);

          // Set error if email exists 
          if (data.exists) {
            setErrors(prev => ({
              ...prev,
              email: 'This email is already registered. Please use a different email.'
            }));
          } else {
            // Clear the error if the email does not exist
            setErrors(prev => ({
              ...prev,
              email: ''
            }));
          }
        }
      } catch (error) {
        console.error('Error checking email:', error);
      } finally {
        setEmailChecking(false);
      }
    };

    // 500ms delay – to prevent too many requests from being sent while typing
    const timer = setTimeout(() => {
      checkEmail();
    }, 500);

    return () => clearTimeout(timer);
  }, [formData.email]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
    
    // Clear the error in the field
    if (errors[name]) {
      setErrors(prev => ({
        ...prev,
        [name]: ''
      }));
    }
  };

  const validateForm = () => {
    const newErrors = {};
    
    if (!formData.fullName.trim()) {
      newErrors.fullName = 'Full name is required';
    }
    
    if (!formData.email.trim()) {
      newErrors.email = 'Email is required';
    } else if (!/\S+@\S+\.\S+/.test(formData.email)) {
      newErrors.email = 'Email is invalid';
    } else if (emailExists) {
      newErrors.email = 'This email is already registered. Please use a different email.';
    }
    
    if (!formData.phone.trim()) {
      newErrors.phone = 'Phone number is required';
    } else if (!/^[0-9+\-\s()]{10,}$/.test(formData.phone)) {
      newErrors.phone = 'Phone number is invalid';
    }
    
    if (!formData.password) {
      newErrors.password = 'Password is required';
    } else if (formData.password.length < 6) {
      newErrors.password = 'Password must be at least 6 characters';
    }
    
    if (!formData.confirmPassword) {
      newErrors.confirmPassword = 'Please confirm your password';
    } else if (formData.password !== formData.confirmPassword) {
      newErrors.confirmPassword = 'Passwords do not match';
    }
    
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    // Do not submit if email exists
    if (emailExists) {
      setErrors(prev => ({
        ...prev,
        email: 'This email is already registered. Please use a different email.'
      }));
      return;
    }
    
    if (!validateForm()) {
      return;
    }
    
    setLoading(true);
    setServerError('');
    
    try {
      const submitData = {
        fullName: formData.fullName,
        email: formData.email,
        phone: formData.phone,
        password: formData.password,
        accountType: formData.accountType,
        organization: formData.organization,
      };
      
      const response = await fetch(`${API_BASE}/api/auth/register`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(submitData),
      });
      
      const data = await response.json();
      
      if (response.ok) {
        setIsSubmitted(true);
        localStorage.setItem('token', data.token);
        localStorage.setItem('userEmail', data.user.email);
        localStorage.setItem('userName', data.user.fullName || formData.fullName);
        localStorage.setItem('userPhone', data.user.phone || formData.phone);
        
        setTimeout(() => {
          navigate('/');
        }, 2000);
      } else {
        setServerError(data.message || 'Registration failed. Please try again.');
      }
    } catch (error) {
      console.error('Registration error:', error);
      setServerError('Network error. Please check your connection.');
    } finally {
      setLoading(false);
    }
  };

  const handleReset = () => {
    setFormData({
      fullName: '',
      email: '',
      phone: '',
      password: '',
      confirmPassword: '',
      accountType: 'personal',
      organization: '',
    });
    setErrors({});
    setServerError('');
    setEmailExists(false);
    setEmailCheckMessage('');
  };

  const goToLogin = () => {
    navigate('/Login');
  };

  return {
    formData,
    errors,
    isSubmitted,
    loading,
    serverError,
    emailChecking,
    emailExists,
    emailCheckMessage,
    handleChange,
    handleSubmit,
    handleReset,
    goToLogin,
  };
}