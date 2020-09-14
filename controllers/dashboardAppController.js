const Job = require('../models/JobModel');
const Applicant = require('../models/ApplicantModel');

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

    // TODO: edit profile
};

// enables to export controller object when called in another .js file
module.exports = dashboardAppController;
