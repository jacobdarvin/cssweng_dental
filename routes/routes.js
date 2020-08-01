// import module `express`
const express = require('express');

// import module `controller` from `./controllers/controller.js`
const controller = require('../controllers/controller.js');

const app = express();

// call function getIndex when client sends a request for '/' defined in routes.js
app.get('/', controller.getIndex);


//Home Route
app.get('/home(page)?(.html)?', function(req, res) {
    res.render('index', {
        title: 'Home | BookMeDental',
        home_active: true
    })
});

app.get('/profile', function(req, res) {
    res.render('profile', {
        title: 'Profile | BookMeDental',
        profile_active: true
    })
});

app.get('/login', function(req, res) {
    res.render('login', {
        title: 'Login | BookMeDental',
        login_active: true,
    })
});

app.get('/form', function(req, res) {
    res.render('form', {
        title: 'Sign Up | BookMeDental',
        login_active: true,
    })
});

app.get('/register', function(req, res) {
    res.render('register', {
        title: 'Register | BookMeDental',
        register_active: true
    })
});

// enables to export app object when called in another .js file
module.exports = app;