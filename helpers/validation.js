const { check } = require('express-validator');
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
                .withMessage('You must agree to the terms and conditions.'),
        ];
    },

    formEmpValidation: function () {
        return [
            check('fname')
                .notEmpty()
                .withMessage('First name required.')
                .trim(),
            check('lname').notEmpty().withMessage('Last name required.').trim(),
            check('title').notEmpty().withMessage('Title is required.').trim(),
            check('phone')
                .isMobilePhone('en-US')
                .withMessage('Please enter a valid phone number.')
                .trim(),
            check('blname')
                .notEmpty()
                .withMessage('Business legal name is required.')
                .trim(),
            check('clinic_street').notEmpty().withMessage('Required').trim(),
            check('clinic_no').notEmpty().withMessage('Required').trim(),
            check('clinic_city').notEmpty().withMessage('Required').trim(),
            check('clinic_state').notEmpty().withMessage('Required').trim(),
            check('clinic_zip').notEmpty().withMessage('Required').trim(),

            check('clinic_phone')
                .isMobilePhone('en-US')
                .withMessage('Please enter a valid phone number.')
                .trim(),

            check('clinic_name')
                .notEmpty()
                .withMessage('Clinic name is required.')
                .trim(),

            check('clinic_program')
                .notEmpty()
                .withMessage('Clinic software field is required.')
                .customSanitizer(value => value.split(',')),
            check('clinic_program.*').trim(),

            check('clinic_specialty')
                .notEmpty()
                .withMessage('Clinic specialty field is required.')
                .customSanitizer(value => value.split(',')),
            check('clinic_specialty.*').trim(),

            check('clinic_services')
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
                .notEmpty()
                .withMessage('Empty field. Please input your first name!')
                .trim(),
            check('lname')
                .notEmpty()
                .withMessage('Empty field. Please input your last name!')
                .trim(),
            check('streetAdd')
                .notEmpty()
                .withMessage('Empty field. Please input your street address!')
                .trim(),
            check('house')
                .notEmpty()
                .withMessage('Empty field. Please input your house no.!')
                .trim(),
            check('city')
                .notEmpty()
                .withMessage('Empty field. Please input your city!')
                .trim(),
            check('state')
                .notEmpty()
                .withMessage('Empty field. Please input your state!')
                .trim(),
            check('zip').notEmpty().withMessage('Invalid input!').trim(),
            check('phone')
                .notEmpty()
                .withMessage('Empty field. Please input your number!')
                .trim(),
            check('years')
                .notEmpty()
                .withMessage('Empty field. Please fill this out!')
                .trim(),

            check('programs')
                .notEmpty()
                .withMessage('Empty field. Please fill this out!')
                .customSanitizer(value => value.split(',')),
            check('programs.*').trim(),

            check('language')
                .notEmpty()
                .withMessage('Empty field. Please fill this out!')
                .trim(),

            check('specialties')
                .notEmpty()
                .withMessage('Empty field. Please fill this out!')
                .customSanitizer(value => value.split(',')),
            check('specialties.*').trim(),

            check('payrate')
                .notEmpty()
                .withMessage('Empty field. Please fill this out!')
                .trim(),
            check('shortprofile')
                .notEmpty()
                .withMessage('Empty field. Please fill this out!')
                .trim(),

            check('useragreement')
                .exists()
                .withMessage(
                    'You must agree to the Candidate Agreement, Terms and Conditions, and Privacy Policy.',
                ),
        ];
    },
};

module.exports = validation;
