const db = require('../models/db');
const Applicant = require('../models/ApplicantModel.js');
const helper = require('../helpers/helper.js');

const formController = {
    postApplicantReg: function (req, res){
        var errors = validationResult(req);

        if (!errors.isEmpty()) {
            errors = errors.errors;

            var msg = {};
            for (let i = 0; i < errors.length; i++)
                msg[errors[i].param + 'Error'] = errors[i].msg;

            res.render('form', {
                msg: msg,
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