const { Schema, model } = require('mongoose');

const planSchema = new Schema({
    name: {
        type: String,
        required: true,
    },
    description: {
        type: String,
        required: true
    },

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

// ✅ Duplicate currency validation
planSchema.pre('save', function (next) {
    const codes = this.allprice.map(p => p.currencyCode);
    const unique = new Set(codes);
    if (codes.length !== unique.size) {
        return next(new Error('Duplicate currency codes not allowed'));
    }
    next;
});

const Plan = model('Plan', planSchema);

module.exports = Plan;