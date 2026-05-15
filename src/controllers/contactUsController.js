const ContactUs = require('../models/contactUs.model');

exports.createContactUs = async (req, res) => {
    try {
        const { email, Address, phone } = req.body;
        const contactUs = new ContactUs({ email, Address, phone });
        await contactUs.save();
        res.status(201).json(contactUs);
    } catch (error) {
        res.status(400).json({ error: error.message });
    }
};

exports.getContactUs = async (req, res) => {
    try {
        const contactUsList = await ContactUs.find();
        res.status(200).json(contactUsList);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};

exports.updateContactUs = async (req, res) => {
    try {
        const { id } = req.params;
        const { email, Address, phone } = req.body;
        const contactUs = await ContactUs.findByIdAndUpdate(id, { email, Address, phone }, { new: true });
        if (!contactUs) {
            return res.status(404).json({ error: 'ContactUs not found' });
        }
        res.status(200).json(contactUs);
    } catch (error) {
        res.status(400).json({ error: error.message });
    }
};

exports.deleteContactUs = async (req, res) => {
    try {
        const { id } = req.params;
        const contactUs = await ContactUs.findByIdAndDelete(id);
        if (!contactUs) {
            return res.status(404).json({ error: 'ContactUs not found' });
        }
        res.status(200).json({ message: 'ContactUs deleted successfully' });
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};

