import React, { useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import axios from "axios";
import { ToastContainer, toast } from "react-toastify";
import { FiLock, FiCheck, FiArrowRight } from "react-icons/fi";
import { motion } from "framer-motion";
import "react-toastify/dist/ReactToastify.css";
import "./ResetPassword.css";

const ResetPassword = () => {
  const { uidb64, token } = useParams();
  const navigate = useNavigate();
  const [password, setPassword] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [passwordStrength, setPasswordStrength] = useState(0);

  const handlePasswordChange = (e) => {
    const newPassword = e.target.value;
    setPassword(newPassword);
    let strength = 0;
    if (newPassword.length >= 8) strength++;
    if (newPassword.match(/[A-Z]/)) strength++;
    if (newPassword.match(/[^A-Za-z0-9]/)) strength++;
    setPasswordStrength(strength);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!password) {
      toast.error("🌿 Password cannot be empty!");
      return;
    }

    if (password.length < 8) {
      toast.error("🍃 Password must be at least 8 characters!");
      return;
    }

    setIsSubmitting(true);
    try {
      const response = await axios.post(
        `http://127.0.0.1:8000/reset/${uidb64}/${token}/`,
        { password }
      );
      toast.success("✨ " + response.data.message);
      setTimeout(() => navigate("/login"), 2000);
    } catch (err) {
      toast.error(`⚠️ ${err.response?.data?.error || err.message}`);
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="eco-reset-wrapper">
      <ToastContainer 
        position="top-center"
        autoClose={4000}
        theme="colored"
        toastClassName="eco-toast"
        progressClassName="eco-progress"
      />
      
      <motion.div 
        className="eco-reset-card"
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6, ease: "easeOut" }}
      >
        <div className="eco-reset-header">
          <motion.div 
            className="eco-reset-icon-holder"
            animate={{ rotate: [0, 10, -5, 0] }}
            transition={{ 
              duration: 1.5,
              repeat: Infinity,
              repeatType: "mirror",
              ease: "easeInOut"
            }}
          >
            <FiLock className="eco-reset-icon" />
          </motion.div>
          <h2 className="eco-reset-title">Renew Your Access</h2>
          <p className="eco-reset-subtext">
            Create a fresh, secure password to continue
          </p>
        </div>

        <form onSubmit={handleSubmit} className="eco-reset-form">
          <div className="eco-input-group">
            <motion.div 
              className="eco-floating-label"
              initial={{ y: 20, opacity: 0 }}
              animate={{ y: 0, opacity: 1 }}
              transition={{ delay: 0.2 }}
            >
              <FiLock className="eco-input-icon" />
              <label htmlFor="new-password">New Password</label>
            </motion.div>
            <input
              type="password"
              id="new-password"
              className="eco-input-field"
              placeholder="Your new secure password"
              value={password}
              onChange={handlePasswordChange}
              required
            />
            <div className="eco-input-underline"></div>
            
            <div className="eco-strength-container">
              <div className="eco-strength-meter">
                {[1, 2, 3].map((level) => (
                  <div 
                    key={level}
                    className={`eco-strength-bar ${passwordStrength >= level ? 'eco-active' : ''}`}
                  ></div>
                ))}
              </div>
              <span className="eco-strength-text">
                {passwordStrength === 0 ? 'Weak' : 
                 passwordStrength === 1 ? 'Fair' :
                 passwordStrength === 2 ? 'Good' : 'Strong'}
              </span>
            </div>
            
            <div className="eco-requirements">
              <span className={`eco-requirement ${password.length >= 8 ? 'eco-met' : ''}`}>
                <FiCheck className="eco-requirement-icon" /> 8+ characters
              </span>
              <span className={`eco-requirement ${password.match(/[A-Z]/) ? 'eco-met' : ''}`}>
                <FiCheck className="eco-requirement-icon" /> Uppercase letter
              </span>
              <span className={`eco-requirement ${password.match(/[^A-Za-z0-9]/) ? 'eco-met' : ''}`}>
                <FiCheck className="eco-requirement-icon" /> Special character
              </span>
            </div>
          </div>

          <motion.button 
            type="submit" 
            className="eco-submit-btn"
            disabled={isSubmitting}
            whileHover={{ scale: 1.03 }}
            whileTap={{ scale: 0.97 }}
          >
            {isSubmitting ? (
              <span className="eco-submit-spinner"></span>
            ) : (
              <>
                Renew Password <FiArrowRight className="eco-arrow-icon" />
              </>
            )}
          </motion.button>
        </form>
      </motion.div>
    </div>
  );
};

export default ResetPassword;