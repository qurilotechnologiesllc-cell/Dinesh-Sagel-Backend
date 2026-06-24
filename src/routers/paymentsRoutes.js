const express = require("express")
const router = express.Router()
const { authMiddleware } = require('../middleware/auth')
const { purchaseCourse, InitiatedPayments } = require('../controllers/paymentController')

router.post('/purchase/plan', authMiddleware, purchaseCourse)
router.post('/payment/initiate/:paymentId', authMiddleware, InitiatedPayments)

module.exports = router