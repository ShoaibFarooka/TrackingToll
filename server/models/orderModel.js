const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const clientInfoSchema = new Schema({
    carChassisNumber: { type: String, required: true },
    carModel: { type: String, required: true },
    carNumber: { type: String, required: true },
    contactNumber: { type: String, required: true },
    customerName: { type: String, required: true },
    location: { type: String, required: true },
    mrNumber: { type: String, default: '' },
    roNumber: { type: String, default: '' },
},
    { _id: false }
);

const salesOrderItemSchema = new Schema({
    package: { type: Schema.Types.ObjectId, ref: 'sales-package', required: true },
    quantity: { type: Number, required: true },
},
    { _id: false }
);

const serviceOrderItemSchema = new Schema({
    package: { type: Schema.Types.ObjectId, ref: 'service-package', required: true },
    quantity: { type: Number, required: true },
},
    { _id: false }
);

const teamResponseSchema = new Schema({
    teamName: { type: String, required: true },
    user: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
        required: true
    },
    code: { type: String, required: true },
    status: { type: String, required: true, enum: ['approved', 'rejected'] },
    comments: { type: String, default: null },
    timestamp: { type: Date, default: Date.now }
},
    { _id: false }
);

const engineerSchema = new Schema({
    key: { type: Number, required: true },
    item: { type: String, required: true, trim: true },
    name: { type: String, required: true, trim: true },
    id: { type: String, required: true, trim: true },
    position: { type: String, required: true, trim: true },
},
    { _id: false }
);

const orderSchema = new Schema({
    clientInfo: clientInfoSchema,
    initialSalesOrderItems: [salesOrderItemSchema],
    initialServiceOrderItems: [serviceOrderItemSchema],
    finalSalesOrderItems: [salesOrderItemSchema],
    finalServiceOrderItems: [serviceOrderItemSchema],
    status: { type: String, required: true, enum: ['processing', 'completed', 'rejected'] },
    currentTeamProcessing: { type: String, required: true },
    teamResponses: [teamResponseSchema],
    engineers: [engineerSchema],
    dtNumber: {
        type: String,
        default: '',
        trim: true
    },
    wptsNumber: {
        type: String,
        default: '',
        trim: true
    },
    cparNumber: {
        type: String,
        default: '',
        trim: true
    }
},
    { timestamps: true }
);

const Order = mongoose.model('order', orderSchema);

module.exports = Order;
