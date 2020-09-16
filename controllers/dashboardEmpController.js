const mongoose = require('mongoose');
const Job = require('../models/JobModel');
const Employer = require('../models/EmployerModel');
const Applicant = require('../models/ApplicantModel');
const helper = require('../helpers/helper');
const pagination = require('../helpers/pagination');
const db = require('../models/db');
const fs = require('fs');
const { validationResult } = require('express-validator');

const dashboardEmpController = {
    getCreateJob: function (req, res) {
        db.findOne(Employer, { account: req.session.user }, '', function (result) {
            if (result) {
                res.render('create', {
                    active_session: req.session.user && req.cookies.user_sid,
                    active_user: req.session.user,
                    title: 'Post Job | BookMeDental',
                    profile_active: true,
                    emp: result.toObject(),

                    // navbar indicator
                    accType: req.session.accType,
                });
            } else {
                res.render('404', {
                    active_session: req.session.user && req.cookies.user_sid,
                    active_user: req.session.user,
                    title: '404 Page Not Found | BookMeDental',
                });
            }
        });
    },

    postCreateJob: function (req, res) {
        var desc = helper.sanitize(req.body.jobdescription);

        //check date if valid
        var [year, month, day] = req.body.date.split('-');
        var input = Date.UTC(
            Number(year),
            Number(month) - 1, // parameter month starts at 0
            Number(day),
        );
        var now = Date.now();

        if (input < now) {
            db.findOne(Employer, { account: req.session.user }, '', function (result) {
                res.render('create', {
                    active_session: req.session.user && req.cookies.user_sid,
                    active_user: req.session.user,
                    title: 'Post Job | BookMeDental',
                    profile_active: true,
                    input: req.body,
                    emp: result.toObject(),
                    dateError:
                        'Invalid date. Please enter a date that comes after the date today.',
                });
            })
           
        } else {
            db.findOne(Employer, { account: req.session.user }, '', function (
                result,
            ) {
                console.log('inserting');

                var job = new Job({
                    _id: new mongoose.Types.ObjectId(),
                    employer: result._id,
                    placement: req.body.placement,
                    position: req.body.position,
                    clinicName: result.clinicName,
                    date: req.body.date,
                    description: desc,
                    software: req.body.software,
                    experience: req.body.experience,
                    posted: 'just then',
                    clinic_city: result.clinicAddress.city,
                    clinic_state: result.clinicAddress.state,
                });

                db.insertOne(Job, job, function (flag) {
                    if (flag) {
                        console.log('inserted');
                        helper.updatePostedDate();
                        res.redirect('/dashboard');
                    }
                });
            });
        }
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

        let placementQuery = pagination.initQueryArray(
            helper.sanitize(req.query.placement),
            ['Permanent Work', 'Temporary Work'],
        );
        
        let positionQuery = pagination.initQueryArray(
            helper.sanitize(req.query.position),
            ['Dentist', 'Dental Hygienist', 'Front Desk', 'Dental Assistant'],
        );

        let page = helper.sanitize(req.query.page);
        if (page == null) page = '1';

        let options = { lean: true, page: page, limit: 6 };

        let query = {
            account: { $exists: true },
            position: { $in: positionQuery },
            placement: { $in: placementQuery },
        };

        Applicant.paginate(query, options, function (err, results) {
            if (err) throw err;
            let route = '/search/applicants';

            let placementLink = pagination.createQueryLink(
                placementQuery,
                'placement',
            );
            let positionLink = pagination.createQueryLink(
                positionQuery,
                'position',
            );

            let queryLinks = [];
            queryLinks.push(positionLink);
            queryLinks.push(placementLink);

            const {
                selectOptions,
                prevPageLink,
                nextPageLink,
                hasPrevPage,
                hasNextPage,
            } = pagination.configPagination(results, route, queryLinks);

            res.render('feed-app', {
                active_session: req.session.user && req.cookies.user_sid,
                active_user: req.session.user,
                title: 'Applicants | BookMeDental',
                filter_route: route,
                profile_active: true,
                applicants: results.docs,
                profile_route: `/applicants`,

                // Pagination
                selectOptions: selectOptions,
                hasPrev: hasPrevPage,
                hasNext: hasNextPage,
                prevPageLink: prevPageLink,
                nextPageLink: nextPageLink,
            });
        });
    },

    getAppProfile: function (req, res, next) {
        if (!(req.session.user && req.cookies.user_sid)) {
            res.redirect('/login');
            return;
        }

        if (req.session.accType != 'employer') {
            res.status(403).send('Forbidden: you are not an employer');
            return;
        }

        var sntAppId = helper.sanitize(req.params.appId);
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

                            // additional config
                            from: 'search',
                        });
                    },
                );
            } else {
                res.status(404);
                next();
            }
        });
    },

    getAppResume : function (req, res){
        var resumePath = "./public/resumes/" + req.params.resume;

        db.findOne(Applicant, {resume: req.params.resume}, '', function(result){
            var resumeFile = result.fName + "_" + result.lName + ".pdf"
            if (fs.existsSync(resumePath)) {
                res.download(resumePath, resumeFile);
            }
        })
    },

    updateClinicProfile: function (req, res){
        console.log("yes");
        // var errors = validationResult(req);

        // if (!errors.isEmpty()) {
        //     errors = errors.errors;

        //     var details = {};

        //     for (let i = 0; i < errors.length; i++)
        //         details[errors[i].param + 'Error'] = errors[i].msg;
            
        //     res.render('dashboard-emp', {})
        // }



        var email = helper.sanitize(req.body.clinic_email);
        var phone = helper.sanitize(req.body.clinic_phone);

        console.log(email);
        console.log(phone);

        // helper.updatePostedDate();
        // res.redirect('/dashboard');
    }
};

// enables to export controller object when called in another .js file
module.exports = dashboardEmpController;
