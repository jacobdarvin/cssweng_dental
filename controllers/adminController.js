const Applicant = require('../models/ApplicantModel');
const Employer = require('../models/EmployerModel');

const adminController = {
    getAdmin: function (req, res) {
        res.render('admin', {
            active_session: req.session.user && req.cookies.user_sid,
            active_user: req.session.user,
            title: 'Admin | BookMeDental',
            admin_active: true,
        });
    },
    getEmployerList: function (req, res) {
        // only get Employers who have completed the form
        Employer.find(
            { account: { $exists: true } },
            'account name clinicName phone',
        )
            .populate('account')
            .exec()
            .then(docs => {
                var data = [];
                for (const {
                    name: { first, last },
                    clinicName,
                    phone,
                    account: { accEmail, created, accStatus },
                } of docs)
                    data.push({
                        first,
                        last,
                        clinicName,
                        phone,
                        accEmail,
                        created,
                        accStatus: accStatus === 'active',
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
            '_id account fName lName phone position placement',
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
                } of docs)
                    data.push({ _id, accEmail, fName, lName, phone,
                                position, placement });

                res.send(data);
            })
            .catch(err => res.send(err));
    },
};

module.exports = adminController;
