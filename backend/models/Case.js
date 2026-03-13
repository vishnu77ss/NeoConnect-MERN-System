const mongoose = require('mongoose');

const CaseSchema = new mongoose.Schema({
    trackingId: { type: String, unique: true }, // Format: NEO-YYYY-001
    title: { type: String, required: true },
    description: { type: String, required: true },
    category: { 
        type: String, 
        enum: ['Safety', 'Policy', 'Facilities', 'HR', 'Other'], 
        required: true 
    },
    department: { type: String, required: true },
    location: { type: String, required: true },
    severity: { 
        type: String, 
        enum: ['Low', 'Medium', 'High'], 
        required: true 
    },
    status: { 
        type: String, 
        enum: ['New', 'Assigned', 'In Progress', 'Pending', 'Resolved', 'Escalated'], 
        default: 'New' 
    },
    isAnonymous: { type: Boolean, default: false },
    submittedBy: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
    assignedTo: { type: mongoose.Schema.Types.ObjectId, ref: 'User' }, 
    attachmentUrl: { type: String }, 
    notes: [String], 
    lastActionDate: { type: Date, default: Date.now } 
}, { timestamps: true });

module.exports = mongoose.model('Case', CaseSchema);