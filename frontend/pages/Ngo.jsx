import { useEffect, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import "bootstrap/dist/css/bootstrap.min.css";
import { FaShoppingCart, FaUtensils, FaCheck, FaBell } from "react-icons/fa";
import { toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import socket from "./socket"; // Shared socket
import Cart from "../component/Cart";
import "./ngo.css";

const Ngo = () => {
  const [institutes, setInstitutes] = useState([]);
  const [cart, setCart] = useState([]);
  const [showCart, setShowCart] = useState(false);
  const [notifications, setNotifications] = useState([]);
  const [showNotifications, setShowNotifications] = useState(false);
  const username = localStorage.getItem("username");

  useEffect(() => {
    // Fetch notifications for the NGO
    const fetchNotifications = async () => {
      try {
        const response = await fetch(
          `https://food-backend-service.onrender.com/api/ngo/bookings/${username}`
        );
        if (!response.ok) throw new Error("Failed to fetch notifications");
        const data = await response.json();
        if (data.success) {
          setNotifications(data.bookings);
        }
      } catch (error) {
        console.error("Error fetching notifications:", error);
      }
    };

    const fetchInstitutes = async () => {
      try {
        const response = await fetch(
          "https://food-backend-service.onrender.com/api/ngo/food-availability"
        );
        if (!response.ok) throw new Error("Failed to fetch data");
        const data = await response.json();
        console.log("Fetched Data:", data);
        setInstitutes(data.availableFood);
      } catch (error) {
        console.error("Error fetching institutes:", error);
      }
    };

    if (username) {
      fetchInstitutes();
      fetchNotifications();
      
      // Ensure clean socket connection
      if (!socket.connected) {
        socket.connect();
      }
      socket.emit("register", { userId: username, userType: "ngo" });
      
      // Log socket connection status
      console.log("Socket connected:", socket.connected);

      // Listen for booking responses (when institute accepts/rejects)
      socket.on("bookingResponse", (data) => {
        console.log("Booking response received:", data);
        
        // Update notifications list with new status
        setNotifications(prev => {
          const updatedNotifications = prev.map(notif => 
            notif._id === data.bookingId 
              ? {
                  ...notif,
                  status: data.status,
                  pickupDetails: data.pickupDetails,
                  rejectionReason: data.rejectionReason,
                  updatedAt: new Date().toISOString()
                }
              : notif
          );

          return updatedNotifications;
        });

        // Show toast notification
        toast[data.status === "ACCEPTED" ? "success" : "error"](
          `Booking ${data.status === "ACCEPTED" ? "accepted! Check pickup details" : "rejected. See reason in notifications."}`
        );
      });

      // Listen for booking cancellation confirmations
      socket.on("bookingCancelled", (data) => {
        console.log("Booking cancelled:", data);
        
        // Update notifications list
        setNotifications(prev => {
          const updatedNotifications = prev.map(notif => 
            notif._id === data.bookingId 
              ? {
                  ...notif,
                  status: "CANCELLED",
                  updatedAt: new Date().toISOString()
                }
              : notif
          );

          return updatedNotifications;
        });

        // Show toast notification
        toast.info("Booking cancelled successfully");
      });

      // Listen for new booking confirmations
      socket.on("bookingConfirmed", (data) => {
        console.log("New booking confirmed:", data);
        
        // Add new notification to the list
        setNotifications(prev => [{
          _id: data.bookingId,
          status: "PENDING",
          instituteUsername: data.instituteUsername,
          mealType: data.mealType,
          foodItems: data.foodItems,
          createdAt: new Date().toISOString()
        }, ...prev]);

        // Show toast notification
        toast[data.status === "ACCEPTED" ? "success" : "error"](
          `Booking ${data.status === "ACCEPTED" ? "accepted" : "rejected"}${data.rejectionReason ? `: ${data.rejectionReason}` : ""}`
        );
      });

      socket.on("newBookingRequest", (data) => {
        console.log("Socket Event Received:", data);
        if (data.accepted) {
          setInstitutes((prevInstitutes) =>
            prevInstitutes.map((institute) =>
              institute.instituteUsername === data.instituteUsername
                ? {
                    ...institute,
                    meals: institute.meals.map((meal) =>
                      meal.type === data.mealType
                        ? {
                            ...meal,
                            items: meal.items.filter(
                              (item) => item.food_name !== data.foodItem.food_name
                            ),
                          }
                        : meal
                    ),
                  }
                : institute
            )
          );
        }
        alert(`Institute ${data.instituteUsername} responded: ${data.message}`);
      });

      return () => {
        socket.off("newBookingRequest");
        socket.off("bookingResponse");
        socket.off("bookingCancelled");
        socket.off("bookingConfirmed");
        socket.disconnect();
      };
    }
  }, [username]);

  const handleBook = async (instituteUsername, mealType, foodItem) => {
  try {
    console.log("Booking Food:", { instituteUsername, mealType, foodItem });
    
    if (!foodItem.food_name || !foodItem.quantity) {
      toast.error("Invalid food item details");
      return;
    }

    const response = await fetch("https://food-backend-service.onrender.com/api/ngo/book-food", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        instituteUsername,
        mealType,
        ngoUsername: username,
        foodItems: [
          {
            food_name: foodItem.food_name,
            quantity: foodItem.quantity || 1,
          },
        ],
      }),
    });

    const result = await response.json();
    console.log("API Response:", result);

    if (!response.ok) {
      console.error("Booking failed:", result.message);
      toast.error(result.message || "Failed to book food");
      return;
    }
    
    toast.success("Food booked successfully!");

    setCart((prevCart) => [
      ...prevCart,
      { ...foodItem, instituteUsername, mealType, bookedAt: Date.now() },
    ]);

    setInstitutes((prevInstitutes) =>
      prevInstitutes.map((institute) =>
        institute.instituteUsername === instituteUsername
          ? {
              ...institute,
              meals: institute.meals.map((meal) =>
                meal.type === mealType
                  ? {
                      ...meal,
                      items: meal.items.filter(
                        (item) => item.food_name !== foodItem.food_name
                      ),
                    }
                  : meal
              ),
            }
          : institute
      )
    );

    // Optional auto-unreserve logic after 30 min
    setTimeout(() => {
      setInstitutes((prevInstitutes) =>
        prevInstitutes.map((institute) =>
          institute.instituteUsername === instituteUsername
            ? {
                ...institute,
                meals: institute.meals.map((meal) =>
                  meal.type === mealType
                    ? { ...meal, items: [...meal.items, foodItem] }
                    : meal
                ),
              }
            : institute
        )
      );

      setCart((prevCart) =>
        prevCart.filter(
          (cartItem) =>
            !(
              cartItem.food_name === foodItem.food_name &&
              cartItem.instituteUsername === instituteUsername &&
              cartItem.mealType === mealType
            )
        )
      );
    }, 30 * 60 * 1000);
  } catch (error) {
    console.error("Error booking food:", error);
  }
};


  const toggleCart = () => setShowCart(!showCart);

  return (
    <div className="container py-5">
      <motion.div
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.8 }}
        className="d-flex justify-content-between align-items-center mb-5"
      >
        <h1 className="display-5 fw-bold text-dark">Hello, {username}</h1>
        <motion.button
          className="btn btn-outline-primary btn-md d-flex align-items-center"
          onClick={toggleCart}
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
        >
          <FaShoppingCart className="me-2" /> Cart ({cart.length})
        </motion.button>

        <motion.button
          className="btn btn-outline-info ms-2"
          onClick={() => setShowNotifications(!showNotifications)}
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
        >
          <FaBell className="me-2" /> Notifications ({notifications.length})
        </motion.button>
      </motion.div>

      {/* Notifications Panel */}
      <AnimatePresence>
        {showNotifications && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.3 }}
            className="notifications-overlay"
            style={{
              position: 'fixed',
              top: 0,
              right: 0,
              width: '400px',
              height: '100%',
              background: 'white',
              boxShadow: '-2px 0 5px rgba(0,0,0,0.1)',
              padding: '20px',
              zIndex: 1000,
              overflowY: 'auto'
            }}
          >
            <div className="d-flex justify-content-between align-items-center mb-4">
              <h3 className="fw-bold m-0">Notifications</h3>
              <button className="btn btn-sm btn-outline-secondary" onClick={() => setShowNotifications(false)}>
                Close
              </button>
            </div>

            {notifications.length === 0 ? (
              <p className="text-muted text-center">No notifications yet</p>
            ) : (
              notifications
                .sort((a, b) => new Date(b.updatedAt || b.createdAt) - new Date(a.updatedAt || a.createdAt))
                .map((notification) => (
                <motion.div
                  key={notification._id}
                  initial={{ x: 50, opacity: 0 }}
                  animate={{ x: 0, opacity: 1 }}
                  className="card mb-3 border-0 shadow-sm"
                >
                  <div className="card-body">
                    <div className={`badge ${
                      notification.status === "ACCEPTED" ? "bg-success" : 
                      notification.status === "REJECTED" ? "bg-danger" :
                      "bg-warning text-dark"
                    } mb-2`}>
                      {notification.status}
                    </div>
                    <h6 className="mb-1">From: {notification.instituteUsername}</h6>
                    <p className="mb-1">Meal Type: {notification.mealType}</p>
                    {notification.foodItems && (
                      <p className="mb-1">
                        Items: {notification.foodItems.map(item => `${item.food_name} (${item.quantity})`).join(', ')}
                      </p>
                    )}
                    {notification.status === "ACCEPTED" && notification.pickupDetails && (
                      <p className="mb-1">
                        Pickup: {new Date(notification.pickupDetails.time).toLocaleString()}
                        {notification.pickupDetails.notes && <br/>}
                        {notification.pickupDetails.notes}
                      </p>
                    )}
                    {notification.status === "REJECTED" && notification.rejectionReason && (
                      <p className="mb-1 text-danger">
                        Reason: {notification.rejectionReason}
                      </p>
                    )}
                    <small className="text-muted">
                      {new Date(notification.createdAt).toLocaleString()}
                    </small>
                  </div>
                </motion.div>
              ))
            )}
          </motion.div>
        )}
      </AnimatePresence>

      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.8 }}
        className="text-center mb-5"
      >
        <h2 className="fw-bold text-dark">Today&apos;s Available Food</h2>
        <p className="text-muted">Reserve meals to help reduce food waste</p>
      </motion.div>

      <AnimatePresence>
        {showCart && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.3 }}
            className="cart-overlay"
          >
            <Cart cart={cart} />
            <button className="btn btn-secondary mt-3" onClick={toggleCart}>
              Close
            </button>
          </motion.div>
        )}
      </AnimatePresence>

      <div className="row g-4">
        {institutes.map((institute, index) => (
          <motion.div
            key={index}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
            className="col-md-4"
          >
            <div className="card shadow-sm p-4 border-0 h-100">
              <h3 className="fw-bold text-dark mb-3">
                {institute.instituteUsername.toUpperCase()}
              </h3>
              {institute.meals.map((meal, mealIndex) => (
                <div key={mealIndex} className="mb-3">
                  <h4 className="text-primary mb-2">
                    <FaUtensils className="me-2" /> {meal.type.toUpperCase()}
                  </h4>
                  {meal.items.length > 0 ? (
                    <ul className="list-group">
                      {meal.items.map((item, itemIndex) => (
                        <li
                          key={itemIndex}
                          className="list-group-item d-flex justify-content-between align-items-center"
                        >
                          <div>
                            <span className="fw-bold">{item.food_name}</span>
                            <br />
                            <small className="text-muted">Qty: {item.quantity}</small>
                          </div>
                          <motion.button
                            className="btn btn-success btn-sm"
                            onClick={() =>
                              handleBook(institute.instituteUsername, meal.type, item)
                            }
                            whileHover={{ scale: 1.05 }}
                            whileTap={{ scale: 0.95 }}
                          >
                            <FaCheck className="me-1" /> Book
                          </motion.button>
                        </li>
                      ))}
                    </ul>
                  ) : (
                    <p className="text-muted">No available food items.</p>
                  )}
                </div>
              ))}
            </div>
          </motion.div>
        ))}
      </div>
    </div>
  );
};

export default Ngo;
