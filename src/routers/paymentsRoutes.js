const express = require("express")
const router = express.Router()
const { authMiddleware } = require('../middleware/auth')
const { purchaseCourse, InitiatedPayments, razorpayWebhookController, getallPaymentsDetails } = require('../controllers/paymentController')

router.post('/purchase/plan', authMiddleware, purchaseCourse)
router.post('/payment/initiate/:paymentId', authMiddleware, InitiatedPayments)
router.post("/payment/webhook", razorpayWebhookController );
router.get('/all-payments', authMiddleware, getallPaymentsDetails)

module.exports = router