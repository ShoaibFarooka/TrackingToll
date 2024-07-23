const mongoose = require('mongoose');
const SalesPackage = require('../models/salesPackageModel');
const jsonData = require('../data/salesPackageData.json');
require('dotenv').config();

async function seedSalesPackage() {
    const DB = process.env.DB_URI;
    console.log('Connecting to MongoDB...');
    await mongoose.connect(DB);
    console.log('Connected to MongoDB');
    try {
        await SalesPackage.deleteMany({});
        console.log('Deleted existing Sales Packages');
        console.log('Seeding Sales Packages...');
        await SalesPackage.insertMany(jsonData);
        console.log('Sales Packages Seeded Successfully!');
    } catch (error) {
        console.error('Error seeding data:', error);
    } finally {
        await mongoose.disconnect();
        console.log('Disconnected from MongoDB');
    }
}

seedSalesPackage();
