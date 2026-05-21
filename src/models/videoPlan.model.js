const { Schema, model } = require('mongoose');

const videoPlanSchema = new Schema({
    title: { type: String, required: true },
    price: { type: Number, required: true },
    duration: { type: String, required: true }, // Duration in seconds
}, { timestamps: true });

const VideoPlan = model('VideoPlan', videoPlanSchema);
module.exports = VideoPlan;