import React from "react";
import { motion } from "framer-motion";
import "bootstrap/dist/css/bootstrap.min.css";

const journeyTimeline = [
  {
    year: "2021",
    title: "Idea & Concept",
    description: "Our journey started with a simple idea: to reduce food wastage by connecting institutions with NGOs efficiently.",
  },
  {
    year: "2022",
    title: "Prototype Development",
    description: "We built an initial version of our platform and tested it with a few NGOs and food providers.",
  },
  {
    year: "2023",
    title: "Expanding Network",
    description: "Partnered with major NGOs and expanded our food-sharing network across multiple cities.",
  },
  {
    year: "2024",
    title: "Technology Upgrade",
    description: "Enhanced our platform with AI-driven analytics and real-time tracking for better food redistribution.",
  },
  {
    year: "2025",
    title: "Scaling Nationwide",
    description: "Our platform now connects thousands of food providers with NGOs across the country, making a real impact!",
  },
];

const OurJourney = () => {
  return (
    <motion.section
      className="py-5 container text-center"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.8 }}
    >
      <h2
        className="fw-bold text-center mb-4"
        style={{
          fontFamily: "Poppins, sans-serif",
        }}
      >
        Our 
        <span className="text-success"> Journey</span>
      </h2>
      <p className="lead text-muted mb-4">
        From a simple idea to a nationwide impact, our journey is a story of dedication and innovation.
      </p>

      <div className="row row-cols-1 row-cols-md-3 g-4">
        {journeyTimeline.map((event, index) => (
          <motion.div
            className="col"
            key={index}
            whileHover={{ scale: 1.05 }}
            transition={{ type: "spring", stiffness: 300 }}
          >
            <div className="card border-0 shadow-sm text-center p-4">
              <h3
                className="fw-bold mb-2"
                style={{ fontFamily: "Poppins, sans-serif", color: "#198754" }}
              >
                {event.year}
              </h3>
              <h5 className="fw-semibold text-dark" style={{ fontFamily: "Poppins, sans-serif" }}>
                {event.title}
              </h5>
              <p className="text-muted">{event.description}</p>
            </div>
          </motion.div>
        ))}
      </div>
    </motion.section>
  );
};

export default OurJourney;