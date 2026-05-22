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

    currencyCode: {
        type: String,
        Required: true,
        default: 'INR'
    },

    price: {
        type: Number,
        required: true
    },

    duration: {
        type: String,
        required: true
    },

    category: {
        type: String,
        enum: ["transformation", "diet"],
        required: true
    },
    features: [
        {
            type: String,
            required: true
        }
    ]
}, { timestamps: true });

planSchema.index({ category: 1 });

const Plan = model('Plan', planSchema);

module.exports = Plan;