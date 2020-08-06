const db = require('../models/db');
const Applicant = require('../models/ApplicantModel.js');
const helper = require('../helpers/helper.js');
const { validationResult } = require('express-validator');

const formController = {
    postApplicantReg: function (req, res){
        var errors = validationResult(req);

        if (!errors.isEmpty()) {
            errors = errors.errors;

            var details = {};
            for (let i = 0; i < errors.length; i++)
                details[errors[i].param + 'Error'] = errors[i].msg;

            res.render('form', {
                details: details,
                title: 'Sign Up | BookMeDental',
                login_active: true,
            });
        }
        else{
            //check if blank value nung placement if yes edi yung kunin na value is textbox
            var { fname, lname, streetAdd, house, city, state, zip, phone, position, years, programs, 
                language, specialties, placement, payrate, travel, shortprofile, feedback} = req.body
        }
       
    }
}

module.exports = formController;