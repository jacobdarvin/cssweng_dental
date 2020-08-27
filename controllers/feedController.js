const db = require('../models/db');
const sanitize = require('mongo-sanitize');

const Job = require('../models/JobModel');
const Employer = require('../models/EmployerModel');

const feedController = {

    getEmpFeed: function (req, res) {
         if (!(req.session.user && req.cookies.user_sid)) {
            res.redirect('/login');
            return;
        }

        console.log('getFiltered request');

        let positionQuery = new Array();
        let placementQuery = new Array();

        let positionStatus = sanitize(req.query.position);
        let placementStatus = sanitize(req.query.placement);

        let dateStatus = sanitize(req.query.date);

        if(positionStatus) {
            positionQuery = positionStatus;
        } else {
            positionQuery.push('Dentist', 'Dental Hygienist', 'Front Desk', 'Dental Assistant');
        }

        if(placementStatus) {
            placementQuery = placementStatus;
        } else {
            placementQuery.push('Permanent', 'Temporary');
        }

        console.log(positionQuery);
        console.log(placementQuery);

        db.findOne(Employer, {account: req.session.user}, '_id', function(emp){
            
            let query = {
                employer : emp._id,
                position : { $in: positionQuery },
                placement : { $in : placementQuery}
            };

            db.findMany(Job, query, '', function(result){
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
        db.findMany(Job, {}, '', function(result){
            Employer.populate(result, {path: 'employer', options: {lean: true}}, function (err, data){
                if (err) throw err;
                res.render('feed', {
                    active_session: (req.session.user && req.cookies.user_sid),
                    active_user: req.session.user,
                    title: 'Applicant Feed | BookMeDental',
                    profile_active: true,
                    jobs: data
                });
            });
        });
    },

    getIndivJob: function (req,res){
        db.findOne(Job, {_id: req.query._id}, '', function(result){
            if(result){
                result 
                    .populate('employer')
                    .execPopulate(function(err,data){
                        if (err) throw err;
                        res.render('details',{
                            active_session: (req.session.user && req.cookies.user_sid),
                            active_user: req.session.user,
                            profile_active: true,
                            jobData: data.toObject()
                        })
                    })
            }
            
        })
    },
};
// enables to export controller object when called in another .js file
module.exports = feedController;