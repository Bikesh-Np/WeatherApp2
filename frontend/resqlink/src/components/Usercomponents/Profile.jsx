import React, { useEffect, useState } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { FiEdit, FiSave, FiX, FiUser, FiMail, FiPhone, FiCalendar, FiFileText } from "react-icons/fi";
import "./Profile.css";

const Profile = () => {
  const [user, setUser] = useState(null);
  const [isEditing, setIsEditing] = useState(false);
  const [formData, setFormData] = useState({
    email: "",
    username: "",
    first_name: "",
    last_name: "",
    dob: "",
    phone: "",
    citizenship: null,
    image: null,
  });
  const [selectedImage, setSelectedImage] = useState(null);
  const [selectedCitizenship, setSelectedCitizenship] = useState(null);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchUserProfile = async () => {
      try {
        const token = localStorage.getItem("token");
        if (!token) {
          navigate("/login");
          return;
        }

        const response = await axios.get("http://127.0.0.1:8000/profile/", {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });

        if (response.status === 200) {
          setUser(response.data);
          setFormData({
            email: response.data.email,
            username: response.data.username,
            first_name: response.data.first_name,
            last_name: response.data.last_name,
            dob: response.data.dob,
            phone: response.data.phone || "",
            citizenship: response.data.citizenship || null,
            image: response.data.image || null,
          });
        }
      } catch (err) {
        toast.error(`Failed to fetch user profile: ${err.response?.data?.error || err.message}`);
        navigate("/login");
      }
    };

    fetchUserProfile();
  }, [navigate]);

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
      setSelectedImage(file);
      setFormData({
        ...formData,
        image: URL.createObjectURL(file),
      });
    }
  };

  const handleCitizenshipChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      setSelectedCitizenship(file);
      setFormData({
        ...formData,
        citizenship: URL.createObjectURL(file),
      });
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const token = localStorage.getItem("token");
      const formDataToSend = new FormData();

      formDataToSend.append("email", formData.email);
      formDataToSend.append("username", formData.username);
      formDataToSend.append("first_name", formData.first_name);
      formDataToSend.append("last_name", formData.last_name);
      formDataToSend.append("dob", formData.dob);
      formDataToSend.append("phone", formData.phone);

      if (selectedImage) {
        formDataToSend.append("image", selectedImage);
      }

      if (selectedCitizenship) {
        formDataToSend.append("citizenship", selectedCitizenship);
      }

      const response = await axios.put(
        "http://127.0.0.1:8000/profile/",
        formDataToSend,
        {
          headers: {
            Authorization: `Bearer ${token}`,
            "Content-Type": "multipart/form-data",
          },
        }
      );

      if (response.status === 200) {
        toast.success("Profile updated successfully!");
        window.location.reload(); // This will refresh the page
      }
    } catch (err) {
      toast.error(`Failed to update profile: ${err.response?.data?.error || err.message}`);
    }
  };

  if (!user) {
    return (
      <div className="d-flex justify-content-center align-items-center vh-100">
        <div className="spinner-border text-primary" role="status">
          <span className="visually-hidden">Loading...</span>
        </div>
      </div>
    );
  }

  return (
    <>
      <ToastContainer position="top-center" autoClose={3000} />
      <section className="profile-section py-5">
        <div className="container">
          <div className="row justify-content-center">
            <div className="col-lg-8">
              <div className="card profile-card shadow-sm border-0">
                <div className="card-header bg-white border-0 pt-4">
                  <div className="d-flex justify-content-between align-items-center">
                    <h3 className="mb-0">
                      <FiUser className="me-2" />
                      User Profile
                    </h3>
                  </div>
                </div>
                
                <div className="card-body p-4">
                  <div className="text-center mb-4">
                    <div className="profile-pic-container mx-auto">
                      <img
                        src={user.image || "https://ui-avatars.com/api/?name="+user.first_name+"+"+user.last_name+"&background=random"}
                        alt="Profile"
                        className="profile-pic rounded-circle shadow"
                      />
                      {isEditing && (
                        <div className="image-upload-overlay">
                          <label htmlFor="image-upload" className="btn btn-sm btn-light">
                            Change Photo
                          </label>
                          <input
                            id="image-upload"
                            type="file"
                            name="image"
                            onChange={handleImageChange}
                            accept="image/*"
                            className="d-none"
                          />
                        </div>
                      )}
                    </div>
                    <h4 className="mt-3 mb-0">{user.first_name} {user.last_name}</h4>
                    <p className="text-muted">@{user.username}</p>
                  </div>

                  {isEditing ? (
                    <form onSubmit={handleSubmit}>
                      <div className="row">
                        <div className="col-md-6 mb-3">
                          <label className="form-label">First Name</label>
                          <div className="input-group">
                            <span className="input-group-text">
                              <FiUser />
                            </span>
                            <input
                              type="text"
                              name="first_name"
                              value={formData.first_name}
                              onChange={handleInputChange}
                              className="form-control"
                              required
                            />
                          </div>
                        </div>
                        <div className="col-md-6 mb-3">
                          <label className="form-label">Last Name</label>
                          <div className="input-group">
                            <span className="input-group-text">
                              <FiUser />
                            </span>
                            <input
                              type="text"
                              name="last_name"
                              value={formData.last_name}
                              onChange={handleInputChange}
                              className="form-control"
                              required
                            />
                          </div>
                        </div>
                      </div>

                      <div className="mb-3">
                        <label className="form-label">Email</label>
                        <div className="input-group">
                          <span className="input-group-text">
                            <FiMail />
                          </span>
                          <input
                            type="email"
                            name="email"
                            value={formData.email}
                            onChange={handleInputChange}
                            className="form-control"
                            required
                          />
                        </div>
                      </div>

                      <div className="mb-3">
                        <label className="form-label">Username</label>
                        <div className="input-group">
                          <span className="input-group-text">@</span>
                          <input
                            type="text"
                            name="username"
                            value={formData.username}
                            onChange={handleInputChange}
                            className="form-control"
                            required
                          />
                        </div>
                      </div>

                      <div className="row">
                        <div className="col-md-6 mb-3">
                          <label className="form-label">Date of Birth</label>
                          <div className="input-group">
                            <span className="input-group-text">
                              <FiCalendar />
                            </span>
                            <input
                              type="date"
                              name="dob"
                              value={formData.dob}
                              onChange={handleInputChange}
                              className="form-control"
                              required
                            />
                          </div>
                        </div>
                        <div className="col-md-6 mb-3">
                          <label className="form-label">Phone Number</label>
                          <div className="input-group">
                            <span className="input-group-text">
                              <FiPhone />
                            </span>
                            <input
                              type="text"
                              name="phone"
                              value={formData.phone}
                              onChange={handleInputChange}
                              className="form-control"
                              maxLength="10"
                              pattern="[0-9]{10}"
                              title="Please enter a 10-digit phone number"
                            />
                          </div>
                        </div>
                      </div>

                      <div className="mb-3">
                        <label className="form-label">Citizenship Document</label>
                        <div className="input-group">
                          <span className="input-group-text">
                            <FiFileText />
                          </span>
                          <input
                            type="file"
                            name="citizenship"
                            onChange={handleCitizenshipChange}
                            className="form-control"
                            accept="image/*,.pdf"
                          />
                        </div>
                        {user.citizenship && (
                          <div className="mt-2">
                            <a 
                              href={user.citizenship} 
                              target="_blank" 
                              rel="noopener noreferrer"
                              className="btn btn-sm btn-outline-primary"
                            >
                              View Current Document
                            </a>
                          </div>
                        )}
                      </div>

                      <div className="d-flex justify-content-end mt-4">
                        <button 
                          type="button" 
                          className="btn btn-outline-secondary me-2"
                          onClick={() => setIsEditing(false)}
                        >
                          <FiX className="me-1" />
                          Cancel
                        </button>
                        <button type="submit" className="btn btn-primary">
                          <FiSave className="me-1" />
                          Save Changes
                        </button>
                      </div>
                    </form>
                  ) : (
                    <div className="profile-details">
                      <div className="detail-item">
                        <div className="detail-icon">
                          <FiMail />
                        </div>
                        <div>
                          <h6>Email</h6>
                          <p>{user.email}</p>
                        </div>
                      </div>
                      <div className="detail-item">
                        <div className="detail-icon">
                          <FiUser />
                        </div>
                        <div>
                          <h6>Username</h6>
                          <p>@{user.username}</p>
                        </div>
                      </div>
                      <div className="detail-item">
                        <div className="detail-icon">
                          <FiCalendar />
                        </div>
                        <div>
                          <h6>Date of Birth</h6>
                          <p>{new Date(user.dob).toLocaleDateString()}</p>
                        </div>
                      </div>
                      <div className="detail-item">
                        <div className="detail-icon">
                          <FiPhone />
                        </div>
                        <div>
                          <h6>Phone</h6>
                          <p>{user.phone || "Not provided"}</p>
                        </div>
                      </div>
                      <div className="detail-item">
                        <div className="detail-icon">
                          <FiFileText />
                        </div>
                        <div>
                          <h6>Citizenship Document</h6>
                          <p>
                            {user.citizenship ? (
                              <a 
                                href={user.citizenship} 
                                target="_blank" 
                                rel="noopener noreferrer"
                                className="btn btn-sm btn-outline-primary"
                              >
                                View Document
                              </a>
                            ) : (
                              "Not provided"
                            )}
                          </p>
                        </div>
                      </div>
                      <div className="text-center mt-4">
                        {!isEditing && (
                          <button 
                            className="btn btn-outline-primary"
                            onClick={() => setIsEditing(true)}
                          >
                            <FiEdit className="me-1" />
                            Edit Profile
                          </button>
                        )}
                      </div>
                    </div>
                  )}
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>
    </>
  );
};

export default Profile;