import React, { useState, useEffect, useRef } from "react";
import './Home.css';



import { useNavigate } from "react-router-dom";





function Home() {
  const heroRef = useReveal();
  const homeRef = useReveal();
 

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

         {/* Services Section */}
      <section className="home-services reveal-section" aria-label="Our services" ref={servicesRef}>
        <div className="services-label">
        <span>Photography</span>
        <span>Videography</span>
        <span>Live Broadcasting</span>
        <span>Graphic Design</span>
        <span>Article Writing</span>
        <span>Poetry</span>
        </div>
      </section>


  
    </div>
  );
}

export default Home;
