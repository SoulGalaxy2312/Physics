const Record = require('../models/record'); // Your Mongoose model

// Controller function to get all records
exports.getAllRecords = async (req, res) => {
  try {
    const records = await Record.find(); // Fetch all records from the database
    return res.render('history', { records })
  } catch (error) {
    res.status(500).json({ error: 'Failed to fetch records' });
  }
};

exports.saveRecord = async (req, res) => {
    try {
      const newRecord = new Record(req.body); // Create a new record from the request body
      await newRecord.save(); // Save the record to the database
      res.status(201).json({ message: 'Record saved successfully' });
    } catch (error) {
      res.status(500).json({ error: 'Failed to save the record' });
    }
  };