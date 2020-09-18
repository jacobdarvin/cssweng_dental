// IMPORT
const express = require('express');
const hbs = require('hbs');
const exphbs = require('express-handlebars');
const mongoose = require('mongoose');
const path = require('path');
const fs = require('fs');
const session = require('express-session');

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
            avatar_found: function (value) {
                return fs.existsSync(`./public/avatars/${value}`)
                    ? value
                    : 'portrait.png';
            },
            match: function (v1, v2, options) {
                return v1 == v2 ? options.fn(this) : options.inverse(this);
            },
            capitalize: function (value) {
                return value
                    ? value.charAt(0).toUpperCase() + value.slice(1)
                    : '';
            },
            checkbox : function (value, input){
                if(input){
                    return input.includes(value) ? ' checked' : '';
                }
            },
            ifEquals : function (arg1, arg2, options) {
                return (arg1 == arg2) ? options.fn(this) : options.inverse(this);
            },

            formatJobDate : function(arg1) {
                var months = ["January", "February", "March", "April", "May", "June", "July", "August", "September", "October", "November", "December"];
                var days   = ["Sunday", "Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday"];
                return months[arg1.getMonth()] + ' ' + arg1.getDate() + ', ' + arg1.getFullYear() + ' ' + '(' + days[arg1.getDay()] + ')';
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

// create ./public/resumes directory if it doesn't exist
const resumesDir = './public/resumes';
if (!fs.existsSync(resumesDir)) {
    console.log(
        'resumes folder does not exist! creating ' + resumesDir + '...',
    );
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
    res.render('404', {
        active_session: req.session.user && req.cookies.user_sid,
        active_user: req.session.user,
        title: '404 Page Not Found | BookMeDental',
    });
});

// binds the server to a specific port
const port = 9090;
app.listen(port, function () {
    console.log('app listening at port ' + port);
});
