
import { Link } from "react-router-dom";
import { FaFacebook, FaTwitter, FaInstagram, FaLinkedin, FaYoutube, FaWhatsapp } from "react-icons/fa";
import "bootstrap/dist/css/bootstrap.min.css";
import "./FooterSection.css"; 

const FooterSection = () => {
  let currentYear = new Date().getFullYear();

  return (
    <footer className="bg-light text-center py-3">
      <div className="container">
        {/* Footer Content */}
        <div className="row align-items-center">
          <div className="col-md-4 text-md-start">
            <h5 className="fw-light mb-1">AnnaSamarpana</h5>
            <p className="small text-muted mb-0">Connecting surplus food with those in need.</p>
          </div>

          {/* Quick Links */}
          <div className="col-md-4">
            <h6 className="fw-light mb-1">Quick Links</h6>
            <ul className="list-unstyled d-flex justify-content-center gap-2 mb-0">
              <li><Link to="/about" className="footer-link">About</Link></li>
              <span className="separator">|</span>
              <li><Link to="/contact" className="footer-link">Contact</Link></li>
              <span className="separator">|</span>
              <li><Link to="/privacy" className="footer-link">Privacy</Link></li>
            </ul>
          </div>

          {/* Social Media Icons */}
          <div className="col-md-4">
            <h6 className="fw-light mb-1">Follow Us</h6>
            <div className="d-flex justify-content-center gap-2">
              <a href="#" className="social-icon"><FaFacebook /></a>
              <a href="#" className="social-icon"><FaTwitter /></a>
              <a href="#" className="social-icon"><FaInstagram /></a>
              <a href="#" className="social-icon"><FaLinkedin /></a>
              <a href="#" className="social-icon"><FaYoutube /></a>
              <a href="#" className="social-icon"><FaWhatsapp /></a>
            </div>
          </div>
        </div>

        {/* Clickable Home Image */}
        <div className="mt-3">
          <a href="py-5">
            <img src="/AnnaSamarpan-removebg-preview.png" alt="Home" className="home-icon" />
          </a>
        </div>

        {/* Copyright */}
        <div className="text-center small text-muted mt-2">
          <p className="mb-0">&copy; {currentYear} AnnaSamarpana. All Rights Reserved.</p>
        </div>
      </div>
    </footer>
  );
};

export default FooterSection;