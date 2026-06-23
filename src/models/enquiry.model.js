const { Schema, model } = require('mongoose');

const enquirySchema = new Schema({
    name: {
        type: String,
        required: true,
    },
    email: {
        type: String,
        required: true,
    },
    message: {
        type: String,
        required: true,
    },

    mobileNumber: {
        type: String,
        required: [true, "Mobile number is required"],
        trim: true,
        match: [
            /^[0-9]{10}$/,
            "Mobile number must contain exactly 10 digits"
        ]
    },
    
    isRead: {
        type: Boolean,
        default: false,
    },
}, { timestamps: true });

const Enquiry = model('Enquiry', enquirySchema);

module.exports = Enquiry;