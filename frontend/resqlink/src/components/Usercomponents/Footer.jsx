import React from "react";
import { FaFacebookF, FaTwitter, FaLinkedinIn, FaInstagram, FaHeart } from "react-icons/fa";
import { FiMail, FiPhone, FiMapPin } from "react-icons/fi";
import { motion } from "framer-motion";
import './Footer.css';

const Footer = () => {
  return (
    <footer className="luxury-footer">
      <div className="footer-wave"></div>
      
      <div className="footer-container">
        {/* Main Footer Content */}
        <div className="footer-grid">
          {/* Brand Column */}
          <motion.div 
            className="footer-brand"
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            viewport={{ once: true }}
          >
            <h3 className="brand-title">
              ResQLink<span className="brand-dot">.</span>
            </h3>
            <p className="brand-tagline">
              Connecting compassion with crisis through innovative disaster relief solutions.
            </p>
            <div className="social-links">
              <motion.a 
                href="https://facebook.com" 
                target="_blank" 
                rel="noopener noreferrer"
                whileHover={{ y: -3 }}
                className="social-icon"
              >
                <FaFacebookF />
              </motion.a>
              <motion.a 
                href="https://twitter.com" 
                target="_blank" 
                rel="noopener noreferrer"
                whileHover={{ y: -3 }}
                className="social-icon"
              >
                <FaTwitter />
              </motion.a>
              <motion.a 
                href="https://linkedin.com" 
                target="_blank" 
                rel="noopener noreferrer"
                whileHover={{ y: -3 }}
                className="social-icon"
              >
                <FaLinkedinIn />
              </motion.a>
              <motion.a 
                href="https://instagram.com" 
                target="_blank" 
                rel="noopener noreferrer"
                whileHover={{ y: -3 }}
                className="social-icon"
              >
                <FaInstagram />
              </motion.a>
            </div>
          </motion.div>

          {/* Quick Links */}
          <motion.div 
            className="footer-links"
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.1 }}
            viewport={{ once: true }}
          >
            <h4 className="links-title">Quick Links</h4>
            <ul>
              <li><a href="">Home</a></li>
              <li><a href="/service">Disaster Updates</a></li>
              <li><a href="/registervolunteer">Volunteer</a></li>
              <li><a href="/resources">Resources</a></li>
              <li><a href="/contactus">Contact Us</a></li>
            </ul>
          </motion.div>

          {/* Contact Info */}
          <motion.div 
            className="footer-contact"
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.2 }}
            viewport={{ once: true }}
          >
            <h4 className="contact-title">Contact Us</h4>
            <ul>
              <li>
                <FiMail className="contact-icon" />
                resqlinkmanagement@gmail.com
              </li>
              <li>
                <FiPhone className="contact-icon" />
                +977 9841246229
              </li>
              <li>
                <FiMapPin className="contact-icon" />
                Budhanilkantha, Kathmandu
              </li>
            </ul>
          </motion.div>

          {/* Newsletter */}
          <motion.div 
            className="footer-newsletter"
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.3 }}
            viewport={{ once: true }}
          >
            <h4 className="newsletter-title">Stay Updated</h4>
            <p>Subscribe to our newsletter for the latest updates</p>
            
          </motion.div>
        </div>

        {/* Copyrights */}
        <motion.div 
          className="footer-copyright"
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          transition={{ duration: 0.6, delay: 0.4 }}
          viewport={{ once: true }}
        >
          <p>
            &copy; {new Date().getFullYear()} ResQLink. All rights reserved. 
            Made with <FaHeart className="heart-icon" /> for a better world,
            By Bikesh Maharjan.
          </p>
        </motion.div>
      </div>
    </footer>
  );
};

export default Footer;