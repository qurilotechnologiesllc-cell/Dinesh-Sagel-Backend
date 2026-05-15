const { Schema, model } = require("mongoose")

const contactUsSchema = new Schema({
    email: {
        type: String,
        required: true
    },
    Address: {
        type: String,
        required: true
    },
    phone: {
        type: Number,
        required: true,
        validate: {
            validator: function (v) {
                return /^\d{10}$/.test(v);
            },
            message: props => `${props.value} is not a valid 10-digit phone number!`
        }
    }
}, { timestamps: true })

const ContactUs = model("ContactUs", contactUsSchema)

module.exports = ContactUs