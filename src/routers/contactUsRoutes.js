const express = require('express');
const router = express.Router();
const { createContactUs, getContactUs, updateContactUs, deleteContactUs } = require("../controllers/contactUsController");

router.post('/contactUs', createContactUs);
router.get('/contactUs', getContactUs);
router.put('/contactUs/:id', updateContactUs);
router.delete('/contactUs/:id', deleteContactUs);

module.exports = router;