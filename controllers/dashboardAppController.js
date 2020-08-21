const dashboardAppController = {
    // render log-in page when client requests '/' defined in routes.js
    getAppDashboard: function (req, res) {
        res.render('dashboard-app', {
        	active_session: (req.session.user && req.cookies.user_sid),
       		active_user: req.session.user,
            title: 'Dashboard | BookMeDental',
            profile_active: true,
        });
    },
};

// enables to export controller object when called in another .js file
module.exports = dashboardAppController;
