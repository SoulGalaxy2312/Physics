const mongoose = require('mongoose');

const recordSchema = new mongoose.Schema({
  date: {
    type: String,
    required: true,
    match: /^(0[1-9]|[12][0-9]|3[01])-(0[1-9]|1[0-2])-[0-9]{4}$/ // Validate DD-MM-YYYY
  },
  time: {
    type: String,
    required: true,
    match: /^([01][0-9]|2[0-3])-[0-5][0-9]-[0-5][0-9]$/ // Validate HH-mm-ss
  },
  result: {
    type: String,
    enum: ['success', 'failure'],
    required: true
  }
});

const Record = mongoose.model('Record', recordSchema);

module.exports = Record;
