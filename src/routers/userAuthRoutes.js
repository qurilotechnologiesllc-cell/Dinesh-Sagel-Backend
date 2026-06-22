const express = require('express')
const router = express.Router()
const { signUp, login, forgotPasswordwithOtp, verifyOtpforgotPassword, resetPassword } = require("../controllers/userAuthController")

router.post('/signUp', signUp)
router.post('/login', login)
router.post('/forgot-password', forgotPasswordwithOtp)
router.post('/verify-otp', verifyOtpforgotPassword)
router.post('/reset-password', resetPassword)

module.exports = router