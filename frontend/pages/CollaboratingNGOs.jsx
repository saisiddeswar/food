import React from "react";
import { motion } from "framer-motion";
import "bootstrap/dist/css/bootstrap.min.css";

const ngoList = [
  {
    name: "Akshaya Patra Foundation",
    logo: "https://media.licdn.com/dms/image/v2/C5603AQESX67M3vqCpw/profile-displayphoto-shrink_200_200/profile-displayphoto-shrink_200_200/0/1616962562579?e=2147483647&v=beta&t=byZSR_gM63fRmGZNG8b11BuuTPjZaQvFmzcWmHZMWNw",
    website: "https://www.akshayapatra.org/"
  },
  {
    name: "Feeding India by Zomato",
    logo: "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcSuP0hq62APhBHQvN0qiB4ay9p-5RZD85HmcA&s",
    website: "https://www.feedingindia.org/"
  },
  {
    name: "Robin Hood Army",
    logo: "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcSMGZMfK98TW6q9Bqcle3YADeI1_sfBsHS51A&s",
    website: "https://www.robinhoodarmy.com/"
  },
  {
    name: "Rise Against Hunger India",
    logo: "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcRu0zCN9fGs6GXennDIoh2NdREeyMsZx30gPg&s",
    website: "https://www.riseagainsthungerindia.org/"
  },
  {
    name: "No Food Waste",
    logo: "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcQv2YNZtptF2tJcFJ-AIPuoX0ZLnlTy-90sDg&s",
    website: "https://nofoodwaste.org/"
  },
  {
    name: "Annamrita Foundation",
    logo: "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcTsFG3faJkruay6sYFl3YTLxPyKcwu7G_WwDw&s",
    website: "https://annamrita.org/"
  },
];

const CollaboratingNGOs = () => {
  return (
    <motion.section
      className="py-5 container text-center"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.8 }}
    >
      <h2 className="fw-bold text-center mb-4" style={{ fontFamily: "Poppins, sans-serif" }}>
        Some Of Our <span className="text-success">Collaborating NGOs</span>
      </h2>
      <p className="lead text-muted mb-4">
        We proudly collaborate with NGOs that help distribute food to those in need.
      </p>

      {/* Scrollable NGO List */}
      <div className="position-relative overflow-hidden">
        <div className="d-flex flex-nowrap moving-logos">
          {[...ngoList, ...ngoList].map((ngo, index) => (
            <div key={index} className="flex-shrink-0 px-3" style={{ width: "220px" }}>
              <a href={ngo.website} target="_blank" rel="noopener noreferrer" className="text-decoration-none">
                <div className="card border-0 shadow-sm text-center p-3">
                  <img src={ngo.logo} alt={ngo.name} className="rounded mx-auto d-block mb-2" style={{ width: "100px", height: "60px", objectFit: "contain" }} />
                  <h3 className="h6 fw-bold text-dark" style={{ fontFamily: "Poppins, sans-serif" }}>{ngo.name}</h3>
                </div>
              </a>
            </div>
          ))}
        </div>
      </div>
      
      {/* CSS for animation */}
      <style>
        {`
          @keyframes moveLeft {
            from { transform: translateX(0); }
            to { transform: translateX(-50%); }
          }

          .moving-logos {
            display: flex;
            animation: moveLeft 15s linear infinite;
            width: max-content;
          }
        `}
      </style>
    </motion.section>
  );
};

export default CollaboratingNGOs;