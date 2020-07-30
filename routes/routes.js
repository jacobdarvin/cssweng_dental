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
    })
});

// enables to export app object when called in another .js file
module.exports = app;