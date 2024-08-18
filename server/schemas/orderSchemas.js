const yup = require('yup');
const mongoose = require('mongoose');

const ObjectId = yup.string().test('is-valid', 'Invalid ObjectId', value => mongoose.Types.ObjectId.isValid(value));

const clientInfoSchema = yup.object().shape({
    carChassisNumber: yup.string().trim().required('Car chassis number is required'),
    carModel: yup.string().trim().required('Car model is required'),
    carNumber: yup.string().trim().required('Car number is required'),
    contactNumber: yup.string().trim().required('Contact number is required'),
    customerName: yup.string().trim().required('Customer name is required'),
    location: yup.string().trim().required('Location is required'),
    mrNumber: yup.string().trim(),
    roNumber: yup.string().trim()
}).noUnknown(true, 'Unknown field in client info');

const orderItemSchema = yup.object().shape({
    package: ObjectId.required('Package ID is required'),
    quantity: yup.number().positive().integer().required('Quantity is required')
}).noUnknown(true, 'Unknown field in order item');

const createOrderSchema = yup.object().shape({
    clientInfo: clientInfoSchema.required('Client info is required'),
    salesOrderItems: yup.array().of(orderItemSchema).required('Sales order items are required'),
    serviceOrderItems: yup.array().of(orderItemSchema).required('Service order items are required'),
    teamCode: yup.string().trim().required('Team code is required'),
    teamComments: yup.string().trim().required('Team comments are required'),
    dtNumber: yup.string().trim(),
    wptsNumber: yup.string().trim(),
    cparNumber: yup.string().trim(),
}).test('at-least-one-item', 'At least one of salesOrderItems or serviceOrderItems must contain at least one item', function (value) {
    const { salesOrderItems, serviceOrderItems } = value;
    return (salesOrderItems && salesOrderItems.length > 0) || (serviceOrderItems && serviceOrderItems.length > 0);
}).noUnknown(true, 'Unknown field in create order data');

const orderIdSchema = yup.object().shape({
    orderId: ObjectId.required('Order ID is required'),
}).noUnknown(true, 'Unknown field in order ID');

const engineerSchema = yup.object().shape({
    key: yup.number().positive('Key must be positive').required('Key is required'),
    item: yup.string().trim().required('Item is required'),
    name: yup.string().trim().required('Name is required'),
    id: yup.string().trim().required('Id is required'),
    position: yup.string().trim().required('Position is required'),
}).noUnknown(true, 'Unknown field in engineers data');

const updateOrderSchema = yup.object().shape({
    teamCode: yup.string().trim().required('Team code is required'),
    teamComments: yup.string().trim().required('Team comments are required'),
    status: yup.string().trim().required('Status is required'),
    dtNumber: yup.string().trim(),
    wptsNumber: yup.string().trim(),
    cparNumber: yup.string().trim(),
}).noUnknown(true, 'Unknown field in update order data');

const approveOrderSchema = yup.object().shape({
    teamCode: yup.string().trim().required('Team code is required'),
    teamComments: yup.string().trim().required('Team comments are required'),
    status: yup.string().trim().required('Status is required'),
    finalSalesOrderItems: yup.array().of(orderItemSchema).required('Final sales order items are required'),
    finalServiceOrderItems: yup.array().of(orderItemSchema).required('Final service order items are required'),
    engineers: yup.array().of(engineerSchema).required('Engineers list is required'),
    dtNumber: yup.string().trim(),
    wptsNumber: yup.string().trim(),
    cparNumber: yup.string().trim(),
}).test('at-least-one-item', 'At least one of finalSalesOrderItems or finalServiceOrderItems must contain at least one item', function (value) {
    const { finalSalesOrderItems, finalServiceOrderItems } = value;
    return (finalSalesOrderItems && finalSalesOrderItems.length > 0) || (finalServiceOrderItems && finalServiceOrderItems.length > 0);
}).noUnknown(true, 'Unknown field in update order data');


module.exports = {
    createOrderSchema,
    orderIdSchema,
    updateOrderSchema,
    approveOrderSchema
};
