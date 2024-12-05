const express = require('express');
const router = express.Router();
const historyController = require('../controllers/historyController');

router.get('/history', historyController.getAllRecords);

router.post('/api/records', historyController.saveRecord);

module.exports = router;