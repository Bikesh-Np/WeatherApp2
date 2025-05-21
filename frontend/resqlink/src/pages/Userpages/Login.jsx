import React, { useState, useEffect } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import { ToastContainer, toast } from "react-toastify";
import { Modal, Button } from "react-bootstrap";
import "react-toastify/dist/ReactToastify.css";
import logo from "../../img/logo.png";
import "./Login.css";

const Login = () => {
  const [credentials, setCredentials] = useState({
    email: "",
    password: ""
  });
  const [showModal, setShowModal] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const navigate = useNavigate();

  useEffect(() => {
    const currentLogin = localStorage.getItem("loginType");
    if (currentLogin === "admin") {
      toast.error("Please logout from admin account first");
      navigate("/adminlogin");
    }

    const handleStorageChange = (e) => {
      if (e.key === "loginType" && e.newValue === "admin") {
        toast.warning("Admin logged in another tab. Redirecting...");
        navigate("/adminlogin");
      }
    };

    window.addEventListener("storage", handleStorageChange);
    return () => window.removeEventListener("storage", handleStorageChange);
  }, [navigate]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setCredentials(prev => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsLoading(true);
    
    const currentLogin = localStorage.getItem("loginType");
    if (currentLogin === "admin") {
      toast.error("Please logout from admin account first");
      setIsLoading(false);
      return;
    }

    try {
      const response = await axios.post(
        "/login/", 
        credentials,
        { headers: { "Content-Type": "application/json" } }
      );

      if (response.status === 200) {
        localStorage.setItem("token", response.data.accesstoken);
        localStorage.setItem("loginType", "user");
        setShowModal(true);
      }
    } catch (err) {
      toast.error(`Login failed: ${err.response?.data?.error || err.message}`);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <>
      <ToastContainer position="top-center" />
      <section className="aurora-login-section">
        <div className="aurora-glass-card">
          <div className="aurora-form-wrapper">
            <div className="aurora-hero-image">
              <div className="aurora-hero-overlay">
                <h2 className="aurora-hero-title">Welcome Back</h2>
                <p className="aurora-hero-text">
                  Sign in to continue your journey with us
                </p>
                <div className="aurora-logo-container">
                  <img src={logo} alt="Logo" className="aurora-logo" />
                </div>
              </div>
            </div>
            
            <div className="aurora-form-container">
              <div className="aurora-form-header">
                <h3 className="aurora-form-title">Sign In</h3>
                <div className="aurora-form-divider"></div>
              </div>
              
              <form onSubmit={handleSubmit} className="aurora-login-form">
                <div className="aurora-input-group">
                  <label className="aurora-input-label">Email</label>
                  <input
                    type="email"
                    name="email"
                    value={credentials.email}
                    onChange={handleChange}
                    className="aurora-form-input"
                    placeholder="your@email.com"
                    required
                  />
                </div>
                
                <div className="aurora-input-group">
                  <label className="aurora-input-label">Password</label>
                  <input
                    type="password"
                    name="password"
                    value={credentials.password}
                    onChange={handleChange}
                    className="aurora-form-input"
                    placeholder="Enter your password"
                    required
                  />
                  <div className="aurora-form-extra">
                    <a href="/forgot-password" className="aurora-forgot-link">
                      Forgot password?
                    </a>
                  </div>
                </div>
                
                <button 
                  type="submit" 
                  className="aurora-submit-btn"
                  disabled={isLoading}
                >
                  {isLoading ? (
                    <span className="aurora-spinner"></span>
                  ) : (
                    <>
                      <span className="aurora-btn-text">Sign In</span>
                      <span className="aurora-btn-icon">
                        <i className="bi bi-arrow-right"></i>
                      </span>
                    </>
                  )}
                </button>
              </form>
              
              <div className="aurora-form-footer">
                <p className="aurora-footer-text">
                  Don't have an account?{" "}
                  <a href="/register" className="aurora-footer-link">
                    Create one
                  </a>
                </p>
              </div>
            </div>
          </div>
        </div>
      </section>

      <Modal show={showModal} onHide={() => navigate("/")} centered className="aurora-success-modal">
        <Modal.Body className="aurora-modal-body">
          <div className="aurora-success-content">
            <div className="aurora-success-icon">
              <svg viewBox="0 0 24 24" className="aurora-checkmark">
                <path d="M9 16.17L4.83 12l-1.42 1.41L9 19 21 7l-1.41-1.41L9 16.17z"/>
              </svg>
            </div>
            <h2 className="aurora-success-title">Login Successful!</h2>
            <p className="aurora-success-text">You're now signed in to your account.</p>
            <Button 
              onClick={() => navigate("/")} 
              className="aurora-modal-btn"
            >
              Continue to Dashboard
              <i className="bi bi-box-arrow-in-right ms-2"></i>
            </Button>
          </div>
        </Modal.Body>
      </Modal>
    </>
  );
};

export default Login;