const express = require('express');
const router = express.Router();
const protect = require('../middleware/authMiddleware');
const { createCase, getAllCases, updateCaseStatus, checkEscalations } = require('../controllers/caseController');

// Staff submits a case
router.post('/', protect(['Staff']), createCase);

// Secretariat views all cases
router.get('/', protect(['Secretariat', 'Admin']), getAllCases);

// Case Manager or Secretariat updates a case
router.put('/:id', protect(['Case Manager', 'Secretariat']), updateCaseStatus);

// Trigger escalation check
router.post('/escalate-check', protect(['Admin', 'Secretariat']), checkEscalations);

module.exports = router;