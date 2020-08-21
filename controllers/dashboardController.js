const db = require('../models/db');
const Applicant = require('../models/ApplicantModel');
const Employer = require('../models/EmployerModel');

const dashboardController = {
    // render log-in page when client requests '/' defined in routes.js
    getProfile: function (req, res, next) {
        // If there's no active session, redirect to login
        if (!req.session.user) res.redirect('/login');
        else {
            var view, model;
            if (req.session.accType == 'applicant') {
                view = 'profile';
                model = Applicant;
            } else {
                view = 'profile-emp';
                model = Employer;
            }

            db.findOne(model, { account: req.session.user }, '', function (
                result,
            ) {
                if (result) {
                    result
                        .populate('account')
                        .execPopulate(function (err, data) {
                            if (err) throw err;

                            res.render(view, {
                                active_session:
                                    req.session.user && req.cookies.user_sid,
                                active_user: req.session.user,
                                title: 'Dashboard | BookMeDental',
                                profile_active: true,

                                profileData: data
                            });
                        });
                }
            });
        }
    },
};

// enables to export controller object when called in another .js file
module.exports = dashboardController;
