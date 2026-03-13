const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
const dotenv = require('dotenv');

// Import the routes
const authRoutes = require('./routes/authRoutes');
const caseRoutes = require('./routes/caseRoutes');
const pollRoutes = require('./routes/pollRoutes'); // Added pollRoutes import

// Load environment variables from the root .env
dotenv.config({ path: '../.env' });

const app = express();

// Middleware
app.use(cors());
app.use(express.json()); // To parse JSON bodies

// Use the routes
app.use('/api/auth', authRoutes);
app.use('/api/cases', caseRoutes);
app.use('/api/polls', pollRoutes); // Added pollRoutes middleware

// Basic Route for Testing
app.get('/', (req, res) => {
    res.send('NeoConnect Backend API is running...');
});

// Database Connection
const PORT = process.env.PORT || 5000;
const MONGO_URI = process.env.MONGO_URI;

mongoose.connect(MONGO_URI)
    .then(() => {
        console.log('✅ Connected to MongoDB');
        app.listen(PORT, () => {
            console.log(`🚀 Server running on port ${PORT}`);
        });
    })
    .catch((err) => {
        console.error('❌ MongoDB Connection Error:', err);
    });