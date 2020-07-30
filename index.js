// import modules express, db, and handlebars
const express = require('express');
const hbs = require('hbs');
const db = require('./models/db.js');
const app = express();

// define css, img, js, and views as static 
app.use(express.static('public'));
app.use(express.static('views'));

// set hbs as view engine
app.set('view engine', 'hbs');

// parses incoming requests with urlencoded payloads
app.use(express.urlencoded({extended: true}));

// import routes module
const routes = require('./routes/routes.js');

//partials
//hbs.registerPartials(__dirname + '/views/partials');

// set the folder `public` as folder containing static assets (css, js, imgs)
app.use(express.static('public'));

// define the paths contained in routes module
app.use('/', routes);

// connects to the database
db.connect();

// binds the server to a specific port
const port = 9090;
app.listen(port, function () {
    console.log('app listening at port ' + port);
});