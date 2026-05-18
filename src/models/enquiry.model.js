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
    isRead: {
        type: Boolean,
        default: false,
    },
}, { timestamps: true });

const Enquiry = model('Enquiry', enquirySchema);

module.exports = Enquiry;