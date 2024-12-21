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
const sendValuesToMQTT = require('./middleware/publishMqtt');
const cors = require('cors');

const Value = require('./models/value');
const Record = require('./models/record');

const app = express();
const port = 3000;
const server = http.createServer(app);
const io = socketIo(server);

const Pushsafer = require('pushsafer-notifications');

const push = new Pushsafer({
  k: 'z6gOyxrprLd17djEifOi',
  debug: true
});


app.use(session({
    secret: '1234', // Secret key to sign the session ID cookie
    resave: false, // Don't save session if unmodified
    saveUninitialized: true, // Save session even if it's uninitialized
    cookie: { secure: false } // Set to `true` if you're using HTTPS
}));

app.use(sendValuesToMQTT);

app.use(cors());
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true })); // for parsing application/x-www-form-urlencoded

app.set('view engine', 'ejs');
app.use(express.static('public'));

app.use('/', authRoutes);
app.use(homeRoutes);
app.use(historyRoutes);
app.use(settingsRoutes);

app.use((req, res, next) => {
    res.locals.phone = res.locals.phone;
    next();
});


///
app.post('/api/distance', async (req, res) => {
    const {distance} = req.body;
    console.log(distance);
    if (typeof distance === 'number') {
        await Value.updateOne(
            {},
            { maxDistance: distance },
            { upsert: true }
        );
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
    mqttClient.client.publish('test/postOledState', isTurnOn.toString(), (err) => {
        if (err) {
            console.error('Publish failed:', err);
            res.status(404).json( {success: false, message: "OLED SSD State updated failed!!!"} );
        } else {
            console.log(`Oled State ${isTurnOn} published!`);
            io.emit('OledState', isTurnOn);
            res.status(200).json( {success: true, message: "OLED SSD State updated successfully"} );
        }
    });
})



app.post('/api/TouchScreenState', (req,res)=>{
    const {isTurnOn} = req.body;
    console.log(isTurnOn);
    mqttClient.client.publish('test/postTouchScreenState', isTurnOn.toString(), (err) => {
        if (err) {
            console.error('Publish failed:', err);
            res.status(404).json( {success: false, message: "Touch Screen State updated failed!!!"} );
        } else {
            console.log(`Oled State ${isTurnOn} published!`);
            res.status(200).json( {success: true, message: "Touch Screen State updated successfully"} );
        }
    });
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
app.post('/api/changeLockPassword', async (req,res)=>{
    const {password, maxAttempts} = req.body;
    const safePassword = password ? password.toString() : '';
    const strMessage = safePassword + "\n" + maxAttempts.toString();
    await Value.updateOne(
        {},
        { allowedAttempts: maxAttempts, lockPassword: safePassword },
        { upsert: true }
    );
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

app.post('/api/set-color', async (req,res)=>{
    const {color} = req.body;
    mqttClient.client.publish('test/color', color, (err)=>{
        if (err) {
            console.err('Publish failed: ', err);
            res.status(404).json({ success: false, message: "Change color failed !!!"});
        } else {
            console.log(`Color ${color} published!`);
            res.status(200).json({ success: true, message: "Change color successfully!!!"});
        }
    })
})

app.post('/api/backlight', async (req,res)=>{
    const {state} = req.body;
    mqttClient.client.publish('test/backlight', state, (err)=>{
        if (err) {
            console.err('Publish failed: ', err);
            res.status(404).json({ success: false, message: "Change state failed !!!"});
        } else {
            console.log(`lcd ${state} published!`);
            res.status(200).json({ success: true, message: "Change state successfully!!!"});
        }
    })
})

app.post('/api/soundMelody', async(req,res)=>{
    const {melodyId} = req.body;
    mqttClient.client.publish('test/soundMelody', melodyId, (err)=>{
        if (err){
            console.err('Publish failed: ', err);
            res.status(404).json({success: false, message: "Change sound melody failed!!!"})
        } else{
            console.log(`${melodyId} published!`);
            res.status(200).json({success: true, message: 'Change sound melody successfully!!!'})
        }
    })
})

mqttClient.client.on('message', async (topic, message) => {
    if (topic === 'test/getTemperature') {
        const temperature = parseFloat(message.toString()); 
        await Value.updateOne(
            {}, 
            { temperature: temperature },
            { upsert: true }
        );
        let value = await Value.findOne();
        if (temperature >= value.thresholdTemperature) {
            const msg = {
                m: "Nhiệt độ nhà của bạn đang vượt ngưỡng an toàn", 
                t: 'Thông báo thử nghiệm',
                s: '1',
                v: '2',
                i: '1', 
                c: '#FF0000', 
                d: '88436',
                u: 'https://www.pushsafer.com', 
                ut: 'Pushsafer.com', 
                l: '10', 
                pr: '2'
              };
              
              push.send(msg, function(err, result) {
                if (err) {
                  console.log('Lỗi:', err);
                } else {
                  console.log('Kết quả:', result);
                }
              });  
        }
        console.log(`Temperature: ${temperature}`);
        io.emit('temperatureUpdate', temperature); // Send temperature to clients via WebSocket
    }
    else if (topic === 'test/EmergencyTemperature') {
        const temperature = parseFloat(message.toString()); 
        await Value.updateOne(
            {}, 
            { thresholdTemperature: temperature },
            { upsert: true }
        );
        console.log(`Temperature: ${temperature}`);
        io.emit('EmergencyTemperature', temperature); 
    }
    else if (topic === 'test/history') {
        try {
            const newRecord = JSON.parse(message.toString());
            const [datePart, timePart] = newRecord.date.split(' ');
            const formattedDate = datePart.replace(/\//g, '-'); 
            const formattedTime = timePart.replace(/:/g, '-');
            const newItem = new Record({
              date: formattedDate,
              time: formattedTime,
              result: newRecord.result,
            });
            await newItem.save();
            console.log('Parsed record:', newRecord);
            io.emit('newRecord', newRecord);
        } catch (error) {
            console.error('Failed to parse newRecord:', error.message);
        }
    } else if (topic === 'test/getDistance') {
        const currentDistance = parseInt(message.toString());
        await Value.updateOne(
            {},
            { maxDistance: currentDistance },
            { upsert: true }
        );
        console.log(`Current distance: ${currentDistance}`);
        io.emit('distanceUpdate', currentDistance);
    } else if (topic === 'test/getLockState') {
        const isLocked = (message == 'true');
        if (!isLocked) {
            const msg = {
                m: "Mở Khóa Thành Công", 
                t: 'Thông báo thử nghiệm',
                s: '24',
                v: '2',
                i: '1', 
                c: '#FF0000', 
                d: '88436',
                u: 'https://www.pushsafer.com', 
                ut: 'Pushsafer.com', 
                l: '10', 
                pr: '2'
              };
              
              push.send(msg, function(err, result) {
                if (err) {
                  console.log('Lỗi:', err);
                } else {
                  console.log('Kết quả:', result);
                }
              });     
        }
        await Value.updateOne(
            {},
            { lockStatus: isLocked ? 'true' : 'false' },
            { upsert: true }
        );    
        const lockData = await Value.findOne({}, { lockStatus: 1, _id: 0 });
        const lockStateFromDB = lockData?.lockStatus === 'true';
        
        console.log(`Current Lock State from DB: ${lockStateFromDB}`);
    
        io.emit('lockStateUpdate', lockStateFromDB);
    } else if (topic === 'test/getOLEDSSDState') {
        const isTurnOn = (message.toString().toLowerCase() == 'on');
        console.log(`OLED State: `, isTurnOn);
        io.emit('OledState', isTurnOn);
    } else if (topic === 'test/lockActive') {
        const isTurnOn = (message.toString().toLowerCase() == 'on');
        console.log(`Lock Active: `, isTurnOn);
        io.emit('TouchScreenState', isTurnOn);
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
