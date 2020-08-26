const db = require('../models/db');
const Job = require('../models/JobModel');
const Employer = require('../models/EmployerModel');

const feedController = {
    getFeed: function (req, res) {
        db.findOne(Employer, {account: req.session.user}, '_id', function(emp){
            db.findMany(Job, {employer: emp._id}, '', function(result){
                Employer.populate(result, {path: 'employer', options: {lean: true}}, function (err, data){
                        if (err) throw err;
                        res.render('feed', {
                        active_session: (req.session.user && req.cookies.user_sid),
                        active_user: req.session.user,
                        title: 'Job Feed | BookMeDental',
                        profile_active: true,
                        jobs: data
                    });
                })
            })
        })

    },

    getAppFeed: function (req, res) {
        res.render('feed-app', {
        	active_session: (req.session.user && req.cookies.user_sid),
       		active_user: req.session.user,
            title: 'Applicant Feed | BookMeDental',
            profile_active: true,
        });
    },
};

// enables to export controller object when called in another .js file
module.exports = feedController;
