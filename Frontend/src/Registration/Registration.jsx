import { useState } from 'react';
import { useRegistration } from './Registration';
import './Registration.css';

function Registration() {
  const { formData, handleChange } = useRegistration();

  const handleBackToLogin = () => {
    if (isLeaving) return;

    setIsLeaving(true);
    window.setTimeout(goToLogin, 650);
  };

  return (
    <div className={`registration-page ${isLeaving ? 'is-leaving' : ''}`}>
      <div className="registration-image" role="img" aria-label="Japura Flames media team" />
      <div className="registration-container">
        <div className="accent-bar"></div>

        <div className="header-section">
          <div className="animatedLogoContainer">
            <div className="logoBorderWrapper">
              <img src="/image/logo.png" alt="Japura Flames Logo" className="myCustomLogo" />
            </div>
          </div>
          <p className="header-subtitle">Media & Creative Services</p>
        </div>

        <div className="form-content">
          <form id="eventRegistrationForm" noValidate>
            <div style={{ marginTop: '30px', paddingTop: '25px', borderTop: '1px solid #ddd' }}>
              <div className="section-title">
                <span className="section-number"></span>
                Contact Information
              </div>

              <div className="form-grid">
                {/* Full Name */}
                <div className="form-group">
                  <label className="form-label">
                    Full Name <span className="required-star">*</span>
                  </label>
                  <div className="input-with-icon">
                    <input
                      type="text"
                      name="fullName"
                      className="form-input"
                      placeholder="Your Full Name"
                      value={formData.fullName}
                      onChange={handleChange}
                      required
                    />
                    <i className="fa-solid fa-user input-icon"></i>
                  </div>
                </div>

                {/* Email */}
                <div className="form-group">
                  <label className="form-label">
                    Email Address <span className="required-star">*</span>
                  </label>
                  <div className="input-with-icon">
                    <input
                      type="email"
                      name="email"
                      className="form-input"
                      placeholder="example@email.com"
                      value={formData.email}
                      onChange={handleChange}
                      required
                    />
                    <i className="fa-solid fa-envelope input-icon"></i>
                  </div>
                </div>

                {/* Phone */}
                <div className="form-group">
                  <label className="form-label">
                    Phone Number <span className="required-star">*</span>
                  </label>
                  <div className="input-with-icon">
                    <input
                      type="tel"
                      name="phone"
                      className="form-input"
                      placeholder="+94 77 123 4567"
                      value={formData.phone}
                      onChange={handleChange}
                      required
                    />
                    <i className="fa-solid fa-phone input-icon"></i>
                  </div>
                </div>

                <div className="submit-section" style={{ gridColumn: '1 / -1' }}>
                  <button type="submit" className="btn-submit">
                    Register
                  </button>
                </div>
              </div>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
}

export default Registration;