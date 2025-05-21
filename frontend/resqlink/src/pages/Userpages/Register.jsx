import React, { useState } from "react";
import axios from "axios";
import reg from "../../img/reg.png";
import { useNavigate } from "react-router-dom";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { Modal, Button } from "react-bootstrap";
import "bootstrap-icons/font/bootstrap-icons.css";
import "./Register.css";

const Register = () => {
  const [formData, setFormData] = useState({
    email: "",
    first_name: "",
    last_name: "",
    username: "",
    dob: "",
    phone: "",
    password: "",
    cpassword: "",
    image: null,
    citizenship: null
  });
  const [showModal, setShowModal] = useState(false);
  const [otp, setOtp] = useState("");
  const [showOtpModal, setShowOtpModal] = useState(false);
  const [emailVerified, setEmailVerified] = useState(false);
  const [isSendingOtp, setIsSendingOtp] = useState(false);

  const navigate = useNavigate();
  const role = "user";

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleFileChange = (e) => {
    const { name, files } = e.target;
    setFormData(prev => ({ ...prev, [name]: files[0] }));
  };

  const handleSendOtp = async () => {
    if (!formData.email) {
      toast.error("Please enter your email first");
      return;
    }

    // Basic email validation
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(formData.email)) {
      toast.error("Please enter a valid email address");
      return;
    }

    setIsSendingOtp(true);
    try {
      const response = await axios.post("http://127.0.0.1:8000/send-otp/", {
        email: formData.email
      });

      if (response.status === 200) {
        toast.success("OTP sent to your email");
        setShowOtpModal(true);
      }
    } catch (err) {
      toast.error(`Failed to send OTP: ${err.response?.data?.error || err.message}`);
    } finally {
      setIsSendingOtp(false);
    }
  };

  const handleVerifyOtp = async () => {
    if (!otp || otp.length !== 6) {
      toast.error("Please enter a valid 6-digit OTP");
      return;
    }

    try {
      const response = await axios.post("http://127.0.0.1:8000/verify-otp/", {
        email: formData.email,
        otp: otp
      });

      if (response.status === 200) {
        toast.success("Email verified successfully");
        setEmailVerified(true);
        setShowOtpModal(false);
      }
    } catch (err) {
      toast.error(`OTP verification failed: ${err.response?.data?.error || err.message}`);
    }
  };

  const handleSignup = async (e) => {
    e.preventDefault();

    if (!emailVerified) {
      toast.error("Please verify your email first");
      return;
    }

    // Password validation
    if (formData.password !== formData.cpassword) {
      toast.error("Passwords do not match");
      return;
    }

    // Password strength validation
    const passwordRegex = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]{8,}$/;
    if (!passwordRegex.test(formData.password)) {
      toast.error("Password must contain at least 8 characters, one uppercase, one lowercase, one number and one special character");
      return;
    }

    // Phone number validation
    if (!/^\d{10}$/.test(formData.phone)) {
      toast.error("Please enter a valid 10-digit phone number");
      return;
    }

    // Date of birth validation (basic)
    if (!formData.dob) {
      toast.error("Please enter your date of birth");
      return;
    }

    const formDataToSend = new FormData();
    for (const key in formData) {
      if (formData[key] !== null) {
        formDataToSend.append(key, formData[key]);
      }
    }
    formDataToSend.append("role", role);

    try {
      const response = await axios.post("http://127.0.0.1:8000/register/", formDataToSend, {
        headers: { "Content-Type": "multipart/form-data" },
      });

      if (response.status === 201) {
        setShowModal(true);
      }
    } catch (err) {
      toast.error(`Registration failed: ${err.response?.data?.error || err.message}`);
    }
  };

  return (
    <>
      <ToastContainer position="top-center" autoClose={5000} />
      <section className="aurora-register-section">
        <div className="aurora-glass-card">
          <div className="aurora-form-wrapper">
            <div className="aurora-hero-image">
              <img src={reg} alt="Signup" className="aurora-hero-img" />
              <div className="aurora-hero-overlay">
                <h2 className="aurora-hero-title">Join Our Community</h2>
                <p className="aurora-hero-text">Create your account to start making a difference today</p>
              </div>
            </div>
            
            <div className="aurora-form-container">
              <div className="aurora-form-header">
                <h3 className="aurora-form-title">Create Account</h3>
                <div className="aurora-form-divider"></div>
              </div>
              
              {/* Registration Form */}
              <form onSubmit={handleSignup} className="aurora-register-form">
                <div className="aurora-form-grid">
                  <div className="aurora-input-group">
                    <label className="aurora-input-label">Email</label>
                    <div className="aurora-email-verify-container">
                      <input 
                        type="email" 
                        name="email"
                        value={formData.email}
                        onChange={handleChange}
                        className="aurora-form-input"
                        placeholder="your@email.com"
                        required 
                        disabled={emailVerified}
                      />
                      {!emailVerified && (
                        <button 
                          type="button" 
                          onClick={handleSendOtp}
                          className="aurora-verify-btn"
                          disabled={isSendingOtp}
                        >
                          {isSendingOtp ? (
                            <>
                              <span className="aurora-spinner"></span> Sending...
                            </>
                          ) : (
                            'Verify'
                          )}
                        </button>
                      )}
                      {emailVerified && (
                        <span className="aurora-verified-badge">
                          <i className="bi bi-check-circle-fill"></i> Verified
                        </span>
                      )}
                    </div>
                  </div>
                  
                  <div className="aurora-input-group">
                    <label className="aurora-input-label">Username</label>
                    <input 
                      type="text" 
                      name="username"
                      value={formData.username}
                      onChange={handleChange}
                      className="aurora-form-input"
                      placeholder="Choose a username"
                      required 
                      disabled={!emailVerified}
                    />
                  </div>
                  
                  <div className="aurora-input-group">
                    <label className="aurora-input-label">First Name</label>
                    <input 
                      type="text" 
                      name="first_name"
                      value={formData.first_name}
                      onChange={handleChange}
                      className="aurora-form-input"
                      placeholder="First name"
                      required 
                      disabled={!emailVerified}
                    />
                  </div>
                  
                  <div className="aurora-input-group">
                    <label className="aurora-input-label">Last Name</label>
                    <input 
                      type="text" 
                      name="last_name"
                      value={formData.last_name}
                      onChange={handleChange}
                      className="aurora-form-input"
                      placeholder="Last name"
                      required 
                      disabled={!emailVerified}
                    />
                  </div>
                  
                  <div className="aurora-input-group">
                    <label className="aurora-input-label">Date of Birth</label>
                    <input 
                      type="date" 
                      name="dob"
                      value={formData.dob}
                      onChange={handleChange}
                      className="aurora-form-input"
                      required 
                      disabled={!emailVerified}
                    />
                  </div>
                  
                  <div className="aurora-input-group">
                    <label className="aurora-input-label">Phone Number</label>
                    <input 
                      type="tel" 
                      name="phone"
                      value={formData.phone}
                      onChange={(e) => {
                        const value = e.target.value;
                        if (/^\d*$/.test(value) && value.length <= 10) {
                          handleChange(e);
                        }
                      }}
                      className="aurora-form-input"
                      placeholder="10-digit number"
                      required 
                      pattern="\d{10}"
                      title="Please enter exactly 10 digits"
                      disabled={!emailVerified}
                    />
                  </div>
                  
                  <div className="aurora-input-group">
                    <label className="aurora-input-label">Profile Image</label>
                    <div className="aurora-file-input">
                      <label className="aurora-file-label">
                        <input 
                          type="file" 
                          name="image"
                          accept="image/*" 
                          onChange={handleFileChange} 
                          className="aurora-file-hidden"
                          required 
                          disabled={!emailVerified}
                        />
                        <span className="aurora-file-custom">
                          {formData.image ? formData.image.name : "Choose file..."}
                          <i className="bi bi-upload aurora-upload-icon"></i>
                        </span>
                      </label>
                    </div>
                  </div>
                  
                  <div className="aurora-input-group">
                    <label className="aurora-input-label">National ID</label>
                    <div className="aurora-file-input">
                      <label className="aurora-file-label">
                        <input 
                          type="file" 
                          name="citizenship"
                          accept="image/*, .pdf" 
                          onChange={handleFileChange} 
                          className="aurora-file-hidden"
                          required 
                          disabled={!emailVerified}
                        />
                        <span className="aurora-file-custom">
                          {formData.citizenship ? formData.citizenship.name : "Choose file..."}
                          <i className="bi bi-upload aurora-upload-icon"></i>
                        </span>
                      </label>
                    </div>
                  </div>
                  
                  <div className="aurora-input-group">
                    <label className="aurora-input-label">Password</label>
                    <input 
                      type="password" 
                      name="password"
                      value={formData.password}
                      onChange={handleChange}
                      className="aurora-form-input"
                      placeholder="Create password"
                      required 
                      disabled={!emailVerified}
                    />
                    <div className="aurora-password-hint">
                      Must include: uppercase, lowercase, number, and special character
                    </div>
                  </div>
                  
                  <div className="aurora-input-group">
                    <label className="aurora-input-label">Confirm Password</label>
                    <input 
                      type="password" 
                      name="cpassword"
                      value={formData.cpassword}
                      onChange={handleChange}
                      className="aurora-form-input"
                      placeholder="Confirm password"
                      required 
                      disabled={!emailVerified}
                    />
                  </div>
                </div>
                
                <button 
                  type="submit" 
                  className="aurora-submit-btn"
                  disabled={!emailVerified}
                >
                  <span className="aurora-btn-text">Create Account</span>
                  <span className="aurora-btn-icon">
                    <i className="bi bi-arrow-right"></i>
                  </span>
                </button>
              </form>
              
              <div className="aurora-form-footer">
                <p className="aurora-footer-text">
                  Already have an account? <a href="/login" className="aurora-footer-link">Sign In</a>
                </p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* OTP Verification Modal */}
      <Modal show={showOtpModal} onHide={() => setShowOtpModal(false)} centered className="aurora-otp-modal">
        <Modal.Body className="aurora-modal-body">
          <div className="aurora-otp-content">
            <h3 className="aurora-otp-title">Verify Your Email</h3>
            <p className="aurora-otp-text">
              We've sent a 6-digit OTP to <strong>{formData.email}</strong>. 
              Please enter it below to continue:
            </p>
            
            <div className="aurora-otp-input-container">
              <input
                type="text"
                value={otp}
                onChange={(e) => setOtp(e.target.value.replace(/\D/g, '').slice(0, 6))}
                className="aurora-otp-input"
                placeholder="Enter OTP"
                maxLength={6}
                inputMode="numeric"
              />
              <button 
                className="aurora-otp-resend"
                onClick={handleSendOtp}
                disabled={isSendingOtp}
              >
                {isSendingOtp ? 'Sending...' : 'Resend OTP'}
              </button>
            </div>
            
            <div className="aurora-otp-actions">
              <button 
                className="aurora-otp-back"
                onClick={() => setShowOtpModal(false)}
              >
                Back
              </button>
              <button 
                className="aurora-otp-verify"
                onClick={handleVerifyOtp}
              >
                Verify
              </button>
            </div>
          </div>
        </Modal.Body>
      </Modal>

      {/* Success Modal */}
      <Modal show={showModal} onHide={() => navigate("/login")} centered className="aurora-success-modal">
        <Modal.Body className="aurora-modal-body">
          <div className="aurora-success-content">
            <div className="aurora-success-icon">
              <svg viewBox="0 0 24 24" className="aurora-checkmark">
                <path d="M9 16.17L4.83 12l-1.42 1.41L9 19 21 7l-1.41-1.41L9 16.17z"/>
              </svg>
            </div>
            <h2 className="aurora-success-title">Registration Complete!</h2>
            <p className="aurora-success-text">Your account has been successfully created.</p>
            <Button 
              onClick={() => navigate("/login")} 
              className="aurora-modal-btn"
            >
              Continue to Login
              <i className="bi bi-box-arrow-in-right ms-2"></i>
            </Button>
          </div>
        </Modal.Body>
      </Modal>
    </>
  );
};

export default Register;