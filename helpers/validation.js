const { body, check } = require('express-validator');

const validation = {
    signupValidation: function () {
        var validation = [
            check('fname', 'First name should not be empty').notEmpty(),
            check('lname', 'Last name should not be empty').notEmpty(),
            check('email', 'Please enter a valid email address').isEmail(),
            // check('confemail', 'Emails do not match').custom(
            //     (value, { req }) => value === req.body.email,
            // ),
            check('password', 'Password should not be empty').notEmpty(),
            check('confpassword', 'Passwords do not match')
                .exists()
                .custom((value, { req, loc, path }) => {
                    if (value !== req.body.password) {
                        // trow error if passwords do not match
                        throw new Error("Passwords don't match");
                    } else {
                        return value;
                    }
                }),
        ];
        return validation;
    },
};

module.exports = validation;
