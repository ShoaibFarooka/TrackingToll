const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const servicePackageSchema = new Schema({
  carCode: {
    type: String,
    required: true
  },
  tableNum: {
    type: String,
    required: true
  },
  itemNum: {
    type: String,
    required: true
  },
  description: {
    type: String,
    required: true
  },
  unitOfMeasurement: {
    type: String,
    required: true
  },
  quantity: {
    type: Number,
    required: true
  },
  unitPriceEGP: {
    type: Number,
    required: true
  },
  totalPriceEGP: {
    type: Number,
    required: true
  }
});

const ServicePackage = mongoose.model('service-package', servicePackageSchema);

module.exports = ServicePackage;
