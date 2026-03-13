const express = require('express');
const router = express.Router();
const protect = require('../middleware/authMiddleware');
const Poll = require('../models/Poll');

// @route   POST /api/polls
// @desc    Create a poll (Secretariat only)
router.post('/', protect(['Secretariat']), async (req, res) => {
    try {
        const { question, options } = req.body;
        const newPoll = new Poll({
            question,
            options: options.map(opt => ({ text: opt, votes: 0 })),
            createdBy: req.user.id
        });
        await newPoll.save();
        res.status(201).json(newPoll);
    } catch (err) {
        res.status(500).send('Server Error');
    }
});

// @route   GET /api/polls/active
// @desc    Get the current active poll
router.get('/active', protect(['Staff', 'Secretariat']), async (req, res) => {
    try {
        const poll = await Poll.findOne({ isActive: true }).sort({ createdAt: -1 });
        res.json(poll);
    } catch (err) {
        res.status(500).send('Server Error');
    }
});

// @route   PUT /api/polls/vote/:id
// @desc    Vote in a poll
router.put('/vote/:id', protect(['Staff', 'Secretariat']), async (req, res) => {
    try {
        const { optionId } = req.body;
        const poll = await Poll.findById(req.params.id);

        if (poll.votedBy.includes(req.user.id)) {
            return res.status(400).json({ msg: 'You have already voted' });
        }

        const option = poll.options.id(optionId);
        option.votes += 1;
        poll.votedBy.push(req.user.id);

        await poll.save();
        res.json(poll);
    } catch (err) {
        res.status(500).send('Server Error');
    }
});

module.exports = router;