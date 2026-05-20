const Enquiry = require('../models/enquiry.model');
const { ADMIN_ROOM } = require('../utils/sockethandler');

// Create a new enquiry
exports.createEnquiry = async (req, res) => {
    try {
        const { name, email, message } = req.body;
        
        const newEnquiry = new Enquiry({ name, email, message });

        await newEnquiry.save();

        const io = req.app.get('io'); // Get the socket.io instance

        io.to(ADMIN_ROOM).emit(
            'new_enquiry', {
            message: 'New enquiry received!',
            enquiry: newEnquiry
        }

        ); // Emit event to admin room
        res.status(201).json({ message: 'Enquiry created successfully', enquiry: newEnquiry });
    } catch (error) {
        res.status(500).json({ message: 'Failed to create enquiry', error: error.message });
    }
};

// Get all enquiries
exports.getAllEnquiries = async (req, res) => {
    try {
        const role = req.user.role; // Assuming you have user authentication and role in req.user
        if (role !== 'admin') {
            return res.status(403).json({ message: 'Access denied' });
        }
        const enquiries = await Enquiry.find().sort({ createdAt: -1 });
        res.status(200).json(enquiries);
    } catch (error) {
        res.status(500).json({ message: 'Failed to fetch enquiries', error: error.message });
    }
};

exports.markEnquiryAsRead = async (req, res) => {
    try {
        const role = req.user.role; // Assuming you have user authentication and role in req.user
        if (role !== 'admin') {
            return res.status(403).json({ message: 'Access denied' });
        }
        const enquiryId = req.params.id;
        const enquiry = await Enquiry.findByIdAndUpdate(enquiryId, { isRead: true }, { new: true });
        if (!enquiry) {
            return res.status(404).json({ message: 'Enquiry not found' });
        }
        res.status(200).json({ message: 'Enquiry marked as read', enquiry });
    } catch (error) {
        res.status(500).json({ message: 'Failed to mark enquiry as read', error: error.message });
    }
};
