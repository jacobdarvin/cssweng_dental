const mongoose = require('mongoose');
const Job = require('../models/JobModel');
const Employer = require('../models/EmployerModel');
const Applicant = require('../models/ApplicantModel');
const Response = require('../models/EmpResponseModel');
const helper = require('../helpers/helper');
const pagination = require('../helpers/pagination');
const db = require('../models/db');

const fs = require('fs');
const path = require('path');
const { validationResult } = require('express-validator');

const buffer = fs.readFileSync(
    path.resolve(__dirname, '../public/json/us_cities_and_states.json'),
);

const citiesAndStates = JSON.parse(buffer);

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

        if(req.body.placement == 'Temporary') {
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

                        date_start: helper.parseDate(helper.sanitize(req.body.date_start)),
                        date_end: helper.parseDate(helper.sanitize(req.body.date_end)),

                        description: desc,
                        software: req.body.software,
                        experience: req.body.experience,
                        posted: 'just now',
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

                        date_start: helper.parseDate(helper.sanitize(req.body.date_start)),
                        date_end: helper.parseDate(helper.sanitize(req.body.date_end)),

                        description: desc,
                        software: req.body.software,
                        experience: req.body.experience,
                        posted: 'just now',
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

        let stateStatus = helper.sanitize(req.query.app_state);
        let cityStatus = helper.sanitize(req.query.app_city);

        let stateQuery = new Array();
        let cityQuery = new Array();


        if(stateStatus == undefined || stateStatus == '') {
            stateQuery = (Object.keys(citiesAndStates).sort());
        } else {
            stateQuery.push(stateStatus);
        }

        if(cityStatus == undefined || cityStatus == '') {
            cityQueryLoad = new Array();
            cityQueryLoad = (Object.values(citiesAndStates).sort());
            for(let i = 0; i < cityQueryLoad.length; i++) {
                for(let j = 0; j < cityQueryLoad[i].length; j++) {
                    cityQuery.push(cityQueryLoad[i][j]);
                }
            }
        } else {
            cityQuery.push(cityStatus);
        }

        let page = helper.sanitize(req.query.page);
        if (page == null) page = '1';

        let options = { lean: true, page: page, limit: 6 };

        let query = {
            account: { $exists: true },
            
            position: { $in: positionQuery },
            placement: { $in: placementQuery },

            city : { $in: cityQuery },
            state: { $in: stateQuery },
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

            if(stateStatus == null) {
                cityLink = '&app_city=&';
            } else {
                cityLink = '&app_city=' + cityStatus + '&';
            }

            if(cityStatus == null) {
                stateLink = 'app_state=';
            } else {
                stateLink = 'app_state=' + stateStatus;
            }

            let queryLinks = [];
            queryLinks.push(positionLink);
            queryLinks.push(placementLink);
            queryLinks.push(stateLink);
            queryLinks.push(cityLink);

            const {
                selectOptions,
                prevPageLink,
                nextPageLink,
                hasPrevPage,
                hasNextPage,
            } = pagination.configPagination(results, route, queryLinks);

            let resultWarn = "";

            if(results.total == 0) {
                resultWarn = "No Applicants Returned from Filter";
            }

            res.render('feed-app', {
                active_session: req.session.user && req.cookies.user_sid,
                active_user: req.session.user,
                title: 'Applicants | BookMeDental',
                filter_route: route,
                profile_active: true,
                applicants: results.docs,
                profile_route: `/applicants`,

                warn: resultWarn,

                //cities and states
                states: Object.keys(citiesAndStates).sort(),
                cities: req.body.clinic_state
                ? citiesAndStates[req.body.clinic_state].sort()
                : '',

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
                                    response: false,
                                  
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
        var appId = helper.sanitize(req.params.appId);
        var jobId = helper.sanitize(req.params.jobId);
        var type = helper.sanitize(req.params.type);
        var subject = helper.sanitize(req.body.subject);
        var body = helper.sanitize(req.body.body);

        console.log('inserting');

        db.findOne(Employer, {account: req.session.user}, '', function(result){
           
            var response = new Response({
                _id: new mongoose.Types.ObjectId(),
                applicantId: appId,
                accEmpId: req.session.user,
                type: type,
                subject: subject,
                jobId: jobId,
                body: body,
                clinic_name: result.clinicName,
                clinic_city: result.clinicAddress.city,
                clinic_state: result.clinicAddress.state,
                clinic_email: result.clinicContactEmails,
                clinic_phone: result.clinicPhone
            })

            db.insertOne(Response, response, function (flag){
                if(flag){
                    res.redirect(`/jobs/${jobId}/applicants`)
                }
            })

        })
    },

    sendContactResponse: function (req, res){
        var appId = helper.sanitize(req.params.appId);
        var type = helper.sanitize(req.params.type);
        var subject = helper.sanitize(req.body.subject);
        var body = helper.sanitize(req.body.body);

        console.log('inserting');
        
        db.findOne(Employer, {account: req.session.user}, '', function(result){
           
            var response = new Response({
                _id: new mongoose.Types.ObjectId(),
                applicantId: appId,
                accEmpId: req.session.user,
                type: type,
                subject: subject,
                body: body,
                clinic_name: result.clinicName,
                clinic_city: result.clinicAddress.city,
                clinic_state: result.clinicAddress.state,
                clinic_email: result.clinicContactEmails,
                clinic_phone: result.clinicPhone
            })

            db.insertOne(Response, response, function (flag){
                if(flag){
                    res.redirect('/search/applicants')
                }
            })

        })
    },

    EmpCloseJob: function (req, res) {
        var jobId = req.params.jobId;

        db.deleteOne(Job, {_id: jobId}, function(result){
            db.deleteOne(Response, {jobId: jobId}, function(result){
                res.redirect('/feed-emp');
            })
        })
    }
};

// enables to export controller object when called in another .js file
module.exports = dashboardEmpController;
