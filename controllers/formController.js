const mongoose = require('mongoose');
const { validationResult } = require('express-validator');
const session = require('express-session');

const formController = {
    getFormEmp: function (req, res) {
        res.render('form-emp', {
            active_session: req.session.user && req.cookies.user_sid,
            active_user: req.session.user,
            title: 'Sign Up | BookMeDental',
            login_active: true,
        });
    },
    postFormEmp: function (req, res) {
        var errors = validationResult(req);

        console.log(req.body);
        if (!errors.isEmpty()) {
            errors = errors.errors;

            var details = {};
            for (let i = 0; i < errors.length; i++)
                details[errors[i].param + 'Error'] = errors[i].msg;

            console.log(details);
            res.render('form-emp', {
                details: details,
                active_session: req.session.user && req.cookies.user_sid,
                active_user: req.session.user,
                title: 'Register | BookMeDental',
                register_active: true,
            });
        } else {
            var { fname, lname, title } = req.body;
            res.send(req.body);
        }
    },
};

module.exports = formController;
