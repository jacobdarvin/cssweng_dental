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
                details: details,
                active_session: (req.session.user && req.cookies.user_sid),
                active_user: req.session.user,
                title: 'Sign Up | BookMeDental',
                register_active: true,
            });
        }
        else{
            var { fname, lname, streetAdd, house, city, state, zip, phone, position, years, programs, 
            language, specialties, placement, payrate, travel, shortprofile, feedback} = req.body;
            var availability;

            //sanitize all user inputs
            // const fname = helper.sanitize(req.body.fname);
            // const lname =  helper.sanitize(req.body.lname);
            // const streetAdd =  helper.sanitize(req.body.streetAdd);

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