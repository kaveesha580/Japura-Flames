//-----------------------------------
//Basic login component skeleton
//-----------------------------------
import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import styles from './Login.module.css';
import myLogo from '../assets/logo.png';

const Login = () => {
  const navigate = useNavigate();



  return (
    <div className={styles.loginContainer}></div>
     );
};
export default Login;