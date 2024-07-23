const servicePackageService = require('../services/servicePackageService');

const SearchServicePackages = async (req, res) => {
    try {
        const { carCode, tableNum, itemNum } = req.query;
        const packages = await servicePackageService.searchPackage(carCode, tableNum, itemNum);
        res.status(200).json({ servicePackages: packages });
    } catch (error) {
        if (error.message === 'Service packages not found') {
            res.status(400).send(error.message);
        } else {
            res.status(500).send('Internal Server Error');
        }
    }
};

const AddServicePackage = async (req, res) => {
    try {
        const newPackage = await servicePackageService.addPackage(req.body);
        res.status(201).send('Service package added successfully');
    } catch (error) {
        res.status(500).send('Internal Server Error');
    }
};

const UpdateServicePackage = async (req, res) => {
    try {
        const updatedPackage = await servicePackageService.updatePackage(req.params.id, req.body);
        res.status(200).send('Service package updated successfully');
    } catch (error) {
        if (error.message === 'Service package not found') {
            res.status(404).send(error.message);
        } else {
            res.status(500).send('Internal Server Error');
        }
    }
};

const RemoveServicePackage = async (req, res) => {
    try {
        await servicePackageService.removePackage(req.params.id);
        res.status(200).send('Service package deleted successfully');
    } catch (error) {
        if (error.message === 'Service package not found') {
            res.status(404).send(error.message);
        } else {
            res.status(500).send('Internal Server Error');
        }
    }
};

module.exports = {
    SearchServicePackages,
    AddServicePackage,
    UpdateServicePackage,
    RemoveServicePackage
};
