const { Schema, model } = require('mongoose');

const videoPlanSchema = new Schema({
    title: { type: String, required: true },
    currencyCode: { type: String, required: true, default: 'INR' },
    price: { type: Number, required: true },
    duration: { type: String, required: true }, // Duration in seconds
}, { timestamps: true });

const VideoPlan = model('VideoPlan', videoPlanSchema);
module.exports = VideoPlan;