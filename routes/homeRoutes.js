const express = require('express');
const router = express.Router();
const mqttClient = require('../mqtt/mqttClient'); // Import the MQTT client

// GET route to render the homepage
router.get('/homepage', (req, res) => {
    const username = req.session && req.session.username ? req.session.username : 'Guest';

    res.render('homepage', { username: username });
});

module.exports = router;
