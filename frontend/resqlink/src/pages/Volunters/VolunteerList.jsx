import React, { useEffect, useState } from "react";
import axios from "axios";
import { Table, Container, Spinner, Alert, Button, Badge } from "react-bootstrap";
import { FaEye, FaUser, FaCalendarAlt, FaSearch, FaInfoCircle } from "react-icons/fa";
import { Link } from "react-router-dom";

const VolunteerList = () => {
  const [volunteers, setVolunteers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [searchTerm, setSearchTerm] = useState('');

  useEffect(() => {
    const fetchVolunteers = async () => {
      try {
        const response = await axios.get("/regvol/");
        setVolunteers(response.data);
      } catch (err) {
        setError("Failed to fetch volunteers.");
      } finally {
        setLoading(false);
      }
    };

    fetchVolunteers();
  }, []);

  const filteredVolunteers = volunteers.filter(volunteer => 
    volunteer.username.toLowerCase().includes(searchTerm.toLowerCase()) ||
    volunteer.email.toLowerCase().includes(searchTerm.toLowerCase()) ||
    volunteer.dob.toLowerCase().includes(searchTerm.toLowerCase())
  );

  if (loading) {
    return (
      <div className="emerald-loading">
        <div className="loading-spinner"></div>
        <p>Loading volunteers...</p>
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
          <FaUser className="header-icon" />
          Volunteer Roster
        </h1>
        <div className="search-container">
          <FaSearch className="search-icon" />
          <input
            type="text"
            placeholder="Search volunteers..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
        </div>
      </div>

      {filteredVolunteers.length === 0 ? (
        <div className="emerald-no-messages">
          <img src="/images/no-messages.svg" alt="No volunteers" />
          <p>No volunteers found</p>
        </div>
      ) : (
        <div className="emerald-messages-table-container">
          <table className="emerald-messages-table">
            <thead>
              <tr>
                <th>Username</th>
                <th>Email</th>
                <th>Date of Birth</th>
                <th>Status</th>
                <th>Actions</th>
              </tr>
            </thead>
            <tbody>
              {filteredVolunteers.map((volunteer) => (
                <tr key={volunteer.id}>
                  <td>
                    <div className="user-info">
                      <FaUser className="user-icon" />
                      {volunteer.username}
                    </div>
                  </td>
                  <td>
                    <a href={`mailto:${volunteer.email}`} className="email-link">
                      {volunteer.email}
                    </a>
                  </td>
                  <td>
                    <div className="date-info">
                      <FaCalendarAlt className="date-icon" />
                      {volunteer.dob}
                    </div>
                  </td>
                  <td>
                    {volunteer.verified ? (
                      <Badge pill className="verified-badge">
                        Verified
                      </Badge>
                    ) : (
                      <Badge pill className="pending-badge">
                        Pending
                      </Badge>
                    )}
                  </td>
                  <td>
                    <Link to={`/admin/volunteerprof/${volunteer.id}`}>
                      <Button variant="outline-success" className="profile-action-btn">
                        <FaEye className="action-icon" /> View
                      </Button>
                    </Link>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
};

export default VolunteerList;