import React from 'react';
import { motion } from 'framer-motion';

const CTASection = ({ navigate }) => {
  return (
    <section
      className="py-5 text-center"
      style={{
        backgroundColor: '#E8F5E9',
        fontFamily: 'Poppins, sans-serif',
      }}
    >
      <div className="container">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
        >
          <h2 className="display-5 fw-bold text-dark mb-4" style={{ letterSpacing: '1px' }}>
            Ready to 
            <span className='text-success'> Make a Difference?</span>
          </h2>
          <p className="lead text-dark mb-5" style={{ fontSize: '1.25rem', fontWeight: '500' }}>
            Join the <span className="fw-bold text-success">FoodShare Network</span> today and 
            create a meaningful impact in your community.
          </p>
          <motion.button
            className="btn btn-warning btn-lg px-4 py-2"
            onClick={() => navigate('/signup')}
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            transition={{ type: 'spring', stiffness: 300 }}
            style={{
              fontWeight: '600',
              fontSize: '1.2rem',
              letterSpacing: '0.5px',
            }}
          >
            Get Started
          </motion.button>
        </motion.div>
      </div>
    </section>
  );
};

export default CTASection;