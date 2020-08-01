const profileController = {
    // render log-in page when client requests '/' defined in routes.js
    getProfile: function (req, res) {
        res.render('profile', {
            title: 'Profile | BookMeDental',
            profile_active: true,
        });
    },
};

// enables to export controller object when called in another .js file
module.exports = profileController;
