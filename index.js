// IMPORT
const express = require('express');
const hbs = require('hbs');
const exphbs = require('express-handlebars');
var path = require('path');

//DATA BASE AND EXPRESS
const db = require('./models/db.js');
const app = express();

// DEFINE STATIC FOLDERS
app.use(express.static('public'));
app.use(express.static('views'));

// set hbs as view engine
app.set('view engine', 'hbs');

app.engine('hbs', exphbs({
	extname: 'hbs',
	defaultView: 'main',
	layoutsDir: path.join(__dirname, '/views/layouts'),
	partialsDir: path.join(__dirname, '/views/partials'),
}));

// parses incoming requests with urlencoded payloads
app.use(express.urlencoded({extended: true}));

// import routes module
const routes = require('./routes/routes.js');

//partials
hbs.registerPartials(__dirname + '/views/partials');
//

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