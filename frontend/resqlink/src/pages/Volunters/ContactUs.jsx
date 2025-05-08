import React, { useState } from 'react';
import axios from 'axios';
import { FaPaperPlane, FaUser, FaEnvelope, FaTag, FaComment, FaMapMarkerAlt, FaSpinner, FaLocationArrow } from 'react-icons/fa';
import './ContactUs.css';

const ContactUs = () => {
    const [formData, setFormData] = useState({
        name: '',
        email: '',
        subject: '',
        message: '',
        latitude: '',
        longitude: '',
        accuracy: ''
    });
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [submitStatus, setSubmitStatus] = useState(null);
    const [isLocating, setIsLocating] = useState(false);
    const [locationError, setLocationError] = useState(null);

    const handleChange = (e) => {
        setFormData({
            ...formData,
            [e.target.name]: e.target.value
        });
    };

    const handleGetLocation = async () => {
        if (!navigator.geolocation) {
            setLocationError('Geolocation not supported');
            return;
        }

        setIsLocating(true);
        setLocationError(null);

        try {
            const position = await new Promise((resolve, reject) => {
                navigator.geolocation.getCurrentPosition(resolve, reject, {
                    enableHighAccuracy: true,
                    timeout: 10000,
                    maximumAge: 0
                });
            });

            const { latitude, longitude, accuracy } = position.coords;
            
            setFormData({
                ...formData,
                latitude: latitude.toFixed(6),
                longitude: longitude.toFixed(6),
                accuracy: accuracy.toFixed(2)
            });

        } catch (err) {
            if (err.code) {
                switch (err.code) {
                    case err.PERMISSION_DENIED:
                        setLocationError('Permission denied. Please allow location access.');
                        break;
                    case err.POSITION_UNAVAILABLE:
                        setLocationError('Location unavailable. Try again outdoors.');
                        break;
                    case err.TIMEOUT:
                        setLocationError('Request timed out. Please check your GPS signal.');
                        break;
                    default:
                        setLocationError('Failed to get location.');
                }
            } else {
                setLocationError('Failed to get location.');
            }
        } finally {
            setIsLocating(false);
        }
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setIsSubmitting(true);
        setSubmitStatus(null);
        
        try {
            const response = await axios.post('http://127.0.0.1:8000/contact-us/', formData);
            setSubmitStatus({ success: true, message: response.data.message });
            setFormData({ 
                name: '', 
                email: '', 
                subject: '', 
                message: '',
                latitude: '',
                longitude: '',
                accuracy: ''
            });
        } catch (error) {
            setSubmitStatus({ 
                success: false, 
                message: error.response?.data?.message || 'An error occurred while sending the message.' 
            });
        } finally {
            setIsSubmitting(false);
        }
    };

    return (
        <div className="emerald-contact-container">
            <div className="emerald-contact-card">
                <div className="emerald-contact-header">
                    <h2>Get In Touch</h2>
                    <p>We'd love to hear from you! Send us a message and we'll respond as soon as possible.</p>
                </div>

                <form onSubmit={handleSubmit} className="emerald-contact-form">
                    <div className="emerald-input-group">
                        <div className="emerald-input-icon">
                            <FaUser />
                        </div>
                        <input
                            type="text"
                            name="name"
                            placeholder="Your Name"
                            value={formData.name}
                            onChange={handleChange}
                            required
                        />
                    </div>

                    <div className="emerald-input-group">
                        <div className="emerald-input-icon">
                            <FaEnvelope />
                        </div>
                        <input
                            type="email"
                            name="email"
                            placeholder="Your Email"
                            value={formData.email}
                            onChange={handleChange}
                            required
                        />
                    </div>

                    <div className="emerald-input-group">
                        <div className="emerald-input-icon">
                            <FaTag />
                        </div>
                        <input
                            type="text"
                            name="subject"
                            placeholder="Subject"
                            value={formData.subject}
                            onChange={handleChange}
                            required
                        />
                    </div>

                    <div className="emerald-input-group">
                        <div className="emerald-input-icon">
                            <FaComment />
                        </div>
                        <textarea
                            name="message"
                            placeholder="Your Message"
                            value={formData.message}
                            onChange={handleChange}
                            required
                            rows="5"
                        />
                    </div>

                    <div className="location-section">
                        <button 
                            type="button" 
                            onClick={handleGetLocation}
                            disabled={isLocating}
                            className={`location-btn ${isLocating ? 'loading' : ''}`}
                        >
                            {isLocating ? (
                                <>
                                    <FaSpinner className="spin" />
                                    Locating...
                                </>
                            ) : (
                                <>
                                    <FaLocationArrow />
                                    Get My Location
                                </>
                            )}
                        </button>

                        {formData.latitude && formData.longitude && (
                            <div className="location-details">
                                <p>Location: {formData.latitude}, {formData.longitude}</p>
                                {formData.accuracy && <p>Accuracy: ±{parseFloat(formData.accuracy).toFixed(0)} meters</p>}
                            </div>
                        )}

                        {locationError && (
                            <div className="location-error">
                                <p>{locationError}</p>
                            </div>
                        )}
                    </div>

                    {submitStatus && (
                        <div className={`emerald-alert ${submitStatus.success ? 'success' : 'error'}`}>
                            {submitStatus.message}
                        </div>
                    )}

                    <button type="submit" disabled={isSubmitting} className="emerald-submit-btn">
                        {isSubmitting ? (
                            'Sending...'
                        ) : (
                            <>
                                <FaPaperPlane className="send-icon" />
                                Send Message
                            </>
                        )}
                    </button>
                </form>
            </div>

            <div className="emerald-contact-info">
                <h3>Contact Information</h3>
                <div className="info-item">
                    <div className="info-icon">
                        <i className="bi bi-geo-alt"></i>
                    </div>
                    <p>ResQLink, Nepal</p>
                </div>
                <div className="info-item">
                    <div className="info-icon">
                        <i className="bi bi-telephone"></i>
                    </div>
                    <p>+977 9841246229</p>
                </div>
                <div className="info-item">
                    <div className="info-icon">
                        <i className="bi bi-envelope"></i>
                    </div>
                    <p>resqlinkmanagement@gmail.com</p>
                </div>
            </div>
        </div>
    );
};

export default ContactUs;