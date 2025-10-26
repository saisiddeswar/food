import React from 'react';
import { motion } from 'framer-motion';

const TestimonialsSection = () => {
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
          <h2 className="display-5 fw-bold text-dark mb-4">What People 
            <span className='text-success'> Are Saying</span></h2>
        </motion.div>

        <motion.div
          className="row row-cols-1 row-cols-md-3 g-4"
          variants={containerVariants}
          initial="hidden"
          animate="visible"
        >
          <motion.div className="col" variants={itemVariants}>
            <div className="card h-100 border-0 shadow-sm p-4 text-center rounded-4">
              <p className="text-muted fst-italic">
                "FoodShare has transformed the way our school handles extra food. Now, nothing goes to waste, and many children in need get meals."
              </p>
              <span className="fw-bold text-dark">- Rajesh Kumar, School Principal</span>
            </div>
          </motion.div>

          <motion.div className="col" variants={itemVariants}>
            <div className="card h-100 border-0 shadow-sm p-4 text-center rounded-4">
              <p className="text-muted fst-italic">
                "With FoodShare, our NGO can quickly connect with institutions and ensure food reaches the needy on time."
              </p>
              <span className="fw-bold text-dark">- Anjali Sharma, NGO Coordinator</span>
            </div>
          </motion.div>

          <motion.div className="col" variants={itemVariants}>
            <div className="card h-100 border-0 shadow-sm p-4 text-center rounded-4">
              <p className="text-muted fst-italic">
                "This platform is a blessing. I volunteer to distribute food, and FoodShare makes the process seamless and efficient."
              </p>
              <span className="fw-bold text-dark">- Ravi Verma, Volunteer</span>
            </div>
          </motion.div>
        </motion.div>
      </div>
    </section>
  );
};

export default TestimonialsSection;