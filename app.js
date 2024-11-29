const express = require('express');
const bodyParser = require('body-parser');
const connectDB = require('./db/connectDB');
const authRoutes = require('./routes/authRoutes');
const homeRoutes = require('./routes/homeRoutes');
const mqttClient = require('./mqtt/mqttClient'); // Import your MQTT client
const socketIo = require('socket.io');
const http = require('http');

const app = express();
const port = 3000;
const server = http.createServer(app);
const io = socketIo(server);

app.use(bodyParser.urlencoded({ extended: true }));
app.set('view engine', 'ejs');
app.use(express.static('public'));

app.use('/', authRoutes);
app.use(homeRoutes);

// Emit temperature updates to all connected clients when temperature changes
mqttClient.client.on('message', (topic, message) => {
    if (topic === 'test/temperature') {
        const temperature = parseFloat(message.toString()); // Get temperature from MQTT message
        io.emit('temperatureUpdate', temperature); // Send temperature to clients via WebSocket
    }
});

const start = async () => {
    try {
        await connectDB();
        server.listen(port, () =>
            console.log(`Server running at http://127.0.0.1:${port}/`)
        );
    } catch (error) {
        console.log(error);
    }
};

start();
