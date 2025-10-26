import { useState,useEffect } from "react";
import { motion } from "framer-motion";
import "bootstrap/dist/css/bootstrap.min.css";
import { FaUsers, FaUtensils, FaHandshake } from "react-icons/fa";
import "./about.css";
import OurJourney from "./OurJourney";


const About = () => {
  const [visitors, setVisitors] = useState(0);
  const [mealsSaved, setMealsSaved] = useState(0);
  const [partners, setPartners] = useState(0);

  useEffect(() => {
    let start = 0;
    const endValues = { visitors: 5000, mealsSaved: 12000, partners: 200 };
    const duration = 2000; // Animation duration in ms
    const increment = 50; // Steps for smooth animation

    const animateCount = () => {
      const steps = Math.ceil(duration / increment);
      const visitorStep = Math.ceil(endValues.visitors / steps);
      const mealsStep = Math.ceil(endValues.mealsSaved / steps);
      const partnersStep = Math.ceil(endValues.partners / steps);

      const interval = setInterval(() => {
        start += increment;
        setVisitors((prev) => Math.min(prev + visitorStep, endValues.visitors));
        setMealsSaved((prev) => Math.min(prev + mealsStep, endValues.mealsSaved));
        setPartners((prev) => Math.min(prev + partnersStep, endValues.partners));

        if (start >= duration) clearInterval(interval);
      }, increment);
    };

    animateCount();

    return () => clearInterval();
  }, []);

  // Animation variants
  const sectionVariants = {
    hidden: { opacity: 0, y: 30 },
    visible: { opacity: 1, y: 0, transition: { duration: 0.8, ease: "easeOut" } },
  };

  const statVariants = {
    hidden: { opacity: 0, scale: 0.8 },
    visible: { opacity: 1, scale: 1, transition: { duration: 0.5, delay: 0.2 } },
  };

  return (
    <div className="container-fluid about-bg py-5">
      <div className="container">
        {/* Title Section */}
        <motion.div
          variants={sectionVariants}
          initial="hidden"
          animate="visible"
          className="text-center mb-5"
        >
          <h1 className="about-title fw-bold text-dark">About
            <span className="text-success"> FoodShare Network</span> </h1>
          <p className="about-description text-muted mx-auto">
            At FoodShare Network, we believe in the power of community and sustainability.
            Our mission is to connect educational institutions with NGOs to redistribute surplus food,
            ensuring no meal goes to waste.
          </p>
        </motion.div>

        {/* Stats Section */}
        <motion.div
          variants={sectionVariants}
          initial="hidden"
          animate="visible"
          className="mb-5"
        >
          <h2 className="about-subtitle fw-semibold text-dark text-center mb-4">Our Impact</h2>
          <div className="row g-4 justify-content-center">
            <motion.div
              variants={statVariants}
              initial="hidden"
              animate="visible"
              className="col-md-4 col-sm-6"
            >
              <div className="stat-card shadow-sm text-center p-4">
                <FaUsers className="stat-icon text-primary mb-3" size={40} />
                <h3 className="stat-number fw-bold">{visitors.toLocaleString()}+</h3>
                <p className="stat-label text-muted">People Visited</p>
              </div>
            </motion.div>
            <motion.div
              variants={statVariants}
              initial="hidden"
              animate="visible"
              className="col-md-4 col-sm-6"
            >
              <div className="stat-card shadow-sm text-center p-4">
                <FaUtensils className="stat-icon text-success mb-3" size={40} />
                <h3 className="stat-number fw-bold">{mealsSaved.toLocaleString()}+</h3>
                <p className="stat-label text-muted">Meals Saved</p>
              </div>
            </motion.div>
            <motion.div
              variants={statVariants}
              initial="hidden"
              animate="visible"
              className="col-md-4 col-sm-6"
            >
              <div className="stat-card shadow-sm text-center p-4">
                <FaHandshake className="stat-icon text-warning mb-3" size={40} />
                <h3 className="stat-number fw-bold">{partners.toLocaleString()}+</h3>
                <p className="stat-label text-muted">Partner Institutions</p>
              </div>
            </motion.div>
          </div>
        </motion.div>

        {/* How We Work Section */}
        <motion.div
          variants={sectionVariants}
          initial="hidden"
          animate="visible"
          className="text-center"
        >
          <h2 className="about-subtitle fw-semibold text-dark mb-4">How We Work</h2>
          <p className="about-description text-muted mx-auto">
            Institutions list available food on our platform, and NGOs can reserve or collect it.
            This streamlined process ensures efficient redistribution and minimizes food wastage.
          </p>
        </motion.div>
      </div>
    <OurJourney/>
    </div>
  );
};

export default About;