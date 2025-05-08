import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import "bootstrap/dist/css/bootstrap.min.css";
import './VolunteerForm.css';

const VolunteerForm = () => {
  const [formData, setFormData] = useState({
    email: "",
    username: "",
    first_name: "",
    last_name: "",
    address:"",
    dob: "",
    doa: "",
    phone: "",
    skill: "",
    experience: "",
    profile: null,
    citizenship: null,
    blood_group: "",
  });

  const [message, setMessage] = useState("");
  const [error, setError] = useState(null);
  const [showModal, setShowModal] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const navigate = useNavigate();

  const handleChange = (e) => {
    const { name, value } = e.target;
    
    // Special handling for phone number to ensure only digits and limit to 10
    if (name === "phone") {
      if (value === "" || (/^\d{0,10}$/.test(value))) {
        setFormData({ ...formData, [name]: value });
      }
      return;
    }
    
    setFormData({ ...formData, [name]: value });
  };

  const handleFileChange = (e) => {
    const { name, files } = e.target;
    setFormData({ ...formData, [name]: files[0] });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsSubmitting(true);

    // Phone number validation
    if (formData.phone.length !== 10) {
      setError({ detail: "Phone number must be exactly 10 digits." });
      setIsSubmitting(false);
      return;
    }

    // Age validation
    const today = new Date();
    const birthDate = new Date(formData.dob);
    const age = today.getFullYear() - birthDate.getFullYear();
    const m = today.getMonth() - birthDate.getMonth();
    const isBeforeBirthday = m < 0 || (m === 0 && today.getDate() < birthDate.getDate());

    const finalAge = isBeforeBirthday ? age - 1 : age;

    if (finalAge < 18) {
      setError({ detail: "You must be at least 18 years old to register." });
      setMessage("");
      setIsSubmitting(false);
      return;
    }

    const formDataToSend = new FormData();
    Object.keys(formData).forEach((key) => {
      if (formData[key]) {
        formDataToSend.append(key, formData[key]);
      }
    });

    try {
      const response = await fetch("http://127.0.0.1:8000/vol/", {
        method: "POST",
        body: formDataToSend,
      });

      if (response.ok) {
        setMessage("Volunteer registered successfully!");
        setError(null);
        setShowModal(true);
        setFormData({
          email: "",
          username: "",
          first_name: "",
          last_name: "",
          dob: "",
          doa: "",
          skill: "",
          phone: "",
          experience: "",
          profile: null,
          citizenship: null,
          blood_group: "",
        });
      } else {
        const errorData = await response.json();
        setError(errorData);
        setMessage("");
      }
    } catch (error) {
      setError({ detail: "An unexpected error occurred." });
      setMessage("");
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="volunteer-form-wrapper">
      <div className="volunteer-form-container">
        <div className="form-header">
          <h2 className="form-title">Join Our Volunteer Community</h2>
          <p className="form-subtitle">Make a difference by sharing your skills and time</p>
        </div>

        {message && (
          <div className="alert alert-success alert-dismissible fade show">
            {message}
            <button type="button" className="btn-close" onClick={() => setMessage("")}></button>
          </div>
        )}

        {error && (
          <div className="alert alert-danger alert-dismissible fade show">
            {error.detail || JSON.stringify(error)}
            <button type="button" className="btn-close" onClick={() => setError(null)}></button>
          </div>
        )}

        <form onSubmit={handleSubmit} className="volunteer-form">
          <div className="form-row">
            <div className="form-group">
              <label htmlFor="email">Email Address</label>
              <input
                type="email"
                id="email"
                name="email"
                className="form-control"
                value={formData.email}
                onChange={handleChange}
                required
                placeholder="your.email@example.com"
              />
            </div>

            <div className="form-group">
              <label htmlFor="username">Username</label>
              <input
                type="text"
                id="username"
                name="username"
                className="form-control"
                value={formData.username}
                onChange={handleChange}
                required
                placeholder="Choose a username"
              />
            </div>
          </div>

          <div className="form-row">
            <div className="form-group">
              <label htmlFor="first_name">First Name</label>
              <input
                type="text"
                id="first_name"
                name="first_name"
                className="form-control"
                value={formData.first_name}
                onChange={handleChange}
                required
                placeholder="Your first name"
              />
            </div>

            <div className="form-group">
              <label htmlFor="last_name">Last Name</label>
              <input
                type="text"
                id="last_name"
                name="last_name"
                className="form-control"
                value={formData.last_name}
                onChange={handleChange}
                required
                placeholder="Your last name"
              />
            </div>
          </div>

          <div className="form-row">
            <div className="form-group">
              <label htmlFor="dob">Date of Birth</label>
              <input
                type="date"
                id="dob"
                name="dob"
                className="form-control"
                value={formData.dob}
                onChange={handleChange}
                required
              />
            </div>

            <div className="form-group">
              <label htmlFor="doa">Date of Availability</label>
              <input
                type="date"
                id="doa"
                name="doa"
                className="form-control"
                value={formData.doa}
                onChange={handleChange}
                required
              />
            </div>
          </div>

          <div className="form-group">
              <label htmlFor="Address">Address</label>
              <input
                type="text"
                id="address"
                name="address"
                className="form-control"
                value={formData.address}
                onChange={handleChange}
                required
                placeholder="Your Address"
              />
            </div>
          <div className="form-group">
            <label htmlFor="phone">Phone Number</label>
            <div className="input-group">
              <span className="input-group-text">+977</span>
              <input
                type="tel"
                id="phone"
                name="phone"
                className="form-control"
                value={formData.phone}
                onChange={handleChange}
                required
                placeholder="98XXXXXXXX"
                maxLength="10"
                pattern="\d{10}"
                title="Please enter a 10-digit phone number"
              />
            </div>
            {formData.phone.length > 0 && formData.phone.length !== 10 && (
              <small className="text-danger">Phone number must be 10 digits</small>
            )}
          </div>

          <div className="form-group">
            <label htmlFor="skill">Skills</label>
            <textarea
              id="skill"
              name="skill"
              className="form-control"
              value={formData.skill}
              onChange={handleChange}
              required
              placeholder="List your skills (separated by commas)"
              rows="3"
            />
          </div>

          <div className="form-group">
            <label htmlFor="experience">Experience</label>
            <textarea
              id="experience"
              name="experience"
              className="form-control"
              value={formData.experience}
              onChange={handleChange}
              required
              placeholder="Describe your relevant experience"
              rows="3"
            />
          </div>

          <div className="form-row">
            <div className="form-group">
              <label htmlFor="profile">Profile Picture</label>
              <input
                type="file"
                id="profile"
                name="profile"
                className="form-control"
                onChange={handleFileChange}
                accept="image/*"
              />
              <small className="text-muted">Upload a clear headshot (JPEG/PNG)</small>
            </div>

            <div className="form-group">
              <label htmlFor="citizenship">National Identity</label>
              <input
                type="file"
                id="citizenship"
                name="citizenship"
                className="form-control"
                onChange={handleFileChange}
                accept="image/*,application/pdf"
              />
              <small className="text-muted">Upload citizenship or ID (Image/PDF)</small>
            </div>
          </div>

          <div className="form-group">
            <label htmlFor="blood_group">Blood Group</label>
            <select
              id="blood_group"
              name="blood_group"
              className="form-control"
              value={formData.blood_group}
              onChange={handleChange}
              required
            >
              <option value="">Select your blood group</option>
              <option value="A+">A+</option>
              <option value="A-">A-</option>
              <option value="B+">B+</option>
              <option value="B-">B-</option>
              <option value="AB+">AB+</option>
              <option value="AB-">AB-</option>
              <option value="O+">O+</option>
              <option value="O-">O-</option>
            </select>
          </div>

          <button
            type="submit"
            className="submit-btn"
            disabled={isSubmitting}
          >
            {isSubmitting ? (
              <>
                <span className="spinner-border spinner-border-sm" role="status" aria-hidden="true"></span>
                <span className="ms-2">Registering...</span>
              </>
            ) : (
              "Register as Volunteer"
            )}
          </button>
          <button
  type="button"
  className="btn btn-primary mb-4 rounded-pill"
  onClick={() => navigate("/loginvol")}
  style={{
    width: '50%',
    marginLeft: '160px',
    padding: '10px 20px',
    fontSize: '1rem',
    fontWeight: '500',
    transition: 'all 0.2s ease',
    boxShadow: '0 4px 6px rgba(0, 0, 0, 0.1)',
    border: 'none'
  }}
>
  <i className="bi bi-box-arrow-in-right me-2"></i>
  Go to Login for ID Card
</button>
        </form>
      </div>
    </div>
  );
};

export default VolunteerForm;