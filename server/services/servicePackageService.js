const ServicePackage = require('../models/servicePackageModel');

const searchPackage = async (carCode, tableNum, itemNum) => {
    let query = {};
    if (carCode) {
        query.carCode = carCode;
    }
    if (tableNum && itemNum) {
        query.tableNum = tableNum;
        query.itemNum = itemNum;
    }

    const servicePackages = await ServicePackage.find(query);
    if (!servicePackages || servicePackages.length <= 0) {
        throw new Error('Service packages not found');
    }
    return servicePackages;
};

const addPackage = async (data) => {
    const newPackage = new ServicePackage(data);
    await newPackage.save();
    return newPackage;
};

const updatePackage = async (id, data) => {
    const updatedPackage = await ServicePackage.findByIdAndUpdate(id, data, { new: true });
    if (!updatedPackage) {
        throw new Error('Service package not found');
    }
    return updatedPackage;
};

const removePackage = async (id) => {
    const deletedPackage = await ServicePackage.findByIdAndDelete(id);
    if (!deletedPackage) {
        throw new Error('Service package not found');
    }
    return deletedPackage;
};

module.exports = {
    searchPackage,
    addPackage,
    updatePackage,
    removePackage
};
