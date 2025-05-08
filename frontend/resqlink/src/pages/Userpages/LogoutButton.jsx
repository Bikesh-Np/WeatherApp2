import React from "react";
import { useNavigate } from "react-router-dom";
import { Button } from "react-bootstrap";

const LogoutButton = () => {
  const navigate = useNavigate();

  const handleLogout = () => {
    // Clear all auth-related items
    localStorage.removeItem("accessToken");
    localStorage.removeItem("token");
    localStorage.removeItem("loginType");
    
    // Optional: Clear other user data
    localStorage.removeItem("userData");
    
    // Redirect to login page
    navigate("/login");
    
    // Optional: Force refresh to ensure clean state
    window.location.reload();
  };

  return (
    <Button variant="danger" onClick={handleLogout}>
      Logout
    </Button>
  );
};

export default LogoutButton;