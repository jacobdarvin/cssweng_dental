const bcrypt = require('bcrypt');
const session = require('express-session');
const helper = require('../helpers/helper.js');

const db = require('../models/db.js');
const Account = require('../models/AccountModel');

const loginController = {
    getLogIn: function (req, res) {
        res.render('login', {
            title: 'Login | BookMeDental',
            login_active: true,
        });
    },

    postLogIn: function (req, res) {
        var email = helper.sanitize(req.body.loginEmail);
        var password = helper.sanitize(req.body.loginPassword);

        if (email.trim() == '' || password == '') {
            res.render('login', {
                input: req.body,
                title: 'Login | BookMeDental',
                login_active: true,
                loginErrorMessage: 'Please input your email and password!',
            });
        }

        db.findOne(Account, { accEmail: email }, '', function (user) {
            if (user) {
                bcrypt.compare(password, user.password, function (err, equal) {
              
                    if (equal) {
                        req.session.user = user._id;
                        req.session.accType = user.accType;

                        res.redirect('/dashboard');
                    } else {
                        res.render('login', {
                            input: req.body,
                            title: 'Login | BookMeDental',
                            login_active: true,
                            loginErrorMessage: 'Invalid email or password!',
                        });
                    }
                });
            } else {
                res.render('login', {
                    input: req.body,
                    title: 'Login | BookMeDental',
                    login_active: true,
                    loginErrorMessage: 'Invalid email or password!',
                });
            }
        });
    },
};

module.exports = loginController;
