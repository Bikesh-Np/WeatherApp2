import React, { useEffect, useState } from "react";
import "bootstrap/dist/css/bootstrap.min.css";
import { useParams } from "react-router-dom";
import "./VolunterProfile.css";

const VolunterProfile = () => {
  const [volunteerData, setVolunteerData] = useState([]);
  const [apiError, setApiError] = useState(null);
  const [isFetching, setIsFetching] = useState(true);
  const [enlargedDocument, setEnlargedDocument] = useState(null);
  const { id } = useParams();

  const fetchVolunteers = async () => {
    setIsFetching(true);
    try {
      const response = await fetch("/regvol/");
      if (response.ok) {
        const data = await response.json();
        setVolunteerData(data);
      } else {
        const errorData = await response.json();
        setApiError(errorData.message || "Failed to fetch volunteers");
      }
    } catch (err) {
      setApiError("Network error occurred");
    } finally {
      setIsFetching(false);
    }
  };

  const fetchIndividualVolunteer = async () => {
    setIsFetching(true);
    try {
      const response = await fetch(`/regvol/${id}/`);
      if (response.ok) {
        const data = await response.json();
        setVolunteerData([data]);
      } else {
        setApiError("Volunteer not found in database");
      }
    } catch (err) {
      setApiError("Error retrieving volunteer details");
    } finally {
      setIsFetching(false);
    }
  };

  const deleteVolunteer = async (volunteerId) => {
    if (!window.confirm("Are you sure you want to delete this volunteer?")) return;
    
    try {
      const response = await fetch(`/regvol/${volunteerId}/`, {
        method: "DELETE",
      });
      if (response.ok) {
        if (id) {
          window.location.href = "/admin/listvolunteer";
        } else {
          fetchVolunteers();
        }
      } else {
        setApiError("Failed to delete volunteer");
      }
    } catch (err) {
      setApiError("Error during deletion process");
    }
  };

  const verifyVolunteer = async (volunteerId) => {
    try {
      const response = await fetch(
        `/regvol/${volunteerId}/verify/`,
        {
          method: "PATCH",
        }
      );
      if (response.ok) {
        id ? fetchIndividualVolunteer() : fetchVolunteers();
      } else {
        setApiError("Verification process failed");
      }
    } catch (err) {
      setApiError("Error during verification");
    }
  };

  const displayDocument = (docUrl) => {
    setEnlargedDocument(docUrl);
  };

  const hideDocument = () => {
    setEnlargedDocument(null);
  };

  useEffect(() => {
    if (id) {
      fetchIndividualVolunteer();
    } else {
      fetchVolunteers();
    }
  }, [id]);

  return (
    <div className="volunteer-dashboard-container">
      <div className="dashboard-header-wrapper">
        <div className="header-content-section">
          <h1 className="main-dashboard-title">
            {id ? "Volunteer Profile" : "Volunteer Management System"}
          </h1>
          <p className="dashboard-subheading">
            {id ? "Detailed volunteer information" : "Manage all volunteer profiles and records"}
          </p>
        </div>
        <div className="header-decoration-elements">
          <div className="decorative-dot primary-dot"></div>
          <div className="decorative-dot secondary-dot"></div>
          <div className="decorative-dot tertiary-dot"></div>
        </div>
      </div>

      {isFetching && (
        <div className="data-loading-overlay">
          <div className="loading-animation-container">
            <div className="spinning-loader"></div>
            <div className="loading-status-text">Retrieving Data</div>
          </div>
        </div>
      )}

      {apiError && (
        <div className="error-message-banner">
          <div className="error-content-wrapper">
            <svg className="error-alert-icon" viewBox="0 0 24 24">
              <path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm1 15h-2v-2h2v2zm0-4h-2V7h2v6z"/>
            </svg>
            <span>{apiError}</span>
          </div>
          <button className="error-dismiss-button" onClick={() => setApiError(null)}>
            &times;
          </button>
        </div>
      )}

      {!isFetching && !apiError && volunteerData.length === 0 && (
        <div className="empty-data-state-container">
          <div className="empty-state-illustration-box">
            <svg viewBox="0 0 200 200" className="empty-state-svg">
              <circle cx="100" cy="100" r="80" fill="#f5f5f5" />
              <circle cx="70" cy="80" r="20" fill="#fff" />
              <circle cx="130" cy="80" r="20" fill="#fff" />
              <path d="M60 140 Q100 180 140 140" stroke="#fff" strokeWidth="8" fill="none" />
              <path d="M40 40 L160 160" stroke="#e0e0e0" strokeWidth="2" />
              <path d="M160 40 L40 160" stroke="#e0e0e0" strokeWidth="2" />
            </svg>
          </div>
          <h3 className="empty-state-title">No Volunteer Records Found</h3>
          <p className="empty-state-description">The system currently has no registered volunteers</p>
          <button className="refresh-data-button" onClick={id ? fetchIndividualVolunteer : fetchVolunteers}>
            Refresh Data
          </button>
        </div>
      )}

      {volunteerData.length > 0 && (
        <div className={`volunteer-grid-layout ${id ? "single-column-view" : "multi-column-view"}`}>
          {volunteerData.map((volunteer) => (
            <div className="volunteer-profile-card" key={volunteer.id}>
              <div className={`profile-card-header ${volunteer.verified ? "verified-header" : ""}`}>
                <div className="avatar-image-container">
                  <img
                    src={
                      volunteer.profile ||
                      `https://ui-avatars.com/api/?name=${encodeURIComponent(
                        `${volunteer.first_name} ${volunteer.last_name}`
                      )}&background=random&color=fff&bold=true`
                    }
                    className="volunteer-avatar-image"
                    alt={`${volunteer.username}'s profile`}
                  />
                  {volunteer.verified && (
                    <div className="verification-badge">
                      <svg viewBox="0 0 24 24">
                        <path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm-2 15l-5-5 1.41-1.41L10 14.17l7.59-7.59L19 8l-9 9z"/>
                      </svg>
                    </div>
                  )}
                </div>
                <div className="profile-info-section">
                  <h2 className="volunteer-name">
                    {volunteer.first_name} {volunteer.last_name}
                  </h2>
                  <p className="volunteer-username">@{volunteer.username}</p>
                  <div className="contact-info-section">
                    <a href={`mailto:${volunteer.email}`} className="email-contact-link">
                      <svg viewBox="0 0 24 24">
                        <path d="M20 4H4c-1.1 0-1.99.9-1.99 2L2 18c0 1.1.9 2 2 2h16c1.1 0 2-.9 2-2V6c0-1.1-.9-2-2-2zm0 4l-8 5-8-5V6l8 5 8-5v2z"/>
                      </svg>
                      {volunteer.email}
                    </a>
                    {volunteer.phone && (
                      <span className="phone-contact-info">
                        <svg viewBox="0 0 24 24">
                          <path d="M20.01 15.38c-1.23 0-2.42-.2-3.53-.56-.35-.12-.74-.03-1.01.24l-1.57 1.97c-2.83-1.35-5.48-3.9-6.89-6.83l1.95-1.66c.27-.28.35-.67.24-1.02-.37-1.11-.56-2.3-.56-3.53 0-.54-.45-.99-.99-.99H4.19C3.65 3 3 3.24 3 3.99 3 13.28 10.73 21 20.01 21c.71 0 .99-.63.99-1.18v-3.45c0-.54-.45-.99-.99-.99z"/>
                        </svg>
                        {volunteer.phone}
                      </span>
                    )}
                  </div>
                </div>
              </div>

              <div className="profile-details-section">
                <div className="details-grid-layout">
                  <div className="detail-item">
                    <span className="detail-label">Date of Birth</span>
                    <span className="detail-value">{volunteer.dob}</span>
                  </div>
                  <div className="detail-item">
                    <span className="detail-label">Availability</span>
                    <span className="detail-value">{volunteer.doa}</span>
                  </div>
                  <div className="detail-item">
                    <span className="detail-label">Skills</span>
                    <span className="detail-value">{volunteer.skill || "Not specified"}</span>
                  </div>
                  <div className="detail-item">
                    <span className="detail-label">Experience</span>
                    <span className="detail-value">{volunteer.experience || "Not specified"}</span>
                  </div>
                  <div className="detail-item">
                    <span className="detail-label">Address</span>
                    <span className="detail-value">{volunteer.address || "Not specified"}</span>
                  </div>
                  <div className="detail-item">
                    <span className="detail-label">Blood Type</span>
                    <span className={`blood-type-indicator ${volunteer.blood_group ? "type-available" : ""}`}>
                      {volunteer.blood_group || "Unknown"}
                    </span>
                  </div>
                </div>

                {volunteer.citizenship && (
                  <div className="document-verification-section">
                    <h4 className="document-section-title">National Identity Document</h4>
                    <div className="document-preview-container">
                      <img 
                        src={volunteer.citizenship} 
                        alt="ID Document" 
                        className="document-thumbnail"
                      />
                      <button 
                        className="document-zoom-button"
                        onClick={() => displayDocument(volunteer.citizenship)}
                      >
                        <svg viewBox="0 0 24 24">
                          <path d="M15.5 14h-.79l-.28-.27C15.41 12.59 16 11.11 16 9.5 16 5.91 13.09 3 9.5 3S3 5.91 3 9.5 5.91 16 9.5 16c1.61 0 3.09-.59 4.23-1.57l.27.28v.79l5 4.99L20.49 19l-4.99-5zm-6 0C7.01 14 5 11.99 5 9.5S7.01 5 9.5 5 14 7.01 14 9.5 11.99 14 9.5 14z"/>
                          <path d="M12 10h-2v2H9v-2H7V9h2V7h1v2h2v1z"/>
                        </svg>
                        View Full Size
                      </button>
                    </div>
                  </div>
                )}
              </div>

              <div className="profile-actions-section">
                <button
                  className={`action-button verify-action-button ${volunteer.verified ? "verified-state" : ""}`}
                  onClick={() => verifyVolunteer(volunteer.id)}
                  disabled={volunteer.verified}
                >
                  <svg viewBox="0 0 24 24">
                    <path d={volunteer.verified ? 
                      "M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm-2 15l-5-5 1.41-1.41L10 14.17l7.59-7.59L19 8l-9 9z" : 
                      "M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm0 18c-4.41 0-8-3.59-8-8s3.59-8 8-8 8 3.59 8 8-3.59 8-8 8z"}/>
                  </svg>
                  {volunteer.verified ? "Verified" : "Verify"}
                </button>
                <button
                  className="action-button delete-action-button"
                  onClick={() => deleteVolunteer(volunteer.id)}
                >
                  <svg viewBox="0 0 24 24">
                    <path d="M6 19c0 1.1.9 2 2 2h8c1.1 0 2-.9 2-2V7H6v12zM19 4h-3.5l-1-1h-5l-1 1H5v2h14V4z"/>
                  </svg>
                  Delete
                </button>
              </div>
            </div>
          ))}
        </div>
      )}

      {enlargedDocument && (
        <div className="document-modal-overlay">
          <div className="modal-content-container">
            <button className="modal-close-button" onClick={hideDocument}>
              <svg viewBox="0 0 24 24">
                <path d="M19 6.41L17.59 5 12 10.59 6.41 5 5 6.41 10.59 12 5 17.59 6.41 19 12 13.41 17.59 19 19 17.59 13.41 12z"/>
              </svg>
            </button>
            <img src={enlargedDocument} alt="Enlarged document view" className="enlarged-document-image" />
          </div>
        </div>
      )}
    </div>
  );
};

export default VolunterProfile;