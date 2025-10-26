const mongoose = require("mongoose");

const BookingSchema = new mongoose.Schema({
  instituteUsername: { type: String, required: true },
  ngoUsername: { type: String, required: true },
  mealType: { type: String, required: true },
  foodItems: [{ 
    food_name: { type: String, required: true },
    quantity: { type: Number, required: true }
  }],
  status: { 
    type: String, 
    enum: ['PENDING', 'ACCEPTED', 'REJECTED', 'COMPLETED', 'CANCELLED', 'EXPIRED'],
    default: "PENDING" 
  },
  requestedAt: { type: Date, default: Date.now },
  respondedAt: { type: Date },
  expiresAt: { type: Date, default: () => new Date(Date.now() + 30 * 60 * 1000) }, // 30 minutes
  pickupDetails: {
    time: { type: Date },
    notes: { type: String }
  },
  rejectionReason: { type: String },
  notes: { type: String }
});

// Index for efficient queries
BookingSchema.index({ instituteUsername: 1, status: 1 });
BookingSchema.index({ ngoUsername: 1, status: 1 });
BookingSchema.index({ expiresAt: 1 }, { expireAfterSeconds: 0 });

const Booking = mongoose.models.Booking || mongoose.model("Booking", BookingSchema);
module.exports = Booking;