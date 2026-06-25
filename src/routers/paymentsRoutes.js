const express = require("express")
const router = express.Router()
const { authMiddleware } = require('../middleware/auth')
const { purchaseCourse, InitiatedPayments, razorpayWebhookController } = require('../controllers/paymentController')

router.post('/purchase/plan', authMiddleware, purchaseCourse)
router.post('/payment/initiate/:paymentId', authMiddleware, InitiatedPayments)
router.post("/payment/webhook", razorpayWebhookController );

module.exports = router