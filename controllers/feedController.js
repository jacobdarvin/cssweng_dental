const db = require('../models/db');
const Job = require('../models/JobModel');
const Employer = require('../models/EmployerModel');

const feedController = {
    getEmpFeed: function (req, res) {
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
        })
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
    }
};

// enables to export controller object when called in another .js file
module.exports = feedController;
