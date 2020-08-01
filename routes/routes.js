// import module `express`
const express = require('express');

// import module `controller` from `./controllers/controller.js`
const indexController = require('../controllers/indexController');
const profileController = require('../controllers/profileController');
const registerController = require('../controllers/registerController');
const loginController = require('../controllers/loginController.js');

// import validation script
const validation = require('../helpers/validation.js');

const app = express();

// /home routes
app.get('/', indexController.getIndex);
app.get('/home', indexController.getIndex);

// /profile routes
app.get('/profile', profileController.getProfile);

// /register routes
app.get('/register', registerController.getRegister);

app.post(
    '/register',
    validation.signupValidation(),
    registerController.postRegister,
);

// /login route
app.get('/login', loginController.getLogIn);
app.post('/login', loginController.postLogIn);

// enables to export app object when called in another .js file
module.exports = app;
