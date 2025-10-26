import { useState, useContext } from "react";
import { useNavigate, NavLink } from "react-router-dom";
import { toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { AuthContext } from "../src/store/Auth";
import { motion } from "framer-motion";
import 'bootstrap/dist/css/bootstrap.min.css';
import { FaLock, FaPaperPlane } from 'react-icons/fa';
import './login.css';

const Login = () => {
  const navigate = useNavigate();
  const { storeToken, storeUserDetails } = useContext(AuthContext);
  const [user, setUser] = useState({ email: "", password: "" });
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);

    try {
      const response = await fetch("https://annasamarpan-backend.onrender.com/api/auth/login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(user),
      });

      if (!response.ok) {
        const errorData = await response.json();
        toast.error(errorData?.msg || "Invalid credentials");
        return;
      }

      const data = await response.json();
      toast.success("Login successful! Redirecting...");
      storeToken(data.token);
      storeUserDetails(data.userType, data.username);
      

      setTimeout(() => navigate("/dashboard"), 1000);
    } catch (error) {
      console.error("Login Error:", error);
      toast.error("An error occurred during login. Please try again.");
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
        className="card shadow-sm p-4 border-0 login-card"
      >
        <div className="text-center mb-4">
          <FaLock className="text-primary mb-3" size={40} />
          <h1 className="display-5 fw-bold text-dark">Login</h1>
          <p className="text-muted">Sign in to access your FoodShare account</p>
        </div>

        <form onSubmit={handleSubmit}>
          <div className="mb-3">
            <label htmlFor="email" className="form-label fw-bold text-dark">
              Email
            </label>
            <input
              type="email"
              id="email"
              name="email"
              value={user.email}
              onChange={(e) => setUser({ ...user, email: e.target.value })}
              required
              className="form-control"
              placeholder="Enter your email"
            />
          </div>

          <div className="mb-4">
            <label htmlFor="password" className="form-label fw-bold text-dark">
              Password
            </label>
            <input
              type="password"
              id="password"
              name="password"
              value={user.password}
              onChange={(e) => setUser({ ...user, password: e.target.value })}
              required
              className="form-control"
              placeholder="Enter your password"
            />
          </div>

          <motion.button
            type="submit"
            className="btn btn-warning btn-md w-100 d-flex align-items-center justify-content-center"
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
            {loading ? "Logging in..." : "Login"}
          </motion.button>

          <p className="text-center mt-3 text-muted">
            Don’t have an account?{' '}
            <NavLink className="text-primary text-decoration-none fw-bold" to="/signup">
              Signup
            </NavLink>
          </p>
        </form>
      </motion.div>
    </div>
  );
};

export default Login;