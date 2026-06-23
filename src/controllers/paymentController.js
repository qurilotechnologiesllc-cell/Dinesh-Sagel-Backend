const Payment = require('../models/payment.model');
const User = require('../models/user.models');
const Plan = require('../models/gymplans.model');

const purchaseCourse = async (req, res) => {
    try {

        const { course_id, full_name, age, sex, email, mobile_number, description, past_injury, goal, currencyCode } = req.body;

        // ✅ User exists check — token se aaya hai
        const user = await User.findById(req.user.id);
        if (!user) {
            return res.status(404).json({ message: 'User not found' });
        }

        // ✅ Plan exists check
        const plan = await Plan.findById(course_id);
        if (!plan) {
            return res.status(404).json({ message: 'Plan not found' });
        }

        // ✅ Currency ke hisaab se amount nikalo
        const currencyEntry = plan.allprice.find(p => p.currencyCode === (currencyCode || 'INR'));
        if (!currencyEntry) {
            return res.status(400).json({ message: `Price not available for currency: ${currencyCode}` });
        }

        // ✅ Payment document save karo — status pending
        const payment = await Payment.create({
            user_id: req.user.id,
            course_id,
            full_name,
            age,
            sex,
            email,
            mobile_number,
            description,
            past_injury,
            goal,
            amount: currencyEntry.price,
            payment_status: 'pending',
            payment_details: {}
        });

        res.status(201).json({
            message: 'Payment initiated, complete payment to confirm',
            payment_id: payment._id,
            amount: currencyEntry.price,
            currency: currencyEntry.currencyCode
        });

    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

module.exports = { purchaseCourse };