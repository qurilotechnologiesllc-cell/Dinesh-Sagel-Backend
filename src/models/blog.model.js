const { Schema, model } = require('mongoose');

const blogSchema = new Schema({
    title: {
        type: String,
        required: true
    },
    content: {
        type: String,
        required: true
    },
    blogImage: {
        type: String,
        required: true
    },
    public_id: {
        type: String,
        required: true
    }
}, { timestamps: true });

module.exports = model('Blog', blogSchema);