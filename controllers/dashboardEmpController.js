const mongoose = require('mongoose');
const Job = require('../models/JobModel');
const Employer = require('../models/EmployerModel');
const helper = require('../helpers/helper');
const db = require('../models/db');

const dashboardEmpController = {
    getCreateJob: function (req, res) {
        res.render('create', {
        	active_session: (req.session.user && req.cookies.user_sid),
       		active_user: req.session.user,
            title: 'Dashboard | BookMeDental',
            profile_active: true,
        });
    },

    postCreateJob: function(req,res){
        var desc = helper.sanitize(req.body.jobdescription);
        var software = helper.sanitize(req.body.software);

        db.findOne(Employer, {account: req.session.user}, '', function(result){
            console.log("inserting");
              var job = new Job({
                _id: new mongoose.Types.ObjectId(),
                account: req.session.user,
                placement: req.body.placement,
                employer: result._id,
                position: req.body.position,
                location: req.body.clinic,
                date: req.body.date,
                description: desc,
                software: software,
                experience: req.body.experience
            });

              db.insertOne(Job, job,function (flag){
                if(flag){
                    console.log("inserted");
                    res.redirect('/dashboard');
                }
            })

        })
    }
};

// enables to export controller object when called in another .js file
module.exports = dashboardEmpController;
