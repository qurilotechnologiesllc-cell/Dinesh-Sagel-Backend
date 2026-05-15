const jwt = require('jsonwebtoken');
const RevokedToken = require('../models/revokedToken');

const authMiddleware = async(req, res, next) => {
    const authHeader = req.headers['authorization'];
    if (!authHeader) {
        return res.status(401).json({ message: 'Authorization header missing' });
    }

    const token = authHeader.split(' ')[1];
    if (!token) {
        return res.status(401).json({ message: 'Token missing' });
    }
        // Check if the token is revoked
    try {
        const revoked = await RevokedToken.findOne({ token });
        if (revoked) {
            return res.status(403).json({ message: 'Token has been revoked' });
        }

        // Verify the token
        try {
            const decoded = jwt.verify(token, process.env.JWT_SECRET);
            req.user = decoded; // Attach user info to the request object
            next();
        } catch (err) {
            return res.status(403).json({ message: 'Invalid token' });
        }
    } catch (err) {
        console.error(err);
        return res.status(500).json({ message: 'Server error' });
    }
};


const generateToken = (user) => {
    return jwt.sign({ id: user.id, email: user.email, role: user.role }, process.env.JWT_SECRET, { expiresIn: '1h' });
};      

module.exports = { authMiddleware, generateToken };