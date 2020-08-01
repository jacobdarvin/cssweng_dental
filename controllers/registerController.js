const bcrypt = require('bcrypt');
const mongoose = require('mongoose');
const { validationResult } = require('express-validator');

const Account = require('../models/AccountModel');
const saltRounds = 10;

const registerController = {
    // TODO: move to registerController
    getRegister: function (req, res) {
        res.render('register', {
            title: 'Register | BookMeDental',
            register_active: true,
        });
    },
    // TODO: move to registerController
    postRegister: function (req, res) {
        var errors = validationResult(req);

        if (!errors.isEmpty()) {
            errors = errors.errors;

            var details = {};
            for (let i = 0; i < errors.length; i++)
                details[errors[i].param + 'Error'] = errors[i].msg;

            res.render('register', {
                details: details,
                title: 'Register | BookMeDental',
                register_active: true,
            });
        } else {
            var { options, email, password } = req.body;

            // apply hashing
            bcrypt.hash(password, saltRounds, (err, hash) => {
                // create new Account document
                Account.create({
                    _id: new mongoose.Types.ObjectId(),
                    accType: options,
                    accEmail: email,
                    password: hash,
                })
                    .then(result => {
                        console.log(result);
                        // if no errors, redirect to /profile for now
                        res.redirect('/profile');
                    })
                    .catch(err => {
                        // if there are errors, log them for now
                        console.log(err);
                    });
            });
        }
    },
};

module.exports = registerController;
