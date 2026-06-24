const { Schema, model, Types } = require("mongoose");

const paymentSchema = new Schema(
    {
        user_id: {
            type: Types.ObjectId,
            ref: "User",
            required: true,
        },

        course_id: {
            type: Types.ObjectId,
            ref: "Course",
            required: true,
        },

        full_name: {
            type: String,
            required: true,
            trim: true,
        },

        age: {
            type: Number,
            required: true,
        },

        sex: {
            type: String,
            enum: ["Male", "Female", "Other"],
            required: true,
        },

        email: {
            type: String,
            required: true,
            lowercase: true,
            trim: true,
        },

        mobile_number: {
            type: String,
            required: true,
            match: [/^[6-9]\d{9}$/, "Invalid mobile number"],
        },

        description: {
            type: String,
            default: "",
        },

        past_injury: {
            type: String,
            default: "",
        },

        goal: {
            type: String,
            default: "",
        },

        currencyCode: {
            type: String,
            required: true,
            enum: ['INR', 'USD', 'GBP', 'CAD'],  // ✅ sirf valid currencies
            uppercase: true
        },

        amount: {
            type: Number,
            required: true,
        },

        payment_status: {
            type: String,
            enum: ["pending", "success", "failed"],
            default: "pending",
        },

        payment_method: {
            type: String,
            enum: ["upi", "debit card", "credit card"],
            default: "upi",
        },

        gateway: {
            type: String,
            default: "razorpay"
        },

        razorpay_order_id: {
            type: String,
            default: null
        },

        razorpay_payment_id: {
            type: String,
            default: null
        },

        payment_details: {
            type: Schema.Types.Mixed,
            default: {},
        },
    },
    {
        timestamps: true,
    }
);

module.exports = model("Payment", paymentSchema);