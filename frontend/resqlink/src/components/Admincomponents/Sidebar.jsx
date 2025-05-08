import React, { useState } from "react";
import {
  FaTachometerAlt,
  FaUser,
  FaMoneyBillWave,
  FaBox,
  FaTag,
  FaUsers,
  FaPlus,
  FaEnvelope,
  FaSignOutAlt,
  FaChevronDown,
  FaChevronRight
} from "react-icons/fa";
import { Link, useLocation } from "react-router-dom";
import admin from "../../img/admin.png";
import "./Sidebar.css";

const Sidebar = () => {
  const location = useLocation();
  const [openSubmenus, setOpenSubmenus] = useState({
    products: location.pathname.includes("/admin/product"),
    categories: location.pathname.includes("/admin/category")
  });

  const toggleSubmenu = (menu) => {
    setOpenSubmenus(prev => ({
      ...prev,
      [menu]: !prev[menu]
    }));
  };

  const isActive = (path) => {
    return location.pathname === path || 
           (path === "/admin/productlist" && location.pathname.includes("/admin/product")) ||
           (path === "/admin/category" && location.pathname.includes("/admin/category"));
  };

  return (
    <aside className="emerald-sidebar">
      {/* Sidebar Header */}
      <div className="sidebar-header">
        <div className="admin-avatar">
          <img src={admin} alt="Admin" className="admin-img" />
          <div className="status-indicator"></div>
        </div>
        <div className="admin-info">
          <h3>Admin Panel</h3>
          <p>Administrator</p>
        </div>
      </div>

      {/* Navigation Menu */}
      <nav className="sidebar-menu">
        <ul>
          <li className={isActive("/admin/dashboard") ? "active" : ""}>
            <Link to="/admin/dashboard">
              <FaTachometerAlt className="icon" />
              <span>Dashboard</span>
              <FaChevronRight className="arrow" />
            </Link>
          </li>

          <li className={isActive("/admin/userverify") ? "active" : ""}>
            <Link to="/admin/userverify">
              <FaUser className="icon" />
              <span>User Management</span>
              <FaChevronRight className="arrow" />
            </Link>
          </li>
          {/* volunteers Submenu */}
          <li className={`submenu ${openSubmenus.volunteers ? "open" : ""}`}>
            <div 
              className="submenu-header"
              onClick={() => toggleSubmenu("volunteers")}
            >
              <FaUsers className="icon" />
              <span>Volunteer Management</span>
              {openSubmenus.volunteers ? 
                <FaChevronDown className="arrow" /> : 
                <FaChevronRight className="arrow" />
              }
            </div>
            <ul className="submenu-items">
              <li className={isActive("/admin/assignvol") ? "active" : ""}>
                <Link to="/admin/assignvol">Assign volunteers</Link>
              </li>
              <li className={isActive("/admin/assignlist") ? "active" : ""}>
                <Link to="/admin/assignlist">Assigned List</Link>
              </li>
            </ul>
          </li>

          <li className={isActive("/admin/message") ? "active" : ""}>
            <Link to="/admin/message">
              <FaEnvelope className="icon" />
              <span>Messages</span>
              <span className="badge"></span>
              <FaChevronRight className="arrow" />
            </Link>
          </li>




          <li className={isActive("/admin/donations") ? "active" : ""}>
            <Link to="/admin/donations">
              <FaMoneyBillWave className="icon" />
              <span>Donations</span>
              <FaChevronRight className="arrow" />
            </Link>
          </li>

          {/* Products Submenu */}
          <li className={`submenu ${openSubmenus.products ? "open" : ""}`}>
            <div 
              className="submenu-header"
              onClick={() => toggleSubmenu("products")}
            >
              <FaBox className="icon" />
              <span>Products</span>
              {openSubmenus.products ? 
                <FaChevronDown className="arrow" /> : 
                <FaChevronRight className="arrow" />
              }
            </div>
            <ul className="submenu-items">
              <li className={isActive("/admin/productlist") ? "active" : ""}>
                <Link to="/admin/productlist">Product List</Link>
              </li>
              <li className={isActive("/admin/addproduct") ? "active" : ""}>
                <Link to="/admin/addproduct">Add Product</Link>
              </li>
            </ul>
          </li>

          {/* Categories Submenu */}
          <li className={`submenu ${openSubmenus.categories ? "open" : ""}`}>
            <div 
              className="submenu-header"
              onClick={() => toggleSubmenu("categories")}
            >
              <FaTag className="icon" />
              <span>Categories</span>
              {openSubmenus.categories ? 
                <FaChevronDown className="arrow" /> : 
                <FaChevronRight className="arrow" />
              }
            </div>
            <ul className="submenu-items">
              <li className={isActive("/admin/category") ? "active" : ""}>
                <Link to="/admin/category">Category List</Link>
              </li>
              <li className={isActive("/admin/addcategory") ? "active" : ""}>
                <Link to="/admin/addcategory">Add Category</Link>
              </li>
            </ul>
          </li>
        </ul>
      </nav>

      {/* Sidebar Footer */}
      <div className="sidebar-footer">
        <Link to="/adminlogin" className="logout-btn">
          <FaSignOutAlt className="icon" />
          <span>Logout</span>
        </Link>
      </div>
    </aside>
  );
};

export default Sidebar;