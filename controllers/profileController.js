const profileController = {
    // render log-in page when client requests '/' defined in routes.js
    getProfile: function (req, res) {
        res.render('profile', {
        	active_session: (req.session.user && req.cookies.user_sid),
       		active_user: req.session.user,
            title: 'Profile | BookMeDental',
            profile_active: true,
        });
    },
};

// enables to export controller object when called in another .js file
module.exports = profileController;
