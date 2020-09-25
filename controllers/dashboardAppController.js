const fs = require('fs');
const mongoose = require('mongoose');
const db = require('../models/db');
const Job = require('../models/JobModel');
const Response = require('../models/EmpResponseModel');
const Applicant = require('../models/ApplicantModel');
const Employer = require('../models/EmployerModel');
const { validationResult } = require('express-validator');
const helper = require('../helpers/helper');
const { ObjectId } = require('mongodb');

const dashboardAppController = {
    createSearchJobRoute: function (appDoc) {
        return `/feed-app?placement=${appDoc.placement.replace(
            ' Work',
            '',
        )}&position=${appDoc.position}&clinic_state=${
            appDoc.state
        }&clinic_city=${appDoc.city}`;
    },

    getJobMatchCount: function (appDoc) {
        return Job.countDocuments({
            placement: appDoc.placement.replace(' Work', ''),
            position: appDoc.position,
            clinic_state: appDoc.state,
            clinic_city: appDoc.city,
        }).exec();
    },

    getMatchingJobs: function (appDoc) {
        return Job.find({
            placement: appDoc.placement.replace(' Work', ''),
            position: appDoc.position,
            clinic_state: appDoc.state,
            clinic_city: appDoc.city,
        })
            .populate('employer')
            .sort('-created')
            .limit(3)
            .lean()
            .exec();
    },

    getAppliedJobs: function (app_id) {
        return Applicant.findById(app_id, 'appliedJobs')
            .populate({
                path: 'appliedJobs',
                options: { limit: 3, lean: true },
                populate: {
                    path: 'employer',
                    select: 'clinicName',
                    options: { lean: true },
                },
            })
            .exec();
    },

    getAppliedJobsCount: function (app_id) {
        return Job.countDocuments({ applicants: app_id }).exec();
    },

    // edit applicant description
    postEditDescription: function (req, res) {
        var profile = req.body.profile.trim();
        db.updateOne(
            Applicant,
            { _id: req.params.appId },
            { profile },
            result => {
                if (result) res.send({ profile });
                else res.status(500).send('An error occurred in the server.');
            },
        );
    },

    getPopulateEditProfile: function (req, res) {
        Applicant.findOne({ account: req.session.user }, '')
            .exec()
            .then(doc =>
                res.render(
                    './partials/editProfileForm',
                    { profileData: doc.toObject(), layout: false },
                    (err, html) => {
                        if (err) throw err;
                        res.send(html);
                    },
                ),
            )
            .catch(err => {
                console.log(err);
                res.send(err);
            });
    },

    postEditProfile: function (req, res) {
        var errors = validationResult(req);

        if (!errors.isEmpty()) {
            errors = errors.errors;

            res.send(errors.map(e => e.msg));
        } else {
            const {
                fname,
                lname,
                streetAdd,
                house,
                state,
                city,
                zip,
                phone,
                payrate,
                position,
                placement,
            } = req.body;

            // update database
            var obj = {
                fName: fname,
                lName: lname,
                streetAdd: streetAdd,
                houseNo: house,
                state: state,
                city: city,
                zip: zip,
                phone: phone,
                rate: placement === 'Temporary Work' ? payrate : 0,
                position: position,
                placement: placement,
            };

            db.updateOne(Applicant, { _id: req.params.appId }, obj, result => {
                if (result) {
                    res.send(obj);
                } else {
                    res.status(500).send('An error occurred in the server');
                }
            });
        }
    },

    postEditWage: (req, res) => {
        var rate = Number(req.body.rate.trim());
        db.updateOne(Applicant, { _id: req.params.appId }, { rate }, result => {
            if (result) res.send({ rate });
            else res.status(500).send('An error occurred in the server.');
        });
    },

    postEditAvatar: function (req, res, next) {
        var filePath = req.files['avatar'][0].path;
        var mimetype = req.files['avatar'][0].mimetype;

        if (mimetype.search('image/') === -1 && fs.existsSync(filePath)) {
            fs.unlinkSync(filePath);
            res.redirect('/dashboard');
        } else {
            var filename = helper.renameAvatar(req, req.session.user);

            db.updateOne(
                Applicant,
                { _id: req.params.appId },
                { avatar: filename },
                result => {
                    if (result) res.redirect('/dashboard');
                    else {
                        res.status(404);
                        next();
                    }
                },
            );
        }
    },
    getHireReqCount: function (app_id){
        return Response.countDocuments({ applicantId: app_id, type: 'hire' }).exec();
    },

    getContactReqCount: function (app_id){
        return Response.countDocuments({ applicantId: app_id, type: 'contact' }).exec();
    },

    getRecentContactReq: function (app_id){
        return Response.find({ applicantId: app_id, type: 'contact' })
            .sort('-created')
            .limit(5)
            .lean()
            .exec();
    },
    
    getContactReqFeed: function (req, res){
        var appId = helper.sanitize(req.params.appId);
        db.findMany(Response, {applicantId: appId, type: 'contact'}, '', function (result){
            if(result){
                res.render('feed-reqs', {
                    contact: true,
                    hire: false,
                    active_session: req.session.user && req.cookies.user_sid,
                    active_user: req.session.user,
                    title: 'Contact Requests | BookMeDental',
                    contact_req: result
                });
                    
            }
        })
    },

    deleteContactRequest: function (req, res){
        var contact_req_id = helper.sanitize(req.params.contact_reqId);
        var appId = helper.sanitize(req.params.appId);

        db.deleteOne(Response, {_id: contact_req_id, type: 'contact'}, function(result){
            if(result){
                res.redirect(`/feed-contact/${appId}`);
            }
        })
    },

    getHireReqFeed: function (req, res){
        var appId = helper.sanitize(req.params.appId);

        db.findMany(Response, {applicantId: appId, type: 'hire'}, 'jobId', function (result){
            if(result){

                var query_id = result.map( res => {
                   
                    // console.log(res.jobId);
                    return mongoose.Types.ObjectId(res.jobId);
                })

                console.log(query_id)

                db.findMany(Job, {_id: {$in: query_id}}, '', function (jobs){
                    res.render('feed-reqs', {
                    contact: false,
                    hire: true,
                    active_session: req.session.user && req.cookies.user_sid,
                    active_user: req.session.user,
                    title: 'Hire Requests | BookMeDental',
                    hire_req: jobs
                });
                })
                    
            }
        })
        
    }
};

// enables to export controller object when called in another .js file
module.exports = dashboardAppController;
