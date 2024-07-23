const mongoose = require('mongoose');
const ServicePackage = require('../models/servicePackageModel');
const jsonData = require('../data/servicePackageData.json');
require('dotenv').config();

async function seedServicePackage() {
    const DB = process.env.DB_URI;
    console.log('Connecting to MongoDB...');
    await mongoose.connect(DB);
    console.log('Connected to MongoDB');
    try {
        await ServicePackage.deleteMany({});
        console.log('Deleted existing Service Packages');
        console.log('Seeding Service Packages...');
        await ServicePackage.insertMany(jsonData);
        console.log('Service Packages Seeded Successfully!');
    } catch (error) {
        console.error('Error seeding data:', error);
    } finally {
        await mongoose.disconnect();
        console.log('Disconnected from MongoDB');
    }
}

seedServicePackage();
