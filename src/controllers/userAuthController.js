const User = require('../models/user.models')
const bcrypt = require('bcrypt')
const redisClient = require('../utils/redis');
const { generateToken } = require("../middleware/auth")
const { sendEmailOtpToUser } = require("../utils/sendMail")
const { v4: uuidv4 } = require("uuid");

const generateOTP = () => {
    return Math.floor(100000 + Math.random() * 900000).toString()
}

const signUp = async (req, res) => {
    try {
        const { username, email, password } = req.body;

        // Check required fields
        if (!username || !email || !password) {
            return res.status(400).json({
                success: false,
                message: "All fields are required",
            });
        }

        // Check if user already exists
        const existingUser = await User.findOne({ email });

        if (existingUser) {
            return res.status(409).json({
                success: false,
                message: "Email already registered",
            });
        }

        // Create user
        const user = await User.create({
            username,
            email,
            password
        });

        return res.status(201).json({
            success: true,
            message: "User registered successfully",
            user: {
                id: user._id,
                username: user.username,
                email: user.email,
            },
        });
    } catch (error) {
        console.error("Signup Error:", error);

        return res.status(500).json({
            success: false,
            message: "Internal Server Error",
        });
    }
};

const login = async (req, res) => {
    try {
        const { email, password } = req.body

        const user = await User.findOne({ email });

        if (!user) {
            return res.status(404).json({ success: false, message: "Not found!" })
        }

        const isPasswordCheck = await bcrypt.compare(password, user.password)

        if (!isPasswordCheck) {
            return res.status(401).json({ success: false, message: "Incorrect Password" })
        }

        const token = await generateToken({ id: user._id, email: user.email, role: 'user' })

        return res.status(200).json({ success: true, message: "Login Successfully!", token: token })

    } catch (error) {
        console.error("SignIn Error:", error);

        return res.status(500).json({
            success: false,
            message: "Internal Server Error",
        });
    }
}

const forgotPasswordwithOtp = async (req, res) => {
    try {
        const { email } = req.body

        if (!email) {
            return res.status(400).json({ message: "email is required" })
        }

        const user = await User.findOne({ email })

        if (!user) {
            return res.status(404).json({ success: false, message: "Not found!" })
        }

        // Step 4 — OTP generate karo
        const otp = generateOTP()
        const verificationId = uuidv4();
        

        // Step 5 — OTP Redis mein store karo (10 minute ke liye)
        await redisClient.setex(`forgot-password:otp:${verificationId}`, 600, JSON.stringify({ email, otp }));

        await sendEmailOtpToUser(email, otp, user.username)

        return res.status(200).json({ success: true, message: 'OTP sent to email', verificationId: verificationId, });

    } catch (error) {

        console.error("Send OTP Error:", error);

        return res.status(500).json({
            success: false,
            message: "Internal Server Error",
        });
    }
}

const verifyOtpforgotPassword = async (req, res) => {
    try {
        const { verificationId, otp } = req.body;

        if (!verificationId || !otp) {
            return res.status(400).json({
                success: false,
                message: "verificationId and otp are required",
            });
        }

        const data = await redisClient.get(
            `forgot-password:otp:${verificationId}`
        );

        if (!data) {
            return res.status(400).json({
                success: false,
                message: "OTP expired or invalid",
            });
        }

        const parsedData = JSON.parse(data);

        if (parsedData.otp !== String(otp)) {
            return res.status(400).json({
                success: false,
                message: "Invalid OTP",
            });
        }

        const resetToken = uuidv4();

        await redisClient.setex(
            `forgot-password:reset:${resetToken}`,
            600,
            parsedData.email
        );

        // OTP verified
        await redisClient.del(`forgot-password:otp:${verificationId}`);

        return res.status(200).json({
            success: true,
            message: "OTP verified successfully",
            resetToken: resetToken,
        });
    } catch (error) {
        console.error("Verify OTP Error:", error);

        return res.status(500).json({
            success: false,
            message: "Internal Server Error",
        });
    }
};

const resetPassword = async (req, res) => {
    try {
        const { resetToken, newPassword } = req.body;

        const email = await redisClient.get(
            `forgot-password:reset:${resetToken}`
        );

        if (!email) {
            return res.status(400).json({
                success: false,
                message: "Invalid or expired reset token",
            });
        }

        const user = await User.findOne({ email });

        if (!user) {
            return res.status(404).json({
                success: false,
                message: "User not found",
            });
        }

        user.password = newPassword;

        await user.save(); // pre('save') password hash kar dega

        await redisClient.del(
            `forgot-password:reset:${resetToken}`
        );

        return res.status(200).json({
            success: true,
            message: "Password updated successfully",
        });
    } catch (error) {
        return res.status(500).json({
            success: false,
            message: "Internal Server Error",
        });
    }
};



module.exports = { signUp, login, forgotPasswordwithOtp, verifyOtpforgotPassword, resetPassword }