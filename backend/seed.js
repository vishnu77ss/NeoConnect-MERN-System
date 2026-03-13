const mongoose = require('mongoose');
const Case = require('./models/Case');
const dotenv = require('dotenv');
dotenv.config({ path: '../.env' });

const seedHotspot = async () => {
    try {
        await mongoose.connect(process.env.MONGO_URI);
        console.log("Connected to DB for seeding...");

        const year = new Date().getFullYear();
        
        // We will create 5 cases for the 'Facilities' department
        const hotspotCases = [];
        for (let i = 1; i <= 5; i++) {
            hotspotCases.push({
                trackingId: `SEED-FAC-${year}-00${i}`,
                title: `Facility Issue #${i}`,
                description: "Automated seed data for hotspot testing.",
                category: "Facilities",
                department: "Facilities",
                location: "Block A",
                severity: "High",
                status: "New"
            });
        }

        await Case.insertMany(hotspotCases);
        console.log("✅ 5 Cases added to Facilities! Refresh your dashboard.");
        process.exit();
    } catch (err) {
        console.error(err);
        process.exit(1);
    }
};

seedHotspot();