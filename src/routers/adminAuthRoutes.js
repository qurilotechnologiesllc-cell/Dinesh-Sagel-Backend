const express = require('express');
const router = express.Router();
const { adminSendOtpOnEmail, verifyOtp, updateAdminProfile , logoutAdmin, generateUploadSignature} = require('../controllers/adminAuthController');
const { authMiddleware } = require('../middleware/auth');

router.post('/send-otp', adminSendOtpOnEmail);
router.post('/verify-otp', verifyOtp);
router.put('/profile', authMiddleware, updateAdminProfile);
router.post('/generate-upload-signature', authMiddleware, generateUploadSignature);
router.post('/logout', authMiddleware, logoutAdmin);
module.exports = router;