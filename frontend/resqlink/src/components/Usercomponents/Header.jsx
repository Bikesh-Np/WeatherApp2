import React, { useEffect, useState } from "react";
import axios from "axios";
import { Navbar, Nav, NavDropdown, Container, Image } from "react-bootstrap";
import { useNavigate } from "react-router-dom";
import { 
  FiHome, 
  FiAlertTriangle, 
  FiUsers, 
  FiPackage, 
  FiMail,
  FiUser,
  FiBell,
  FiLogOut,
  FiLogIn,
  FiUserPlus
} from "react-icons/fi";
import { FaLeaf } from "react-icons/fa";
import logo from "../../img/logo.png";
import defaultProfile from "../../img/profile.jpg";
import './header.css';

const Header = () => {
  const [profileImage, setProfileImage] = useState(null);
  const [userFullName, setUserFullName] = useState("");
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchProfileData = async () => {
      try {
        const token = localStorage.getItem("token");
        if (!token) {
          setIsLoggedIn(false);
          return;
        }

        const response = await axios.get("http://127.0.0.1:8000/profile/", {
          headers: { Authorization: `Bearer ${token}` },
        });

        if (response.status === 200) {
          setProfileImage(response.data.image);
          setUserFullName(`${response.data.first_name} ${response.data.last_name}`);
          setIsLoggedIn(true);
        }
      } catch (err) {
        console.error("Error fetching profile data:", err);
        setIsLoggedIn(false);
      }
    };

    fetchProfileData();
  }, [navigate]);

  const handleLogout = () => {
    localStorage.removeItem("token");
    setIsLoggedIn(false);
    navigate("/login");
  };

  return (
    <Navbar expand="lg" bg="dark" variant="dark" sticky="top" className="py-3">
      <Container className="d-flex align-items-center">
        {/* Logo */}
        <Navbar.Brand href="http://localhost:3000/" className="me-auto d-flex align-items-center">
          <img src={logo} alt="ResQLink Logo" width="60" height="60" className="me-2" />
          <span className="brand-text fw-bold text-light">
            ResQLink <FaLeaf className="ms-1" />
          </span>
        </Navbar.Brand>

        <Navbar.Toggle aria-controls="navbar-nav" />
        <Navbar.Collapse id="navbar-nav" className="justify-content-end">
          <Nav>
            <Nav.Link href="http://localhost:3000/" className="d-flex align-items-center">
              <FiHome className="me-1" /> Home
            </Nav.Link>
            <Nav.Link href="http://localhost:3000/service" className="d-flex align-items-center">
              <FiAlertTriangle className="me-1" /> Disaster Updates
            </Nav.Link>
            <Nav.Link href="http://localhost:3000/registervolunteer" className="d-flex align-items-center">
              <FiUsers className="me-1" /> Volunteers
            </Nav.Link>
            <Nav.Link href="http://localhost:3000/resources" className="d-flex align-items-center">
              <FiPackage className="me-1" /> Resources
            </Nav.Link>
            <Nav.Link href="contactus" className="d-flex align-items-center">
              <FiMail className="me-1" /> Contact Us
            </Nav.Link>
          </Nav>
        </Navbar.Collapse>
        </Container>
        {/* Profile Sections */}
        <Nav>
          {isLoggedIn ? (
            <NavDropdown
              title={
                <div className="d-flex align-items-center">
                  <Image
                    src={profileImage || defaultProfile}
                    alt="Profile"
                    roundedCircle
                    width="40"
                    height="40"
                    className="me-2"
                  />
                  <span className="text-light fw-bold">{userFullName || "User"}</span>
                </div>
              }
              id="profile-dropdown"
              align="end"
            >
              <NavDropdown.Item href="/profile" className="d-flex align-items-center">
                <FiUser className="me-2" /> Profile
              </NavDropdown.Item>
              {/* <NavDropdown.Item href="#notifications" className="d-flex align-items-center">
                <FiBell className="me-2" /> Notifications
              </NavDropdown.Item> */}
              <NavDropdown.Divider />
              <NavDropdown.Item onClick={handleLogout} className="d-flex align-items-center">
                <FiLogOut className="me-2" /> Logout
              </NavDropdown.Item>
            </NavDropdown>
          ) : (
            <>
              <Nav.Link href="/login" className="d-flex align-items-center">
                <FiLogIn className="me-1" /> Login
              </Nav.Link>
              <Nav.Link href="/register" className="d-flex align-items-center">
                <FiUserPlus className="me-1" /> Register
              </Nav.Link>
            </>
          )}
        </Nav>
   
    </Navbar>
  );
};

export default Header;