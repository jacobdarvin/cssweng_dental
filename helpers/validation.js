const { check, body } = require('express-validator');
const Account = require('../models/AccountModel');

const validation = {
    signupValidation: function () {
        return [
            check('email')
                .isEmail()
                .withMessage('Please enter a valid email address')
                .bail()
                .trim()
                .normalizeEmail()
                .custom(async value => {
                    // check if email is already used
                    const data = await Account.findOne({
                        accEmail: value,
                    }).exec();
                    // reject if a record is found
                    if (data) return Promise.reject();
                })
                .withMessage('Email address is already in use'),
            check('password')
                .isLength({ min: 8 })
                .withMessage('Password should contain at least 8 characters')
                .notEmpty()
                .withMessage('Please enter a password'),
            check('passwordConfirm')
                .custom((value, { req }) => value === req.body.password)
                .withMessage('Passwords do not match')
                .notEmpty()
                .withMessage('Please enter a password'),
            check('termsCheck')
                .exists()
                .withMessage('You must agree to the terms and conditions'),
        ];
    },

    formEmpValidation: function () {
        return [
            check('fname')
                .trim()
                .notEmpty()
                .withMessage('First name is required.')
                .trim(),
            check('lname')
                .trim()
                .notEmpty()
                .withMessage('Last name is required.')
                .trim(),
            check('title')
                .trim()
                .notEmpty()
                .withMessage('Title is required.')
                .trim(),
            check('phone')
                .trim()
                .isMobilePhone('en-US')
                .withMessage('Please enter a valid US phone number.')
                .trim(),
            check('blname')
                .trim()
                .notEmpty()
                .withMessage('Business legal name is required.')
                .trim(),
            check('clinic_street')
                .trim()
                .notEmpty()
                .withMessage('Street address is required.')
                .trim(),
            check('clinic_no')
                .trim()
                .notEmpty()
                .withMessage('House number is required.')
                .bail()
                .isNumeric()
                .withMessage('Please input a number')
                .trim(),
            check('clinic_city')
                .notEmpty()
                .withMessage('Please select a city.')
                .trim(),
            check('clinic_state')
                .notEmpty()
                .withMessage('Please select a state.')
                .trim(),
            check('clinic_zip')
                .trim()
                .notEmpty()
                .withMessage('Zip is required.')
                .bail()
                .isNumeric()
                .withMessage('Please input a number')
                .trim(),

            check('clinic_phone')
                .trim()
                .isMobilePhone('en-US')
                .withMessage('Please enter a valid US phone number.')
                .trim(),

            check('clinic_name')
                .trim()
                .notEmpty()
                .withMessage('Clinic name is required.')
                .trim(),

            check('clinic_programs')
                .exists()
                .withMessage('Please check at least one software.'),
            check('software_other_text')
                .trim()
                .if(body('clinic_programs').exists())
                .if(
                    (value, { req }) =>
                        req.body.clinic_programs == 'Other' ||
                        req.body.clinic_programs.includes('Other'),
                )
                .notEmpty()
                .withMessage('Please fill this out.')
                .customSanitizer(value => value.split(',')),
            check('software_other_text.*').trim(),

            check('clinic_specialties')
                .exists()
                .withMessage('Please check at least one specialty.'),
            check('clinicspecialty_other_text')
                .trim()
                .if(body('clinic_specialties').exists())
                .if(
                    (value, { req }) =>
                        req.body.clinic_specialties == 'Other' ||
                        req.body.clinic_specialties.includes('Other'),
                )
                .notEmpty()
                .withMessage('Please fill this out.')
                .customSanitizer(value => value.split(',')),
            check('clinicspecialty_other_text.*').trim(),

            check('clinic_services')
                .trim()
                .notEmpty()
                .withMessage('Clinic services field is required.')
                .customSanitizer(value => value.split(',')),
            check('clinic_services.*').trim(),

            check('clinic_con_name')
                .notEmpty()
                .withMessage('Clinic contact name field is required.')
                .trim(),
            check('clinic_con_title')
                .notEmpty()
                .withMessage('Clinic contact title field is required.')
                .trim(),
            check('clinic_con_email').customSanitizer(value =>
                value.split(','),
            ),
            check('clinic_con_email.*')
                .trim()
                .isEmail()
                .withMessage('Please enter valid email addresses.')
                .bail()
                .trim()
                .normalizeEmail(),
            check('useragreement')
                .exists()
                .withMessage(
                    'You must agree to the Employer Agreement, Terms and Conditions, and Privacy Policy.',
                ),
        ];
    },

    formValidation: function () {
        return [
            check('fname')
                .trim()
                .notEmpty()
                .withMessage('First name is required.')
                .trim(),
            check('lname')
                .trim()
                .notEmpty()
                .withMessage('Last name is required.')
                .trim(),
            check('streetAdd')
                .trim()
                .notEmpty()
                .withMessage('Street address is required.')
                .trim(),
            check('house')
                .trim()
                .notEmpty()
                .withMessage('House number is required.')
                .bail()
                .isNumeric()
                .withMessage('Invalid input.')
                .trim(),
            check('city')
                .notEmpty()
                .withMessage('Please select a city.')
                .trim(),
            check('state')
                .notEmpty()
                .withMessage('Please select a state.')
                .trim(),
            check('zip')
                .trim()
                .notEmpty()
                .withMessage('Zip is required.')
                .bail()
                .isNumeric()
                .withMessage('Please input a number')
                .trim(),
            check('phone')
                .trim()
                .isMobilePhone('en-US')
                .withMessage('Please enter a valid US phone number.')
                .trim(),
            check('years')
                .trim()
                .notEmpty()
                .withMessage('Empty field. Please fill this out.')
                .bail()
                .isNumeric()
                .withMessage('Invalid input.')
                .trim(),
            check('programs')
                .exists()
                .withMessage(
                    'Empty field. Please check at least one software.',
                ),
            check('software_other_text')
                .trim()
                .if(body('programs').exists())
                .if(
                    (value, { req }) =>
                        req.body.programs == 'Other' ||
                        req.body.programs.includes('Other'),
                )
                .notEmpty()
                .withMessage('Please fill this out.')
                .customSanitizer(value => value.split(',')),
            check('software_other_text.*').trim(),

            check('specialties')
                .exists()
                .withMessage(
                    'Empty field. Please check at least one specialty.',
                ),
            check('clinicspecialty_other_text')
                .trim()
                .if(body('specialties').exists())
                .if(
                    (value, { req }) =>
                        req.body.specialties == 'Other' ||
                        req.body.specialties.includes('Other'),
                )
                .notEmpty()
                .withMessage('Please fill this out.')
                .customSanitizer(value => value.split(',')),
            check('clinicspecialty_other_text.*').trim(),

            check('language')
                .trim()
                .notEmpty()
                .withMessage('Empty field. Please fill this out.')
                .trim(),

            check('payrate')
                .trim()
                .custom((value, { req, location, path }) => {
                    return (
                        req.body.placement == 'Permanent Work' ||
                        (req.body.placement == 'Temporary Work' &&
                            value != '' &&
                            !Number.isNaN(Number(value)))
                    );
                })
                .withMessage('Empty field. Please try again.')
                .trim(),
            check('date')
                .custom((value, { req, location, path }) => {
                    return (
                        (req.body.availability == 'after' && value != '') ||
                        req.body.availability == 'Available immediately'
                    );
                })
                .withMessage(
                    'Empty field. Please enter a date that comes after the date today.',
                )
                .bail()
                .custom((value, { req, location, path }) => {
                    var [year, month, day] = value.split('-');
                    var input = Date.UTC(
                        Number(year),
                        Number(month) - 1, // parameter month starts at 0
                        Number(day),
                    );
                    var now = Date.now();

                    return (
                        (req.body.availability == 'after' && input > now) ||
                        req.body.availability == 'Available immediately'
                    );
                })
                .withMessage(
                    'Please enter a date that comes after the date today.',
                ),
            check('shortprofile')
                .trim()
                .notEmpty()
                .withMessage('Empty field. Please fill this out.')
                .trim(),

            check('useragreement')
                .exists()
                .withMessage(
                    'You must agree to the Candidate Agreement, Terms and Conditions, and Privacy Policy.',
                ),
        ];
    },

    editAppProfileValidation: function () {
        return [
            check('fname')
                .trim()
                .notEmpty()
                .withMessage('First Name: field is required')
                .trim(),
            check('lname')
                .trim()
                .notEmpty()
                .withMessage('Last name: field is required')
                .trim(),
            check('streetAdd')
                .trim()
                .notEmpty()
                .withMessage('Street address: field is required')
                .trim(),
            check('house')
                .trim()
                .notEmpty()
                .withMessage('House No.: field is required')
                .bail()
                .isNumeric()
                .withMessage('House No.: please input a number')
                .trim(),
            check('city')
                .notEmpty()
                .withMessage('City: please select a city')
                .trim(),
            check('state')
                .notEmpty()
                .withMessage('State: please select a state')
                .trim(),
            check('zip')
                .trim()
                .notEmpty()
                .withMessage('Zip: field is required')
                .bail()
                .isNumeric()
                .withMessage('Zip: please input a number')
                .trim(),
            check('phone')
                .trim()
                .isMobilePhone('en-US')
                .withMessage('Phone: please enter a valid US phone number.')
                .trim(),
            check('payrate')
                .trim()
                .custom((value, { req, location, path }) => {
                    return (
                        req.body.placement == 'Permanent Work' ||
                        (req.body.placement == 'Temporary Work' &&
                            value != '' &&
                            !Number.isNaN(Number(value)))
                    );
                })
                .withMessage(
                    "Placement: please input your rate if you selected 'Temporary Work'",
                )
                .trim(),
        ];
    },

    editJobDetailsValidation: function () {
        return [
            check('date_start')
                .if(body('placement').exists().equals('Temporary'))
                .isAfter()
                .withMessage(
                    'Start date: Please enter a date that comes after the date today',
                ),
            check('date_end')
                .if(body('placement').exists().equals('Temporary'))
                .custom((date_end, { req, location, path }) => {
                    const ds_date = new Date(req.body.date_start);
                    const de_date = new Date(date_end);
                    return de_date > ds_date;
                })
                .withMessage(
                    'End date: Please enter a date that comes after the start date',
                ),
        ];
    },
};

module.exports = validation;
