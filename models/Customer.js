const mongoose = require('mongoose');
const shortid = require('shortid');

const CustomerSchema = new mongoose.Schema({
  customerId: {
    type: String,
    unique: true,
    default: shortid.generate, // Generate a unique ID
  },
  customerName: {
    type: String,
    required: true,
  },
  customerContactNumber: {
    type: String,
    required: true,
  },
  dateOfSale: {
    type: Date,
    default: Date.now,
  },
  totalDownPayment: {
    type: Number,
    required: true,
  },
  totalPayment: {
    type: Number,
    required: true,
  },
  commission: {
    type: Number,
    required: true,
  },
  dealerName: {
    type: String,
    required: true,
  },
  createdBy: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true,
  },
});

module.exports = mongoose.model('Customer', CustomerSchema);