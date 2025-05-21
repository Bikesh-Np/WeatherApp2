import React, { useEffect, useState } from "react";
import { Navbar, Nav, NavDropdown, Container, Image } from "react-bootstrap";
import { useNavigate, Link } from "react-router-dom";
import { 
  FiHome, 
  FiAlertTriangle, 
  FiUsers, 
  FiPackage, 
  FiMail,
  FiUser,
  FiLogOut,
  FiLogIn,
  FiUserPlus
} from "react-icons/fi";
import { FaLeaf } from "react-icons/fa";
import logo from "../../img/logo.png";
import defaultProfile from "../../img/profile.jpg";
import './header.css';
import AxiosInstance from "../AxiosInstance";

const Header = () => {
  const [profileImage, setProfileImage] = useState(null);
  const [userFullName, setUserFullName] = useState("");
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchProfileData = async () => {
      try {
        const token = localStorage.getItem("token");
        if (!token) {
          setIsLoggedIn(false);
          setIsLoading(false);
          return;
        }

        const response = await AxiosInstance.get("/profile/", {
          headers: { Authorization: `Bearer ${token}` },
        });

        if (response.status === 200) {
          setProfileImage(response.data.image || defaultProfile);
          setUserFullName(`${response.data.first_name} ${response.data.last_name}`);
          setIsLoggedIn(true);
        }
      } catch (err) {
        console.error("Error fetching profile data:", err);
        setIsLoggedIn(false);
        // Clear invalid token if request fails
        if (err.response?.status === 401) {
          localStorage.removeItem("token");
        }
      } finally {
        setIsLoading(false);
      }
    };

    fetchProfileData();
  }, [navigate]);

  const handleLogout = () => {
    localStorage.removeItem("token");
    setIsLoggedIn(false);
    navigate("/login");
    // Optional: Add a toast notification for successful logout
  };

  // Show loading state if needed
  if (isLoading) {
    return (
      <Navbar expand="lg" bg="dark" variant="dark" sticky="top" className="py-3">
        <Container className="d-flex justify-content-center">
          <div className="spinner-border text-light" role="status">
            <span className="visually-hidden">Loading...</span>
          </div>
        </Container>
      </Navbar>
    );
  }

  return (
    <Navbar expand="lg" bg="dark" variant="dark" sticky="top" className="py-3">
      <Container>
        {/* Logo with Link component for SPA navigation */}
        <Navbar.Brand as={Link} to="/" className="me-auto d-flex align-items-center">
          <img 
            src={logo} 
            alt="ResQLink Logo" 
            width="60" 
            height="60" 
            className="me-2"
            loading="lazy"
          />
          <span className="brand-text fw-bold text-light">
            ResQLink <FaLeaf className="ms-1" />
          </span>
        </Navbar.Brand>

        <Navbar.Toggle aria-controls="navbar-nav" className="order-lg-1" />
        
        <Navbar.Collapse id="navbar-nav" className="order-lg-0 justify-content-center">
          <Nav className="me-auto">
            <Nav.Link as={Link} to="/" className="d-flex align-items-center">
              <FiHome className="me-1" /> Home
            </Nav.Link>
            <Nav.Link as={Link} to="/service" className="d-flex align-items-center">
              <FiAlertTriangle className="me-1" /> Disaster Updates
            </Nav.Link>
            <Nav.Link as={Link} to="/registervolunteer" className="d-flex align-items-center">
              <FiUsers className="me-1" /> Volunteers
            </Nav.Link>
            <Nav.Link as={Link} to="/resources" className="d-flex align-items-center">
              <FiPackage className="me-1" /> Resources
            </Nav.Link>
            <Nav.Link as={Link} to="/contactus" className="d-flex align-items-center">
              <FiMail className="me-1" /> Contact Us
            </Nav.Link>
          </Nav>
        </Navbar.Collapse>

        {/* Profile Section */}
        <Nav className="order-lg-2">
          {isLoggedIn ? (
            <NavDropdown
              title={
                <div className="d-flex align-items-center">
                  <Image
                    src={profileImage}
                    alt="Profile"
                    roundedCircle
                    width="40"
                    height="40"
                    className="me-2"
                    onError={(e) => {
                      e.target.src = defaultProfile;
                    }}
                  />
                  <span className="text-light fw-bold">
                    {userFullName || "User"}
                  </span>
                </div>
              }
              id="profile-dropdown"
              align="end"
              menuVariant="dark"
            >
              <NavDropdown.Item as={Link} to="/profile" className="d-flex align-items-center">
                <FiUser className="me-2" /> Profile
              </NavDropdown.Item>
              <NavDropdown.Divider />
              <NavDropdown.Item onClick={handleLogout} className="d-flex align-items-center">
                <FiLogOut className="me-2" /> Logout
              </NavDropdown.Item>
            </NavDropdown>
          ) : (
            <>
              <Nav.Link as={Link} to="/login" className="d-flex align-items-center">
                <FiLogIn className="me-1" /> Login
              </Nav.Link>
              <Nav.Link as={Link} to="/register" className="d-flex align-items-center">
                <FiUserPlus className="me-1" /> Register
              </Nav.Link>
            </>
          )}
        </Nav>
      </Container>
    </Navbar>
  );
};

export default Header;