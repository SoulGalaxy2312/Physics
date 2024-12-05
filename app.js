const express = require('express');
const bodyParser = require('body-parser');
const connectDB = require('./db/connectDB');
const authRoutes = require('./routes/authRoutes');
const homeRoutes = require('./routes/homeRoutes');
const historyRoutes = require('./routes/historyRoutes')
const mqttClient = require('./mqtt/mqttClient'); // Import your MQTT client
const socketIo = require('socket.io');
const http = require('http');

const cors = require('cors');


const app = express();
const port = 3000;
const server = http.createServer(app);
const io = socketIo(server);

app.use(cors());
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true })); // for parsing application/x-www-form-urlencoded

app.set('view engine', 'ejs');
app.use(express.static('public'));

app.use('/', authRoutes);
app.use(homeRoutes);
app.use(historyRoutes);

app.post('/api/distance', (req, res) => {
    const {distance} = req.body;
    console.log(distance);
    if (typeof distance === 'number') {
        mqttClient.publishDistance(distance.toString());
        res.status(200).send('Distance updated successfully!');
    } else {
        res.status(400).send('Invalid distance value.');
    }
});

mqttClient.client.on('message', (topic, message) => {
    if (topic === 'test/temperature') {
        const temperature = parseFloat(message.toString()); // Get temperature from MQTT message
        console.log(`Temperature: ${temperature}`);
        io.emit('temperatureUpdate', temperature); // Send temperature to clients via WebSocket
    } else if (topic === 'test/history') {
        try {
            const newRecord = JSON.parse(message.toString());
            console.log('Parsed record:', newRecord);
            io.emit('newRecord', newRecord);
        } catch (error) {
            console.error('Failed to parse newRecord:', error.message);
        }
    } else if (topic === 'test/getDistance') {
        const currentDistance = parseInt(message.toString());
        console.log(`Current distance: ${currentDistance}`);
        io.emit('distanceUpdate', currentDistance);
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
