const { body, check } = require('express-validator');

const validation = {
    signupValidation: function () {
        var validation = [
            // TODO: check unique email
            check('email', 'Please enter a valid email address').isEmail(),
            check(
                'password',
                'Password should contain at least 8 characters',
            ).isLength({ min: 8 }),
            check('passwordConfirm', 'Passwords do not match').custom(
                (value, { req }) => value === req.body.password,
            ),
        ];
        return validation;
    },
};

module.exports = validation;
