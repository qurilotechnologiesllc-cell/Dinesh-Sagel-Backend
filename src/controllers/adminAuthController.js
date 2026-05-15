const Admin = require('../models/admin.model');
const RevokedToken = require('../models/revokedToken');
const { generateToken } = require('../middleware/auth');
const { sendEmailOtp } = require('../utils/sendMail');
const { cloudinary } = require('../utils/cloudinary');
const crypto = require('crypto');
const { v4: uuidv4 } = require('uuid');
const redisClient = require('../utils/redis');
const jwt = require('jsonwebtoken');
const { deleteImage } = require("../utils/cloudinary")

const generateOTP = () => {
    return Math.floor(100000 + Math.random() * 900000).toString()
}

const adminSendOtpOnEmail = async (req, res) => {
    const { email } = req.body;

    try {
        let admin = await Admin.findOne({ email });
        if (!admin) {
            return res.status(404).json({ message: 'Admin not found' });
        }

        // Step 4 — OTP generate karo
        const otp = generateOTP()

        // Step 5 — OTP Redis mein store karo (10 minute ke liye)
        await redisClient.setex(`admin-otp:${email}`, 600, otp)

        // Step 6 — OTP email se bhejo
        await sendEmailOtp(email, otp, admin.username)

        return res.status(200).json({ success: true, message: 'OTP sent to email' });
    } catch (err) {
        console.error(err);
        res.status(500).json({ message: 'Server error' });
    }
};

const verifyOtp = async (req, res) => {
    const { email, otp } = req.body;

    try {
        // Redis se OTP retrieve karo
        const storedOtp = await redisClient.get(`admin-otp:${email}`);

        if (!storedOtp) {
            return res.status(400).json({ message: 'OTP expired or not found' });
        }

        if (storedOtp !== otp) {
            return res.status(400).json({ message: 'Invalid OTP' });
        }

        // OTP valid hai, ab admin ko authenticate karo
        const admin = await Admin.findOne({ email });
        if (!admin) {
            return res.status(404).json({ message: 'Admin not found' });
        }

        // JWT token generate karo
        const token = generateToken({ id: admin._id, email: admin.email, role: 'admin' });

        // OTP delete karo Redis se
        await redisClient.del(`admin-otp:${email}`);

        return res.status(200).json({ success: true, token });
    } catch (err) {
        console.error(err);
        res.status(500).json({ message: 'Server error' });
    }
}

const updateAdminProfile = async (req, res) => {
    const adminId = req.user.id;
    const { username, email, imageUrl, publicId } = req.body;

    try {
        const admin = await Admin.findById(adminId);
        if (!admin) {
            return res.status(404).json({ message: 'Admin not found' });
        }

        admin.username = username || admin.username;
        admin.email = email || admin.email;

        if (imageUrl && publicId) {
            // Purani image delete karo agar exist karti hai
            if (admin.publicId) {
                await deleteImage(admin.publicId);
            }
            admin.imageUrl = imageUrl;
            admin.publicId = publicId;
        }

        await admin.save();

        return res.status(200).json({ success: true, message: 'Profile updated successfully', admin });
    } catch (err) {
        console.error(err);
        res.status(500).json({ message: 'Server error' });
    }
}

const logoutAdmin = async (req, res) => {
    const token = req.headers.authorization.split(' ')[1];

    try {
        // Decode the token to get the user ID
        const decoded = jwt.verify(token, process.env.JWT_SECRET);

        // Save the token as revoked in the database    
        const revokedToken = new RevokedToken({ token: token, revokedAt: decoded.exp * 1000 }); // Store the expiration time of the token
        await revokedToken.save();

        return res.status(200).json({ success: true, message: 'Logged out successfully' });
    } catch (err) {
        console.error(err);
        res.status(500).json({ message: 'Server error' });
    }
}

// Step 1: Presigned URL generate karo
const generateUploadSignature = async (req, res) => {
    try {
        const timestamp = Math.round(new Date().getTime() / 1000)
        const folder = 'gym/images'
        const public_id = `user_${req.user.id}_${uuidv4()}`;

        // Signature banao
        const signature = cloudinary.utils.api_sign_request(
            {
                timestamp: timestamp,
                folder: folder,
                public_id: public_id,
                transformation: 'c_fill,w_500,h_500'
            },
            process.env.CLOUDINARY_API_SECRET
        )

        res.json({
            success: true,
            data: {
                signature: signature,
                timestamp: timestamp,
                public_id: public_id,
                cloudName: process.env.CLOUDINARY_CLOUD_NAME,
                apiKey: process.env.CLOUDINARY_API_KEY,
                folder: folder,
            }
        })

    } catch (error) {
        res.status(500).json({ message: error.message })
    }
}

module.exports = { adminSendOtpOnEmail, verifyOtp, updateAdminProfile, logoutAdmin, generateUploadSignature };