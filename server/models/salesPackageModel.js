const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const salesPackageSchema = new Schema({
  carCode: {
    type: [String],
    required: true
  },
  partNum: {
    type: String,
    required: true
  },
  rowLineNum: {
    type: String,
    required: true
  },
  sapNum: {
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

const SalesPackage = mongoose.model('sales-package', salesPackageSchema);

module.exports = SalesPackage;
