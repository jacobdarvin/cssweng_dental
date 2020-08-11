const Employer = require('../models/EmployerModel');

const adminController = {
    getAdmin: function (req, res) {
        res.render('admin', {
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
};

module.exports = adminController;
