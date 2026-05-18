const express = require('express');
const router = express.Router();
const { adminSendOtpOnEmail, verifyOtp, updateAdminProfile, logoutAdmin, generateUploadSignature, getAdminProfile } = require('../controllers/adminAuthController');
const { authMiddleware } = require('../middleware/auth');
const { upload } = require('../utils/cloudinary');

router.post('/send-otp', adminSendOtpOnEmail);
router.post('/verify-otp', verifyOtp);
router.put('/profile', authMiddleware, upload.single('profileImage'), updateAdminProfile);
router.get('/profile', authMiddleware, getAdminProfile);
router.post('/generate-upload-signature', authMiddleware, generateUploadSignature);
router.post('/logout', authMiddleware, logoutAdmin);
module.exports = router;