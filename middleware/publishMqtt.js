const Value = require('../models/value'); 
const {client} = require('../mqtt/mqttClient'); 

const sendValuesToMQTT = async (req, res, next) => {
    try {
        const value = await Value.findOne();
        res.locals.main = value;
        if (value) {
            client.publish('test/EmergencyTemperature', value.thresholdTemperature.toString());
            client.publish('test/distance', value.maxDistance.toString());
            safePassword = value.lockPassword || '';
            const strMessage = safePassword + "\n" + value.allowedAttempts.toString();
            client.publish('test/changeLockPassword', strMessage);
        } else {
            console.log('No values found in the database to send to MQTT.');
        }
    } catch (error) {
        console.error('Error sending values to MQTT:', error.message);
    }

    next();
};

module.exports = sendValuesToMQTT;