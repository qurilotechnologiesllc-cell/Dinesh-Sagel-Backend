const express = require('express');
const router = express.Router();
const { addVideoPlan, getAllVideoPlans, updateVideoPlan, deleteVideoPlan } = require('../controllers/videoPlanController')

// Route to add a new video plan
router.post('/video-plans', addVideoPlan);

// Route to get all video plans
router.get('/video-plans', getAllVideoPlans);

// Route to update a video plan by ID
router.put('/video-plans/:id', updateVideoPlan);

// Route to delete a video plan by ID
router.delete('/video-plans/:id', deleteVideoPlan);

module.exports = router;
