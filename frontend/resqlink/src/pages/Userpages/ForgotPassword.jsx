import React, { useState } from "react";
import axios from "axios";
import { ToastContainer, toast } from "react-toastify";
import { FiMail, FiKey, FiArrowRight } from "react-icons/fi";
import { motion } from "framer-motion";
import "react-toastify/dist/ReactToastify.css";
import "./ForgotPassword.css";

const ForgotPassword = () => {
  const [email, setEmail] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handlePasswordReset = async (e) => {
    e.preventDefault();
    setIsSubmitting(true);
    
    try {
      await axios.post("/reset/", { email });
      toast.success("🌿 Password reset link sent!");
      setEmail("");
    } catch (err) {
      const errorMessage = err.response?.data?.error || err.message;
      toast.error(`🍃 ${errorMessage}`);
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="password-recovery-container">
      <ToastContainer 
        position="top-center"
        autoClose={4000}
        theme="colored"
        toastClassName="green-toast"
        progressClassName="green-progress"
      />
      
      <motion.div 
        className="recovery-card"
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6, ease: "easeOut" }}
      >
        <div className="recovery-header">
          <motion.div 
            className="recovery-icon-container"
            animate={{ rotate: -5 }}
            transition={{ 
              repeat: Infinity,
              repeatType: "mirror",
              duration: 3,
              ease: "easeInOut"
            }}
          >
            <FiKey className="recovery-icon" />
          </motion.div>
          <h2 className="recovery-title">Reset Your Password</h2>
          <p className="recovery-subtitle">
            Enter your email to receive a secure reset link
          </p>
        </div>

        <form onSubmit={handlePasswordReset} className="recovery-form">
          <div className="form-input-group">
            <motion.div 
              className="floating-label"
              initial={{ y: 20, opacity: 0 }}
              animate={{ y: 0, opacity: 1 }}
              transition={{ delay: 0.2 }}
            >
              <FiMail className="input-icon" />
              <label htmlFor="recovery-email">Email Address</label>
            </motion.div>
            <input
              type="email"
              id="recovery-email"
              className="form-input-field"
              placeholder="your.email@example.com"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
            />
            <div className="input-underline"></div>
          </div>

          <motion.button 
            type="submit" 
            className="recovery-submit-button"
            disabled={isSubmitting}
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
          >
            {isSubmitting ? (
              <span className="submit-spinner"></span>
            ) : (
              <>
                Send Reset Link <FiArrowRight className="arrow-icon" />
              </>
            )}
          </motion.button>
        </form>

        <motion.div 
          className="recovery-footer"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.4 }}
        >
          Remember your password? <a href="/login" className="recovery-link">Sign in here</a>
        </motion.div>
      </motion.div>
    </div>
  );
};

export default ForgotPassword;