const GymPlan = require('../models/gymplans.model');

exports.createPlan = async (req, res) => {
    try {
        const plan = new GymPlan(req.body);
        await plan.save();
        res.status(201).json(plan);
    } catch (error) {
        res.status(400).json({ message: error.message });
    }
};

exports.getPlans = async (req, res) => {
    try {
        const plans = await GymPlan.find();
        res.status(200).json(plans);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

exports.updatePlan = async (req, res) => {
    try {
        const plan = await GymPlan.findByIdAndUpdate(req.params.id, req.body, { new: true });
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