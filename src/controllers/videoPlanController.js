const VideoPlan = require('../models/videoPlan.model');

exports.addVideoPlan = async (req, res) => {
    try {
        const { title, currencyCode, price, duration } = req.body;
        const newVideoPlan = new VideoPlan({ title, currencyCode, price, duration });
        await newVideoPlan.save();
        res.status(201).json({ message: 'Video plan added successfully', videoPlan: newVideoPlan });
    } catch (error) {
        console.error('Error adding video plan:', error);
        res.status(500).json({ message: 'Server error' });
    }
};

exports.getAllVideoPlans = async (req, res) => {
    try {
        const { currencyCode } = req.query;
        let videoPlans = await VideoPlan.find({ currencyCode: currencyCode });
        if (videoPlans.length === 0) {
            return res.status(404).json({ message: 'No video plans found for the specified currency' });
        }
        res.status(200).json(videoPlans);
    } catch (error) {
        console.error('Error fetching video plans:', error);
        res.status(500).json({ message: 'Server error' });
    }
};

exports.updateVideoPlan = async (req, res) => {
    try {
        const { id } = req.params;
        const { title, currencyCode, price, duration } = req.body;
        const updatedVideoPlan = await VideoPlan.findByIdAndUpdate(id, { title, currencyCode, price, duration }, { new: true });
        if (!updatedVideoPlan) {
            return res.status(404).json({ message: 'Video plan not found' });
        }
        res.status(200).json({ message: 'Video plan updated successfully', videoPlan: updatedVideoPlan });
    } catch (error) {
        console.error('Error updating video plan:', error);
        res.status(500).json({ message: 'Server error' });
    }
};

exports.deleteVideoPlan = async (req, res) => {
    try {
        const { id } = req.params;
        const deletedVideoPlan = await VideoPlan.findByIdAndDelete(id);
        if (!deletedVideoPlan) {
            return res.status(404).json({ message: 'Video plan not found' });
        }
        res.status(200).json({ message: 'Video plan deleted successfully' });
    } catch (error) {
        console.error('Error deleting video plan:', error);
        res.status(500).json({ message: 'Server error' });
    }
};