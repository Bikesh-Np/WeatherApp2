import React, { useEffect, useState, useRef } from 'react';
import axios from 'axios';
import { Spinner, Alert, Button, Image, Card } from 'react-bootstrap';
import { FaLeaf, FaArrowLeft, FaDownload } from 'react-icons/fa';
import html2canvas from 'html2canvas';
import './Volid.css';

function Volid() {
  const [volunteer, setVolunteer] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const idCardRef = useRef(null);

  useEffect(() => {
    const fetchVolunteerData = async () => {
      const email = localStorage.getItem('volunteerEmail');

      if (!email) {
        setError('No volunteer email found in localStorage.');
        setLoading(false);
        return;
      }

      try {
        const response = await axios.get(`/api/volunteer/${email}/`);
        if (response.data) {
          setVolunteer(response.data);
        } else {
          setError('No volunteer data received');
        }
      } catch (err) {
        setError(err.response?.data?.message || 'Failed to fetch volunteer details.');
      } finally {
        setLoading(false);
      }
    };

    fetchVolunteerData();
  }, []);

  const handleDownload = () => {
    if (!idCardRef.current) return;

    html2canvas(idCardRef.current, {
      scale: 2, // Higher quality
      logging: false,
      useCORS: true,
      allowTaint: true
    }).then(canvas => {
      const link = document.createElement('a');
      link.download = `volunteer-id-${volunteer?.id || 'card'}.png`;
      link.href = canvas.toDataURL('image/png');
      link.click();
    });
  };

  if (loading) {
    return (
      <div className="eco-loading-screen">
        <div className="eco-spinner-container">
          <Spinner animation="border" role="status" className="eco-spinner">
            <span className="visually-hidden">Loading...</span>
          </Spinner>
          <p className="eco-loading-text">Growing your volunteer ID...</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="eco-error-screen">
        <div className="eco-alert-container">
          <Alert variant="danger" className="eco-alert">
            <FaLeaf className="me-2" />
            {error}
          </Alert>
          <Button 
            variant="outline-success" 
            onClick={() => window.history.back()} 
            className="eco-back-btn"
          >
            <FaArrowLeft className="me-2" />
            Back
          </Button>
        </div>
      </div>
    );
  }

  if (!volunteer) {
    return (
      <div className="eco-error-screen">
        <div className="eco-alert-container">
          <Alert variant="warning" className="eco-alert">
            <FaLeaf className="me-2" />
            No volunteer data available
          </Alert>
          <Button 
            variant="outline-success" 
            onClick={() => window.history.back()} 
            className="eco-back-btn"
          >
            <FaArrowLeft className="me-2" />
            Back
          </Button>
        </div>
      </div>
    );
  }

  return (
    <div className="eco-id-portal">
      <div className="eco-id-container">
        <div className="eco-id-card-wrapper" ref={idCardRef}>
          <Card className="eco-id-card">
            <div className="eco-card-header">
              <div className="eco-card-watermark">
                <FaLeaf className="watermark-icon" />
                <span>@ResQLink-2024</span>
              </div>
              
              <div className="eco-card-title">
                <h2>VOLUNTEER ID</h2>
                <p>Disaster Relief Management</p>
              </div>
              
              <div className="eco-card-corner eco-corner-tl"></div>
              <div className="eco-card-corner eco-corner-tr"></div>
            </div>
            
            <Card.Body className="eco-card-body">
              <div className="eco-avatar-section">
                <div className="eco-avatar-frame">
                  <Image
                    src={volunteer.profile ? `${volunteer.profile}` : '/default-profile.png'}
                    alt="Profile"
                    className="eco-avatar-image"
                    onError={(e) => {
                      e.target.onerror = null; 
                      e.target.src = '/default-profile.png'
                    }}
                  />
                </div>
                <div className={`eco-verified-badge ${volunteer.verified ? 'verified' : 'unverified'}`}>
                  <FaLeaf className="me-1" />
                  {volunteer.verified ? 'Verified' : 'Unverified'}
                </div>
              </div>

              <div className="eco-details-section">
                <div className="eco-volunteer-name">
                  {volunteer.first_name} {volunteer.last_name}
                </div>
                
                <div className="eco-details-grid">
                  <div className="eco-detail-item">
                    <span className="eco-detail-label">Email</span>
                    <span className="eco-detail-value">{volunteer.email}</span>
                  </div>
                  
                  <div className="eco-detail-item">
                    <span className="eco-detail-label">Phone</span>
                    <span className="eco-detail-value">{volunteer.phone || 'N/A'}</span>
                  </div>
                  
                  <div className="eco-detail-item">
                    <span className="eco-detail-label">DOB</span>
                    <span className="eco-detail-value">{volunteer.dob || 'N/A'}</span>
                  </div>
                  
                  <div className="eco-detail-item">
                    <span className="eco-detail-label">Address</span>
                    <span className="eco-detail-value">{volunteer.address || 'N/A'}</span>
                  </div>
                  
                  <div className="eco-detail-item">
                    <span className="eco-detail-label">Skill</span>
                    <span className="eco-detail-value">{volunteer.skill || 'N/A'}</span>
                  </div>
                  
                  <div className="eco-detail-item">
                    <span className="eco-detail-label">Experience</span>
                    <span className="eco-detail-value">{volunteer.experience || 'N/A'}</span>
                  </div>
                  
                  <div className="eco-detail-item">
                    <span className="eco-detail-label">Blood Group</span>
                    <span className="eco-detail-value">{volunteer.blood_group || 'N/A'}</span>
                  </div>
                </div>
              </div>
            </Card.Body>
            
            <div className="eco-card-footer">
              <div className="eco-id-number">ID: {volunteer.id}</div>
              <div className="eco-organization-signature">
                @ResQLink-2024
              </div>
            </div>
          </Card>
        </div>

        <div className="eco-action-panel">
          <Button 
            variant="outline-success" 
            onClick={() => window.history.back()} 
            className="eco-back-btn"
          >
            <FaArrowLeft className="me-2" />
            Back
          </Button>
          <Button 
            variant="success" 
            onClick={handleDownload}
            className="eco-download-btn ms-3"
          >
            <FaDownload className="me-2" />
            Download ID
          </Button>
        </div>
      </div>
    </div>
  );
}

export default Volid;