const mongoose = require("mongoose");

// Food Item Schema
const foodItemSchema = new mongoose.Schema({
    food_name: {
        type: String,
        required: true // Ensure that food_name is provided
    },
    quantity: {
        type: Number,
        required: true,
        min: 1 // Ensures quantity is at least 1
    },
    availability:{
        type: String,
        enum:['YES', 'NO', 'RESERVED'],
        default: 'YES'
    },
    date_time: {
        type: Date,
        default: Date.now // Set default to current date
    }


});

// Meal Type Schema
const mealTypeSchema = new mongoose.Schema({
    type: {
        type: String,
        enum: ['Breakfast', 'Lunch', 'Dinner'], // Restrict to these values
        required: true // Ensure meal type is provided
    },
    items: [foodItemSchema], // Array of food items associated with each meal type
    date: {
        type: String,
        default: () => new Date().toISOString().split('T')[0] // Default to the current date in YYYY-MM-DD format
    }
});

// Main Food Schema
const foodSchema = new mongoose.Schema({
    institute_username: {
        type: String,
        ref: 'User', // Reference to the User model
        required: true // Ensure username is provided
    },
    mealTypes: [mealTypeSchema], // Use the meal type schema for meal types
    dateAdded: {
        type: Date,
        default: Date.now // Default to the current date when added
    }
});

// Creating the Food model
const Food = mongoose.model('Food', foodSchema);

// ------------------ REQUEST MODEL ------------------

// Request Schema
const requestSchema = new mongoose.Schema({
    ngoUsername: {
        type: String,
        ref: 'User',
        required: true
    },
    instituteUsername: {
        type: String,
        ref: 'User',
        required: true
    },
    mealType: {
        type: String,
        enum: ['Breakfast', 'Lunch', 'Dinner'],
        required: true
    },
    foodItems: {
        type: [foodItemSchema], // Reuse foodItemSchema
        required: true
    },
    status: {
        type: String,
        enum: ['pending', 'accepted', 'rejected'],
        default: 'pending'
    }
}, { timestamps: true }); // createdAt, updatedAt

const Request = mongoose.model("Request", requestSchema);

// Exporting both models
module.exports = { Food, Request };
