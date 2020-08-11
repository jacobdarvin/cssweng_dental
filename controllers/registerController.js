const bcrypt = require('bcrypt');
const mongoose = require('mongoose');
const { validationResult } = require('express-validator');

const db = require('../models/db');
const Account = require('../models/AccountModel');
const saltRounds = 10;

const registerController = {
    getRegister: function (req, res) {
        res.render('register', {
            title: 'Register | BookMeDental',
            register_active: true,
        });
    },
    postRegister: function (req, res) {
        var errors = validationResult(req);

        if (!errors.isEmpty()) {
            errors = errors.errors;

            var details = {};
            for (let i = 0; i < errors.length; i++)
                details[errors[i].param + 'Error'] = errors[i].msg;

            res.render('register', {
                inputs: req.body,
                isEmployer: req.body.options == 'employer',
                details: details,
                title: 'Register | BookMeDental',
                register_active: true,
            });
        } else {
            var { options, email, password } = req.body;

            // apply hashing
            bcrypt.hash(password, saltRounds, (err, hash) => {
                const account = {
                    _id: new mongoose.Types.ObjectId(),
                    accType: options,
                    accEmail: email,
                    password: hash,
                };

                // create a new Account document
                db.insertOne(Account, account, function (flag) {
                    if (flag) {
                        // account._id will be stored in Employer.account
                        req.session.accId = account._id;
                        req.session.user = email;

                        if (options == 'applicant') res.redirect('/form');
                        else res.redirect('/form-emp');
                    }
                });
            });
        }
    },
};

module.exports = registerController;
