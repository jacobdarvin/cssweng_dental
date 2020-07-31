const bcrypt = require('bcrypt');
//const session = require('express-session');
const helper = require('../helpers/helper.js');

const db = require('../models/db.js');
const Account = require('../models/AccountModel');

const loginController = {

    getLogIn: function (req, res){
        res.render('login', {
            title: 'Login | BookMeDental',
            login_active: true,
        })
    },

    postLogIn: function (req, res){
        var email = helper.sanitize(req.body.loginEmail);
        var password = helper.sanitize(req.body.loginPassword);

        if (email.trim() == '' || password == '') {
            res.render('login', {
            title: 'Login | BookMeDental',
            login_active: true,
            loginErrorMessage: 'Please input your email and password!'
            }); return;
        }

        db.findOne(Account, {accEmail: email}, {}, function(user) {
            if(user) {
              bcrypt.compare(password, user.password, function(err, equal) {
                console.log(equal)
                if(equal) {
                  //req.session.user = user.accEmail;
                  res.send(user)
                  //res.redirect('/home');
                } 
                else {
                  res.render('login', {
                    title: 'Login | BookMeDental',
                    login_active: true,
                    loginErrorMessage: 'Invalid email or password!'
                  });
                }
              });
            } 
            else {
              res.render('login', {
                title: 'Login | BookMeDental',
                login_active: true,
                loginErrorMessage: 'Invalid email or password!'
              });
            }
          });
        }
}

module.exports = loginController;