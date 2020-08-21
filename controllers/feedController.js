const feedController = {
    // render log-in page when client requests '/' defined in routes.js
    getFeed: function (req, res) {
        res.render('feed', {
        	active_session: (req.session.user && req.cookies.user_sid),
       		active_user: req.session.user,
            title: 'Job Feed | BookMeDental',
            profile_active: true,
        });
    },
};

// enables to export controller object when called in another .js file
module.exports = feedController;
