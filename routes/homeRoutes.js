const express = require('express');
const router = express.Router();
const mqttClient = require('../mqtt/mqttClient'); // Import the MQTT client

// GET route to render the homepage
router.get('/homepage', (req, res) => {
    // Use the user data from the session or database (assuming you have access to the logged-in user's session)
    const username = req.session.username || 'Guest'; // Replace with real username if needed

    // Render the homepage with username and temperature
    res.render('homepage', { username: username });
});

module.exports = router;
