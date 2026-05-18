const { Schema, model } = require('mongoose');

const planSchema = new Schema({
    name: {
        type: String,
        required: true,
        unique: true
    },
    description: {
        type: String,
        required: true
    },
    price: {
        type: Number,
        required: true
    },
    duration: {
        type: String,
        required: true
    },
    features: [
        {
            type: String,
            required: true
        }
    ]
}, { timestamps: true });

const Plan = model('Plan', planSchema);

module.exports = Plan;