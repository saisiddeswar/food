const express = require('express');
const router = express.Router();
const ngocontrollers = require('../controllers/ngo-controller');
const Booking = require('../models/Bookingmodel');
const { getInstituteRequests } = require("../controllers/BookingController");

module.exports = (io, users) => {
    // Setup WebSocket handlers
    const setupWebSocketHandlers = () => {
        io.on('connection', (socket) => {
            console.log('User connected:', socket.id);

            // User registration
            socket.on('register', (userData) => {
                users[userData.userId] = {
                    socketId: socket.id,
                    userType: userData.userType
                };
                console.log('User registered:', userData.userId);
            });

            // Cancel booking event
            socket.on('cancelBooking', async (data) => {
                try {
                    const { bookingId, ngoUsername } = data;
                    
                    const booking = await Booking.findById(bookingId);
                    if (booking && booking.status === 'PENDING') {
                        booking.status = 'CANCELLED';
                        booking.cancelledAt = new Date();
                        await booking.save();

                        // Notify institute
                        if (users[booking.instituteUsername]) {
                            io.to(users[booking.instituteUsername].socketId).emit('bookingCancelled', {
                                bookingId,
                                message: `Booking cancelled by ${ngoUsername}`
                            });
                        }

                        // Notify NGO
                        if (users[ngoUsername]) {
                            io.to(users[ngoUsername].socketId).emit('bookingCancelled', {
                                bookingId,
                                message: 'Booking cancelled successfully'
                            });
                        }
                    }
                } catch (error) {
                    console.error('Error cancelling booking:', error);
                }
            });

            // Respond to booking event
            socket.on('respondToBooking', async (data) => {
                try {
                    const { bookingId, status, pickupDetails, rejectionReason } = data;
                    
                    const booking = await Booking.findById(bookingId);
                    if (booking && booking.status === 'PENDING') {
                        booking.status = status;
                        booking.respondedAt = new Date();
                        
                        if (status === 'ACCEPTED') {
                            booking.pickupDetails = pickupDetails;
                        } else if (status === 'REJECTED') {
                            booking.rejectionReason = rejectionReason;
                        }
                        
                        await booking.save();

                        // Notify NGO
                        if (users[booking.ngoUsername]) {
                            io.to(users[booking.ngoUsername].socketId).emit('bookingResponse', {
                                bookingId,
                                status,
                                pickupDetails,
                                rejectionReason
                            });
                        }

                        // Confirm to institute
                        if (users[booking.instituteUsername]) {
                            io.to(users[booking.instituteUsername].socketId).emit('responseConfirmed', {
                                bookingId,
                                status
                            });
                        }
                    }
                } catch (error) {
                    console.error('Error responding to booking:', error);
                }
            });

            socket.on('disconnect', () => {
                // Remove user from active users
                for (const [userId, userData] of Object.entries(users)) {
                    if (userData.socketId === socket.id) {
                        delete users[userId];
                        break;
                    }
                }
                console.log('User disconnected:', socket.id);
            });
        });
    };

    // Initialize WebSocket handlers
    setupWebSocketHandlers();

    // Regular routes
    router.get('/food-availability', ngocontrollers.Foodlistings);
    router.post('/book-food', (req, res) => ngocontrollers.bookFood(req, res, io, users));
    router.get("/requests", getInstituteRequests);

    // New booking routes
    router.get('/bookings/:ngoUsername', async (req, res) => {
        try {
            const { ngoUsername } = req.params;
            const bookings = await Booking.find({ ngoUsername })
                .sort({ requestedAt: -1 })
                .limit(50);
            res.json({ success: true, bookings });
        } catch (error) {
            res.status(500).json({ success: false, message: 'Server error' });
        }
    });

    router.post('/cancel-booking', async (req, res) => {
        try {
            const { bookingId, ngoUsername } = req.body;
            const booking = await Booking.findById(bookingId);
            
            if (!booking) {
                return res.status(404).json({ success: false, message: 'Booking not found' });
            }
            
            if (booking.ngoUsername !== ngoUsername) {
                return res.status(403).json({ success: false, message: 'Unauthorized' });
            }
            
            if (booking.status !== 'PENDING') {
                return res.status(400).json({ success: false, message: 'Cannot cancel non-pending booking' });
            }
            
            booking.status = 'CANCELLED';
            booking.cancelledAt = new Date();
            await booking.save();
            
            // Notify institute through WebSocket
            if (users[booking.instituteUsername]) {
                io.to(users[booking.instituteUsername].socketId).emit('bookingCancelled', {
                    bookingId,
                    message: `Booking cancelled by ${ngoUsername}`
                });
            }
            
            res.json({ success: true, message: 'Booking cancelled successfully' });
        } catch (error) {
            res.status(500).json({ success: false, message: 'Server error' });
        }
    });

    router.post('/respond-booking', async (req, res) => {
        try {
            const { bookingId, status, pickupDetails, rejectionReason } = req.body;
            
            if (!bookingId || !status) {
                return res.status(400).json({ 
                    success: false, 
                    message: 'Booking ID and status are required' 
                });
            }

            const booking = await Booking.findById(bookingId);
            
            if (!booking) {
                return res.status(404).json({ 
                    success: false, 
                    message: 'Booking not found' 
                });
            }
            
            if (booking.status !== 'PENDING') {
                return res.status(400).json({ 
                    success: false, 
                    message: 'Cannot respond to non-pending booking' 
                });
            }
            
            booking.status = status;
            booking.respondedAt = new Date();
            
            if (status === 'ACCEPTED') {
                if (!pickupDetails || !pickupDetails.time) {
                    return res.status(400).json({
                        success: false,
                        message: 'Pickup details are required for acceptance'
                    });
                }
                booking.pickupDetails = {
                    time: new Date(pickupDetails.time),
                    notes: pickupDetails.notes || ''
                };
            } else if (status === 'REJECTED') {
                if (!rejectionReason) {
                    return res.status(400).json({
                        success: false,
                        message: 'Rejection reason is required'
                    });
                }
                booking.rejectionReason = rejectionReason;
            }
            
            await booking.save();

            // Notify NGO through WebSocket
            if (users[booking.ngoUsername]) {
                io.to(users[booking.ngoUsername].socketId).emit('bookingResponse', {
                    bookingId,
                    status,
                    pickupDetails: booking.pickupDetails,
                    rejectionReason: booking.rejectionReason,
                    ngoUsername: booking.ngoUsername
                });
            }
            
            res.json({ 
                success: true, 
                message: `Booking ${status.toLowerCase()} successfully`,
                ngoUsername: booking.ngoUsername
            });
        } catch (error) {
            console.error('Error in respond-booking:', error);
            res.status(500).json({ 
                success: false, 
                message: error.message || 'Server error'
            });
        }
    });

    return router;
};
