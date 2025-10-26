import { useState, useEffect } from "react";
import io from "socket.io-client";
import AddFoodForm from "./AddFoodForm";
import History from "./History";
import Request from './Request'
import './institutedashboard.css';

const socket = io("https://annasamarpan-backend.onrender.com");

const Institutes = () => {
  const [activeCard, setActiveCard] = useState('addFood'); 
  const organizationName = localStorage.getItem('username') || 'Institute';
  const [notifications, setNotifications] = useState([]);

  useEffect(() => {
    socket.emit("register", { userId: organizationName, userType: "institute" });

    // Listen for new booking notifications
    socket.on("newBooking", (data) => {
      setNotifications((prev) => [...prev, data]);
    });

    return () => {
      socket.off("newBooking");
    };
  }, [organizationName]);

  const handleCardClick = (card) => {
    setActiveCard(card);
  };

  return (
    <div className="institute-dashboard">
      {/* Sidebar */}
      <div className="sidebar">
        <h1>Hello, {organizationName}</h1>
        <div className={`card ${activeCard === 'addFood' ? 'active' : ''}`} onClick={() => handleCardClick('addFood')}>
          Add Food
        </div>
        <div className={`card ${activeCard === 'Request' ? 'active' : ''}`} onClick={() => handleCardClick('Request')}>
          Requests {notifications.length > 0 && <span className="badge">{notifications.length}</span>}
        </div>
        <div className={`card ${activeCard === 'history' ? 'active' : ''}`} onClick={() => handleCardClick('history')}>
          History
        </div>
      </div>

      {/* Main Content */}
      <div className="main-content">
        <div className={activeCard ? 'fade-in' : ''}>
          {activeCard === 'addFood' && <AddFoodForm />}
          {activeCard === 'Request' && <Request notifications={notifications} />}
          {activeCard === 'history' && <History />}
        </div>
      </div>
    </div>
  );
};

export default Institutes;
