const mongoose = require('mongoose');
const { validationResult } = require('express-validator');
const session = require('express-session');
const fs = require('fs');
const path = require('path');
const db = require('../models/db');
const Applicant = require('../models/ApplicantModel');
const Employer = require('../models/EmployerModel');

const helper = require('../helpers/helper');

const buffer = fs.readFileSync(
    path.resolve(__dirname, '../public/json/us_cities_and_states.json'),
);
const citiesAndStates = JSON.parse(buffer);
// console.log(Object.keys(citiesAndStates));

const formController = {
    getApplicantReg: function (req, res) {
        res.render('form', {
            active_session: req.session.user && req.cookies.user_sid,
            active_user: req.session.user,
            title: 'Sign Up | BookMeDental',
            register_active: true,

            states: Object.keys(citiesAndStates).sort(),
        });
    },
    postApplicantReg: function (req, res) {
        var errors = validationResult(req);

        if (!errors.isEmpty()) {
            errors = errors.errors;

            var details = {};

            for (let i = 0; i < errors.length; i++)
                details[errors[i].param + 'Error'] = errors[i].msg;
            console.log(req.body);
            res.render('form', {
                input: req.body,
                details: details,
                active_session: req.session.user && req.cookies.user_sid,
                active_user: req.session.user,
                title: 'Sign Up | BookMeDental',
                register_active: true,

                states: Object.keys(citiesAndStates).sort(),
                cities: req.body.state
                    ? citiesAndStates[req.body.state].sort()
                    : '',
            });
        } else {
            var { position, placement, travel, feedback } = req.body;
            var availability, payrate;

            //sanitize user inputs
            const fname = helper.sanitize(req.body.fname);
            const lname = helper.sanitize(req.body.lname);
            const streetAdd = helper.sanitize(req.body.streetAdd);
            const house = helper.sanitize(req.body.house);
            const city = helper.sanitize(req.body.city);
            const state = helper.sanitize(req.body.state);
            const zip = helper.sanitize(req.body.zip);
            const phone = helper.sanitize(req.body.phone);
            const years = helper.sanitize(req.body.years);
            const programs = helper.sanitize(req.body.programs);
            const language = helper.sanitize(req.body.language);
            const specialties = helper.sanitize(req.body.specialties);
            const shortprofile = helper.sanitize(req.body.shortprofile);


            if (req.body.availability == 'after') {
                availability = req.body.date;
            } else {
                availability = req.body.availability;
            }

            if (req.body.placement == 'Temporary Work') {
                payrate = helper.sanitize(req.body.payrate);
            } else {
                payrate = 0;
            }

            //user used default avatar
            if (!req.files['avatar']) {
                var applicant = new Applicant({
                    _id: new mongoose.Types.ObjectId(),
                    account: req.session.user,
                    fName: fname,
                    lName: lname,
                    streetAdd: streetAdd,
                    houseNo: house,
                    city: city,
                    state: state,
                    zip: zip,
                    phone: phone,
                    position: position,
                    yearExp: years,
                    dentalProg: programs,
                    language: language,
                    specialties: specialties,
                    placement: placement,
                    rate: payrate,
                    availability: availability,
                    travel: travel,
                    profile: shortprofile,
                    feedback: feedback,
                });

                var newName = applicant.account;
                var fileName = helper.renameResume(req, newName);
                applicant.resume = fileName;

                db.insertOne(Applicant, applicant, function (flag) {
                    if (flag) {
                        res.redirect('/home');
                    }
                });
            }

            //user uploaded his/her own avatar
            else {
                var applicant = new Applicant({
                    _id: new mongoose.Types.ObjectId(),
                    account: req.session.user,
                    fName: fname,
                    lName: lname,
                    streetAdd: streetAdd,
                    houseNo: house,
                    city: city,
                    state: state,
                    zip: zip,
                    phone: phone,
                    position: position,
                    yearExp: years,
                    dentalProg: programs,
                    language: language,
                    specialties: specialties,
                    placement: placement,
                    rate: payrate,
                    availability: availability,
                    travel: travel,
                    profile: shortprofile,
                    feedback: feedback,
                });

                //rename user's uploaded avatar
                var newAvatarName = applicant.account;
                var avatarFileName = helper.renameAvatar(req, newAvatarName);
                applicant.avatar = avatarFileName;

                //rename user's uploaded resume
                var newResumeName = applicant.account;
                var resumeFileName = helper.renameResume(req, newResumeName);
                applicant.resume = resumeFileName;

                db.insertOne(Applicant, applicant, function (flag) {
                    if (flag) {
                        res.redirect('/dashboard');
                    }
                });
            }
        }
    },
    getFormEmp: function (req, res) {
        res.render('form-emp', {
            active_session: req.session.user && req.cookies.user_sid,
            active_user: req.session.user,
            title: 'Sign Up | BookMeDental',
            login_active: true,

            states: Object.keys(citiesAndStates).sort(),
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
            // console.log(details);
            console.log(req.body);
            res.render('form-emp', {
                inputs: req.body,
                details: details,
                active_session: req.session.user && req.cookies.user_sid,
                active_user: req.session.user,
                title: 'Register | BookMeDental',
                register_active: true,

                states: Object.keys(citiesAndStates).sort(),
                cities: req.body.clinic_state
                    ? citiesAndStates[req.body.clinic_state].sort()
                    : '',
            });
        } else {
            var employer = {
                _id: new mongoose.Types.ObjectId(),
                account: req.session.user,
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

            db.insertOne(Employer, employer, function (flag) {
                if (flag) {
                    res.redirect('/dashboard');
                }
            });
        }
    },
    getCities: function (req, res) {
        if (req.query.state) res.send(citiesAndStates[req.query.state].sort());
        else res.send('');
    },
};

module.exports = formController;
