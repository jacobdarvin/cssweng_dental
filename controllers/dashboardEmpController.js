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
            title: 'Post Job | BookMeDental',
            profile_active: true,
        });
    },

    postCreateJob: function(req,res){
        var desc = helper.sanitize(req.body.jobdescription);
        var software = helper.sanitize(req.body.software);

        //check date if valid
        var [year, month, day] = req.body.date.split('-');
        var input = Date.UTC(
            Number(year),
            Number(month) - 1, // parameter month starts at 0
            Number(day),
        );
        var now = Date.now();


        if (input < now){
            res.render('create', {
                active_session: (req.session.user && req.cookies.user_sid),
                active_user: req.session.user,
                title: 'Post Job | BookMeDental',
                profile_active: true,
                input: req.body,
                dateError: 'Invalid date. Please enter a date that comes after the date today.'
            });
        }
        else{
            db.findOne(Employer, {account: req.session.user}, '', function(result){
            console.log("inserting");

            var job = new Job({
                _id: new mongoose.Types.ObjectId(),
                employer: result._id,
                placement: req.body.placement,            
                position: req.body.position,
                location: req.body.clinic,
                clinicName: result.clinicName,
                date: req.body.date,
                description: desc,
                software: software,
                experience: req.body.experience
            });

            db.insertOne(Job, job, function (flag){
                if(flag){
                    console.log("inserted");
                    res.redirect('/dashboard');
                }
            })

        })
        }
    }
};

// enables to export controller object when called in another .js file
module.exports = dashboardEmpController;
