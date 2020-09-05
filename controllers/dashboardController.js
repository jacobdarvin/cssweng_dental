const db = require('../models/db');
const Applicant = require('../models/ApplicantModel');
const Employer = require('../models/EmployerModel');
const dac = require('./dashboardAppController');
const helper = require('../helpers/helper');


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
                                        renderOptions.matching_jobs_count = n;
                                        return dac.getMatchingJobs(data);
                                    })
                                    .then(jobs => {
                                        renderOptions.matching_jobs = jobs;
                                        return dac.getAppliedJobsCount(data._id)
                                    }).then(n => {
                                        renderOptions.applied_jobs_count = n;
                                        return dac.getAppliedJobs(data._id);
                                    })
                                    .then(appData => {
                                        renderOptions.applied_jobs = appData.appliedJobs;
                                        res.render(view, renderOptions);
                                    })
                                    .catch(err => {
                                        console.log(err);
                                        res.status(404);
                                        next();
                                    });
                            } else {
                                var query = helper.getActiveJobPost(data._id);
                                query.exec(function(err, result){
                                    if(err) throw err;
                                    helper.getPermCount(data._id).then(function(perm_count){
                                        helper.getTempCount(data._id).then(function(temp_count){
                                            res.render(view, {
                                                active_session:
                                                req.session.user && req.cookies.user_sid,
                                                active_user: req.session.user,
                                                title: 'Dashboard | BookMeDental',
                                                profile_active: true,
//                                                 employer_active: true,
                                                accType: req.session.accType,
                                                profileData: data.toObject(),
                                                activeJob: result,
                                                temp: temp_count,
                                                perma: perm_count
                                            });
                                        })
                                    })
                                })
                               
                            }
                        });
                } else {
                    res.redirect(
                        req.session.accType == 'applicant'
                            ? '/form/' + req.session.user
                            : '/form-emp/' + req.session.user ,
                    );
                }
            });
        }
    },
};

// enables to export controller object when called in another .js file
module.exports = dashboardController;
