const mqtt = require('mqtt');

// MQTT options for WebSocket connection
var options = {
    host: '57f8334a22cf47a080caa6a1f0c656b7.s1.eu.hivemq.cloud',
    port: 8883,  // Use port 8884 for WebSocket
    protocol: 'mqtts',  // Use WebSocket Secure (wss) for SSL/TLS encrypted WebSocket connection
    username: 'huhyhuvinh',
    password: 'Secret123'
};

const client = mqtt.connect(options);

// Variable to store the latest temperature
let latestTemperature = '--';  // Default value


// Handle the connection
client.on('connect', () => {
    console.log('Connected to MQTT broker');
    client.subscribe('test/getTemperature', (err) => {
        if (err) console.error('Failed to subscribe:', err);
    });
    client.subscribe('test/history', (err) => {
        if (err) console.error('Failed to subscribe:', err);
    });
    client.subscribe('test/getDistance', (err) => {
        if (err) console.error('Failed to subscribe:', err);
    });
    client.subscribe('test/getLockState', (err)=> {
        if (err) console.error('Failed to subscribe:', err);
    });
    client.subscribe('test/getOLEDSSDState', (err)=>{
        if (err) console.error('Failed to subscribe:', err);
    });

    client.subscribe('test/EmergencyTemperature', (err)=>{
        if (err) console.error('Failed to subscribe:', err);
    });

    client.subscribe('test/lockActive', (err)=>{
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
