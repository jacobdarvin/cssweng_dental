const db = require('../models/db');
const CreateJob = require('../models/CreateJobModel');

const feedController = {
    getFeed: function (req, res) {
       db.findMany(CreateJob, { account: req.session.user }, '', function(result){
            res.render('feed', {
                active_session: (req.session.user && req.cookies.user_sid),
                active_user: req.session.user,
                title: 'Job Feed | BookMeDental',
                profile_active: true,
                jobs: result,
            });
       })
    },

};

// enables to export controller object when called in another .js file
module.exports = feedController;
