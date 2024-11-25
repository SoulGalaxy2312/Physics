const User = require('../models/user');

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
        // Check if the user already exists
        const existingUser = await User.findOne({ email });
        if (existingUser) {
            return res.status(400).send('User with this email already exists.');
        }

        // Create a new user
        const newUser = new User({ username, password, email, phone }); // Save phone
        await newUser.save();

        res.redirect('/'); // Redirect to sign-in page after successful sign-up
    } catch (err) {
        res.status(500).send('Error signing up: ' + err.message);
    }
};

exports.postSignIn = async (req, res) => {
    const { email, password } = req.body;

    try {
        const user = await User.findOne({ email });
        if (!user || user.password !== password) {
            return res.status(401).send('Invalid email or password.');
        }

        res.send('Sign-in successful!');
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

