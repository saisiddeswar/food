import { BrowserRouter as Router, Route, Routes } from "react-router-dom";
import Home from "../pages/Home";
import About from "../pages/About";
import Contact from "../pages/Contact";
import Navbar from "../component/Navbar";
import FooterSection from "../pages/FooterSection";// Import Footer
import Registration from "../pages/Registration";
import Login from "../pages/Login";
import Ngo from "../pages/Ngo";
import Institutes from "../pages/Institutes";
import Logout from "../pages/Logout";
import Dashboard from "../component/Dashboard";
import "bootstrap/dist/css/bootstrap.min.css"; // Bootstrap styles
import "./App.css"; // Custom styles

import { ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css"; // Import Toastify styles

function App() {
  return (
    <Router>
      {/* Toast Notifications */}
      <ToastContainer position="top-right" autoClose={3000} />
      
      <div className="app-wrapper">
        {/* Navbar */}
        <Navbar />

        {/* Routes */}
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/about" element={<About />} />
          <Route path="/contact" element={<Contact />} />
          <Route path="/logout" element={<Logout />} />
          <Route path="/login" element={<Login />} />
          <Route path="/signup" element={<Registration />} />
          <Route path="/dashboard" element={<Dashboard />} />
          <Route path="/institute-dashboard" element={<Institutes />} />
          <Route path="/ngo-dashboard" element={<Ngo />} />
        </Routes>

        {/* Footer (Stays on All Pages) */}
        <FooterSection />
      </div>
    </Router>
  );
}

export default App;
