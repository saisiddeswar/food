import React from 'react';
import { motion } from 'framer-motion';
import { FaHandHoldingHeart, FaExchangeAlt, FaSeedling } from 'react-icons/fa';

const FeaturesSection = () => {
  const containerVariants = {
    hidden: { opacity: 0 },
    visible: { opacity: 1, transition: { staggerChildren: 0.3 } },
  };

  const itemVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: { opacity: 1, y: 0 },
  };

  return (
    <section
      className="py-5"
      style={{
        backgroundColor: '#F5F5F5',
        fontFamily: 'Poppins, sans-serif',
      }}
    >
      <div className="container">
        <motion.div
          className="text-center mb-5"
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
        >
          <h2 className="display-5 fw-bold text-dark mb-3">
            Our <span className="text-success">Core Values</span>
          </h2>
          <p className="lead text-secondary">
            Learn how we’re making a difference in food distribution.
          </p>
        </motion.div>

        <motion.div
          className="row row-cols-1 row-cols-md-3 g-4"
          variants={containerVariants}
          initial="hidden"
          animate="visible"
        >
          <motion.div className="col" variants={itemVariants}>
            <motion.div
              className="card h-100 border-0 shadow-sm text-center p-4 rounded-4"
              whileHover={{ scale: 1.05, backgroundColor: '#E8F5E9' }}
              transition={{ type: 'spring', stiffness: 300 }}
            >
              <FaHandHoldingHeart className="text-primary mx-auto mb-3" size={50} />
              <h3 className="h4 fw-semibold text-dark mb-3">Our Mission</h3>
              <p className="text-muted fs-6">
                Bridging the gap between surplus and scarcity effortlessly.
              </p>
            </motion.div>
          </motion.div>

          <motion.div className="col" variants={itemVariants}>
            <motion.div
              className="card h-100 border-0 shadow-sm text-center p-4 rounded-4"
              whileHover={{ scale: 1.05, backgroundColor: '#E8F5E9' }}
              transition={{ type: 'spring', stiffness: 300 }}
            >
              <FaExchangeAlt className="text-success mx-auto mb-3" size={50} />
              <h3 className="h4 fw-semibold text-dark mb-3">How It Works</h3>
              <p className="text-muted fs-6">
                Institutions list food; NGOs reserve or collect it easily.
              </p>
            </motion.div>
          </motion.div>

          <motion.div className="col" variants={itemVariants}>
            <motion.div
              className="card h-100 border-0 shadow-sm text-center p-4 rounded-4"
              whileHover={{ scale: 1.05, backgroundColor: '#E8F5E9' }}
              transition={{ type: 'spring', stiffness: 300 }}
            >
              <FaSeedling className="text-warning mx-auto mb-3" size={50} />
              <h3 className="h4 fw-semibold text-dark mb-3">Make a Difference</h3>
              <p className="text-muted fs-6">
                Reduce waste and feed those in need with us.
              </p>
            </motion.div>
          </motion.div>
        </motion.div>
      </div>
    </section>
  );
};

export default FeaturesSection;