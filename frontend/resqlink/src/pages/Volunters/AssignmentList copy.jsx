import React, { useState, useEffect } from "react";
import axios from "axios";
import { Badge, Button } from "react-bootstrap";
import { FaUser, FaCalendarAlt, FaClock, FaInfoCircle, FaMapMarkerAlt, FaSearch, FaTrash } from "react-icons/fa";
import { Link } from "react-router-dom";
import './AssignmentList.css'

const AssignmentList = () => {
  const [assignments, setAssignments] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [searchTerm, setSearchTerm] = useState('');

  useEffect(() => {
    fetchAssignments();
  }, []);

  const fetchAssignments = async () => {
    try {
      const response = await axios.get("http://127.0.0.1:8000/api/assignments/");
      setAssignments(response.data);
    } catch (err) {
      setError("Failed to fetch assignments.");
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async (id) => {
    try {
      await axios.delete(`http://127.0.0.1:8000/assignments/${id}/`);
      setAssignments(assignments.filter(assignment => assignment.id !== id));
    } catch (err) {
      setError("Failed to delete assignment.");
    }
  };

  const filteredAssignments = assignments.filter(assignment => 
    assignment.volunteer_name?.toLowerCase().includes(searchTerm.toLowerCase()) ||
    assignment.location.toLowerCase().includes(searchTerm.toLowerCase()) ||
    assignment.date.toLowerCase().includes(searchTerm.toLowerCase())
  );

  if (loading) {
    return (
      <div className="emerald-loading">
        <div className="loading-spinner"></div>
        <p>Loading assignments...</p>
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
          <FaCalendarAlt className="header-icon" />
          Volunteer Assignments
        </h1>
        <div className="search-container">
          <FaSearch className="search-icon" />
          <input
            type="text"
            placeholder="Search assignments..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
        </div>
      </div>

      {filteredAssignments.length === 0 ? (
        <div className="emerald-no-messages">
          <img src="/images/no-messages.svg" alt="No assignments" />
          <p>No assignments found</p>
        </div>
      ) : (
        <div className="emerald-messages-table-container">
          <table className="emerald-messages-table">
            <thead>
              <tr>
                <th>Volunteer</th>
                <th>Volunteer Name</th>
                <th>Location</th>
                <th>Date</th>
                <th>Time Slot</th>
                <th>Status</th>
                <th>Action</th>
              </tr>
            </thead>
            <tbody>
              {filteredAssignments.map((assignment) => (
                <tr key={assignment.id}>
                  <td>
                    <div className="user-info">
                      <FaUser className="user-icon" />
                      {assignment.volunteer_name || `Volunteer #${assignment.volunteer}`}
                    </div>
                  </td>
                  <td>
                    <div className="user-info">
                      <FaUser className="user-icon" />
                      {assignment.username || `Volunteer #${assignment.username}`}
                    </div>
                  </td>
                  <td>
                    <div className="location-info">
                      <FaMapMarkerAlt className="location-icon" />
                      {assignment.location}
                    </div>
                  </td>
                  <td>
                    <div className="date-info">
                      <FaCalendarAlt className="date-icon" />
                      {new Date(assignment.date).toLocaleDateString()}
                    </div>
                  </td>
                  <td>
                    <div className="time-info">
                      <FaClock className="time-icon" />
                      {assignment.start_time} - {assignment.end_time}
                    </div>
                  </td>
                  <td>
                    <Badge pill className={new Date(assignment.date) > new Date() ? "upcoming-badge" : "completed-badge"}>
                      {new Date(assignment.date) > new Date() ? "Upcoming" : "Completed"}
                    </Badge>
                  </td>
                  <td>
                    <button 
                      className="delete-btn"
                      onClick={() => handleDelete(assignment.id)}
                      title="Delete assignment"
                    >
                      <FaTrash />
                    </button>
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

export default AssignmentList;