const db = require('../models/db');
const CreateJob = require('../models/CreateJobModel');
const sanitize = require('mongo-sanitize');

const feedController = {
    getFeed: function (req, res) {
        if (!(req.session.user && req.cookies.user_sid)) {
            res.redirect('/login');
            return;
        }

        console.log('getFiltered request');

        let positionQuery = new Array();
        let positionStatus = sanitize(req.query.position);

        if(positionStatus) {
            positionQuery.push(positionStatus);
        } else {
            positionQuery.push('Dentist', 'Dental Hygienist', 'Front Desk', 'Dental Assistant');
        }

        let query = {
            account : req.session.user,
            position : { $in: positionQuery },
        };

        console.log(positionQuery);

        db.findMany(CreateJob, query, '' , function(result){
            res.render('feed', {
                active_session: (req.session.user && req.cookies.user_sid),
                active_user: req.session.user,
                title: 'Job Feed | BookMeDental',
                profile_active: true,

                jobs: result,
            });
       });
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
