// import modules express, db, and handlebars
const express = require('express');
const hbs = require('hbs');
const db = require('./models/db.js');

// define css, img, js, and views as static 
app.use(express.static('public'));
app.use(express.static('views'));

// parses incoming requests with urlencoded payloads
app.use(express.urlencoded({extended: true}));

// import routes module
const routes = require('./routes/routes.js');

//partials
//hbs.registerPartials(__dirname + '/views/partials');

// define css, img, js, and views as static 
app.use(express.static('css'));
app.use(express.static('imgs'));
app.use(express.static('views'));

// define the paths contained in routes module
app.use('/', routes);

// set hbs as view engine
app.set('view engine', 'hbs');

// connects to the database
db.connect();

// binds the server to a specific port
const port = 9090;
app.listen(port, function () {
    console.log('app listening at port ' + port);
});