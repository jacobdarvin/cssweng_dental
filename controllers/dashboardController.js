const db = require('../models/db');
const Applicant = require('../models/ApplicantModel');
const Employer = require('../models/EmployerModel');
const Job = require('../models/JobModel');
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
            let adminUsing = false;

            if (req.session.accType == 'applicant') {
                view = 'dashboard-app';
                model = Applicant;
            } else if (req.session.accType == 'employer') {
                view = 'dashboard-emp';
                model = Employer;
            } else {
                res.redirect('/admin');
                adminUsing = true;
            }

            if (!adminUsing) {
                helper.updatePostedDate();
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
                                    Promise.all([
                                        dac.createSearchJobRoute(data),
                                        dac.getJobMatchCount(data),
                                        dac.getMatchingJobs(data),
                                        dac.getAppliedJobsCount(data._id),
                                        dac.getAppliedJobs(data._id),
                                    ])
                                        .then(results => {
                                            const [
                                                searchJobRoute,
                                                nMatchingJobs,
                                                matchingJobs,
                                                nAppliedJobs,
                                                appData,
                                            ] = results;
                                            // console.log(matchingJobs);
                                            // console.log(appData.appliedJobs);
                                            renderOptions.search_job_route = searchJobRoute;
                                            renderOptions.matching_jobs_count = nMatchingJobs;
                                            renderOptions.matching_jobs = matchingJobs;
                                            renderOptions.applied_jobs_count = nAppliedJobs;
                                            renderOptions.applied_jobs =
                                                appData.appliedJobs;
                                            renderOptions.warn_matching_jobs =
                                                nMatchingJobs === 0
                                                    ? 'You have no matching jobs based on your profile details.'
                                                    : '';
                                            renderOptions.warn_applied_jobs =
                                                nAppliedJobs === 0
                                                    ? 'You have no active jobs available.'
                                                    : '';
                                            res.render(view, renderOptions);
                                        })
                                        .catch(error => {
                                            console.log(error);
                                            res.status(404);
                                            next();
                                        });
                                } else {
                                    var query = helper.getActiveJobPost(
                                        data._id,
                                    );
                                    query.exec(function (err, result) {
                                        if (err) throw err;
                                        helper
                                            .getPermCount(data._id)
                                            .then(function (perm_count) {
                                                helper
                                                    .getTempCount(data._id)
                                                    .then(function (
                                                        temp_count,
                                                    ) {
                                                        res.render(view, {
                                                            active_session:
                                                                req.session
                                                                    .user &&
                                                                req.cookies
                                                                    .user_sid,
                                                            active_user:
                                                                req.session
                                                                    .user,
                                                            title:
                                                                'Dashboard | BookMeDental',
                                                            profile_active: true,
                                                            accType:
                                                                req.session
                                                                    .accType,
                                                            profileData: data.toObject(),
                                                            activeJob: result,
                                                            temp: temp_count,
                                                            perma: perm_count,
                                                            status:
                                                                data.account
                                                                    .accStatus,
                                                        });
                                                    });
                                            });
                                    });
                                }
                            });
                    } else {
                        helper.updatePostedDate();
                        res.redirect(
                            req.session.accType == 'applicant'
                                ? '/form/' + req.session.user
                                : '/form-emp/' + req.session.user,
                        );
                    }
                });
            }
        }
    },
};

// enables to export controller object when called in another .js file
module.exports = dashboardController;
