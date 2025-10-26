import React from "react";
import { FaTimes, FaClock, FaCheckCircle } from "react-icons/fa";
import "./cart.css"; // Optional styling import

const Cart = ({ cart = [], onCancel }) => {
  // Get appropriate icon for booking status
  const getStatusIcon = (status) => {
    switch (status?.toUpperCase()) {
      case "PENDING":
        return <FaClock className="text-warning" />;
      case "ACCEPTED":
        return <FaCheckCircle className="text-success" />;
      default:
        return <FaClock className="text-secondary" />;
    }
  };

  return (
    <div className="cart-modal">
      <div className="cart-content p-3 rounded shadow-sm bg-light">
        <h2 className="fw-bold mb-3 text-dark">Pending Bookings</h2>

        {cart.length === 0 ? (
          <p className="text-muted">No pending bookings</p>
        ) : (
          <ul className="cart-list list-unstyled m-0">
            {cart.map((item, index) => {
              const safeStatus = item.status ? item.status.toLowerCase() : "unknown";

              return (
                <li
                  key={index}
                  className="cart-item d-flex justify-content-between align-items-center p-3 mb-2 bg-white rounded shadow-sm"
                >
                  <div className="cart-item-details">
                    <div className="d-flex align-items-center mb-2">
                      {getStatusIcon(item.status)}
                      <span className="food-name ms-2 fw-semibold text-primary">
                        {item.food_name || "Unnamed Item"}
                      </span>
                    </div>

                    <div className="small text-muted">
                      <span>Quantity: {item.quantity || 1}</span>
                      <br />
                      <span>
                        From:{" "}
                        <span className="text-dark">
                          {item.instituteUsername || "Unknown Institute"}
                        </span>{" "}
                        - {item.mealType || "N/A"}
                      </span>
                      <br />
                      <span
                        className={`status text-capitalize fw-semibold text-${
                          safeStatus === "accepted"
                            ? "success"
                            : safeStatus === "pending"
                            ? "warning"
                            : "secondary"
                        }`}
                      >
                        Status: {item.status || "UNKNOWN"}
                      </span>
                    </div>
                  </div>

                  {item.status?.toUpperCase() === "PENDING" && (
                    <button
                      className="btn btn-outline-danger btn-sm ms-2"
                      onClick={() => onCancel?.(item.bookingId)}
                    >
                      <FaTimes />
                    </button>
                  )}
                </li>
              );
            })}
          </ul>
        )}
      </div>
    </div>
  );
};

export default Cart;
