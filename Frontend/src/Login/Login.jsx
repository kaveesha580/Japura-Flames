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

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  return (
    <div className={styles.loginContainer}>
     {/* Added glass card and header section */}
     <div className={styles.loginGlassCard}>
        <div className={styles.loginHeader}>
          <h2 className={styles.title}>Japura Flames</h2>
          <p className={styles.subtitle}>Welcome back! Please login to your account.</p>
        </div>

        </div>
    </div>
     );
};

      

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
              </div>
              </div>
            </form>
          
        </div>
    </div>
  );
};        

export default Login;