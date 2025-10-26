import { NavLink } from "react-router-dom";
import { useContext, useState } from "react";
import { AuthContext } from "../src/store/Auth";
import "bootstrap/dist/css/bootstrap.min.css";
import "bootstrap/dist/js/bootstrap.bundle.min.js"; // Bootstrap JS
import "./styles/Navbar.css";

const Navbar = () => {
  const { isLoggedIn, LogoutUser } = useContext(AuthContext);
  const [dropdownOpen, setDropdownOpen] = useState(false);

  const toggleDropdown = () => setDropdownOpen(!dropdownOpen);

  return (
    <nav className="navbar navbar-expand-lg navbar-light bg-light sticky-top shadow-sm">
      <div className="container-fluid px-3 px-md-5">
        {/* Logo and Brand */}
        <NavLink className="navbar-brand d-flex align-items-center" to="/">
          <img
            src="/AnnaSamarpan-removebg-preview.png"
            alt="AnnaSamarpan Logo"
            className="logo img-fluid me-2"
            style={{ maxHeight: "45px", width: "auto" }}
          />
          <span className="brand-title fw-bold">AnnaSamarpan</span>
        </NavLink>

        {/* Mobile Toggle Button */}
        <button
          className="navbar-toggler"
          type="button"
          data-bs-toggle="collapse"
          data-bs-target="#navbarNav"
          aria-controls="navbarNav"
          aria-expanded="false"
          aria-label="Toggle navigation"
        >
          <span className="navbar-toggler-icon"></span>
        </button>

        {/* Navbar Links */}
        <div className="collapse navbar-collapse" id="navbarNav">
          <ul className="navbar-nav mx-auto mb-2 mb-lg-0 gap-2 gap-lg-4">
            <li className="nav-item">
              <NavLink
                className={({ isActive }) => `nav-link ${isActive ? "active" : ""}`}
                to="/"
              >
                Home
              </NavLink>
            </li>
            <li className="nav-item">
              <NavLink
                className={({ isActive }) => `nav-link ${isActive ? "active" : ""}`}
                to="/about"
              >
                About
              </NavLink>
            </li>
            <li className="nav-item">
              <NavLink
                className={({ isActive }) => `nav-link ${isActive ? "active" : ""}`}
                to="/contact"
              >
                Contact
              </NavLink>
            </li>
          </ul>

          {/* Profile/Auth Section */}
          <div className="d-flex align-items-center gap-3">
            {isLoggedIn ? (
              <div className="dropdown">
                <img
                  src="/profile-user.png" // Replace with dynamic user image if available
                  alt="Profile"
                  className="rounded-circle dropdown-toggle profile-img"
                  style={{ height: "40px", width: "40px", cursor: "pointer" }}
                  onClick={toggleDropdown}
                  data-bs-toggle="dropdown"
                  aria-expanded={dropdownOpen}
                  id="profileDropdown"
                />
                <ul
                  className={`dropdown-menu dropdown-menu-end ${dropdownOpen ? "show" : ""}`}
                  aria-labelledby="profileDropdown"
                >
                  <li>
                    <NavLink className="dropdown-item" to="/dashboard" onClick={toggleDropdown}>
                      Dashboard
                    </NavLink>
                  </li>
                  <li>
                    <NavLink
                      className="dropdown-item text-danger"
                      to="/logout"
                      onClick={() => {
                        LogoutUser();
                        toggleDropdown();
                      }}
                    >
                      Logout
                    </NavLink>
                  </li>
                </ul>
              </div>
            ) : (
              <div className="auth-links d-flex gap-2">
                <NavLink className="nav-link text-primary fw-medium" to="/login">
                  Login
                </NavLink>
                <span className="text-secondary d-none d-sm-inline">/</span>
                <NavLink className="nav-link text-primary fw-medium" to="/signup">
                  Signup
                </NavLink>
              </div>
            )}
          </div>
        </div>
      </div>
    </nav>
  );
};

export default Navbar;