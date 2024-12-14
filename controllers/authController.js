const User = require('../models/user');
const mqttClient = require('../mqtt/mqttClient');

exports.getSignIn = (req, res) => {
    res.render('signin');
};

exports.getSignUp = (req, res) => {
    res.render('signup');
};

exports.getForgotPassword = (req, res) => {
    res.render('forgetPassword');
}

exports.postSignUp = async (req, res) => {
    const { username, password, email, phone } = req.body; // Include phone

    try {
        const existingUser = await User.findOne({ email });
        if (existingUser) {
            return res.status(400).send('User with this email already exists.');
        }

        const newUser = new User({ username, password, email, phone });
        await newUser.save();

        res.redirect('/');
    } catch (err) {
        res.status(500).send('Error signing up: ' + err.message);
    }
};

exports.postSignIn = async (req, res) => {
    const { email, password } = req.body;

    const username = req.body.username;
    req.session.username = username; // Store username in session
    try {
        const user = await User.findOne({ email });
        if (!user || user.password !== password) {
            return res.status(401).send('Invalid email or password.');
        }

        res.render('homepage', { username: user.username });
    } catch (err) {
        res.status(500).send('Error signing in: ' + err.message);
    }
};

exports.postForgotPassword = (req, res) => {
    const { email } = req.body;

    if (!email) {
        return res.status(400).send('Email is required.');
    }

    console.log(`Password reset requested for email: ${email}`);
    res.send('A password reset link has been sent to your email address.');
};

