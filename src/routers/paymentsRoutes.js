const express = require("express")
const router = express.Router()
const { authMiddleware } = require('../middleware/auth')
const { purchaseCourse } = require('../controllers/paymentController')

router.post('/purchase/plan', authMiddleware, purchaseCourse)

module.exports = router