const db = require('../models/db');
const Applicant = require('../models/ApplicantModel.js');
const helper = require('../helpers/helper.js');
const { validationResult } = require('express-validator');

const formController = {
    postApplicantReg: function (req, res){
        var errors = validationResult(req);

        // if (!errors.isEmpty()) {
        //     errors = errors.errors;

        //     var details = {};
        //     for (let i = 0; i < errors.length; i++)
        //         details[errors[i].param + 'Error'] = errors[i].msg;

        //     res.render('form', {
        //         details: details,
        //         title: 'Sign Up | BookMeDental',
        //         login_active: true,
        //     });
        // }
        // else{
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
            if(!(req.files['avatar'][0])){
                var applicant = new Applicant({
                    fname: fname,
                    lname: lname,
                    streetAdd: streetAdd,
                    house: house,
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

                var newName = applicant._id;
                var fileName = helper.renameFile(req, newName);
                applicant.resume = fileName;

                db.insertOne(Applicant, applicant, function(flag){
                    if(flag){
                       res.send(flag);
                    }
                })
            }

            else{
                var applicant = new Applicant({
                    fname: fname,
                    lname: lname,
                    streetAdd: streetAdd,
                    house: house,
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
                var newAvatarName = applicant._id;
                var avatarFileName = helper.renameFile(req, newAvatarName);
                applicant.avatar = avatarFileName;

                //rename user's uploaded resume
                var newResumeName = applicant._id;
                var resumeFileName = helper.renameFile(req, newResumeName);
                applicant.resume = resumeFileName;
            }

        // }
       
    },
};

module.exports = formController;