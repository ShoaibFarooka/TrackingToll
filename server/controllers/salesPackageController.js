const salesPackageService = require('../services/salesPackageService');

const SearchSalesPackages = async (req, res) => {
    try {
        const { carCode, rowLineNum } = req.query;
        const packages = await salesPackageService.searchPackage(carCode, rowLineNum);
        res.status(200).json({ salesPackages: packages });
    } catch (error) {
        if (error.message === 'Sales packages not found') {
            res.status(400).send(error.message);
        } else {
            res.status(500).send('Internal Server Error');
        }
    }
};

const AddSalesPackage = async (req, res) => {
    try {
        const { carCode } = req.body;
        if (typeof carCode === 'string') {
            req.body.carCode = carCode.split(',').map(item => item.trim());
        }
        const newPackage = await salesPackageService.addPackage(req.body);
        res.status(201).send('Sales package added successfully');
    } catch (error) {
        res.status(500).send('Internal Server Error');
    }
};

const UpdateSalesPackage = async (req, res) => {
    try {
        const { carCode } = req.body;
        if (typeof carCode === 'string') {
            req.body.carCode = carCode.split(',').map(item => item.trim());
        }
        const updatedPackage = await salesPackageService.updatePackage(req.params.id, req.body);
        res.status(200).send('Sales package updated successfully');
    } catch (error) {
        if (error.message === 'Sales package not found') {
            res.status(404).send(error.message);
        } else {
            res.status(500).send('Internal Server Error');
        }
    }
};

const RemoveSalesPackage = async (req, res) => {
    try {
        await salesPackageService.removePackage(req.params.id);
        res.status(200).send('Sales package deleted successfully');
    } catch (error) {
        if (error.message === 'Sales package not found') {
            res.status(404).send(error.message);
        } else {
            res.status(500).send('Internal Server Error');
        }
    }
};

module.exports = {
    SearchSalesPackages,
    AddSalesPackage,
    UpdateSalesPackage,
    RemoveSalesPackage
};
