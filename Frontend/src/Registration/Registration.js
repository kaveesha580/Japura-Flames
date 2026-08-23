import { useState } from 'react';
import { useNavigate } from 'react-router-dom';

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

    // Email check state
  const [emailChecking, setEmailChecking] = useState(false);
  const [emailExists, setEmailExists] = useState(false);
  const [emailCheckMessage, setEmailCheckMessage] = useState('');

  // Check when the email changes
  useEffect(() => {
    const checkEmail = async () => {
      const email = formData.email.trim();

      if (!email || !/\S+@\S+\.\S+/.test(email)) {
        setEmailExists(false);
        setEmailCheckMessage('');
        return;
      }

      setEmailChecking(true);

      try {
        const response = await fetch(
          `http://localhost:5000/api/auth/check-email?email=${encodeURIComponent(email)}`
        );

        const data = await response.json();

        if (response.ok) {
          setEmailExists(data.exists);
          setEmailCheckMessage(data.message);

          if (data.exists) {
            setErrors(prev => ({
              ...prev,
              email: 'This email is already registered. Please use a different email.'
            }));
          } else {
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

    // 500ms delay - don't make too many requests while typing
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

      const response = await fetch('http://localhost:5000/api/auth/register', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(submitData),
      });

      const data = await response.json();

      if (response.ok) {
        setIsSubmitted(true);
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