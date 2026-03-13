const Case = require('../models/Case');

// Create a new Case
exports.createCase = async (req, res) => {
    try {
        const { title, description, category, department, location, severity, isAnonymous } = req.body;

        // Generate Tracking ID: NEO-YYYY-001
        const year = new Date().getFullYear();
        const count = await Case.countDocuments() + 1;
        const trackingId = `NEO-${year}-${String(count).padStart(3, '0')}`;

        const newCase = new Case({
            trackingId,
            title,
            description,
            category,
            department,
            location,
            severity,
            isAnonymous,
            submittedBy: req.user.id // From our Protect middleware
        });

        await newCase.save();
        res.status(201).json(newCase);
    } catch (err) {
        console.error(err);
        res.status(500).send('Server Error');
    }
};

// Get all cases (For Secretariat)
exports.getAllCases = async (req, res) => {
    try {
        const cases = await Case.find().populate('submittedBy', 'name email').sort({ createdAt: -1 });
        res.json(cases);
    } catch (err) {
        res.status(500).send('Server Error');
    }
};

// Update Case Status & Manage Escalation
exports.updateCaseStatus = async (req, res) => {
    try {
        const { status, notes } = req.body;
        const caseItem = await Case.findById(req.params.id);

        if (!caseItem) return res.status(404).json({ msg: 'Case not found' });

        // Update fields
        if (status) caseItem.status = status;
        if (notes) caseItem.notes.push(notes);
        
        // Reset lastActionDate whenever an update happens
        caseItem.lastActionDate = Date.now();

        await caseItem.save();
        res.json(caseItem);
    } catch (err) {
        res.status(500).send('Server Error');
    }
};

// Logic to check and trigger Escalation (The 7-Day Rule)
exports.checkEscalations = async (req, res) => {
    try {
        const sevenDaysAgo = new Date();
        sevenDaysAgo.setDate(sevenDaysAgo.getDate() - 7);

        // Find cases that are 'Assigned' or 'In Progress' but haven't been touched in 7 days
        const overdueCases = await Case.find({
            status: { $in: ['Assigned', 'In Progress'] },
            lastActionDate: { $lt: sevenDaysAgo }
        });

        // Bulk update them to 'Escalated'
        const updates = overdueCases.map(c => {
            c.status = 'Escalated';
            return c.save();
        });

        await Promise.all(updates);
        res.json({ msg: `Checked for escalations. ${overdueCases.length} cases escalated.` });
    } catch (err) {
        res.status(500).send('Server Error');
    }
};