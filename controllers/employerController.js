const employerController = {
    // render log-in page when client requests '/' defined in routes.js
    getEmpProfile: function (req, res) {
        res.render('profile-emp', {
        	active_session: (req.session.user && req.cookies.user_sid),
       		active_user: req.session.user,
            title: 'Dashboard | BookMeDental',
            profile_active: true,
        });
    },

    getCreateJob: function (req, res) {
        res.render('create', {
        	active_session: (req.session.user && req.cookies.user_sid),
       		active_user: req.session.user,
            title: 'Dashboard | BookMeDental',
            profile_active: true,
        });
    },
};

// enables to export controller object when called in another .js file
module.exports = employerController;
