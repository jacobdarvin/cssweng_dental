const db = require('../models/db');
const Applicant = require('../models/ApplicantModel.js');
const helper = require('../helpers/helper.js');

const formController = {
    postApplicantReg: function (req, res){
        
        //check if blank value nung placement if yes edi yung kunin na value is textbox
        var { fname, lname, streetAdd, house, city, state, zip, phone, position, years, programs, language, specialties, placement, payrate, travel, shortprofile, feedback} = req.body
    }
}

module.exports = formController;