const { Schema, model } = require('mongoose');

const adminSchema = new Schema({
    email: { type: String, required: true, unique: true },
    username: { type: String, required: true },
    profilePicture: { type: String },
    publicId: { type: String },
}, { timestamps: true });

const Admin = model('Admin', adminSchema);

module.exports = Admin;