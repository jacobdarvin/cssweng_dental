const db = require('../models/db');
const sanitize = require('mongo-sanitize');

const Job = require('../models/JobModel');
const Applicant = require('../models/ApplicantModel');
const Employer = require('../models/EmployerModel');
const app = require('../routes/routes');

const feedController = {
    getEmpFeed: function (req, res) {
        if (!(req.session.user && req.cookies.user_sid)) {
            res.redirect('/login');
            return;
        }

        console.log('getFiltered request');

        let positionQuery = new Array();
        let placementQuery = new Array();

        let positionStatus = sanitize(req.query.position);
        let placementStatus = sanitize(req.query.placement);

        let dateStatus = sanitize(req.query.date);

        if (positionStatus) {
            positionQuery = positionStatus;
        } else {
            positionQuery.push(
                'Dentist',
                'Dental Hygienist',
                'Front Desk',
                'Dental Assistant',
            );
        }

        if (placementStatus) {
            placementQuery = placementStatus;
        } else {
            placementQuery.push('Permanent', 'Temporary');
        }

        console.log(positionQuery);
        console.log(placementQuery);

        db.findOne(Employer, { account: req.session.user }, '_id', function (
            emp,
        ) {
            let query = {
                employer: emp._id,
                position: { $in: positionQuery },
                placement: { $in: placementQuery },
            };

            db.findMany(Job, query, '', function (result) {
                Employer.populate(
                    result,
                    { path: 'employer', options: { lean: true } },
                    function (err, data) {
                        if (err) throw err;
                        res.render('feed', {
                            active_session:
                                req.session.user && req.cookies.user_sid,
                            active_user: req.session.user,
                            title: 'Job Feed | BookMeDental',
                            filter_route: '/feed-emp',
                            is_employer: true,
                            profile_active: true,
                            jobs: data,
                        });
                    },
                );
            });
        });
    },

    getAppFeed: function (req, res) {
        if (!(req.session.user && req.cookies.user_sid)) {
            res.redirect('/login');
            return;
        }
        console.log('queries: ' + req.query);
        // console.log('params: ' + req.params)
        console.log('getFiltered request');

        let positionQuery = new Array();
        let placementQuery = new Array();

        let positionStatus = sanitize(req.query.position);
        let placementStatus = sanitize(req.query.placement);

        let dateStatus = sanitize(req.query.date);

        if (positionStatus) {
            positionQuery = positionStatus;
        } else {
            positionQuery.push(
                'Dentist',
                'Dental Hygienist',
                'Front Desk',
                'Dental Assistant',
            );
        }

        if (placementStatus) {
            placementQuery = placementStatus;
        } else {
            placementQuery.push('Permanent', 'Temporary');
        }

        console.log(positionQuery);
        console.log(placementQuery);

        let query = {
            position: { $in: positionQuery },
            placement: { $in: placementQuery },
        };

        db.findMany(Job, query, '', function (result) {
            Employer.populate(
                result,
                { path: 'employer', options: { lean: true } },
                function (err, data) {
                    if (err) throw err;
                    res.render('feed', {
                        active_session:
                            req.session.user && req.cookies.user_sid,
                        active_user: req.session.user,
                        title: 'Applicant Feed | BookMeDental',
                        filter_route: '/feed-app',
                        profile_active: true,
                        jobs: data,
                    });
                },
            );
        });
    },

    getIndivJob: function (req, res) {
        if (!(req.session.user && req.cookies.user_sid)) {
            res.redirect('/login');
            return;
        }

        if (req.session.accType != 'applicant') {
            res.status(403).send('Forbidden: you are not an applicant');
            return;
        }

        db.findOne(Applicant, { account: req.session.user }, '_id', function (
            applicant,
        ) {
            db.findOne(Job, { _id: req.params.id }, '', function (job) {
                if (job) {
                    job.populate('employer').execPopulate(function (err, data) {
                        if (err) throw err;
                        res.render('details', {
                            active_session:
                                req.session.user && req.cookies.user_sid,
                            active_user: req.session.user,
                            title:
                                data.placement +
                                ' ' +
                                data.position +
                                ' | ' +
                                'BookMeDental',
                            profile_active: true,
                            applied: data.applicants.includes(applicant._id),
                            jobData: data.toObject(),
                        });
                    });
                }
            });
        });
    },

    postIndivJob: function (req, res) {
        if (!(req.session.user && req.cookies.user_sid)) {
            res.redirect('/login');
            return;
        }

        db.findOne(Applicant, { account: req.session.user }, '_id', function (
            applicant,
        ) {
            console.log(applicant);

            db.updateOne(
                Job,
                { _id: req.body.jobId },
                { $push: { applicants: applicant._id } },
                function (result) {
                    if (result) {
                        res.redirect('/feed-app');
                    } else res.redirect(`/jobs/${req.body.jobId}`);
                },
            );
        });
    },

    getJobApplicants: function (req, res, next) {
        if (!(req.session.user && req.cookies.user_sid)) {
            res.redirect('/login');
            return;
        }

        if (req.session.accType != 'employer') {
            res.status(403).send('Forbidden: you are not an employer');
            return;
        }

        db.findOne(Job, { _id: req.params.id }, 'applicants', function (job) {
            if (job) {
                job.populate(
                    {
                        path: 'applicants',
                        select: 'avatar fName lName position',
                        options: { lean: true },
                    },
                    function (err, data) {
                        if (err) throw err;

                        res.render('feed-app', {
                            active_session:
                                req.session.user && req.cookies.user_sid,
                            active_user: req.session.user,
                            title: 'Applicants | BookMeDental',
                            filter_route: `/jobs/${req.params.id}/applicants`,
                            profile_active: true,
                            applicants: data.applicants,
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
module.exports = feedController;
