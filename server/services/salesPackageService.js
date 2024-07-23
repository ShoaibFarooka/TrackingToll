const SalesPackage = require('../models/salesPackageModel');

const searchPackage = async (carCode, rowLineNum) => {
    let query = {};
    if (carCode) {
        query.carCode = { $in: carCode };
    }
    if (rowLineNum) {
        query.rowLineNum = rowLineNum;
    }

    const salesPackages = await SalesPackage.find(query);
    if (!salesPackages || salesPackages.length <= 0) {
        throw new Error('Sales packages not found');
    }
    return salesPackages;
};

const addPackage = async (data) => {
    const newPackage = new SalesPackage(data);
    await newPackage.save();
    return newPackage;
};

const updatePackage = async (id, data) => {
    const updatedPackage = await SalesPackage.findByIdAndUpdate(id, data, { new: true });
    if (!updatedPackage) {
        throw new Error('Sales package not found');
    }
    return updatedPackage;
};

const removePackage = async (id) => {
    const deletedPackage = await SalesPackage.findByIdAndDelete(id);
    if (!deletedPackage) {
        throw new Error('Sales package not found');
    }
    return deletedPackage;
};

module.exports = {
    searchPackage,
    addPackage,
    updatePackage,
    removePackage
};
