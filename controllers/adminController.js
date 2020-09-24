const Applicant = require('../models/ApplicantModel');
const Employer = require('../models/EmployerModel');
const Job = require('../models/JobModel');
const Account = require('../models/AccountModel');
const db = require('../models/db');

const adminController = {
    getAdmin: function (req, res) {
        if(req.session.accType == 'admin') {
            res.render('admin', {
                active_session: req.session.user && req.cookies.user_sid,
                active_user: req.session.user,
                title: 'Admin | BookMeDental',
                admin_active: true,
            });
        } else res.redirect('/404');
    },

    getEmployerList: function (req, res) {
        // only get Employers who have completed the form
        Employer.find(
            { account: { $exists: true } },
            '_id account name clinicName phone',
        )
            .populate('account')
            .exec()
            .then(docs => {
                var data = [];
                for (const {
                    name: { first, last },
                    clinicName,
                    phone,
                    account: {  _id, accEmail, created, accStatus },
                } of docs)
                    data.push({
                        _id,
                        first,
                        last,
                        clinicName,
                        phone,
                        accEmail,
                        created,
                        accStatus,
                    });

                res.send(data);
            })
            .catch(err => {
                res.send(err);
            });
    },
    getApplicantList: function (req, res) {
        // only get Applicants who have completed the form
        Applicant.find(
            { account: { $exists: true } },
            '_id account fName lName phone position placement streetAdd houseNo city state zip',
        )
            .populate('account')
            .exec()
            .then(docs => {
                var data = [];

                for (const {
                    _id,
                    account: { accEmail },
                    fName,
                    lName,
                    phone,
                    position,
                    placement,
                    streetAdd,
                    houseNo,
                    city,
                    state,
                    zip,
                } of docs)
                    data.push({ _id, accEmail, fName, lName, phone,
                                position, placement, streetAdd, houseNo,
                                city, state, zip });

                res.send(data);
            })
            .catch(err => res.send(err));
    },
    getJobList: function(req, res) {
        Job.find(
            { employer: { $exists: true} },
            '_id applicants placement position clinicName clinic_city clinic_state created description',
        )
            .populate('employer')
            .exec()
            .then(docs => {
                var data = [];

                for (const {
                    _id,
                    applicants,
                    placement,
                    position,
                    clinicName,
                    clinic_city,
                    clinic_state,
                    created,
                    date_start,
                    date_end,
                    description,
                    software,
                    experience,
                    posted,
                } of docs)
                    data.push({_id, applicants, placement, position,
                                clinicName, clinic_city, clinic_state, created,
                                date_start, date_end, description, software,
                                experience, posted});

                res.send(data);
            })
            .catch(err => res.send(err));
    },

    confirmEmpStatus: function (req, res){
        var acc_id = req.body.confirm_id;

        db.updateOne(Account, {_id: acc_id}, {accStatus: 'Verified'}, function(result){
            res.redirect('/admin');
        })
    },

    declineEmpStatus: function (req, res){
        var acc_id = req.body.decline_id;
        console.log(req.body);

        db.updateOne(Account, {_id: acc_id}, {accStatus: 'Unverified'}, function(result){
            res.redirect('/admin');
        })
    },

    closeJob: function (req, res){
        var job_id = req.body.closejob_id;

        db.deleteOne(Job, {_id: job_id}, function(result){
            res.redirect('/admin');
        })
    }
};

module.exports = adminController;
