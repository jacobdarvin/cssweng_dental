// import sessions
const express = require('express');
const session = require('express-session');
const database = require('../models/db.js');

const cookieParser = require('cookie-parser');
const bodyParser = require('body-parser');

// import module `controller` from `./controllers/controller.js`
const indexController = require('../controllers/indexController');
const profileController = require('../controllers/profileController');
const registerController = require('../controllers/registerController');
const loginController = require('../controllers/loginController');
const adminController = require('../controllers/adminController');
const formController = require('../controllers/formController');

// import validation script
const validation = require('../helpers/validation.js');

const app = express();

//Init Cookie and Body Parser
app.use(bodyParser.urlencoded({ extended: true }));
app.use(cookieParser());

//Init Sessions
app.use(
    session({
        key: 'user_sid', //user session id
        secret: 'lifecouldbedream',
        resave: false,
        saveUninitialized: true,
        store: database.sessionStore,
        cookie: {
            maxAge: 1000 * 60 * 60 * 24, // 1 Day.
        },
    }),
);

app.use((req, res, next) => {
    if (req.cookies.user_sid && !req.session.user) {
        res.clearCookie('user_sid');
    }
    next();
});

// call function getIndex when client sends a request for '/' defined in routes.js
app.get('/form', function (req, res) {
    res.render('form', {
        active_session: (req.session.user && req.cookies.user_sid),
        active_user: req.session.user,
        title: 'Sign Up | BookMeDental',
        login_active: true,
    });
});
app.post('/form', validation.formValidation, formController.postApplicantReg);

app.get('/form-emp', function(req, res) {
    res.render('form-emp', {
        active_session: (req.session.user && req.cookies.user_sid),
        active_user: req.session.user,
        title: 'Sign Up | BookMeDental',
        login_active: true,
    })
});

// /admin routes
// app.get('/admin', adminController.getAdmin);
app.get('/employers', adminController.getEmployerList);

app.get('/admin', function(req, res) {
    res.render('admin', {
        active_session: (req.session.user && req.cookies.user_sid),
        active_user: req.session.user,
        title: 'Admin | BookMeDental',
        admin_active: true,
    })
});

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

//Login route
app.get('/login', loginController.getLogIn);
app.post('/login', loginController.postLogIn);

//Logout Route
app.get('/logout', function (req, res) {
    req.logout;
    req.session.destroy(function (err) {});
    res.redirect('/');
});

// enables to export app object when called in another .js file
module.exports = app;
