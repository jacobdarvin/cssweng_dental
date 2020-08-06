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

    formValidation: function(){
        return[
            check('fname')
                .notEmpty().withMessage('Empty field. Please input your first name!')
                .isInt().withMessage('Invalid input!')
                .trim(),
            check('lname')
                .notEmpty()
                .withMessage('Empty field. Please input your last name!')
                .isInt().withMessage('Invalid input!')
                .trim(),
            check('streetAdd')
                .notEmpty().withMessage('Empty field. Please input your street address!')
                .isInt().withMessage('Invalid input!')
                .trim(),
            check('house')
                .notEmpty().withMessage('Empty field. Please input your house no.!')
                .trim(),
            check('city')
                .notEmpty().withMessage('Empty field. Please input your city!')
                .isInt().withMessage('Invalid input!')
                .trim(),
            check('state')
                .notEmpty().withMessage('Empty field. Please input your state!')
                .isInt().withMessage('Invalid input!')
                .trim(),
            check('zip')
                .notEmpty().withMessage('Invalid zip!')
                .isLength({min: 5}).withMessage('Invalid zip!')
                .matches(['A-Z']).withMessage('Invalid zip!')
                .matches(['a-z']).withMessage('Invalid zip!')
                .trim(),
            check('phone')
                .notEmpty().withMessage('Empty field. Please input your number!')
                .matches(['A-Z']).withMessage('Invalid input!')
                .matches(['a-z']).withMessage('Invalid input!')
                .trim(),
            check('years')
                .notEmpty().withMessage('Empty field. Please fill this out!')
                .matches(['A-Z']).withMessage('Invalid input!')
                .matches(['a-z']).withMessage('Invalid input!')
                .trim(),
            check('programs')
                .notEmpty().withMessage('Empty field. Please fill this out!')
                .isInt().withMessage('Invalid input!')
                .trim(),
            check('language')
                .notEmpty().withMessage('Empty field. Please fill this out!')
                .isInt().withMessage('Invalid input!')
                .trim(),
            check('specialties')
                .notEmpty().withMessage('Empty field. Please fill this out!')
                .isInt().withMessage('Invalid input!')
                .trim(),
            check('payrate')
                .notEmpty().withMessage('Empty field. Please fill this out!')
                .matches(['A-Z']).withMessage('Invalid input!')
                .matches(['a-z']).withMessage('Invalid input!')
                .trim(),
            check('shortprofile')
                .notEmpty().withMessage('Empty field. Please fill this out!')
                .trim(),
        ];
    }
};

module.exports = validation;
