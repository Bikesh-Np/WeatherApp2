import React, { useEffect, useState } from "react";
import axios from "axios";
import { 
  FaTrash, 
  FaEye, 
  FaEdit, 
  FaTimes, 
  FaCheck, 
  FaSearch,
  FaUser,
  FaEnvelope,
  FaPhone,
  FaCalendarAlt,
  FaIdCard
} from "react-icons/fa";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import "./AdminUserList.css";

const AdminUserList = () => {
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [verifyingUsers, setVerifyingUsers] = useState(new Set());
  const [error, setError] = useState(null);
  const [selectedUser, setSelectedUser] = useState(null);
  const [showDetailsModal, setShowDetailsModal] = useState(false);
  const [isEditing, setIsEditing] = useState(false);
  const [formData, setFormData] = useState({
    email: "",
    username: "",
    first_name: "",
    last_name: "",
    dob: "",
    phone: "",
    image: null,
    citizenship: null
  });
  const [searchTerm, setSearchTerm] = useState("");
  const [showZoomModal, setShowZoomModal] = useState(false);
  const [zoomImageSrc, setZoomImageSrc] = useState("");

  useEffect(() => {
    const fetchUsers = async () => {
      try {
        const token = localStorage.getItem("accessToken");
        if (!token) {
          throw new Error("No authentication token found. Please log in.");
        }

        const response = await axios.get("/users/", {
          headers: {
            Authorization: `Bearer ${token}`,
            "Content-Type": "application/json",
          },
        });

        setUsers(response.data);
      } catch (error) {
        setError(error.response?.data?.message || "Failed to fetch users");
        toast.error(error.response?.data?.message || "Failed to fetch users");
      } finally {
        setLoading(false);
      }
    };

    fetchUsers();
  }, []);

  const filteredUsers = users.filter(user => 
    user.email.toLowerCase().includes(searchTerm.toLowerCase()) ||
    user.username.toLowerCase().includes(searchTerm.toLowerCase()) ||
    user.first_name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    user.last_name.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const toggleUserVerification = async (userId, isChecked) => {
    setVerifyingUsers(prev => new Set(prev).add(userId));

    try {
      const token = localStorage.getItem("accessToken");
      if (!token) {
        throw new Error("No authentication token found. Please log in.");
      }

      await axios.post(
        `/verify-user/${userId}/`,
        { is_verified: isChecked },
        {
          headers: {
            Authorization: `Bearer ${token}`,
            "Content-Type": "application/json",
          },
        }
      );

      setUsers(users.map(user => 
        user.id === userId ? { ...user, is_verified: isChecked } : user
      ));
      toast.success(`User ${isChecked ? "verified" : "unverified"} successfully`);
    } catch (error) {
      toast.error(error.response?.data?.message || "Failed to update verification status");
    } finally {
      setVerifyingUsers(prev => {
        const updated = new Set(prev);
        updated.delete(userId);
        return updated;
      });
    }
  };

  const deleteUser = async (userId) => {
    if (!window.confirm("Are you sure you want to delete this user?")) return;

    try {
      const token = localStorage.getItem("accessToken");
      if (!token) {
        throw new Error("No authentication token found. Please log in.");
      }

      await axios.delete(`/delete_user/${userId}/`, {
        headers: {
          Authorization: `Bearer ${token}`,
          "Content-Type": "application/json",
        },
      });

      setUsers(users.filter(user => user.id !== userId));
      toast.success("User deleted successfully!");
    } catch (error) {
      toast.error(error.response?.data?.message || "Failed to delete user");
    }
  };

  const viewUserDetails = (user) => {
    setSelectedUser(user);
    setFormData({
      email: user.email,
      username: user.username,
      first_name: user.first_name,
      last_name: user.last_name,
      dob: user.dob,
      phone: user.phone,
      image: user.image,
      citizenship: user.citizenship
    });
    setShowDetailsModal(true);
    setIsEditing(false);
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData({
      ...formData,
      [name]: value,
    });
  };

  const handleImageChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      setFormData({
        ...formData,
        image: URL.createObjectURL(file),
      });
    }
  };

  const handleCitizenshipChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      setFormData({
        ...formData,
        citizenship: URL.createObjectURL(file),
      });
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const token = localStorage.getItem("accessToken");
      const formDataToSend = new FormData();

      formDataToSend.append("email", formData.email);
      formDataToSend.append("username", formData.username);
      formDataToSend.append("first_name", formData.first_name);
      formDataToSend.append("last_name", formData.last_name);
      formDataToSend.append("dob", formData.dob);
      formDataToSend.append("phone", formData.phone);

      const response = await axios.put(
        `/update-user/${selectedUser.id}/`,
        formDataToSend,
        {
          headers: {
            Authorization: `Bearer ${token}`,
            "Content-Type": "multipart/form-data",
          },
        }
      );

      setUsers(users.map(user => 
        user.id === selectedUser.id ? response.data : user
      ));
      setSelectedUser(response.data);
      setIsEditing(false);
      toast.success("User updated successfully!");
    } catch (error) {
      toast.error(`Failed to update user: ${error.response?.data?.error || error.message}`);
    }
  };

  const handleZoomImage = (imageSrc) => {
    setZoomImageSrc(imageSrc);
    setShowZoomModal(true);
  };

  const formatDate = (dateString) => {
    if (!dateString) return "N/A";
    const options = { year: 'numeric', month: 'long', day: 'numeric' };
    return new Date(dateString).toLocaleDateString(undefined, options);
  };

  return (
    <div className="emerald-admin-container">
      <ToastContainer position="top-center" />
      
      <div className="emerald-admin-header">
        <h1>
          <FaUser className="header-icon" />
          User Management
        </h1>
        <div className="search-container">
          <FaSearch className="search-icon" />
          <input
            type="text"
            placeholder="Search users..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
        </div>
      </div>

      {loading ? (
        <div className="loading-spinner-container">
          <div className="loading-spinner"></div>
          <p>Loading users...</p>
        </div>
      ) : error ? (
        <div className="error-message">
          <p>{error}</p>
        </div>
      ) : filteredUsers.length === 0 ? (
        <div className="no-users-message">
          <img src="/images/no-users.svg" alt="No users found" />
          <p>No users found</p>
        </div>
      ) : (
        <div className="users-table-container">
          <table className="users-table">
            <thead>
              <tr>
                <th>ID</th>
                <th>Username</th>
                <th>Email</th>
                <th>Name</th>
                <th>Verified</th>
                <th>Actions</th>
              </tr>
            </thead>
            <tbody>
              {filteredUsers.map((user) => (
                <tr key={user.id}>
                  <td>{user.id}</td>
                  <td>{user.username}</td>
                  <td>
                    <a href={`mailto:${user.email}`} className="email-link">
                      {user.email}
                    </a>
                  </td>
                  <td>{user.first_name} {user.last_name}</td>
                  <td>
                    {verifyingUsers.has(user.id) ? (
                      <div className="verification-spinner"></div>
                    ) : (
                      <label className="verification-toggle">
                        <input
                          type="checkbox"
                          checked={user.is_verified}
                          onChange={(e) => toggleUserVerification(user.id, e.target.checked)}
                        />
                        <span className="toggle-slider"></span>
                      </label>
                    )}
                  </td>
                  <td>
                    <div className="action-buttons">
                      <button 
                        onClick={() => viewUserDetails(user)}
                        className="view-btn"
                      >
                        <FaEye />
                      </button>
                      <button 
                        onClick={() => deleteUser(user.id)}
                        className="delete-btn"
                      >
                        <FaTrash />
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}

      {/* User Details Modal */}
      <div className={`modal-overlay ${showDetailsModal ? 'active' : ''}`}>
        <div className="user-details-modal">
          <div className="modal-header">
            <h2>
              {isEditing ? 'Edit User' : 'User Details'}
            </h2>
            <button 
              onClick={() => setShowDetailsModal(false)}
              className="close-modal"
            >
              &times;
            </button>
          </div>

          <div className="modal-content">
            {selectedUser && (
              <>
                <div className="user-profile-section">
                  <div className="profile-image-container">
                    <img
                      src={formData.image || "/images/default-profile.png"}
                      alt="Profile"
                      className="profile-image"
                    />
                    {isEditing && (
                      <div className="image-upload">
                        <label>
                          Change Image
                          <input
                            type="file"
                            name="image"
                            onChange={handleImageChange}
                            accept="image/*"
                          />
                        </label>
                      </div>
                    )}
                  </div>

                  {isEditing ? (
                    <form onSubmit={handleSubmit} className="edit-form">
                      <div className="form-group">
                        <label>
                          <FaEnvelope /> Email
                        </label>
                        <input
                          type="email"
                          name="email"
                          value={formData.email}
                          onChange={handleInputChange}
                          required
                        />
                      </div>

                      <div className="form-group">
                        <label>
                          <FaUser /> Username
                        </label>
                        <input
                          type="text"
                          name="username"
                          value={formData.username}
                          onChange={handleInputChange}
                          required
                        />
                      </div>

                      <div className="form-row">
                        <div className="form-group">
                          <label>First Name</label>
                          <input
                            type="text"
                            name="first_name"
                            value={formData.first_name}
                            onChange={handleInputChange}
                            required
                          />
                        </div>
                        <div className="form-group">
                          <label>Last Name</label>
                          <input
                            type="text"
                            name="last_name"
                            value={formData.last_name}
                            onChange={handleInputChange}
                            required
                          />
                        </div>
                      </div>

                      <div className="form-row">
                        <div className="form-group">
                          <label>
                            <FaCalendarAlt /> Date of Birth
                          </label>
                          <input
                            type="date"
                            name="dob"
                            value={formData.dob}
                            onChange={handleInputChange}
                            required
                          />
                        </div>
                        <div className="form-group">
                          <label>
                            <FaPhone /> Phone
                          </label>
                          <input
                            type="text"
                            name="phone"
                            value={formData.phone}
                            onChange={handleInputChange}
                            required
                          />
                        </div>
                      </div>

                      <div className="form-group">
                        <label>
                          <FaIdCard /> Citizenship Document
                        </label>
                        {formData.citizenship ? (
                          <div className="document-preview">
                            <img
                              src={formData.citizenship}
                              alt="Citizenship"
                              onClick={() => handleZoomImage(formData.citizenship)}
                            />
                            {isEditing && (
                              <input
                                type="file"
                                name="citizenship"
                                onChange={handleCitizenshipChange}
                                accept="image/*"
                              />
                            )}
                          </div>
                        ) : (
                          <input
                            type="file"
                            name="citizenship"
                            onChange={handleCitizenshipChange}
                            accept="image/*"
                          />
                        )}
                      </div>

                      <div className="form-actions">
                        <button type="submit" className="save-btn">
                          <FaCheck /> Save Changes
                        </button>
                        <button
                          type="button"
                          onClick={() => setIsEditing(false)}
                          className="cancel-btn"
                        >
                          <FaTimes /> Cancel
                        </button>
                      </div>
                    </form>
                  ) : (
                    <div className="user-info">
                      <div className="info-item">
                        <FaEnvelope className="info-icon" />
                        <span>{selectedUser.email}</span>
                      </div>
                      <div className="info-item">
                        <FaUser className="info-icon" />
                        <span>{selectedUser.username}</span>
                      </div>
                      <div className="info-item">
                        <span className="info-label">Full Name:</span>
                        <span>{selectedUser.first_name} {selectedUser.last_name}</span>
                      </div>
                      <div className="info-item">
                        <FaCalendarAlt className="info-icon" />
                        <span>{formatDate(selectedUser.dob)}</span>
                      </div>
                      <div className="info-item">
                        <FaPhone className="info-icon" />
                        <span>{selectedUser.phone || 'N/A'}</span>
                      </div>
                      <div className="info-item">
                        <span className="info-label">Verified:</span>
                        <span className={`verification-status ${selectedUser.is_verified ? 'verified' : 'not-verified'}`}>
                          {selectedUser.is_verified ? 'Verified' : 'Not Verified'}
                        </span>
                      </div>

                      {selectedUser.citizenship && (
                        <div className="document-section">
                          <h4>
                            <FaIdCard /> Citizenship Document
                          </h4>
                          <div className="document-preview">
                            <img
                              src={selectedUser.citizenship}
                              alt="Citizenship"
                              onClick={() => handleZoomImage(selectedUser.citizenship)}
                            />
                          </div>
                        </div>
                      )}

                     
                    </div>
                  )}
                </div>
              </>
            )}
          </div>
        </div>
      </div>

      {/* Zoom Modal */}
      <div className={`zoom-modal-overlay ${showZoomModal ? 'active' : ''}`}>
        <div className="zoom-modal">
          <button 
            onClick={() => setShowZoomModal(false)}
            className="close-zoom-modal"
          >
            &times;
          </button>
          <img src={zoomImageSrc} alt="Zoomed Document" />
        </div>
      </div>
    </div>
  );
};

export default AdminUserList;