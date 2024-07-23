const yup = require('yup');
const mongoose = require('mongoose');

const ObjectId = yup.string().test('is-valid', 'Invalid package ID', value => mongoose.Types.ObjectId.isValid(value));

const searchServicePackagesSchema = yup.object().shape({
    carCode: yup.string().trim(),
    tableNum: yup.string().trim(),
    itemNum: yup.string().trim(),
}).test('at-least-one', 'At least one of carCode or (tableNum and itemNum) is required', function (value) {
    return value.carCode || (value.tableNum && value.itemNum);
}).noUnknown(true, 'Unknown field in search service packages');

const addServicePackageSchema = yup.object().shape({
    carCode: yup.string().trim().required('Car code is required'),
    tableNum: yup.string().trim().required('Table number is required'),
    itemNum: yup.string().trim().required('Item number is required'),
    description: yup.string().trim().required('Description is required'),
    unitOfMeasurement: yup.string().trim().required('Unit of measurement is required'),
    quantity: yup.number().positive().integer().required('Quantity is required'),
    unitPriceEGP: yup.number().positive().required('Unit price is required'),
    totalPriceEGP: yup.number().positive().required('Total price is required'),
}).noUnknown(true, 'Unknown field in add service package');

const updateServicePackageSchema = yup.object().shape({
    carCode: yup.string().trim().required('Car code is required'),
    tableNum: yup.string().trim().required('Table number is required'),
    itemNum: yup.string().trim().required('Item number is required'),
    description: yup.string().trim().required('Description is required'),
    unitOfMeasurement: yup.string().trim().required('Unit of measurement is required'),
    quantity: yup.number().positive().integer().required('Quantity is required'),
    unitPriceEGP: yup.number().positive().required('Unit price is required'),
    totalPriceEGP: yup.number().positive().required('Total price is required'),
}).noUnknown(true, 'Unknown field in update service package');

const packageIdSchema = yup.object().shape({
    id: ObjectId.required('Package ID is required'),
}).noUnknown(true, 'Unknown field in package ID');

module.exports = {
    searchServicePackagesSchema,
    addServicePackageSchema,
    updateServicePackageSchema,
    packageIdSchema
};
