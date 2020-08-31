const db = require('../models/db');
const Applicant = require('../models/ApplicantModel');
const Employer = require('../models/EmployerModel');
const dac = require('./dashboardAppController');

const dashboardController = {
    getDashboard: function (req, res, next) {
        // If there's no active session, redirect to login
        if (!req.session.user) res.redirect('/login');
        else {
            var renderOptions = {
                active_session: req.session.user && req.cookies.user_sid,
                active_user: req.session.user,
                title: 'Dashboard | BookMeDental',
                profile_active: true,
                accType: req.session.accType,
            };

            var view, model;
            if (req.session.accType == 'applicant') {
                view = 'dashboard-app';
                model = Applicant;
            } else {
                view = 'dashboard-emp';
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

                            renderOptions.profileData = data.toObject();

                            if (view == 'dashboard-app') {
                                renderOptions.search_job_route = dac.createSearchJobRoute(
                                    data,
                                );
                                dac.getJobMatchCount(data)
                                    .then(n => {
                                        renderOptions.job_match_count = n;
                                        return dac.getMatchingJobs(data);
                                    })
                                    .then(docs => {
                                        renderOptions.matching_jobs = docs;
                                        res.render(view, renderOptions);
                                    })
                                    .catch(err => {
                                        console.log(err);
                                        res.status(404);
                                        next();
                                    });
                            } else {
                                res.render(view, renderOptions);
                            }
                        });
                } else {
                    res.redirect(
                        req.session.accType == 'applicant'
                            ? '/form'
                            : '/form-emp',
                    );
                }
            });
        }
    },
};

// enables to export controller object when called in another .js file
module.exports = dashboardController;
