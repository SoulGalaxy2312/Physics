const Record = require('../models/record'); // Your Mongoose model

// Controller function to get all records
exports.getAllRecords = async (req, res) => {
  try {
    const records = await Record.find().sort({ _id: -1 }).limit(10);
    return res.render('history', { records })
  } catch (error) {
    res.status(500).json({ error: 'Failed to fetch records' });
  }
};

exports.saveRecord = async (req, res) => {
    try {
      const { date, result } = req.body;

      const [datePart, timePart] = date.split(' ');
      const formattedDate = datePart.replace(/\//g, '-'); 
      const formattedTime = timePart.replace(/:/g, '-');
      res.status(201).json({ message: 'Record saved successfully' });
    } catch (error) {
      res.status(500).json({ error: 'Failed to save the record' });
    }
  };