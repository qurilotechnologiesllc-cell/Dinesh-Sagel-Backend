const { Schema, model } = require('mongoose');

const videoPlanSchema = new Schema({
    title: { type: String, required: true },
    allprice: [
        {
            currencyCode: {
                type: String,
                required: true,
                enum: ['INR', 'USD', 'GBP', 'CAD'],  // ✅ sirf valid currencies
                uppercase: true
            },

            price: {
                type: Number,
                required: true,
                min: 0
            },

            symbol: {
                type: String,
                enum: ['₹', '$', '£', 'CA$'],         // ✅ frontend display ke liye
                required: true
            }
        }
    ],
    duration: { type: String, required: true }, // Duration in seconds
}, { timestamps: true });

const VideoPlan = model('VideoPlan', videoPlanSchema);
module.exports = VideoPlan;