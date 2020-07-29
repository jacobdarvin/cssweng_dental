// import module `express`
const express = require('express');
const app = express();

// import module `controller` from `./controllers/controller.js`
const controller = require('../controllers/controller.js');


// call function getIndex when client sends a request for '/' defined in routes.js
app.get('/', controller.getIndex);

// enables to export app object when called in another .js file
module.exports = app;