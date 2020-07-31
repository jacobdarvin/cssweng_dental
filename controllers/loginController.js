//const Account = require('../models/AccountModel');

const loginController = {

    getLogIn: function (req, res){
        res.render('login', {
            title: 'Login | BookMeDental',
            login_active: true,
        })
    }, 

}

module.exports = loginController;