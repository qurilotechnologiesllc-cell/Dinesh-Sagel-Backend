const { Schema, model } = require('mongoose');

const videoPlanSchema = new Schema({
    title: { type: String, required: true },
    description: { type: String, required: true },
    duration: { type: Number, required: true }, // Duration in seconds
}, { timestamps: true });

const VideoPlan = model('VideoPlan', videoPlanSchema);
module.exports = VideoPlan;