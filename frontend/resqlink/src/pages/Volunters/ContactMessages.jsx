import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { FaEnvelope, FaUser, FaCalendarAlt, FaInfoCircle, FaSearch, FaMapMarkerAlt } from 'react-icons/fa';
import MapModal from './MapModal';
import './Contactms.css';

const ContactMessages = () => {
    const [messages, setMessages] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [searchTerm, setSearchTerm] = useState('');
    const [showMap, setShowMap] = useState(false);
    const [selectedLocation, setSelectedLocation] = useState(null);

    useEffect(() => {
        const fetchMessages = async () => {
            try {
                const response = await axios.get('http://127.0.0.1:8000/get-contact-messages/');
                if (response.data.status === 'success') {
                    setMessages(response.data.messages);
                } else {
                    setError('Failed to fetch messages.');
                }
            } catch (err) {
                setError('An error occurred while fetching messages.');
            } finally {
                setLoading(false);
            }
        };

        fetchMessages();
    }, []);

    const filteredMessages = messages.filter(message => 
        message.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        message.email.toLowerCase().includes(searchTerm.toLowerCase()) ||
        message.subject.toLowerCase().includes(searchTerm.toLowerCase()) ||
        message.message.toLowerCase().includes(searchTerm.toLowerCase())
    );

    const formatDate = (dateString) => {
        const options = { year: 'numeric', month: 'short', day: 'numeric', hour: '2-digit', minute: '2-digit' };
        return new Date(dateString).toLocaleDateString(undefined, options);
    };

    if (loading) {
        return (
            <div className="emerald-loading">
                <div className="loading-spinner"></div>
                <p>Loading messages...</p>
            </div>
        );
    }

    if (error) {
        return (
            <div className="emerald-error">
                <FaInfoCircle className="error-icon" />
                <p>{error}</p>
            </div>
        );
    }

    const handleViewMap = (latitude, longitude) => {
        if (latitude && longitude) {
            setSelectedLocation({ latitude, longitude });
            setShowMap(true);
        }
    };

    if (loading) {
        return (
            <div className="emerald-loading">
                <div className="loading-spinner"></div>
                <p>Loading messages...</p>
            </div>
        );
    }

    if (error) {
        return (
            <div className="emerald-error">
                <FaInfoCircle className="error-icon" />
                <p>{error}</p>
            </div>
        );
    }
    return (
        <div className="emerald-messages-container">
            <div className="emerald-messages-header">
                <h1>
                    <FaEnvelope className="header-icon" />
                    Contact Messages
                </h1>
                <div className="search-container">
                    <FaSearch className="search-icon" />
                    <input
                        type="text"
                        placeholder="Search messages..."
                        value={searchTerm}
                        onChange={(e) => setSearchTerm(e.target.value)}
                    />
                </div>
            </div>

            
            {filteredMessages.length === 0 ? (
                <div className="emerald-no-messages">
                    <img src="/images/no-messages.svg" alt="No messages" />
                    <p>No messages found</p>
                </div>
            ) : (
                <div className="emerald-messages-table-container">
                    <table className="emerald-messages-table">
                        <thead>
                            <tr>
                                <th>Name</th>
                                <th>Email</th>
                                <th>Subject</th>
                                <th>Message</th>
                                <th>Date</th>
                                <th>Location</th>
                            </tr>
                        </thead>
                        <tbody>
                            {filteredMessages.map((message) => (
                                <tr key={message.id}>
                                    <td>
                                        <div className="user-info">
                                            <FaUser className="user-icon" />
                                            {message.name}
                                        </div>
                                    </td>
                                    <td>
                                        <a href={`mailto:${message.email}`} className="email-link">
                                            {message.email}
                                        </a>
                                    </td>
                                    <td>{message.subject}</td>
                                    <td className="message-content">
                                        <div className="message-preview">
                                            {message.message.length > 50 
                                                ? `${message.message.substring(0, 50)}...` 
                                                : message.message}
                                        </div>
                                        {message.message.length > 50 && (
                                            <div className="message-tooltip">{message.message}</div>
                                        )}
                                    </td>
                          
                                    <td>
                                        <div className="date-info">
                                            <FaCalendarAlt className="date-icon" />
                                            {formatDate(message.created_at)}
                                        </div>
                                    </td>
                                    <td>
                                        {message.latitude && message.longitude ? (
                                            <button 
                                                className="view-map-btn"
                                                onClick={() => handleViewMap(message.latitude, message.longitude)}
                                            >
                                                <FaMapMarkerAlt /> View Map
                                            </button>
                                        ) : (
                                            <span className="no-location">No location</span>
                                        )}
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
            )}

            {showMap && selectedLocation && (
                <MapModal 
                    latitude={selectedLocation.latitude}
                    longitude={selectedLocation.longitude}
                    onClose={() => setShowMap(false)}
                />
            )}
            
        </div>
    );
};

export default ContactMessages;