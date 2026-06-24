const VideoPlan = require('../models/videoPlan.model');

exports.addVideoPlan = async (req, res) => {
    try {
        const { title, allprice, duration } = req.body;

        // ✅ Validation 1 — allprice array hai aur empty nahi
        if (!Array.isArray(allprice) || allprice.length === 0) {
            return res.status(400).json({ message: 'allprice array required hai' });
        }

        // ✅ Validation 2 — har entry mein currencyCode aur price ho
        for (const item of allprice) {
            if (!item.currencyCode || item.price === undefined) {
                return res.status(400).json({
                    message: 'Har price entry mein currencyCode aur price hona chahiye'
                });
            }
            if (item.price < 0) {
                return res.status(400).json({ message: 'Price negative nahi ho sakta' });
            }
        }

        const newVideoPlan = new VideoPlan({ title, allprice, duration });

        await newVideoPlan.save();

        res.status(201).json({ message: 'Video plan added successfully', videoPlan: newVideoPlan });
    } catch (error) {
        console.error('Error adding video plan:', error);
        res.status(500).json({ message: 'Server error' });
    }
};

exports.getAllVideoPlans = async (req, res) => {
    try {
        let videoPlans = await VideoPlan.find();
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
        const { title, allprice, duration } = req.body;

        // ✅ Validation — agar allprice aaya hai toh array hona chahiye
        if (allprice !== undefined && !Array.isArray(allprice)) {
            return res.status(400).json({ message: 'allprice array hona chahiye' });
        }

        const videoplan = await VideoPlan.findById(id);
        if (!videoplan) {
            return res.status(404).json({ message: 'videoplan not found' });
        }

        // ✅ Sirf jo currency aayi hai update karo, baaki same rehne do
        if (allprice && allprice.length > 0) {
            allprice.forEach(({ currencyCode, price, symbol }) => {
                const existing = videoplan.allprice.find(p => p.currencyCode === currencyCode);
                if (existing) {
                    // Currency pehle se hai — sirf price/symbol update karo
                    if (price !== undefined) existing.price = price;
                } else {
                    // Nayi currency add karo
                    videoplan.allprice.push({ currencyCode, price, symbol });
                }
            });
        }

        if (duration !== undefined) videoplan.duration = duration;
        if (title !== undefined) videoplan.title = title;

        await videoplan.save();

        res.status(200).json({ message: 'Video plan updated successfully', videoPlan: videoplan });
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