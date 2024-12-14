const mongoose = require('mongoose');

const valuesSchema = new mongoose.Schema({
  maxDistance: {
    type: Number,
    required: true,
    min: 0,
    max: 100,
  },
  thresholdTemperature: {
    type: Number,
    required: true,
  },
  lockPassword: {
    type: String,
    minlength: 0,
    maxlength: 6,
  },
  allowedAttempts: {
    type: Number,
    required: true,
    min: 0,
  },
  lockStatus: {
    type: String,
    required: true,
  },
}, { timestamps: true });

const Value = mongoose.model('Value', valuesSchema);

module.exports = Value;
