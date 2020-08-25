// IMPORT
const express = require('express');
const hbs = require('hbs');
const exphbs = require('express-handlebars');
const mongoose = require('mongoose');
const path = require('path');
const fs = require('fs');

//DATA BASE AND EXPRESS
const app = express();

// DEFINE STATIC FOLDERS
app.use(express.static('public'));
app.use(express.static('views'));

// set hbs as view engine
app.set('view engine', 'hbs');

app.engine(
    'hbs',
    exphbs({
        extname: 'hbs',
        defaultView: 'main',
        layoutsDir: path.join(__dirname, '/views/layouts'),
        partialsDir: path.join(__dirname, '/views/partials'),

        // custom helpers
        helpers: {
            // Use this helper on <select> elements to retain option when submitting form data
            select: function (value, input) {
                return value === input ? ' selected' : '';
            },
            // Use this helper on <input type="radio"> elements to retain option when submitting form data
            check: function (value, input, init) {
                if (!input) input = init;
                return value === input ? ' checked' : '';
            },
        },
    }),
);

// parses incoming requests with urlencoded payloads
app.use(express.urlencoded({ extended: true }));

// import routes module
const routes = require('./routes/routes.js');

//partials
hbs.registerPartials(__dirname + '/views/partials');

// set the folder `public` as folder containing static assets (css, js, imgs)
// app.use(express.static('public'));
app.use(express.static(path.join(__dirname, 'public')));

// create ./public/resumes directory if it doesn't exists
const resumesDir = './public/resumes';
if (!fs.existsSync(resumesDir)) {
    console.log('resumes folder does not exist!');
    fs.mkdirSync(resumesDir);
}

// define the paths contained in routes module
app.use('/', routes);

// connects to the database
const url = 'mongodb://localhost:27017/cssweng_dental';
const options = {
    useUnifiedTopology: true,
    useNewUrlParser: true,
};

mongoose.connect(url, options, err => {
    if (err) throw err;
    console.log('connected at ' + url);
});

//404 error.

app.use(function (req, res) {
    res.render('404');
});

// binds the server to a specific port
const port = 9090;
app.listen(port, function () {
    console.log('app listening at port ' + port);
});
