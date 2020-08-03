const adminController = {
    getAdmin: function (req, res) {
        res.render('admin', {
            title: 'Admin | BookMeDental',
            admin_active: true,
        });
    },
};

module.exports = adminController;
