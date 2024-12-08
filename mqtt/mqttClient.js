const mqtt = require('mqtt');

// MQTT options for WebSocket connection
var options = {
    host: '78282865d97d4e2f92862000736b19af.s1.eu.hivemq.cloud',
    port: 8883,  // Use port 8884 for WebSocket
    protocol: 'mqtts',  // Use WebSocket Secure (wss) for SSL/TLS encrypted WebSocket connection
    username: 'ngothanhtri',
    password: 'NgoThanhTri123'
};

const client = mqtt.connect(options);

// Variable to store the latest temperature
let latestTemperature = '--';  // Default value


// Handle the connection
client.on('connect', () => {
    console.log('Connected to MQTT broker');
    // Get Temperature
    client.subscribe('test/temperature', (err) => {
        if (err) console.error('Failed to subscribe:', err);
    });
    // Get history record when someone tries to type password
    client.subscribe('test/history', (err) => {
        if (err) console.error('Failed to subscribe:', err);
    });
    // Get current distance adjusted for Ultra Sonic Sensor at the moment
    client.subscribe('test/getDistance', (err) => {
        if (err) console.error('Failed to subscribe:', err);
    });
    // Get Current Lock State from the Servo
    client.subscribe('test/getLockState', (err)=> {
        if (err) console.error('Failed to subscribe:', err);
    });
    // Get the state of Oled SSD
    client.subscribe('test/getOledSSDState', (err)=>{
        if (err) console.error('Failed to subscribe:', err);
    });
    // Get the state of Touch Screen
    client.subscribe('test/getTouchScreenState', (err)=>{
        if (err) console.error('Failed to subscribe:', err);
    });
});

// User want to update the distance of UltraSonicSensor
function publishDistance(distance) {
    client.publish('test/distance', distance, (err) => {
        if (err) {
            console.error('Publish failed:', err);
        } else {
            console.log(`Distance ${distance} published!`);
        }
    });
}

// Export the client and the getTemperature function
module.exports = {
    client,
    publishDistance,
};
