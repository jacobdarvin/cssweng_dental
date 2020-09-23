const Job = require('../models/JobModel');
const Response = require('../models/EmpResponseModel');
const Applicant = require('../models/ApplicantModel');
const Employer = require('../models/EmployerModel');
const db = require('../models/db');
const helper = require('../helpers/helper');

const dashboardAppController = {
    createSearchJobRoute: function (appDoc) {
        return `/feed-app?placement=${appDoc.placement.replace(
            ' Work',
            '',
        )}&position=${appDoc.position}`;
    },

    getJobMatchCount: function (appDoc) {
        return Job.countDocuments({
            placement: appDoc.placement.replace(' Work', ''),
            position: appDoc.position,
        }).exec();
    },

    getMatchingJobs: function (appDoc) {
        return Job.find({
            placement: appDoc.placement.replace(' Work', ''),
            position: appDoc.position,
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
    }
};

// enables to export controller object when called in another .js file
module.exports = dashboardAppController;
