const express = require('express');
const authController = require('../controllers/authController');

const router = express.Router();

// Routes for sign-in
router.get('/', authController.getSignIn);
router.post('/', authController.postSignIn);

// Routes for sign-up
router.get('/signup', authController.getSignUp);
router.post('/signup', authController.postSignUp);

// Routes for forget-password
router.get('/forgot-password', authController.getForgotPassword);
router.post('/forgot-password', authController.postForgotPassword);

module.exports = router;
