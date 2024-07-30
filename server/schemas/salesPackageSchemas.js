const yup = require('yup');
const mongoose = require('mongoose');

const ObjectId = yup.string().test('is-valid', 'Invalid package ID', value => mongoose.Types.ObjectId.isValid(value));

const searchSalesPackagesSchema = yup.object().shape({
    carCode: yup.string().trim(),
    rowLineNum: yup.string().trim(),
}).test('at-least-one', 'At least one of carCode or rowLineNum is required', function (value) {
    return value.carCode || value.rowLineNum;
}).noUnknown(true, 'Unknown field in search sales packages');

const addSalesPackageSchema = yup.object().shape({
    carCode: yup.lazy(value =>
        typeof value === 'string'
            ? yup.string()
                .transform((value, originalValue) => {
                    return originalValue ? originalValue.split(',').map(item => item.trim()) : [];
                })
                .test('is-array', 'Car code must be an array', value => Array.isArray(value))
                .required('Car code is required')
            : yup.array().of(yup.string().trim().required('Car code is required'))
    ),
    rowLineNum: yup.string().trim().required('Row line number is required'),
    partNum: yup.string().trim().required('Part number is required'),
    sapNum: yup.string().trim().required('SAP number is required'),
    description: yup.string().trim().required('Description code is required'),
    unitOfMeasurement: yup.string().trim().required('Unit of measurement is required'),
    quantity: yup.number().required('Quantity is required'),
    unitPriceEGP: yup.number().required('Unit price is required'),
    totalPriceEGP: yup.number().required('Total price is required'),
}).noUnknown(true, 'Unknown field in add sales package');

const updateSalesPackageSchema = yup.object().shape({
    carCode: yup.lazy(value =>
        typeof value === 'string'
            ? yup.string()
                .transform((value, originalValue) => {
                    return originalValue ? originalValue.split(',').map(item => item.trim()) : [];
                })
                .test('is-array', 'Car code must be an array', value => Array.isArray(value))
                .required('Car code is required')
            : yup.array().of(yup.string().trim().required('Car code is required'))
    ),
    partNum: yup.string().trim().required('Part number is required'),
    rowLineNum: yup.string().trim().required('Row line number is required'),
    sapNum: yup.string().trim().required('SAP number is required'),
    description: yup.string().trim().required('Description code is required'),
    unitOfMeasurement: yup.string().trim().required('Unit of measurement is required'),
    quantity: yup.number().required('Quantity is required'),
    unitPriceEGP: yup.number().required('Unit price is required'),
    totalPriceEGP: yup.number().required('Total price is required'),
}).noUnknown(true, 'Unknown field in update sales package');

const packageIdSchema = yup.object().shape({
    id: ObjectId.required('Package ID is required'),
}).noUnknown(true, 'Unknown field in package ID');

module.exports = {
    searchSalesPackagesSchema,
    addSalesPackageSchema,
    updateSalesPackageSchema,
    packageIdSchema
};
