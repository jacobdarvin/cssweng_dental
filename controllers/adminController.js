const Account = require('../models/AccountModel');

const adminController = {
    getAdmin: function (req, res) {
        res.render('admin', {
            title: 'Admin | BookMeDental',
            admin_active: true,
        });
    },
    getEmployerList: function (req, res) {
        // get all Employers from Employer
        // TESTING: get data from Account collection for testing purposes
        Account.find({ accType: 'employer' }, '_id accEmail created')
            .exec()
            .then(docs => {
                res.send(docs);
            })
            .catch(err => {
                res.send(err);
            });
    },
};

module.exports = adminController;
