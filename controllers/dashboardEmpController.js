const mongoose = require('mongoose');
const Job = require('../models/JobModel');
const Employer = require('../models/EmployerModel');
const Applicant = require('../models/ApplicantModel');
const Response = require('../models/EmpResponseModel');
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
                    title: 'Create Job | BookMeDental',
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
        var [year, month, day] = req.body.date_start.split('-');

        var input = Date.UTC(
            Number(year),
            Number(month) - 1, // parameter month starts at 0
            Number(day),
        );

        var [year, month, day] = req.body.date_end.split('-');

        var input_end = Date.UTC(
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
                    title: 'Create Job | BookMeDental',
                    profile_active: true,
                    input: req.body,
                    emp: result.toObject(),
                    dateError:
                        'Invalid date. Please enter a date that comes after the date today.',
                });
            })
        } else if (input_end <= input) {
            db.findOne(Employer, { account: req.session.user }, '', function (result) {
                res.render('create', {
                    active_session: req.session.user && req.cookies.user_sid,
                    active_user: req.session.user,
                    title: 'Create Job | BookMeDental',
                    profile_active: true,
                    accType: req.session.accType,
                    emp: result.toObject(),
                    input: req.body,
                    dateError:
                        'Invalid date. Please enter a date that comes after the start date.',
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

                    date_start: req.body.date_start,
                    date_end: req.body.date_end,

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
        db.findOne(Response, {accEmpId: req.session.user, applicantId: sntAppId, type: 'contact'}, '', function (response){
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

                            if(response){
                                res.render('details-app', {
                                    active_session:
                                    req.session.user && req.cookies.user_sid,
                                    active_user: req.session.user,
                                    title: `Applicant ${applicant.fName} ${applicant.lName} | BookMeDental`,
                                    appData: result.toObject(),
                                    profile_active: true,
                                    type: 'contact',
                                    response: true,
        
                                    // additional config
                                    from: 'search',
                                });
                            } else{
                                res.render('details-app', {
                                    active_session:
                                    req.session.user && req.cookies.user_sid,
                                    active_user: req.session.user,
                                    title: `Applicant ${applicant.fName} ${applicant.lName} | BookMeDental`,
                                    appData: result.toObject(),
                                    profile_active: true,
                                    type: 'contact',
                                  
                                    // additional config
                                    from: 'search',
                                });
                            }                            
                        },
                    );
                } else {
                    res.status(404);
                    next();
                }
            });
        })
       

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
        var email = helper.sanitize(req.body.clinic_email);
        var phone = helper.sanitize(req.body.clinic_phone);

        db.updateOne(Employer, {account: req.session.user}, {clinicContactEmails: email, clinicPhone: phone}, function(result){
            if(result){
                res.redirect('/dashboard');
            }
        })
    },

    sendHireResponse: function (req, res){
        console.log("hello");
        console.log(req.params.jobId);
        console.log(req.params.appId);
        console.log(req.params.type);

        var appId = helper.sanitize(req.params.appId);
        var jobId = helper.sanitize(req.params.jobId);
        var type = helper.sanitize(req.params.type);
        var subject = helper.sanitize(req.body.subject);
        var body = helper.sanitize(req.body.body);

        console.log('inserting');

        var response = new Response({
            _id: new mongoose.Types.ObjectId(),
            jobId: jobId,
            accEmpId: req.session.user,
            applicantId: appId,
            type: type,
            subject: subject,
            body: body
        })

        db.insertOne(Response, response, function (flag){
            if(flag){
                res.redirect(`/jobs/${jobId}/applicants`)
            }
        })
    },

    sendContactResponse: function (req, res){
        console.log("hello");
        console.log(req.params.appId);
        console.log(req.params.type);
        console.log(req.body);

        var appId = helper.sanitize(req.params.appId);
        var type = helper.sanitize(req.params.type);
        var subject = helper.sanitize(req.body.subject);
        var body = helper.sanitize(req.body.body);

        console.log('inserting');

        var response = new Response({
            _id: new mongoose.Types.ObjectId(),
            applicantId: appId,
            accEmpId: req.session.user,
            type: type,
            subject: subject,
            body: body
        })

        db.insertOne(Response, response, function (flag){
            if(flag){
                res.redirect('/search/applicants')
            }
        })
    },
};

// enables to export controller object when called in another .js file
module.exports = dashboardEmpController;
