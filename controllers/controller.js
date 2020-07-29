// define objects for client request functions for a certain path in the server
const controller = {
    // render log-in page when client requests '/' defined in routes.js
    getIndex: function (req, res) {
        // res.render('index');
        res.send('hello worlds');
    },
    getRegister: function(req, res) {
        // OK
        res.render('register');
    }
};

// enables to export controller object when called in another .js file
module.exports = controller;
