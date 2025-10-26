import React from 'react';
import { motion } from 'framer-motion';
import { FaEnvelope, FaPhone, FaMapMarkerAlt } from 'react-icons/fa';
import './Contact.css'; // Import your CSS file

const Contact = () => {
  return (
    <div className="contact-container">
      {/* Contact Header */}
      <motion.div
        className="contact-header"
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.8 }}
      >
        <h1>Contact Us</h1>
        <p>We'd love to hear from you! Reach out to us for any inquiries or feedback.</p>
      </motion.div>

      {/* Contact Information */}
      <motion.div
        className="contact-info"
        initial={{ opacity: 0, x: -50 }}
        animate={{ opacity: 1, x: 0 }}
        transition={{ duration: 0.8, delay: 0.2 }}
      >
        <div className="info-card">
          <FaEnvelope className="info-icon" />
          <h3>Email</h3>
          <p>support@foodshare.com</p>
        </div>
        <div className="info-card">
          <FaPhone className="info-icon" />
          <h3>Phone</h3>
          <p>+1 (123) 456-7890</p>
        </div>
        <div className="info-card">
          <FaMapMarkerAlt className="info-icon" />
          <h3>Address</h3>
          <p>123 FoodShare Street, City, Country</p>
        </div>
      </motion.div>

      {/* Contact Form */}
      <motion.div
        className="contact-form"
        initial={{ opacity: 0, x: 50 }}
        animate={{ opacity: 1, x: 0 }}
        transition={{ duration: 0.8, delay: 0.4 }}
      >
        <h2>Send Us a Message</h2>
        <form>
          <div className="form-group">
            <label htmlFor="name">Name</label>
            <input type="text" id="name" name="name" placeholder="Enter your name" />
          </div>
          <div className="form-group">
            <label htmlFor="email">Email</label>
            <input type="email" id="email" name="email" placeholder="Enter your email" />
          </div>
          <div className="form-group">
            <label htmlFor="message">Message</label>
            <textarea id="message" name="message" placeholder="Enter your message" rows="5" />
          </div>
          <button type="submit" className="submit-button">
            Send Message
          </button>
        </form>
      </motion.div>

      {/* Optional: Map Section */}
      <motion.div
        className="map-section"
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.8, delay: 0.6 }}
      >
        <h2>Find Us on the Map</h2>
        <div className="map-container">
          {/* Embed your map here (e.g., Google Maps) */}
          <iframe
            title="FoodShare Location"
            src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3827.8354345093747!2d80.52373531531615!3d16.258279742021665!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x3a4a755c8c2b8f1d%3A0x9f8e7d2a6c8f4f4b!2sRVR%26JC%20College%20of%20Engineering!5e0!3m2!1sen!2sus!4v1692549400000!5m2!1sen!2sus"
            width="100%"
            height="400"
            style={{ border: 0 }}
            allowFullScreen=""
            loading="lazy"
          />
        </div>
      </motion.div>
    </div>
  );
};

export default Contact;