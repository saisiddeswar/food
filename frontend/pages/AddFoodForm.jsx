import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import 'bootstrap/dist/css/bootstrap.min.css';
import { FaPlus, FaPaperPlane } from 'react-icons/fa';
import './Addform.css';

const AddFoodForm = () => {
  const [foodData, setFoodData] = useState([{ food_name: "", quantity: "", meal_type: "" }]);

  const handleInputChange = (index, e) => {
    const newFoodData = [...foodData];
    newFoodData[index][e.target.name] = e.target.value;
    setFoodData(newFoodData);
  };

  const handleAddFoodItem = () => {
    setFoodData([...foodData, { food_name: "", quantity: "", meal_type: "" }]);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    const username = localStorage.getItem('username');
    if (!username) {
      alert("Please login first");
      return;
    }

    const foodItems = foodData.map(item => ({
      food_name: item.food_name,
      quantity: item.quantity,
      meal_type: item.meal_type,
    }));

    try {
      const response = await fetch(`https://food-backend-service.onrender.com/api/food/add`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ username, foodItems }),
      });

      if (response.ok) {
        alert("Food items added successfully!");
        setFoodData([{ food_name: "", quantity: "", meal_type: "" }]);
      } else {
        const errorData = await response.json();
        alert(errorData.msg || 'Failed to add food items');
      }
    } catch (error) {
      console.error('Error:', error);
      alert('An error occurred while adding food items.');
    }
  };

  const itemVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: { opacity: 1, y: 0 },
    exit: { opacity: 0, y: -20 },
  };

  return (
    <div className="container py-5">
      <motion.div
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.8 }}
        className="text-center mb-5"
      >
        <h2 className="display-5 fw-bold text-dark">Add Food Items</h2>
        <p className="lead text-muted">Contribute to reducing food waste by listing surplus food.</p>
      </motion.div>

      <form onSubmit={handleSubmit} className="add-food-form">
        <AnimatePresence>
          {foodData.map((food, index) => (
            <motion.div
              key={index}
              variants={itemVariants}
              initial="hidden"
              animate="visible"
              exit="exit"
              transition={{ duration: 0.5 }}
              className="card mb-4 shadow-sm p-4 border-0"
            >
              <div className="row g-3 align-items-center">
                <div className="col-md-4">
                  <input
                    type="text"
                    value={food.food_name}
                    name="food_name"
                    placeholder="Food Name"
                    onChange={(e) => handleInputChange(index, e)}
                    required
                    className="form-control"
                  />
                </div>
                <div className="col-md-4">
                  <input
                    type="number"
                    name="quantity"
                    placeholder="Quantity (Plates)"
                    value={food.quantity}
                    onChange={(e) => {
                      const value = Math.max(1, parseInt(e.target.value) || 1);
                      handleInputChange(index, { target: { name: "quantity", value } });
                    }}
                    min="1"
                    required
                    className="form-control"
                  />
                </div>
                <div className="col-md-4">
                  <select
                    name="meal_type"
                    value={food.meal_type}
                    onChange={(e) => handleInputChange(index, e)}
                    required
                    className="form-select"
                  >
                    <option value="">Select Meal Type</option>
                    <option value="Breakfast">Breakfast</option>
                    <option value="Lunch">Lunch</option>
                    <option value="Dinner">Dinner</option>
                  </select>
                </div>
              </div>
            </motion.div>
          ))}
        </AnimatePresence>

        {/* Updated Button Section */}
        <div className="d-flex justify-content-between gap-3 mt-4">
          <motion.button
            type="button"
            className="btn btn-outline-success btn-md d-flex align-items-center justify-content-center flex-grow-1"
            onClick={handleAddFoodItem}
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            transition={{ type: 'spring', stiffness: 300 }}
          >
            <FaPlus className="me-2" /> Add More
          </motion.button>

          <motion.button
            type="submit"
            className="btn btn-warning btn-md d-flex align-items-center justify-content-center flex-grow-1"
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            transition={{ type: 'spring', stiffness: 300 }}
          >
            <FaPaperPlane className="me-2" /> Submit
          </motion.button>
        </div>
      </form>
    </div>
  );
};

export default AddFoodForm;