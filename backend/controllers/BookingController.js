const Booking = require("../models/Bookingmodel"); // Ensure the correct path

const getInstituteRequests = async (req, res) => {
    try {
        const { instituteUsername } = req.query;

        if (!instituteUsername) {
            return res.status(400).json({ success: false, message: "Institute username required" });
        }

        // Fetch all relevant requests for the institute (not just pending)
        const requests = await Booking.find({ 
            instituteUsername,
            status: { $in: ['PENDING', 'ACCEPTED', 'REJECTED'] } 
        }).sort({ requestedAt: -1 });

        res.status(200).json({ success: true, requests });
    } catch (error) {
        console.error("Error fetching booking requests:", error);
        res.status(500).json({ success: false, message: "Server error" });
    }
};

module.exports = { getInstituteRequests };
