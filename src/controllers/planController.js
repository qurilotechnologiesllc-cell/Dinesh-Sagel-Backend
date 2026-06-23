const GymPlan = require('../models/gymplans.model');

exports.createPlan = async (req, res) => {
    try {
        const { name, description, allprice, duration, category, features } = req.body;

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

        // Duplicate check hata diya — schema ka pre-save hook handle karega

        const plan = await GymPlan.create({
            name, description, allprice, duration, category, features
        });

        res.status(201).json(plan);

    } catch (error) {
        res.status(400).json({ message: error.message });
    }
};

exports.getPlans = async (req, res) => {
    try {
        const { category } = req.query;
        const filter = category ? { category } : {};
        const plans = await GymPlan.find(filter);
        if (plans.length === 0) {
            return res.status(404).json({ message: 'No plans found' });
        }
        res.status(200).json(plans);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

exports.updatePlan = async (req, res) => {
    try {
        const { name, description, allprice, duration, category, features } = req.body;

        // ✅ Validation — agar allprice aaya hai toh array hona chahiye
        if (allprice !== undefined && !Array.isArray(allprice)) {
            return res.status(400).json({ message: 'allprice array hona chahiye' });
        }

        const plan = await GymPlan.findById(req.params.id);
        if (!plan) {
            return res.status(404).json({ message: 'Plan not found' });
        }

        // ✅ Sirf jo currency aayi hai update karo, baaki same rehne do
        if (allprice && allprice.length > 0) {
            allprice.forEach(({ currencyCode, price, symbol }) => {
                const existing = plan.allprice.find(p => p.currencyCode === currencyCode);
                if (existing) {
                    // Currency pehle se hai — sirf price/symbol update karo
                    if (price !== undefined) existing.price = price;
                } else {
                    // Nayi currency add karo
                    plan.allprice.push({ currencyCode, price, symbol });
                }
            });
        }

        // Baaki fields update karo agar aaye hain
        if (name !== undefined) plan.name = name;
        if (description !== undefined) plan.description = description;
        if (duration !== undefined) plan.duration = duration;
        if (category !== undefined) plan.category = category;
        if (features !== undefined) plan.features = features;

        await plan.save();
        res.status(200).json(plan);

    } catch (error) {
        res.status(400).json({ message: error.message });
    }
};

exports.deletePlan = async (req, res) => {
    try {
        const plan = await GymPlan.findByIdAndDelete(req.params.id);
        if (!plan) {
            return res.status(404).json({ message: 'Plan not found' });
        }
        res.status(200).json({ message: 'Plan deleted successfully' });
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};