const Banner = require('../models/banner.model');
const { uploadToCloudinary, deleteImage } = require('../utils/cloudinary');

exports.createBanner = async (req, res) => {
    try {
        const { title, bannerfor } = req.body;
        if (!req.file) {
            return res.status(400).json({ message: 'Image file is required' });
        }

        const result = await uploadToCloudinary(req.file.buffer, 'banners');
        const newBanner = new Banner({
            title,
            bannerfor,
            imageUrl: result.secure_url,
            public_id: result.public_id
        });

        await newBanner.save();
        res.status(201).json(newBanner);
    } catch (error) {
        console.error('Error creating banner:', error);
        res.status(500).json({ message: 'Server error' });
    }
};

exports.getBanners = async (req, res) => {
    try {
        const { bannerfor } = req.query;
        let query = {};
        if (bannerfor) {
            query.bannerfor = bannerfor;
        }
        const banners = await Banner.find(query).sort({ createdAt: -1 });
        res.status(200).json(banners);
    } catch (error) {
        console.error('Error fetching banners:', error);
        res.status(500).json({ message: 'Server error' });
    }
};

exports.updateBanner = async (req, res) => {
    try {
        const { id } = req.params;
        const { title, bannerfor, description } = req.body;

        const banner = await Banner.findById(id);
        if (!banner) {
            return res.status(404).json({ message: 'Banner not found' });
        }

        if (req.file) {
            // If a new image is uploaded, delete the old one from Cloudinary
            await deleteImage(banner.public_id);
            const result = await uploadToCloudinary(req.file.buffer, 'banners');
            banner.imageUrl = result.secure_url;
            banner.public_id = result.public_id;
        }

        banner.title = title || banner.title;
        banner.bannerfor = bannerfor || banner.bannerfor;
        banner.description = description || banner.description;

        await banner.save();
        res.status(200).json(banner);
    } catch (error) {
        console.error('Error updating banner:', error);
        res.status(500).json({ message: 'Server error' });
    }
};

exports.deleteBanner = async (req, res) => {
    try {
        const { id } = req.params;
        const banner = await Banner.findById(id);
        if (!banner) {
            return res.status(404).json({ message: 'Banner not found' });
        }

        // Delete the image from Cloudinary
        await deleteImage(banner.public_id);

        // Delete the banner from the database
        await Banner.findByIdAndDelete(id);
        res.status(200).json({ message: 'Banner deleted successfully' });
    } catch (error) {
        console.error('Error deleting banner:', error);
        res.status(500).json({ message: 'Server error' });
    }
}; 

