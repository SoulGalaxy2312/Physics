const express = require('express');
const bodyParser = require('body-parser');
const connectDB = require('./db/connectDB');
const authRoutes = require('./routes/authRoutes');
const homeRoutes = require('./routes/homeRoutes');
const settingsRoutes = require('./routes/settingsRoutes');
const historyRoutes = require('./routes/historyRoutes')
const mqttClient = require('./mqtt/mqttClient'); // Import your MQTT client
const socketIo = require('socket.io');
const session = require('express-session');
const http = require('http');

const cors = require('cors');


const app = express();
const port = 3000;
const server = http.createServer(app);
const io = socketIo(server);

app.use(session({
    secret: '1234', // Secret key to sign the session ID cookie
    resave: false, // Don't save session if unmodified
    saveUninitialized: true, // Save session even if it's uninitialized
    cookie: { secure: false } // Set to `true` if you're using HTTPS
}));


app.use(cors());
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true })); // for parsing application/x-www-form-urlencoded

app.set('view engine', 'ejs');
app.use(express.static('public'));

app.use('/', authRoutes);
app.use(homeRoutes);
app.use(historyRoutes);
app.use(settingsRoutes);

///
app.post('/api/distance', (req, res) => {
    const {distance} = req.body;
    console.log(distance);
    if (typeof distance === 'number') {
        mqttClient.publishDistance(distance.toString());
        res.status(200).json({ success: true, message: 'Distance updated successfully!'})
    } else {
        res.status(400).json({ success: false, message: 'Invalid distance value.'})
    }
});

///
app.post('/api/OledState', (req,res)=>{
    const {isTurnOn} = req.body;
    console.log(isTurnOn);
    if (isTurnOn) {
        mqttClient.client.publish('test/postOledState', isTurnOn.toString(), (err) => {
            if (err) {
                console.error('Publish failed:', err);
                res.status(404).json( {success: false, message: "OLED SSD State updated failed!!!"} );
            } else {
                console.log(`Oled State ${isTurnOn} published!`);
                res.status(200).json( {success: true, message: "OLED SSD State updated successfully"} );
            }
        });
    } else {
        res.status(400).send('No Change Occurs.');
    }
})

app.post('/api/EmergencyTemperature', (req, res)=>{
    const {tempInput} = req.body;
    console.log("Emergency Temperature: ", tempInput);
    mqttClient.client.publish('test/EmergencyTemperature', tempInput.toString(), (err)=>{
        if (err) {
            console.error('Publish failed:', err);
            res.status(404).json({ success: false, message: "Temperature updated failed !!!"});
        } else {
            console.log(`Emergency Temperature ${tempInput} published!`);
            res.status(200).json({ success: true, message: "Temperature updated successfully!!!"});
        }
    }) 
})

///
app.post('/api/changeLockPassword', (req,res)=>{
    const {password, maxAttempts} = req.body;

    const strMessage = password.toString() + "\n" + maxAttempts.toString();
    console.log('String message: ', strMessage);
    mqttClient.client.publish('test/changeLockPassword', strMessage, (err)=>{
        if (err) {
            console.err('Publish failed: ', err);
            res.status(404).json({ success: false, message: "Change Lock Password failed !!!"});
        } else {
            console.log(`Lock Password ${password} published!`);
            res.status(200).json({ success: true, message: "Change Lock Password successfully!!!"});
        }
    })
}) 

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
    } else if (topic === 'test/getLockState') {
        const messageString = message.toString();
        const isLocked = (message == 'true');
        console.log(`Current Lock State: ${isLocked}`);
        io.emit('lockStateUpdate', isLocked);
    } else if (topic === 'test/getOledSSDState') {
        const isTurnOn = (message.toString() == 'true');
        console.log(`OLED State: `, isTurnOn);
        io.emit('OledState', isTurnOn);
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
