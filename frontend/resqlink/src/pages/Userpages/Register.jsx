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

  const handleSignup = async (e) => {
    e.preventDefault();

    // Validation checks remain the same...
    // (Keep all your existing validation logic)

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
      <ToastContainer position="top-center" />
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
              
              <form onSubmit={handleSignup} className="aurora-register-form">
                <div className="aurora-form-grid">
                  <div className="aurora-input-group">
                    <label className="aurora-input-label">Email</label>
                    <input 
                      type="email" 
                      name="email"
                      value={formData.email}
                      onChange={handleChange}
                      className="aurora-form-input"
                      placeholder="your@email.com"
                      required 
                    />
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
                        />
                        <span className="aurora-file-custom">
                          {formData.image ? formData.image.name : "Choose file..."}
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
                          accept="image/*" 
                          onChange={handleFileChange} 
                          className="aurora-file-hidden"
                          required 
                        />
                        <span className="aurora-file-custom">
                          {formData.citizenship ? formData.citizenship.name : "Choose file..."}
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
                    />
                    <div className="aurora-password-hint">
                      Must include uppercase, lowercase, number, and special character
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
                    />
                  </div>
                </div>
                
                <button type="submit" className="aurora-submit-btn">
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