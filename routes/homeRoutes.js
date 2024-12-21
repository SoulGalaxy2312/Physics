const express = require('express');
const router = express.Router();
const mqttClient = require('../mqtt/mqttClient'); // Import the MQTT client
const Value = require('../models/value');

// GET route to render the homepage
router.get('/homepage', async (req, res) =>  {
    const username = req.session && req.session.username ? req.session.username : 'Guest';
    value = await Value.findOne();
    res.render('homepage', { username: username, value: value });
});

module.exports = router;
