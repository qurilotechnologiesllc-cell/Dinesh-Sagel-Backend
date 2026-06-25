const Payment = require('../models/payment.model');
const User = require('../models/user.models');
const Plan = require('../models/gymplans.model');
const VideoPlan = require("../models/videoPlan.model")
const razorpay = require('../utils/razorpay')

const purchaseCourse = async (req, res) => {
    try {
        const { course_id, full_name, age, sex, email, mobile_number, description, past_injury, goal, currencyCode, plantype } = req.body;

        // ✅ plantype validation
        if (!plantype || !['transformationPlan', 'videoPlan'].includes(plantype)) {
            return res.status(400).json({ message: 'Invalid plantype. Must be transformation or video' });
        }

        // ✅ User exists check
        const user = await User.findById(req.user.id);
        if (!user) {
            return res.status(404).json({ message: 'User not found' });
        }

        // ✅ plantype ke hisaab se sahi collection mein dhundo
        let plan;
        if (plantype === 'transformationPlan') {
            plan = await Plan.findById(course_id);
        } else if (plantype === 'videoPlan') {
            plan = await VideoPlan.findById(course_id);
        }

        if (!plan) {
            return res.status(404).json({ message: `${plantype} plan not found` });
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
            plantype,
            full_name,
            age,
            sex,
            email,
            mobile_number,
            description,
            past_injury,
            goal,
            amount: currencyEntry.price,
            currencyCode: currencyEntry.currencyCode,
            payment_status: 'pending',
            payment_details: {}
        });

        res.status(201).json({
            message: 'Payment initiated, complete payment to confirm',
            payment_id: payment._id,
            amount: currencyEntry.price,
            currency: currencyEntry.currencyCode,
            plantype
        });

    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

const InitiatedPayments = async (req, res) => {
    try {
        const { paymentId } = req.params;

        console.log(paymentId);
        

        const payment = await Payment.findById(paymentId);

        if (!payment) {
            return res.status(404).json({
                success: false,
                message: "Payment not found"
            });
        }

        if (payment.payment_status === "success") {
            return res.status(400).json({
                success: false,
                message: "Payment already completed"
            });
        }

        const order = await razorpay.orders.create({
            amount: payment.amount * 100,
            currency: payment.currencyCode,
            receipt: payment._id.toString()
        });

        payment.razorpay_order_id = order.id;
        await payment.save();

        return res.status(200).json({
            success: true,

            paymentId: payment._id,

            razorpayOrderId: order.id,

            amount: order.amount,

            currency: order.currency,

            key: process.env.RAZORPAY_KEY_ID,

            paymentType:
                payment.currencyCode === "INR"
                    ? "upi_or_card"
                    : "card"
        });

    } catch (error) {
        console.error(error);

        return res.status(500).json({
            success: false,
            message: error.message
        });
    }
};

module.exports = { purchaseCourse , InitiatedPayments};