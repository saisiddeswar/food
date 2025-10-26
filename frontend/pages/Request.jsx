import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import "bootstrap/dist/css/bootstrap.min.css";
import { FaCheck, FaTimes, FaSpinner } from "react-icons/fa";
import { toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import socket from "./socket"; // Shared socket instance
import "./Request.css";

const Request = () => {
  const [requests, setRequests] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const instituteUsername = localStorage.getItem("username");

  // Fetch requests (extracted so socket handlers can reuse it)
  const fetchRequests = async () => {
    try {
      setLoading(true);
      const response = await fetch(
        `http://localhost:5000/api/ngo/requests?instituteUsername=${instituteUsername}`,
        { method: "GET" }
      );
      if (!response.ok) throw new Error(`HTTP error! Status: ${response.status}`);
      const data = await response.json();
      // Normalize statuses to uppercase (backend uses uppercase statuses)
      const normalized = (data.requests || []).map((r) => ({ ...r, status: r.status?.toUpperCase?.() || r.status }));
      setRequests(normalized);
      setLoading(false);
    } catch (err) {
      console.error("Error fetching requests:", err);
      setError("Failed to load requests");
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchRequests();

    socket.on("newBookingRequest", (data) => {
      toast.info(`New request from ${data.ngoUsername}`, { position: "top-right" });
      // refresh list to ensure consistent shape
      fetchRequests();
    });

    // Listen for booking responses from backend (backend emits 'bookingResponse')
    socket.on("bookingResponse", (data) => {
      setRequests((prevRequests) =>
        prevRequests.map((req) =>
          req._id === data.bookingId
            ? { ...req, status: data.status }
            : req
        )
      );
    });

    return () => {
      socket.off("newBookingRequest");
      socket.off("bookingResponse");
    };
  }, [instituteUsername]);

  const handleAction = async (requestId, action) => {
    try {
      let pickupDetails = null;
      let rejectionReason = null;

      if (action === "ACCEPTED") {
        const deliveryTime = prompt("Enter delivery time in minutes:");
        if (!deliveryTime) {
          toast.error("Please enter delivery time to accept the request");
          return;
        }
        
        // Convert minutes to future timestamp
        const pickupTime = new Date();
        pickupTime.setMinutes(pickupTime.getMinutes() + parseInt(deliveryTime));
        
        pickupDetails = {
          time: pickupTime.toISOString(),
          notes: `Food will be ready for pickup in ${deliveryTime} minutes`
        };
      } else if (action === "REJECTED") {
        rejectionReason = "Request rejected by institute";
      }

      const response = await fetch(`http://localhost:5000/api/ngo/respond-booking`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          bookingId: requestId,
          status: action,
          pickupDetails,
          rejectionReason
        }),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.message || "Failed to update request");
      }

      if (data.success) {
        toast.success(`Request ${action.toLowerCase()}ed successfully!`, { position: "top-right" });

        setRequests((prevRequests) =>
          prevRequests.map((req) =>
            req._id === requestId ? { ...req, status: action } : req
          )
        );
        // Backend will notify the NGO via WebSocket; no client emit needed here.
      } else {
        throw new Error(data.message || "Failed to update request");
      }
    } catch (err) {
      console.error(`Error ${action.toLowerCase()}ing request:`, err);
      toast.error(`Failed to ${action.toLowerCase()} request: ${err.message}`, { position: "top-right" });
    }
  };

  const cardVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: { opacity: 1, y: 0, transition: { duration: 0.5, ease: "easeOut" } },
    exit: { opacity: 0, y: -20, transition: { duration: 0.3 } },
  };

  const bookedRequests = requests.filter((req) => req.status === "ACCEPTED");
  const otherRequests = requests.filter((req) => req.status !== "ACCEPTED");

  // Helper to render food items safely
  const renderFoodItems = (foodItems) => {
    if (!foodItems) return "";
    if (Array.isArray(foodItems)) {
      return foodItems
        .map((f) => `${f.food_name} x ${f.quantity}`)
        .join(", ");
    }
    // Single object
    return `${foodItems.food_name} x ${foodItems.quantity}`;
  };

  return (
    <div className="container-fluid request-bg py-5 request-container">
      <motion.div
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.8, ease: "easeOut" }}
        className="text-center mb-5"
      >
        <h2 className="fw-bold text-dark request-title">Food Requests</h2>
        <p className="text-muted request-subtitle">Manage and review food bookings</p>
      </motion.div>

      {loading && (
        <div className="text-center">
          <FaSpinner className="spinner" size={40} />
          <p className="mt-2 text-muted">Loading requests...</p>
        </div>
      )}
      {error && <p className="text-danger text-center fw-semibold">{error}</p>}

      {/* Booked Requests Section */}
      {!loading && bookedRequests.length > 0 && (
        <div className="mb-5">
          <h3 className="fw-semibold text-dark mb-3">Booked Food</h3>
          <AnimatePresence>
            {bookedRequests.map((request) => (
              <motion.div
                key={request._id}
                variants={cardVariants}
                initial="hidden"
                animate="visible"
                exit="exit"
                className="card shadow-sm p-3 mb-3 border-0 request-card booked-card"
              >
                <div className="d-flex justify-content-between align-items-center">
                  <div>
                    <h5 className="fw-bold text-dark mb-2">
                      {renderFoodItems(request.foodItems)}{" "}
                      <small className="text-muted">({request.mealType})</small>
                    </h5>
                    <p className="mb-1 text-muted">
                      <strong className="text-dark">NGO:</strong> {request.ngoUsername}
                    </p>
                    <p className="mb-0 text-muted">
                      <strong className="text-dark">Status:</strong>{" "}
                      <span className="badge bg-success">
                        {request.status.charAt(0).toUpperCase() + request.status.slice(1)}
                      </span>
                      {request.pickupDetails && request.pickupDetails.time && (
                        <span className="ms-2">
                          Ready for pickup at: {new Date(request.pickupDetails.time).toLocaleTimeString()}
                        </span>
                      )}
                    </p>
                  </div>
                </div>
              </motion.div>
            ))}
          </AnimatePresence>
        </div>
      )}

      {/* Pending/Rejected Requests Section */}
      {!loading && otherRequests.length > 0 && (
        <div>
          <h3 className="fw-semibold text-dark mb-3">Pending Requests</h3>
          <AnimatePresence>
            {otherRequests.map((request) => (
              <motion.div
                key={request._id}
                variants={cardVariants}
                initial="hidden"
                animate="visible"
                exit="exit"
                className="card shadow-sm p-3 mb-3 border-0 request-card"
              >
                <div className="d-flex justify-content-between align-items-center">
                  <div>
                    <h5 className="fw-bold text-dark mb-2">
                      {renderFoodItems(request.foodItems)}{" "}
                      <small className="text-muted">({request.mealType})</small>
                    </h5>
                    <p className="mb-1 text-muted">
                      <strong className="text-dark">NGO:</strong> {request.ngoUsername}
                    </p>
                    <p className="mb-0 text-muted">
                      <strong className="text-dark">Status:</strong>{" "}
                      <span
                        className={`badge ${
                          request.status === "PENDING" ? "bg-warning text-dark" : "bg-danger"
                        }`}
                      >
                        {request.status.charAt(0).toUpperCase() + request.status.slice(1).toLowerCase()}
                      </span>
                    </p>
                  </div>
                  {request.status === "PENDING" && (
  <div className="d-flex gap-2">
      <motion.button
      className="btn btn-success btn-sm d-flex align-items-center"
      onClick={() => handleAction(request._id, "ACCEPTED")}
      whileHover={{ scale: 1.05 }}
      whileTap={{ scale: 0.95 }}
    >
      <FaCheck className="me-1" /> Accept
    </motion.button>
    <motion.button
      className="btn btn-danger btn-sm d-flex align-items-center"
      onClick={() => handleAction(request._id, "REJECTED")}
      whileHover={{ scale: 1.05 }}
      whileTap={{ scale: 0.95 }}
    >
      <FaTimes className="me-1" /> Reject
    </motion.button>
  </div>
)}

                </div>
              </motion.div>
            ))}
          </AnimatePresence>
        </div>
      )}

      {!loading && requests.length === 0 && (
        <p className="text-muted text-center fw-semibold">No requests found at the moment.</p>
      )}
    </div>
  );
};

export default Request;
