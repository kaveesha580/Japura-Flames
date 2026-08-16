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
export default Login;