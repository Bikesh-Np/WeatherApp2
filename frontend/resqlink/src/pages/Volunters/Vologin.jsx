import React, { useState } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import { Form, Button, Container, Alert, Spinner, Card, Row, Col } from 'react-bootstrap';
import { FaLeaf, FaEnvelope, FaCalendarAlt, FaHandsHelping } from 'react-icons/fa';
import './Vologin.css'; // We'll create this CSS file

function Vologin() {
  const [email, setEmail] = useState('');
  const [dob, setDob] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError('');

    try {
      const response = await axios.post('/api/volunteer/login/', {
        email,
        dob,
      });

      if (response.data.status === 'success') {
        localStorage.setItem('volunteer', JSON.stringify(response.data.volunteer));
        localStorage.setItem('volunteerEmail', response.data.volunteer.email);
        navigate('/volid');
      } else {
        setError('Login failed. Please try again.');
      }
    } catch (err) {
      setError('Invalid email or date of birth or not verified.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="volunteer-gateway">
      <div className="eco-backdrop"></div>
      
      <div className="green-portal-container">
        <div className="nature-side-panel">
          <div className="eco-brand">
            <FaLeaf className="portal-icon" />
            <h2>Welocome to the Volunteer Login Portal..</h2>
            
          </div>
          <div className="eco-illustration"></div>
        </div>
        
        <div className="access-panel">
          <div className="portal-header">
            <FaHandsHelping className="access-icon" />
            <h3>Volunteer Portal</h3>
            <p>Welcome back, earth champion!</p>
          </div>
          
          {error && <Alert variant="danger" className="portal-alert">{error}</Alert>}
          
          <Form onSubmit={handleSubmit} className="gateway-form">
            <div className="form-field-group">
              <FaEnvelope className="input-ic" />
              <Form.Control
                type="email"
                placeholder="Your registered email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
                className="eco-input"
              />
            </div>
            
            <div className="form-field-group">
              <FaCalendarAlt className="input-ic" />
              <Form.Control
                type="date"
                value={dob}
                onChange={(e) => setDob(e.target.value)}
                required
                className="eco-input"
              />
            </div>
            
            <Button 
              type="submit" 
              className="portal-submit-btn"
              disabled={loading}
            >
              {loading ? (
                <Spinner animation="border" size="sm" role="status" />
              ) : (
                'Access Your Volunteer ID'
              )}
            </Button>
          </Form>
          
          <div className="portal-footer">
            <p>New to our cause? <a href="/register" className="portal-link">Join us</a></p>
          </div>
        </div>
      </div>
    </div>
  );
}

export default Vologin;