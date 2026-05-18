const express = require('express');
const router = express.Router();
const { createEnquiry, getAllEnquiries, markEnquiryAsRead } = require('../controllers/userEnquiryController');
const { authMiddleware } = require('../middleware/auth');

router.post('/enquiries', createEnquiry);
router.get('/enquiries', authMiddleware, getAllEnquiries);
router.patch('/enquiries/:id/read', authMiddleware, markEnquiryAsRead);

module.exports = router;

