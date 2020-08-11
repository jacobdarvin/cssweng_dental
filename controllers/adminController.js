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
                } of docs) {
                    data.push({
                        first,
                        last,
                        clinicName,
                        phone,
                        accEmail,
                        created,
                        accStatus: accStatus === 'active',
                    });
                }

                res.send(data);
            })
            .catch(err => {
                res.send(err);
            });
    },
    getApplicantList: function (req, res) {
        // TODO: get from database
        // DUMMY DATA below
        res.send([
            {
                fname: 'Rethaniel',
                lname: 'Ramos',
                accEmail: 'rethanielramos@gmail.com',
                phone: '(555) 555-5656',
            },
            {
                fname: 'Another',
                lname: 'Person',
                accEmail: 'anotherperson@gmail.com',
                phone: '(555) 555-3434',
            },
        ]);
    },
};

module.exports = adminController;
