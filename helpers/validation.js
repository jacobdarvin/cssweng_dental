const { check } = require('express-validator');
const Account = require('../models/AccountModel');

const validation = {
    signupValidation: function () {
        return [
            check('email')
                .isEmail()
                .withMessage('Please enter a valid email address')
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
        ];
    },

    formValidation: function() {
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
            check('zip')
                .notEmpty()
                .withMessage('Invalid input!')
                .trim(),
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
                .trim(),
            check('language')
                .notEmpty()
                .withMessage('Empty field. Please fill this out!')
                .trim(),
            check('specialties')
                .notEmpty()
                .withMessage('Empty field. Please fill this out!')
                .trim(),
            check('payrate')
                .notEmpty()
                .withMessage('Empty field. Please fill this out!')
                .trim(),
            check('shortprofile')
                .notEmpty()
                .withMessage('Empty field. Please fill this out!')
                .trim(),
        ];
    }
};

module.exports = validation;
