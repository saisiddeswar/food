import { useReducer, useContext, useEffect, useState } from 'react';
import { useNavigate, NavLink } from 'react-router-dom';
import { AuthContext } from '../src/store/Auth';
import { motion } from 'framer-motion';
import 'bootstrap/dist/css/bootstrap.min.css';
import { FaUserPlus, FaPaperPlane } from 'react-icons/fa';
import { toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import './signup.css';

const initialState = {
  userType: 'NGO',
  username: '',
  email: '',
  phone: '',
  address: { street: '', city: '', state: '', zip: '' },
  password: '',
  latitude: null,
  longitude: null,
};

const reducer = (state, action) => {
  if (action.name === 'address') {
    return { ...state, address: { ...state.address, [action.field]: action.value } };
  }
  return { ...state, [action.name]: action.value };
};

const Registration = () => {
  const navigate = useNavigate();
  const { storeToken, storeUserDetails } = useContext(AuthContext);
  const [user, dispatch] = useReducer(reducer, initialState);
  const [geoLocationFetched, setGeoLocationFetched] = useState(false);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (!geoLocationFetched) {
      if (navigator.geolocation) {
        navigator.geolocation.getCurrentPosition(
          (position) => {
            dispatch({ name: 'latitude', value: position.coords.latitude });
            dispatch({ name: 'longitude', value: position.coords.longitude });
            setGeoLocationFetched(true);
          },
          (error) => {
            console.error("Error getting location:", error);
            toast.warn("Please enable location access for better experience.");
          }
        );
      }
    }
  }, [geoLocationFetched]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);

    try {
      const response = await fetch(`https://annasamarpan-backend.onrender.com/api/auth/register`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(user),
      });

      if (!response.ok) {
        const errorMsg = await response.json();
        toast.error(`Error: ${errorMsg.msg || 'Registration failed'}`);
        return;
      }

      const responseData = await response.json();
      toast.success("Registration successful! Redirecting...");
      
      storeToken(responseData.token);
      storeUserDetails(responseData.userType, responseData.username);

      setTimeout(() => navigate('/dashboard'), 1000);
    } catch (error) {
      console.error('Error:', error);
      toast.error('Something went wrong. Try again later.');
    } finally {
      setLoading(false);
    }
  };

  // Animation variants
  const containerVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: { opacity: 1, y: 0, transition: { duration: 0.8 } },
  };

  return (
    <div className="container py-5 d-flex justify-content-center align-items-center min-vh-100">
      <motion.div
        variants={containerVariants}
        initial="hidden"
        animate="visible"
        className="card shadow-sm p-4 border-0 signup-card"
      >
        <div className="text-center mb-4">
          <FaUserPlus className="text-primary mb-3" size={40} />
          <h1 className="display-5 fw-bold text-dark">Sign Up</h1>
          <p className="text-muted">Join the FoodShare Network today</p>
        </div>

        <form onSubmit={handleSubmit}>
          <div className="row g-3">
            {/* User Type */}
            <div className="col-md-6">
              <label htmlFor="userType" className="form-label fw-bold text-dark">User Type</label>
              <select
                id="userType"
                name="userType"
                value={user.userType}
                onChange={(e) => dispatch({ name: "userType", value: e.target.value })}
                className="form-select"
                required
              >
                <option value="NGO">NGO</option>
                <option value="Institute">Institute</option>
              </select>
            </div>

            {/* Username */}
            <div className="col-md-6">
              <label htmlFor="username" className="form-label fw-bold text-dark">Username</label>
              <input
                type="text"
                id="username"
                name="username"
                value={user.username}
                onChange={(e) => dispatch({ name: "username", value: e.target.value })}
                required
                className="form-control"
                placeholder="Enter username"
              />
            </div>

            {/* Email */}
            <div className="col-md-6">
              <label htmlFor="email" className="form-label fw-bold text-dark">Email</label>
              <input
                type="email"
                id="email"
                name="email"
                value={user.email}
                onChange={(e) => dispatch({ name: "email", value: e.target.value })}
                required
                className="form-control"
                placeholder="Enter email"
              />
            </div>

            {/* Phone */}
            <div className="col-md-6">
              <label htmlFor="phone" className="form-label fw-bold text-dark">Phone</label>
              <input
                type="tel"
                id="phone"
                name="phone"
                value={user.phone}
                onChange={(e) => dispatch({ name: "phone", value: e.target.value })}
                required
                className="form-control"
                placeholder="Enter phone number"
              />
            </div>

            {/* Address Fields */}
            <div className="col-md-12">
              <label htmlFor="street" className="form-label fw-bold text-dark">Street</label>
              <input
                type="text"
                id="street"
                name="street"
                value={user.address.street}
                onChange={(e) => dispatch({ name: 'address', field: 'street', value: e.target.value })}
                required
                className="form-control"
                placeholder="Enter street address"
              />
            </div>

            <div className="col-md-4">
              <label htmlFor="city" className="form-label fw-bold text-dark">City</label>
              <input
                type="text"
                id="city"
                name="city"
                value={user.address.city}
                onChange={(e) => dispatch({ name: 'address', field: 'city', value: e.target.value })}
                required
                className="form-control"
                placeholder="Enter city"
              />
            </div>

            <div className="col-md-4">
              <label htmlFor="state" className="form-label fw-bold text-dark">State</label>
              <input
                type="text"
                id="state"
                name="state"
                value={user.address.state}
                onChange={(e) => dispatch({ name: 'address', field: 'state', value: e.target.value })}
                required
                className="form-control"
                placeholder="Enter state"
              />
            </div>

            <div className="col-md-4">
              <label htmlFor="zip" className="form-label fw-bold text-dark">Zip Code</label>
              <input
                type="text"
                id="zip"
                name="zip"
                value={user.address.zip}
                onChange={(e) => dispatch({ name: 'address', field: 'zip', value: e.target.value })}
                required
                className="form-control"
                placeholder="Enter zip code"
              />
            </div>

            {/* Password */}
            <div className="col-md-12">
              <label htmlFor="password" className="form-label fw-bold text-dark">Password</label>
              <input
                type="password"
                id="password"
                name="password"
                value={user.password}
                onChange={(e) => dispatch({ name: "password", value: e.target.value })}
                required
                className="form-control"
                placeholder="Enter password"
              />
            </div>
          </div>

          <motion.button
            type="submit"
            className="btn btn-warning btn-md w-100 d-flex align-items-center justify-content-center mt-4"
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            transition={{ type: 'spring', stiffness: 300 }}
            disabled={loading}
          >
            {loading ? (
              <div className="spinner-border spinner-border-sm me-2" role="status">
                <span className="visually-hidden">Loading...</span>
              </div>
            ) : (
              <FaPaperPlane className="me-2" />
            )}
            {loading ? "Signing up..." : "Sign Up"}
          </motion.button>

          <p className="text-center mt-3 text-muted">
            Already have an account?{' '}
            <NavLink className="text-primary text-decoration-none fw-bold" to="/signin">
              Sign In
            </NavLink>
          </p>
        </form>
      </motion.div>
    </div>
  );
};

export default Registration;