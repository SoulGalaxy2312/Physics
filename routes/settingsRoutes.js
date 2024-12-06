const express = require('express');
const settingsController = require('../controllers/settingsController');

const router = express.Router();

router.get('/settings', settingsController.showSettings);

module.exports = router;
