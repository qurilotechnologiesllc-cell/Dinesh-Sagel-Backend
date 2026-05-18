const express = require('express');
const router = express.Router();
const { createPlan, getPlans, updatePlan, deletePlan } = require('../controllers/planController');

router.post('/plans', createPlan);
router.get('/plans', getPlans);
router.put('/plans/:id', updatePlan);
router.delete('/plans/:id', deletePlan);

module.exports = router;