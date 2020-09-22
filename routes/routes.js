// IMPORT
const express = require('express'); //EXPRESS
const session = require('express-session'); //EXPRESS-SESSIONS
const database = require('../models/db.js'); //CONNECT DB

const cookieParser = require('cookie-parser'); //COOKIES
const bodyParser = require('body-parser'); //BODY PARSING

const validation = require('../helpers/validation.js'); //FORM VALIDATION
var multer = require('multer'); //FILE UPLOAD
// IMPORT

// import module `controller` from `./controllers/controller.js`
const indexController = require('../controllers/indexController');

//DASHBOARD CONTROLLER
const dashboardController = require('../controllers/dashboardController');
const dashboardEmpController = require('../controllers/dashboardEmpController');
const dashboardAppController = require('../controllers/dashboardAppController');
//DASHBOARD CONTROLLER

//FEED CONTROLLER
const feedController = require('../controllers/feedController');
//FEED CONTROLLER

//ACCOUNT LOG CONTROLLER
const registerController = require('../controllers/registerController');
const loginController = require('../controllers/loginController');
//ACCOUNT LOG CONTROLLER

const adminController = require('../controllers/adminController');
const formController = require('../controllers/formController');

//MULTER INIT
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
//MULTER INIT

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

app.get('/states', formController.getStates);
app.get('/cities', formController.getCities);
app.get('/form/:fappId', formController.getApplicantReg);
app.post(
    '/form',
    uploadFilter,
    validation.formValidation(),
    formController.postApplicantReg,
);

app.get('/form-emp/:fempId', formController.getFormEmp);
app.post(
    '/form-emp',
    validation.formEmpValidation(),
    formController.postFormEmp,
);

// /admin | ADMIN

app.get('/employers', adminController.getEmployerList);
app.get('/applicants', adminController.getApplicantList);
app.get('/jobs', adminController.getJobList);

app.get('/admin', adminController.getAdmin);
// /admin | ADMIN

// /home | HOME
app.get('/', indexController.getIndex);
app.get('/home', indexController.getIndex);

app.get('/features', function (req, res) {
    res.render('features', {
        active_session: req.session.user && req.cookies.user_sid,
        active_user: req.session.user,
        title: 'Features | BookMeDental',

        // navbar indicator
        accType: req.session.accType,

        features_active: true,
    });
});

app.get('/terms', function (req, res) {
    res.render('terms', {
        active_session: req.session.user && req.cookies.user_sid,
        active_user: req.session.user,
        title: 'Terms & Conditions | BookMeDental',
    });
});

app.get('/offers', function (req, res) {
    res.render('offers', {
        active_session: req.session.user && req.cookies.user_sid,
        active_user: req.session.user,
        title: 'Offers | BookMeDental',
    });
});
// /home | HOME

// /details | JOB
app.get('/details', function (req, res) {
    res.render('details', {
        active_session: req.session.user && req.cookies.user_sid,
        active_user: req.session.user,
        title: 'Details | BookMeDental',
    });
});

app.get('/details-app', function (req, res) {
    res.render('details-app', {
        active_session: req.session.user && req.cookies.user_sid,
        active_user: req.session.user,
        title: 'Details | BookMeDental',
    });
});
// /dashboard-type / DASHBOARD
app.get('/dashboard', dashboardController.getDashboard);
app.post(
    '/dashboard/applicant/:appId/edit-description',
    dashboardAppController.postEditDescription,
);
app.get(
    '/dashboard/applicant/data',
    dashboardAppController.getPopulateEditProfile,
);
app.post(
    '/dashboard/applicant/:appId/edit-profile',
    validation.editAppProfileValidation(),
    dashboardAppController.postEditProfile,
);
app.post(
    '/dashboard/applicant/:appId/edit-wage',
    dashboardAppController.postEditWage,
);
app.post(
    '/dashboard/applicant/:appId/edit-avatar',
    uploadFilter,
    dashboardAppController.postEditAvatar,
);
// /dashboard-type / DASHBOARD

// /updateClinicProfile
app.post('/updateClinicProfile', dashboardEmpController.updateClinicProfile);

// post job / CREATE
app.get('/create/:jobId', dashboardEmpController.getCreateJob);
// post job / CREATE
app.post('/create', dashboardEmpController.postCreateJob);
app.get('/search/applicants', dashboardEmpController.getApplicantsFromSearch);
app.get('/applicants/:appId', dashboardEmpController.getAppProfile); // view applicant from applicant search

// /feed / FEED
app.get('/feed-emp', feedController.getEmpFeed);
app.get('/feed-app', feedController.getAppFeed);
app.get('/feed-app/applied-jobs', feedController.getAppliedAppFeed);
app.get('/jobs/:jobId', feedController.getIndivJob);
app.post('/jobs/:jobId', feedController.postIndivJob);
app.get('/jobs/:jobId/applicants', feedController.getJobApplicants);
app.get('/jobs/:jobId/applicants/:appId', feedController.getAppProfile); // view applicant from job post's applicants
app.get('/getAppResume/:resume', dashboardEmpController.getAppResume);
// /feed / FEED

// employer / sendResponse
app.post('/sendHireResponse/:appId/job/:jobId/type/:type', dashboardEmpController.sendHireResponse);
app.post('/sendContactResponse/:appId/type/:type', dashboardEmpController.sendContactResponse);
// employer / sendResponse


// /register | REGISTER
app.get('/register', registerController.getRegister);
app.post(
    '/register',
    validation.signupValidation(),
    registerController.postRegister,
);
// /register | REGISTER

//login | LOGIN
app.get('/login', loginController.getLogIn);
app.post('/login', loginController.postLogIn);
//login | LOGIN

//logout | LOGOUT
app.get('/logout', function (req, res) {
    req.logout;
    req.session.destroy(function (err) {});
    res.redirect('/');
});
//logout | LOGOUT

// enables to export app object when called in another .js file
module.exports = app;
