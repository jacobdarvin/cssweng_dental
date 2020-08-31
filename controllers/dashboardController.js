const db = require('../models/db');
const Applicant = require('../models/ApplicantModel');
const Employer = require('../models/EmployerModel');
const helper = require('../helpers/helper');

const dashboardController = {
    getDashboard: function (req, res, next) {
        // If there's no active session, redirect to login
        if (!req.session.user) res.redirect('/login');
        else {
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
                            if(view == 'dashboard-app') {
                                res.render(view, {
                                    active_session:
                                    req.session.user && req.cookies.user_sid,
                                    active_user: req.session.user,
                                    title: 'Dashboard | BookMeDental',
                                    profile_active: true,
                                    applicant_active: true,
                                    profileData: data.toObject()
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
                                                employer_active: true,
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
                    if(view == 'dashboard-app') {
                        res.render('form', {
                            active_session: req.session.user && req.cookies.user_sid,
                            active_user: req.session.user,
                            title: 'Sign Up | BookMeDental',
                            register_active: true,

                            states: Object.keys(citiesAndStates).sort(),
                        });
                    } else {
                        res.render('form-emp', {
                            active_session: req.session.user && req.cookies.user_sid,
                            active_user: req.session.user,
                            title: 'Sign Up | BookMeDental',
                            register_active: true,

                            states: Object.keys(citiesAndStates).sort(),
                        }); 
                    }
                }
            });
        }
    },
};

// enables to export controller object when called in another .js file
module.exports = dashboardController;
