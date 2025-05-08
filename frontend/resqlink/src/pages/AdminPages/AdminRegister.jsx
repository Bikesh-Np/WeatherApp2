import React, { useState } from "react";
import axios from "axios";
import reg from "../../img/reg.png";
import { useNavigate } from "react-router-dom";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { Link } from "react-router-dom";

const AdminRegister = () => {
  const [email, setEmail] = useState("");
  const [first_name, setFirstName] = useState("");
  const [last_name, setLastName] = useState("");
  const [username, setUsername] = useState("");
  const [dob, setDob] = useState("");
  const [password, setPassword] = useState("");
  const [cpassword, setCpassword] = useState("");
  const [isAdmin, setIsAdmin] = useState(true); // Admin by default
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (password !== cpassword) {
      toast.error("Passwords do not match!");
      return;
    }

    try {
      const response = await axios.post(
        "http://127.0.0.1:8000/register/", // Adjust this endpoint as needed
        {
          email,
          first_name,
          last_name,
          username,
          dob,
          password,
          role: isAdmin ? "admin" : "user", // Send the role as "admin" or "user"
        },
        { headers: { "Content-Type": "application/json" } }
      );

      if (response.status === 201) {
        toast.success(isAdmin ? "Admin registered successfully!" : "User registered successfully!");
        navigate("/admin-login"); // Redirect to admin login or dashboard
      }
    } catch (err) {
      if (err.response && err.response.data) {
        const errorMessages = Object.values(err.response.data)
          .flat()
          .join(", ");
        toast.error(`Registration failed: ${errorMessages}`);
      } else {
        toast.error(`Registration failed: ${err.message}`);
      }
    }
  };

  return (
    <>
      <ToastContainer position="top-center" />
      <section className="vh-100 d-flex align-items-center bg-light">
        <div className="container">
          <div className="row justify-content-center">
            <div className="col-md-8">
              <div className="card shadow-lg border-0">
                <div className="row g-0">
                  {/* Left side with image */}
                  <div className="col-md-6 d-none d-md-block">
                    <img
                      src={reg}
                      alt="Register Illustration"
                      className="img-fluid h-100 rounded-start"
                      style={{ objectFit: "cover" }}
                    />
                  </div>

                  <div className="col-md-6">
                    <div className="card-body p-5">
                      <h3 className="mb-4 text-center">{isAdmin ? "Admin Register" : "User Register"}</h3>
                      <form onSubmit={handleSubmit}>
                        <div className="form-group mb-3">
                          <label htmlFor="email">Your Email</label>
                          <input
                            type="email"
                            value={email}
                            onChange={(e) => setEmail(e.target.value)}
                            className="form-control"
                            id="email"
                            placeholder="Enter your email"
                            required
                          />
                        </div>

                        <div className="form-group mb-3">
                          <label htmlFor="username">User Name</label>
                          <input
                            type="text"
                            value={username}
                            onChange={(e) => setUsername(e.target.value)}
                            className="form-control"
                            id="username"
                            placeholder="Enter your username"
                            required
                          />
                        </div>

                        <div className="form-group mb-3">
                          <label htmlFor="firstName">First Name</label>
                          <input
                            type="text"
                            value={first_name}
                            onChange={(e) => setFirstName(e.target.value)}
                            className="form-control"
                            id="firstName"
                            placeholder="Enter your first name"
                            required
                          />
                        </div>

                        <div className="form-group mb-3">
                          <label htmlFor="lastName">Last Name</label>
                          <input
                            type="text"
                            value={last_name}
                            onChange={(e) => setLastName(e.target.value)}
                            className="form-control"
                            id="lastName"
                            placeholder="Enter your last name"
                            required
                          />
                        </div>

                        <div className="form-group mb-3">
                          <label htmlFor="password">Password</label>
                          <input
                            type="password"
                            value={password}
                            onChange={(e) => setPassword(e.target.value)}
                            className="form-control"
                            id="password"
                            placeholder="Enter your password"
                            required
                          />
                        </div>

                        <div className="form-group mb-3">
                          <label htmlFor="cpassword">Confirm Password</label>
                          <input
                            type="password"
                            value={cpassword}
                            onChange={(e) => setCpassword(e.target.value)}
                            className="form-control"
                            id="cpassword"
                            placeholder="Confirm your password"
                            required
                          />
                        </div>

                        <div className="form-group mb-3">
                          <label htmlFor="dob">Date of Birth</label>
                          <input
                            type="date"
                            value={dob}
                            onChange={(e) => setDob(e.target.value)}
                            className="form-control"
                            id="dob"
                            required
                          />
                        </div>

                        {/* Admin-specific checkbox for role */}
                        <div className="form-group mb-3 form-check">
                          <input
                            type="checkbox"
                            className="form-check-input"
                            id="role"
                            checked={isAdmin}
                            onChange={() => setIsAdmin(!isAdmin)} // Toggle the isAdmin state
                          />
                          <label className="form-check-label" htmlFor="role">
                            Register as Admin
                          </label>
                        </div>

                        <div className="form-group mb-3 form-check">
                          <input
                            type="checkbox"
                            className="form-check-input"
                            id="terms"
                            required
                          />
                          <label className="form-check-label" htmlFor="terms">
                            I agree to all statements in{" "}
                            <Link to="/">Terms of Service</Link>
                          </label>
                        </div>

                        {/* Dynamically change button text */}
                        <button type="submit" className="btn btn-primary w-100">
                          {isAdmin ? "Register as Admin" : "Register as User"}
                        </button>
                      </form>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>
    </>
  );
};

export default AdminRegister;
