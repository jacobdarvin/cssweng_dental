const db = require('../models/db');
const Applicant = require('../models/ApplicantModel.js');
const helper = require('../helpers/helper.js');
const { validationResult } = require('express-validator');
const mongoose = require('mongoose');

const formController = {

    getApplicantReg: function (req, res){
        res.render('form', {
            active_session: (req.session.user && req.cookies.user_sid),
            active_user: req.session.user,
            title: 'Sign Up | BookMeDental',
            register_active: true,
        });
    },

    postApplicantReg: function (req, res){
        var errors = validationResult(req);

        if (!errors.isEmpty()) {
            errors = errors.errors;

            var details = {};
            for (let i = 0; i < errors.length; i++)
                details[errors[i].param + 'Error'] = errors[i].msg;

            res.render('form', {
                input: req.body,
                details: details,
                active_session: (req.session.user && req.cookies.user_sid),
                active_user: req.session.user,
                title: 'Sign Up | BookMeDental',
                register_active: true,
            });
        }
        else{
            var { position, placement, travel, feedback} = req.body;
            var availability;

            //sanitize user inputs
            const fname = helper.sanitize(req.body.fname);
            const lname =  helper.sanitize(req.body.lname);
            const streetAdd =  helper.sanitize(req.body.streetAdd);
            const house = helper.sanitize(req.body.house);
            const city = helper.sanitize(req.body.city);
            const state = helper.sanitize(req.body.state);
            const zip = helper.sanitize(req.body.zip);
            const phone = helper.sanitize(req.body.phone);
            const years = helper.sanitize(req.body.years);
            const programs = helper.sanitize(req.body.programs);
            const language = helper.sanitize(req.body.language);
            const specialties = helper.sanitize(req.body.specialties);
            const payrate = helper.sanitize(req.body.payrate);
            const shortprofile = helper.sanitize(req.body.shortprofile);

            if(req.body.availability == "after"){
                availability = req.body.date;
            }
            else{
                availability = req.body.availability;
            } 
        
            //user used default avatar
            if(!(req.files['avatar'])){
                var applicant = new Applicant({
                    _id: new mongoose.Types.ObjectId(),
                    account: req.session.accId,
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
                    feedback: feedback
                });

                var newName = applicant.account;
                console.log(applicant.account);
                var fileName = helper.renameResume(req, newName);
                applicant.resume = fileName;

                db.insertOne(Applicant, applicant, function(flag){
                    if(flag){
                       res.send("success!")
                    }
                })
            }

            //user uploaded his/her own avatar
            else{
                console.log("with avatar")
                var applicant = new Applicant({
                    _id: new mongoose.Types.ObjectId(),
                    account: req.session.accId,
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
                    feedback: feedback
                });

                //rename user's uploaded avatar
                var newAvatarName = applicant.account;
                var avatarFileName = helper.renameAvatar(req, newAvatarName);
                applicant.avatar = avatarFileName;

                //rename user's uploaded resume
                var newResumeName = applicant.account;
                var resumeFileName = helper.renameResume(req, newResumeName);
                applicant.resume = resumeFileName;

                db.insertOne(Applicant, applicant, function(flag){
                    if(flag){
                       res.send("success!");
                    }
                })
            }

        }
       
    },
};

module.exports = formController;