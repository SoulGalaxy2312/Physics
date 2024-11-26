const mongoose = require('mongoose');

const connectDB = () => {
    return mongoose.connect("mongodb+srv://admin:admin@physics.2mji7.mongodb.net/?retryWrites=true&w=majority&appName=Physics")
}

module.exports = connectDB;
