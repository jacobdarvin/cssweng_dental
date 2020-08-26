const moment = require('moment');
const Order = require('../model/order.js');
const sanitize = require('mongo-sanitize');
const { filter } = require('async');
const { options } = require('../routes/routes.js');

const CARD_SELECT = '_id paymentStatus deliveryStatus orderDate';

const ordersController = {
    getFilteredOrderPage: function(req, res) {
        if (!(req.session.user && req.cookies.user_sid)) {
            res.redirect('/login');
            return;
        }
        console.log('getFiltered request')
        let deliveryQueries = new Array();
        let paymentQueries = new Array();

        let deliveryStatus = sanitize(req.query.deliveryStatus);
        if (deliveryStatus == 'SELECT' || deliveryStatus == null || deliveryStatus == 'undefined') {
            deliveryQueries.push('PROCESSING', 'DELIVERING', 'DELIVERED');
        } else {
            deliveryQueries.push(deliveryStatus);
        }

        let paymentStatus = sanitize(req.query.paymentStatus);
        if (paymentStatus == 'SELECT' || paymentStatus == null || paymentStatus == 'undefined') {
            paymentQueries.push('TO PAY', 'PAID');
        } else {
            paymentQueries.push(paymentStatus);
        }

        let dateStart = parseDate(sanitize(req.query.dateStart));
        let dateEnd = parseDate(sanitize(req.query.dateEnd));

        let page = sanitize(req.query.page);
        if (page == null) {
            page = 1;
        }

        let options = {
            select: CARD_SELECT,
            lean: true,
            page: page,
            limit: 2,

            sort: {
                orderDate: -1
            }
        };

        dateStart = (dateStart == null) ? new Date(-8640000000000000) : dateStart;
        dateEnd = (dateEnd == null) ? new Date(8640000000000000) : dateEnd;
        console.log(dateStart.toISOString());
        console.log(dateEnd.toISOString());

        let query= {
            deliveryStatus: {$in: deliveryQueries},   
            paymentStatus: {$in : paymentQueries},
            
            
            orderDate: {
                $gte: dateStart.toISOString(),
                $lte: dateEnd.toISOString()
            } 
        };

        Order.paginate(query, options, 
            function(err, results) {
            let filteredOrders = new Array();
            console.log(results)
           
            let selectOptions = new Array();
            for (let i = 0; i < results.totalPages; i++) {
                let no = i + 1;
                let options = {
                    pageLink: "/admin/orders?deliveryStatus=" + deliveryStatus + "&paymentStatus=" + paymentStatus + "&dateStart=" + req.query.dateStart + "&dateEnd=" + req.query.dateEnd + "&page=" + no,
                    pageNo: no,
                    isSelected: (results.page == no),
                };

                selectOptions.push(options);
            }

            let prevPageLink = results.hasPrevPage ? "/admin/orders?deliveryStatus=" + deliveryStatus + "&paymentStatus=" + paymentStatus + "&dateStart=" + req.query.dateStart + "&dateEnd=" + req.query.dateEnd + "&page=" + results.prevPage : ""
            let nextPageLink = results.hasNextPage ? "/admin/orders?deliveryStatus=" + deliveryStatus + "&paymentStatus=" + paymentStatus + "&dateStart=" + req.query.dateStart + "&dateEnd=" + req.query.dateEnd + "&page=" + results.nextPage : ""
            res.render('admin/orders', {
                title: 'Facemustph | Orders',
                layout: 'main',

                orderCards: results.docs,
                selectOptions: selectOptions,
                hasPrev: results.hasPrevPage,
                hasNext: results.hasNextPage,
                prevPageLink: prevPageLink,
                nextPageLink: nextPageLink

            });
        })
    }
}

function parseDate(s) {
    if (!(moment(s, 'YYYY-MM-DD', true).isValid())) {
        return null;
    }

    if (s == null || s === undefined) {
        return null;
    }

    var b = s.split(/\D/);
    let date = new Date(b[0], --b[1], b[2]);

    date.setHours(8, 0, 0, 0);

    return date;
}

module.exports = ordersController;