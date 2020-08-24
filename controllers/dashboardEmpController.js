const dashboardEmpController = {
    getCreateJob: function (req, res) {
        res.render('create', {
        	active_session: (req.session.user && req.cookies.user_sid),
       		active_user: req.session.user,
            title: 'Post Job | BookMeDental',
            profile_active: true,
        });
    },
};

// enables to export controller object when called in another .js file
module.exports = dashboardEmpController;
