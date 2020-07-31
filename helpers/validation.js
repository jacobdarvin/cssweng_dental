const { check } = require('express-validator');
const account = require('../models/AccountModel');

const validation = {
    signupValidation: function () {
        return [
            check('email')
                .isEmail()
                .withMessage('Please enter a valid email address')
                .custom(async value => {
                    // check if email is already used
                    const data = await account
                        .findOne({ accEmail: value })
                        .exec();
                    // reject if a record is found
                    if (data) return Promise.reject();
                })
                .withMessage('Email is already in use'),
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
};

module.exports = validation;
