import React, { useState, useEffect } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import { ToastContainer, toast } from "react-toastify";
import { Modal, Button } from "react-bootstrap";
import "react-toastify/dist/ReactToastify.css";
import admin from "../../img/admin.png";
import "./adminlogin.css";

const AdminLogin = () => {
  const [credentials, setCredentials] = useState({
    email: "",
    password: ""
  });
  const [showModal, setShowModal] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const navigate = useNavigate();

  useEffect(() => {
    const checkLoginStatus = () => {
      const currentLogin = localStorage.getItem("loginType");
      if (currentLogin === "user") {
        toast.warning("Please logout from user account first");
        navigate("/login");
      }
    };

    checkLoginStatus();

    const handleStorageChange = (e) => {
      if (e.key === "loginType") {
        checkLoginStatus();
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
    if (currentLogin === "user") {
      toast.error("Please logout from user account first");
      setIsLoading(false);
      return;
    }

    try {
      const response = await axios.post(
        "/admin-login/", 
        credentials, 
        { 
          headers: { "Content-Type": "application/json" },
          timeout: 10000
        }
      );
      
      if (response.status === 200) {
        if (response.data.role !== "admin") {
          toast.error("Access denied. Only admins can log in here.");
          setIsLoading(false);
          return;
        }
        
        localStorage.setItem("accessToken", response.data.accesstoken);
        localStorage.setItem("loginType", "admin");
        
        if (response.data.adminData) {
          localStorage.setItem("adminData", JSON.stringify(response.data.adminData));
        }
        
        setShowModal(true);
      }
    } catch (err) {
      let errorMessage = "An error occurred during login";
      if (err.response) {
        errorMessage = err.response.data?.detail || err.response.data?.message || "Invalid credentials";
      } else if (err.request) {
        errorMessage = "No response from server. Please try again later.";
      } else if (err.code === "ECONNABORTED") {
        errorMessage = "Request timeout. Please try again.";
      }
      
      toast.error(`Login failed: ${errorMessage}`);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <>
      <ToastContainer 
        position="top-center"
        autoClose={5000}
        hideProgressBar={false}
        newestOnTop={false}
        closeOnClick
        rtl={false}
        pauseOnFocusLoss
        draggable
        pauseOnHover
      />
      
      <section className="secure-admin-section">
        <div className="secure-admin-glass">
          <div className="secure-admin-wrapper">
            <div className="secure-admin-header">
              <div className="secure-admin-logo">
                <img src={admin} alt="Admin" className="secure-admin-img" />
                <div className="secure-admin-glow"></div>
              </div>
              <h2 className="secure-admin-title">Admin Portal</h2>
              <p className="secure-admin-subtitle">Secure System Access</p>
            </div>
            
            <form onSubmit={handleSubmit} className="secure-admin-form">
              <div className="secure-input-group">
                <label htmlFor="adminEmail" className="secure-input-label">
                  <i className="bi bi-envelope-fill me-2"></i>
                  Admin Email
                </label>
                <input
                  type="email"
                  id="adminEmail"
                  name="email"
                  value={credentials.email}
                  onChange={handleChange}
                  className="secure-admin-input"
                  placeholder="admin@example.com"
                  required
                  autoComplete="username"
                />
              </div>
              
              <div className="secure-input-group">
                <label htmlFor="adminPassword" className="secure-input-label">
                  <i className="bi bi-lock-fill me-2"></i>
                  Password
                </label>
                <input
                  type="password"
                  id="adminPassword"
                  name="password"
                  value={credentials.password}
                  onChange={handleChange}
                  className="secure-admin-input"
                  placeholder="••••••••"
                  required
                  autoComplete="current-password"
                />
              </div>
              
              <button 
                type="submit" 
                className="secure-auth-btn"
                disabled={isLoading}
                aria-label={isLoading ? "Authenticating" : "Authenticate"}
              >
                {isLoading ? (
                  <span className="secure-spinner" aria-hidden="true"></span>
                ) : (
                  <>
                    <span className="secure-btn-text">Authenticate</span>
                    <i className="bi bi-arrow-right-short secure-btn-icon"></i>
                  </>
                )}
              </button>
            </form>
            
            <div className="secure-admin-notice">
              <i className="bi bi-shield-check secure-shield-icon"></i>
              <p>Restricted to authorized personnel only</p>
            </div>
          </div>
        </div>
      </section>

      <Modal 
        show={showModal} 
        onHide={() => navigate("/admin/dashboard")} 
        centered 
        className="secure-success-modal"
        aria-labelledby="success-modal-title"
      >
        <Modal.Body className="secure-modal-body">
          <div className="secure-verified-card">
            <div className="secure-verified-badge">
              <svg viewBox="0 0 24 24" className="secure-checkmark" aria-hidden="true">
                <path d="M9 16.17L4.83 12l-1.42 1.41L9 19 21 7l-1.41-1.41L9 16.17z"/>
              </svg>
            </div>
            <h2 id="success-modal-title" className="secure-verified-title">Identity Verified</h2>
            <p className="secure-verified-text">Access granted to admin controls</p>
            <Button 
              onClick={() => {
                navigate("/admin/dashboard");
                window.location.reload();
              }} 
              className="secure-dashboard-btn"
              aria-label="Continue to dashboard"
            >
              Enter Dashboard
              <i className="bi bi-box-arrow-in-right ms-2"></i>
            </Button>
          </div>
        </Modal.Body>
      </Modal>
    </>
  );
};

export default AdminLogin;