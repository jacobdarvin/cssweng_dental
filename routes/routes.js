// import module `express`
const express = require('express');

// import module `controller` from `./controllers/controller.js`
const controller = require('../controllers/controller');
const registerController = require('../controllers/registerController');

// import validation script
const validation = require('../helpers/validation.js');

const app = express();

// /home route
app.get('/', controller.getIndex);

// /profile routes
app.get('/profile', function (req, res) {
    res.render('profile', {
        title: 'Profile | BookMeDental',
        profile_active: true,
    });
});

// /login routes
app.get('/login', function (req, res) {
    res.render('login', {
        title: 'Login | BookMeDental',
        login_active: true,
    });
});

// /register routes
app.get('/register', registerController.getRegister);

app.post(
    '/register',
    validation.signupValidation(),
    registerController.postRegister,
);

// enables to export app object when called in another .js file
module.exports = app;
