const { Schema, model } = require('mongoose');

const bannerSchema = new Schema({
    title: {
        type: String,
        required: true
    },
    imageUrl: {
        type: String,
        required: true
    },
    public_id: {
        type: String,
        required: true
    },
    bannerfor: {
        type: String,
        enum: ['home', 'transformation',],
        required: true
    },
    description: {
        type: String,
        default: ''
    }
}, { timestamps: true });

const Banner = model('Banner', bannerSchema);

module.exports = Banner;