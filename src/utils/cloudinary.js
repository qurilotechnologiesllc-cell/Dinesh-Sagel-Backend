const cloudinary = require('cloudinary').v2
const multer = require('multer');

cloudinary.config({
    cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
    api_key: process.env.CLOUDINARY_API_KEY,
    api_secret: process.env.CLOUDINARY_API_SECRET,
})

// ✅ Memory Storage — Disk pe kuch save nahi!
const storage = multer.memoryStorage()

const upload = multer({
    storage: storage,
    limits: { fileSize: 5 * 1024 * 1024 }, // 5MB
    fileFilter: (req, file, cb) => {
        const allowedTypes = [
            'image/jpeg',
            'image/png',
            'image/webp'
        ]
        if (allowedTypes.includes(file.mimetype)) {
            cb(null, true)
        } else {
            cb(new Error('Only JPG, PNG, WEBP allowed!'), false)
        }
    }
})

// ✅ Buffer se Cloudinary pe upload!
// Disk touch nahi hua!
const uploadToCloudinary = (buffer, folder) => {
    return new Promise((resolve, reject) => {
        const uploadStream = cloudinary.uploader.upload_stream(
            { folder },
            (error, result) => {
                if (error) reject(error)
                else resolve(result)
            }
        )
        uploadStream.end(buffer)
    })
}

const deleteImage = async (public_id) => {
    try {
        await cloudinary.uploader.destroy(public_id);
        console.log('Image deleted successfully');
    } catch (error) {
        console.error('Error deleting image:', error);
    }
}

module.exports = { cloudinary, deleteImage, uploadToCloudinary, upload }


