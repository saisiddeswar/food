import React from 'react';
import { motion } from 'framer-motion';
// import foodShareImage from '/img2.jpg'; // Ensure this path is correct
import { FaHandHoldingHeart } from 'react-icons/fa';
// import './Herosection.css'

const HeroSection = ({ navigate }) => {
  return (
    <div className="py-5 bg-success bg-opacity-10" style={{ fontFamily: 'Poppins, sans-serif' }}>
      <div className="container">
        <div className="row align-items-center">
          {/* Left Column - Text Content */}
          <motion.div
            className="col-lg-6 text-md-start text-center"
            initial={{ opacity: 0, x: -50 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.8, ease: 'easeOut' }}
          >
            <p className="text-success fw-semibold text-uppercase mb-2 fs-5">
              Combat Food Wastage
            </p>
            <h1 className="fw-bold text-dark display-5 mb-3">
              Join the <span className="text-success">FoodShare Network</span>
            </h1>
            <p className="text-secondary fs-5 mb-4">
              Connecting educational institutions with NGOs to combat food wastage.
            </p>
            <motion.button
              className="btn btn-warning btn-lg shadow-sm"
              onClick={() => navigate('/signup')}
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              transition={{ type: 'spring', stiffness: 300 }}
            >
              {/* <FaHandHoldingHeart className="me-2" /> */}
              Get Started
            </motion.button>
          </motion.div>

          {/* Right Column - Image */}
          <motion.div
            className="col-lg-6 d-flex justify-content-center mt-4 mt-lg-0"
            initial={{ opacity: 0, x: 50 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.8, delay: 0.2, ease: 'easeOut' }}
          >
            {/* <img
              src={foodShareImage}
              alt="Food Sharing"
              className="img-fluid rounded shadow-lg"
              style={{ maxHeight: '400px' }}
            /> */}
          </motion.div>
        </div>
      </div>
    </div>
  );
};

export default HeroSection;