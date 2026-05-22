const GymPlan = require('../models/gymplans.model');

exports.createPlan = async (req, res) => {
    try {
        const { name, description, currencyCode, price, duration, category, features } = req.body;
        const plan = await GymPlan.create({ name, description, currencyCode, price, duration, category, features });
        res.status(201).json(plan);
    } catch (error) {
        res.status(400).json({ message: error.message });
    }
};

exports.getPlans = async (req, res) => {
    try {
        const { category, currencyCode } = req.query;
        let plans = await GymPlan.find({$and: [
            category ? { category } : {},
            currencyCode ? { currencyCode } : {}
        ]});
        if (plans.length === 0) {
            return res.status(404).json({ message: 'No plans found for the specified category and currency' });
        }
        res.status(200).json(plans);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

exports.updatePlan = async (req, res) => {
    try {
        const { name, description, currencyCode, price, duration, category, features } = req.body;
        const plan = await GymPlan.findByIdAndUpdate(req.params.id, { name, description, currencyCode, price, duration, category, features }, { new: true });
        if (!plan) {
            return res.status(404).json({ message: 'Plan not found' });
        }
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