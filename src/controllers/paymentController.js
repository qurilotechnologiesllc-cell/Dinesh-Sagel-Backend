const Payment = require('../models/payment.model');
const crypto = require("crypto")
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
            course_type: plantype == 'transformationPlan' ? 'Plan' : 'VideoPlan',
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

const razorpayWebhookController = async (req, res) => {
    try {

        // Verify webhook signature
        const webhookSignature = req.headers["x-razorpay-signature"];

        const generatedSignature = crypto
            .createHmac(
                "sha256",
                process.env.RAZORPAY_WEBHOOK_SECRET
            )
            .update(JSON.stringify(req.body))
            .digest("hex");

        if (generatedSignature !== webhookSignature) {
            return res.status(400).json({
                success: false,
                message: "Invalid Webhook Signature"
            });
        }

        const event = req.body.event;

        switch (event) {

            case "payment.captured": {

                const paymentEntity = req.body.payload.payment.entity;

                // Find payment using Razorpay Order ID
                const payment = await Payment.findOne({
                    razorpay_order_id: paymentEntity.order_id
                });

                if (!payment) {
                    return res.status(404).json({
                        success: false,
                        message: "Payment document not found"
                    });
                }

                // Ignore duplicate webhook
                if (payment.payment_status === "success") {
                    return res.status(200).json({
                        success: true,
                        message: "Payment already processed"
                    });
                }

                payment.payment_status = "success";

                payment.razorpay_payment_id = paymentEntity.id;

                payment.payment_method = paymentEntity.method;

                // Store complete Razorpay payment payload
                payment.payment_details = paymentEntity;

                await payment.save();

                console.log("Payment Updated Successfully");

                break;
            }

            case "payment.failed": {

                const paymentEntity = req.body.payload.payment.entity;

                const payment = await Payment.findOne({
                    razorpay_order_id: paymentEntity.order_id
                });

                if (payment) {

                    payment.payment_status = "failed";

                    payment.payment_method = paymentEntity.method;

                    payment.payment_details = paymentEntity;

                    await payment.save();

                    console.log("Payment Failed Updated");
                }

                break;
            }

            default:
                console.log(`Unhandled Event: ${event}`);
        }

        return res.status(200).json({
            success: true
        });

    } catch (error) {

        console.error("Webhook Error:", error);

        return res.status(500).json({
            success: false,
            message: "Internal Server Error"
        });
    }
};

const getallPaymentsDetails = async (req, res) => {
    try {

        // Verify Admin
        if (req.user.role !== "admin") {
            return res.status(403).json({
                success: false,
                message: "Unauthorized User"
            });
        }

        // Fetch Payments
        const payments = await Payment.find()
            .populate({
                path: "course_id",
                select: "name"
            })
            .sort({ createdAt: -1 });

        // Response Data
        const paymentList = payments.map(payment => ({
            payment_id: payment._id,
            full_name: payment.full_name,
            course_name: payment.course_id?.name || null,
            gender: payment.sex,
            payment_status: payment.payment_status,
            amount: payment.amount,
            currency: payment.currencyCode,
            payment_method: payment.payment_method,
            payment_date: payment.createdAt
        }));

        return res.status(200).json({
            success: true,
            totalPayments: paymentList.length,
            payments: paymentList
        });

    } catch (error) {

        console.error("Get Payments Error:", error);

        return res.status(500).json({
            success: false,
            message: "Internal Server Error"
        });
    }
};


module.exports = { purchaseCourse, InitiatedPayments, razorpayWebhookController, getallPaymentsDetails };