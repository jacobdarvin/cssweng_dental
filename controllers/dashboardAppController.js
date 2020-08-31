const Job = require('../models/JobModel');

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
        return Job.find(
            {
                placement: appDoc.placement.replace(' Work', ''),
                position: appDoc.position,
            },
            'employer position placement date',
        )
            .populate('employer')
            .sort('-created')
            .limit(3)
            .lean()
            .exec();
    },
};

// enables to export controller object when called in another .js file
module.exports = dashboardAppController;
