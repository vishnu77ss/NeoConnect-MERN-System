const mongoose = require('mongoose');

const PollSchema = new mongoose.Schema({
    question: { type: String, required: true },
    options: [{
        text: { type: String, required: true },
        votes: { type: Number, default: 0 }
    }],
    votedBy: [{ type: mongoose.Schema.Types.ObjectId, ref: 'User' }], // To ensure one vote per person
    createdBy: { type: mongoose.Schema.Types.ObjectId, ref: 'User' }, // Secretariat/Admin
    isActive: { type: Boolean, default: true }
}, { timestamps: true });

module.exports = mongoose.model('Poll', PollSchema);