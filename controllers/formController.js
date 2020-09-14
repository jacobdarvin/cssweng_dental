const mongoose = require('mongoose');
const { validationResult } = require('express-validator');
const session = require('express-session');
const fs = require('fs');
const path = require('path');
const db = require('../models/db');
const Applicant = require('../models/ApplicantModel');
const Employer = require('../models/EmployerModel');
const Account = require('../models/AccountModel');

const helper = require('../helpers/helper');

const buffer = fs.readFileSync(
    path.resolve(__dirname, '../public/json/us_cities_and_states.json'),
);
const citiesAndStates = JSON.parse(buffer);
// console.log(Object.keys(citiesAndStates));

const formController = {
    getApplicantReg: function (req, res) {
        if (!req.session.user) {
            res.redirect('/register')
        }
        else{
            db.findOne(Account, {_id: req.params.fappId}, '', function(result){
            if(result){
                res.render('form', {
                    active_session: req.session.user && req.cookies.user_sid,
                    active_user: req.session.user,
                    title: 'Sign Up | BookMeDental',
                    register_active: true,
        
                    states: Object.keys(citiesAndStates).sort(),
                });
            }
            else{
                res.render('404', {
                    active_session: req.session.user && req.cookies.user_sid,
                    active_user: req.session.user,
                    title: '404 Page Not Found | BookMeDental',
                });
            }
            });
        }
    },
    postApplicantReg: function (req, res) {
        var errors = validationResult(req);

        if (!errors.isEmpty()) {
            errors = errors.errors;

            var details = {};

            for (let i = 0; i < errors.length; i++)
                details[errors[i].param + 'Error'] = errors[i].msg;
            
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
            const language = helper.sanitize(req.body.language);
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

            var progs = req.body.programs;
            
            if(progs == 'Other') {
                progs = req.body.software_other_text;
            }
            else if(progs.includes('Other')) {
                progs = progs.concat(req.body.software_other_text);
                var i = progs.indexOf('Other');
                progs.splice(i, 1);
            }

            var specs = req.body.specialties;

            if(specs == 'Other') {
                specs = req.body.clinicspecialty_other_text;
            }
            else if(specs.includes('Other')) {
                specs = specs.concat(req.body.clinicspecialty_other_text);
                var i = specs.indexOf('Other');
                specs.splice(i, 1);
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
                    dentalProg: progs,
                    language: language,
                    specialties: specs,
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
                        res.redirect('/dashboard');
                    }
                });
            }

            // user uploaded his/her own avatar
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
                    dentalProg:  progs,
                    language: language,
                    specialties:  specs,
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
                        helper.updatePostedDate();
                        res.redirect('/dashboard');
                    }
                });
            }
        }
    },
    getFormEmp: function (req, res) {
        if (!req.session.user) {
            res.redirect('/register')
        }
        else{
            db.findOne(Account, {_id: req.params.fempId}, '', function(result){
            if(result){
                res.render('form-emp', {
                    active_session: req.session.user && req.cookies.user_sid,
                    active_user: req.session.user,
                    title: 'Sign Up | BookMeDental',
                    register_active: true,
        
                    states: Object.keys(citiesAndStates).sort(),
                });
            }
            else{
                res.render('404', {
                    active_session: req.session.user && req.cookies.user_sid,
                    active_user: req.session.user,
                    title: '404 Page Not Found | BookMeDental',
                });
            }
            });
        }
    },
    postFormEmp: function (req, res) {
        console.log(req.body)
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

                states: Object.keys(citiesAndStates).sort(),
                cities: req.body.clinic_state
                    ? citiesAndStates[req.body.clinic_state].sort()
                    : '',
            });
        } else {
            //sanitize user inputs
            const o = {};
            for (const field in req.body) {
                if (req.body.hasOwnProperty(field)) {
                    o[field] = helper.sanitize(req.body[field]);
                    
                }
            }
            var employer = {
                _id: new mongoose.Types.ObjectId(),
                account: req.session.user,
                name: { first: o.fname, last: o.lname },
                title: o.title,
                phone: o.phone,
                businessName: o.blname,

                clinicAddress: {
                    street: o.clinic_street,
                    houseNo: o.clinic_no,
                    city: o.clinic_city,
                    state: o.clinic_state,
                    zip: o.clinic_zip,
                },
                clinicPhone: o.clinic_phone,
                clinicName: o.clinic_name,
                clinicProgram: o.clinic_programs,
                clinicSpecialties: o.clinic_specialties,
                clinicServices: o.clinic_services,

                clinicContactName: o.clinic_con_name,
                clinicContactTitle: o.clinic_con_title,
                clinicContactEmails: o.clinic_con_email,
                feedback: o.feedback,
            };

            db.insertOne(Employer, employer, function (flag) {
                if (flag) {
                    helper.updatePostedDate();
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
