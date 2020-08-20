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

// import multer for file uploads
var multer = require('multer');

// var avatarStorage = multer.diskStorage({
//     destination:  './public/avatars',
//     filename: function(req, file, cb) {
//         cb(null, file.originalname)
//     }
// }),
// avatarUpload = multer({ storage: avatarStorage }).single('avatar');

// var resumeStorage = multer.diskStorage({
//     destination:  './public/resumes',
//     filename: function(req, file, cb) {
//         cb(null, file.originalname)
//     }
// }),
// resumeUpload = multer({ storage: resumeStorage }).single('resume');

var storage = multer.diskStorage({
    destination: function (req, file, cd) {
        if (file.fieldname === 'avatar') {
            cd(null, './public/avatars');
        } else if (file.fieldname === 'resume') {
            cd(null, './public/resumes');
        }
    },
    filename: function (req, file, cd) {
        cd(null, file.originalname);
    },
});

var upload = multer({ storage: storage });
var uploadFilter = upload.fields([
    { name: 'avatar', maxCount: 1 },
    { name: 'resume', maxCount: 1 },
]);

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

app.get('/cities', formController.getCities);
app.get('/form', formController.getApplicantReg);
app.post(
    '/form',
    uploadFilter,
    validation.formValidation(),
    formController.postApplicantReg,
);

app.get('/form-emp', formController.getFormEmp);
app.post(
    '/form-emp',
    validation.formEmpValidation(),
    formController.postFormEmp,
);

app.get('/features', function (req, res) {
    res.render('features', {
        active_session: req.session.user && req.cookies.user_sid,
        active_user: req.session.user,
        title: 'Features | BookMeDental',
        features_active: true,
    });
});

app.get('/offers', function (req, res) {
    res.render('offers', {
        active_session: req.session.user && req.cookies.user_sid,
        active_user: req.session.user,
        title: 'Offers | BookMeDental',
    });
});

// /admin routes
app.get('/employers', adminController.getEmployerList);
app.get('/applicants', adminController.getApplicantList);
app.get('/admin', adminController.getAdmin);

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
