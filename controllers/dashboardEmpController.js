const mongoose = require('mongoose');
const CreateJob = require('../models/CreateJobModel');
const helper = require('../helpers/helper');

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
        console.log(req.body);
        const desc = helper.sanitize(req.body.jobdescription);
        const software = helper.sanitize(req.body.software);

        var job = {
            _id = new mongoose.Types.ObjectId(),
            account = req.session.user,
            position = req.body.
        }
    }
};

// enables to export controller object when called in another .js file
module.exports = dashboardEmpController;
