const mongoose = require('mongoose');
const Job = require('../models/JobModel');
const Employer = require('../models/EmployerModel');
const Applicant = require('../models/ApplicantModel');
const helper = require('../helpers/helper');
const db = require('../models/db');
const sanitize = require('mongo-sanitize');

const dashboardEmpController = {
    getCreateJob: function (req, res) {
        res.render('create', {
            active_session: req.session.user && req.cookies.user_sid,
            active_user: req.session.user,
            title: 'Post Job | BookMeDental',
            profile_active: true,
        });
    },

    postCreateJob: function (req, res) {
        var desc = helper.sanitize(req.body.jobdescription);
        var software = helper.sanitize(req.body.software);

        db.findOne(Employer, { account: req.session.user }, '', function (
            result,
        ) {
            console.log('inserting');

            var job = new Job({
                _id: new mongoose.Types.ObjectId(),
                employer: result._id,
                placement: req.body.placement,
                position: req.body.position,
                location: req.body.clinic,
                date: req.body.date,
                description: desc,
                software: software,
                experience: req.body.experience,
            });

            db.insertOne(Job, job, function (flag) {
                if (flag) {
                    console.log('inserted');
                    res.redirect('/dashboard');
                }
            });
        });
    },

    getApplicantsFromSearch: function (req, res) {
        if (!(req.session.user && req.cookies.user_sid)) {
            res.redirect('/login');
            return;
        }

        if (req.session.accType != 'employer') {
            res.status(403).send('Forbidden: you are not an employer');
            return;
        }

        db.findMany(
            Applicant,
            { account: { $exists: true } },
            'avatar fName lName position',
            function (applicants) {
                if (applicants) {
                    res.render('feed-app', {
                        active_session:
                            req.session.user && req.cookies.user_sid,
                        active_user: req.session.user,
                        title: 'Applicants | BookMeDental',
                        filter_route: req.path,
                        profile_active: true,
                        applicants: applicants,
                        profile_route: `/applicants`,
                    });
                } else {
                    res.status(404);
                    next();
                }
            },
        );
    },

    getAppProfile: function (req, res) {
        if (!(req.session.user && req.cookies.user_sid)) {
            res.redirect('/login');
            return;
        }

        if (req.session.accType != 'employer') {
            res.status(403).send('Forbidden: you are not an employer');
            return;
        }

        var sntAppId = sanitize(req.params.appId);
        db.findOne(Applicant, { _id: sntAppId }, '', function (applicant) {
            if (applicant) {
                applicant.populate(
                    {
                        path: 'account',
                        select: 'accEmail -_id',
                        options: { lean: true },
                    },
                    function (err, result) {
                        if (err) throw err;

                        res.render('details-app', {
                            active_session:
                                req.session.user && req.cookies.user_sid,
                            active_user: req.session.user,
                            title: `Applicant ${applicant.fName} ${applicant.lName} | BookMeDental`,
                            appData: result.toObject(),
                            profile_active: true,
                        });
                    },
                );
            } else {
                res.status(404);
                next();
            }
        });
    },
};

// enables to export controller object when called in another .js file
module.exports = dashboardEmpController;
