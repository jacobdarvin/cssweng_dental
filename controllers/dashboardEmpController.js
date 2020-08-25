const mongoose = require('mongoose');
const CreateJob = require('../models/CreateJobModel');
const Employer = require('../models/EmployerModel');
const helper = require('../helpers/helper');
const db = require('../models/db');

const dashboardEmpController = {
    getCreateJob: function (req, res) {
        res.render('create', {
        	active_session: (req.session.user && req.cookies.user_sid),
       		active_user: req.session.user,
            title: 'Post Job | BookMeDental',
            profile_active: true,
        });
    },

    postCreateJob: function(req,res){
        var desc = helper.sanitize(req.body.jobdescription);
        var software = helper.sanitize(req.body.software);

        db.findOne(Employer, {account: req.session.user}, '', function(result){
            console.log(result.clinicName)
            console.log(result.clinicAddress.city)

              var job = new CreateJob({
                _id: new mongoose.Types.ObjectId(),
                account: req.session.user,
                position: req.body.position,
                location: req.body.clinic,
                clinicName: result.clinicName,
                city: result.clinicAddress.city,
                state: result.clinicAddress.state,
                date: req.body.date,
                description: desc,
                software: software,
                experience: req.body.experience
            });

              db.insertOne(CreateJob, job,function (flag){
                if(flag){
                    res.redirect('/dashboard');
                }
            })

        })

        // var job = new CreateJob({
        //     _id: new mongoose.Types.ObjectId(),
        //     account: req.session.user,
        //     position: req.body.position,
        //     location: req.body.clinic,
        //     date: req.body.date,
        //     description: desc,
        //     software: software,
        //     experience: req.body.experience
        // });
        
        // db.insertOne(CreateJob, job,function (flag){
        //     if(flag){
        //         res.redirect('/dashboard');
        //     }
        // })
    }
};

// enables to export controller object when called in another .js file
module.exports = dashboardEmpController;
