// define objects for client request functions for a certain path in the server
const controller = {
    // render log-in page when client requests '/' defined in routes.js
    getIndex: function (req, res) {
        res.render('index', {
            title: 'Home | BookMeDental',
            home_active: true,
        });
    },
};

// enables to export controller object when called in another .js file
module.exports = controller;
