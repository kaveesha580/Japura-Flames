import React from "react";
import { useRegistration } from "./Registration";
import "./Registration.css";

function Registration() {
  const {
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
  } = useRegistration();

  return (
    <div className="loginGlassCard">
      <div className="registration-container">
        <div className="accent-bar"></div>

        <div className="header-section">
          <div className="animatedLogoContainer">
            <div className="logoBorderWrapper">
              <img
                src="/image/logo.png"
                alt="Japura Flames Logo"
                className="myCustomLogo"
              />
            </div>
          </div>
          <p className="header-subtitle">Media & Creative Services</p>
        </div>

        <div className="form-content">
          {serverError && (
            <div className="server-error-message">
              <i className="fa-solid fa-exclamation-circle"></i>
              {serverError}
            </div>
          )}

          {!isSubmitted ? (
            <form id="eventRegistrationForm" noValidate>
              <div
                style={{
                  marginTop: "30px",
                  paddingTop: "25px",
                  borderTop: "1px solid #ddd",
                }}
              >
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
                    <div
                      className={`input-with-icon ${errors.fullName ? "has-error" : ""}`}
                    >
                      <input
                        type="text"
                        name="fullName"
                        className="form-input"
                        placeholder="Your Full Name"
                        value={formData.fullName}
                        onChange={handleChange}
                        required
                        disabled={loading}
                      />
                      <i className="fa-solid fa-user input-icon"></i>
                    </div>
                    {errors.fullName && (
                      <span className="error-message">{errors.fullName}</span>
                    )}
                  </div>

                  {/* Email */}
                  <div className="form-group">
                    <label className="form-label">
                      Email Address <span className="required-star">*</span>
                    </label>
                    <div
                      className={`input-with-icon ${errors.email ? "has-error" : ""}`}
                    >
                      <input
                        type="email"
                        name="email"
                        className="form-input"
                        placeholder="example@email.com"
                        value={formData.email}
                        onChange={handleChange}
                        required
                        disabled={loading}
                      />
                      <i className="fa-solid fa-envelope input-icon"></i>

                      {/* Email checking status */}
                      {emailChecking && (
                        <span className="input-status checking">
                          <i className="fa-solid fa-spinner fa-spin"></i>{" "}
                          Checking...
                        </span>
                      )}
                      {!emailChecking &&
                        formData.email &&
                        !errors.email &&
                        emailExists && (
                          <span className="input-status error">
                            <i className="fa-solid fa-times-circle"></i> Already
                            registered
                          </span>
                        )}
                      {!emailChecking &&
                        formData.email &&
                        !errors.email &&
                        !emailExists && (
                          <span className="input-status success">
                            <i className="fa-solid fa-check-circle"></i>{" "}
                            Available
                          </span>
                        )}
                    </div>
                    {errors.email && (
                      <span className="error-message">{errors.email}</span>
                    )}
                    {!errors.email && emailCheckMessage && !emailExists && (
                      <span className="success-message">
                        {emailCheckMessage}
                      </span>
                    )}
                  </div>

                  {/* Phone */}
                  <div className="form-group">
                    <label className="form-label">
                      Phone Number <span className="required-star">*</span>
                    </label>
                    <div
                      className={`input-with-icon ${errors.phone ? "has-error" : ""}`}
                    >
                      <input
                        type="tel"
                        name="phone"
                        className="form-input"
                        placeholder="+94 77 123 4567"
                        value={formData.phone}
                        onChange={handleChange}
                        required
                        disabled={loading}
                      />
                      <i className="fa-solid fa-phone input-icon"></i>
                    </div>
                    {errors.phone && (
                      <span className="error-message">{errors.phone}</span>
                    )}
                  </div>

                  {/* Password */}
                  <div className="form-group">
                    <label className="form-label">
                      Password <span className="required-star">*</span>
                    </label>
                    <div
                      className={`input-with-icon ${errors.password ? "has-error" : ""}`}
                    >
                      <input
                        type="password"
                        name="password"
                        className="form-input"
                        placeholder="Min 6 characters"
                        value={formData.password}
                        onChange={handleChange}
                        required
                        disabled={loading}
                      />
                      <i className="fa-solid fa-lock input-icon"></i>
                    </div>
                    {errors.password && (
                      <span className="error-message">{errors.password}</span>
                    )}
                  </div>

                  {/* Confirm Password */}
                  <div className="form-group">
                    <label className="form-label">
                      Confirm Password <span className="required-star">*</span>
                    </label>
                    <div
                      className={`input-with-icon ${errors.confirmPassword ? "has-error" : ""}`}
                    >
                      <input
                        type="password"
                        name="confirmPassword"
                        className="form-input"
                        placeholder="Re-enter password"
                        value={formData.confirmPassword}
                        onChange={handleChange}
                        required
                        disabled={loading}
                      />
                      <i className="fa-solid fa-check-circle input-icon"></i>
                    </div>
                    {errors.confirmPassword && (
                      <span className="error-message">
                        {errors.confirmPassword}
                      </span>
                    )}
                  </div>

                  {/* Account Type */}
                  <div className="form-group">
                    <label className="form-label">Account Type</label>
                    <div className="input-with-icon">
                      <select
                        name="accountType"
                        className="form-input"
                        value={formData.accountType}
                        onChange={handleChange}
                      >
                        <option value="personal">Personal</option>
                        <option value="organizer">Organizer</option>
                      </select>
                      <i className="fa-solid fa-user-tie input-icon"></i>
                    </div>
                  </div>

                  {/* Organization – conditional */}
                  {formData.accountType === "organizer" && (
                    <div className="form-group">
                      <label className="form-label">Organization</label>
                      <div className="input-with-icon">
                        <input
                          type="text"
                          name="organization"
                          className="form-input"
                          placeholder="Organization (Optional)"
                          value={formData.organization}
                          onChange={handleChange}
                        />
                        <i className="fa-solid fa-building input-icon"></i>
                      </div>
                    </div>
                  )}

                  <div
                    className="submit-section"
                    style={{ gridColumn: "1 / -1" }}
                  >
                    <button
                      type="submit"
                      className="btn-submit"
                      disabled={loading || emailChecking || emailExists}
                    >
                      {loading ? (
                        <>
                          <i
                            className="fa-solid fa-spinner fa-spin"
                            style={{ marginRight: "8px" }}
                          ></i>
                          Registering...
                        </>
                      ) : (
                        <>
                          <i
                            className="fa-solid fa-paper-plane"
                            style={{ marginRight: "8px" }}
                          ></i>
                          Register
                        </>
                      )}
                    </button>

                    <button
                      type="button"
                      className="btn-reset"
                      onClick={handleReset}
                      disabled={loading}
                    >
                      <i
                        className="fa-solid fa-rotate-left"
                        style={{ marginRight: "8px" }}
                      ></i>
                      Clear
                    </button>

                    <button
                      type="button"
                      className="btn-back-to-login"
                      onClick={goToLogin}
                      disabled={loading}
                    >
                      <i
                        className="fa-solid fa-arrow-left"
                        style={{ marginRight: "8px" }}
                      ></i>
                      Back to Login
                    </button>
                  </div>
                </div>
              </div>
            </form>
          ) : (
            <div className="success-message">
              <i className="fa-solid fa-check-circle"></i>
              <h2>Registration Successful!</h2>
              <p>Welcome to J'Pura Flames!</p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

export default Registration;