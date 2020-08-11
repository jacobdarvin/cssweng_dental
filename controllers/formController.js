const mongoose = require('mongoose');
const { validationResult } = require('express-validator');
const session = require('express-session');

const Employer = require('../models/EmployerModel');

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

        if (!errors.isEmpty()) {
            errors = errors.errors;

            var details = {};
            for (let i = 0; i < errors.length; i++) {
                // remove array indices for wildcard checks
                details[`${errors[i].param.replace(/\[\d\]/g, '')}Error`] =
                    errors[i].msg;
            }

            res.render('form-emp', {
                inputs: req.body,
                details: details,
                active_session: req.session.user && req.cookies.user_sid,
                active_user: req.session.user,
                title: 'Register | BookMeDental',
                register_active: true,
            });
        } else {
            var employer = {
                _id: new mongoose.Types.ObjectId(),
                account: req.session.accId,
                name: { first: req.body.fname, last: req.body.lname },
                title: req.body.title,
                phone: req.body.phone,
                businessName: req.body.blname,

                clinicAddress: {
                    street: req.body.clinic_street,
                    houseNo: req.body.clinic_no,
                    city: req.body.clinic_city,
                    state: req.body.clinic_state,
                    zip: req.body.clinic_zip,
                },
                clinicPhone: req.body.clinic_phone,
                clinicName: req.body.clinic_name,
                clinicProgram: req.body.clinic_program,
                clinicSpecialties: req.body.clinic_specialty,
                clinicServices: req.body.clinic_services,

                clinicContactName: req.body.clinic_con_name,
                clinicContactTitle: req.body.clinic_con_title,
                clinicContactEmails: req.body.clinic_con_email,
                feedback: req.body.feedback,
            };

            Employer.create(employer)
                .then(doc => {
                    res.send(doc);
                })
                .catch(err => {
                    res.send(err);
                });
        }
    },
};

module.exports = formController;
