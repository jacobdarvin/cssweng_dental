const moment = require('moment');

const db = require('../models/db');
const sanitize = require('mongo-sanitize');

const Job = require('../models/JobModel');
const Employer = require('../models/EmployerModel');

const JOB_SELECT = '_id placement position date'

const feedController = {

    getEmpFeed: function (req, res) {
         if (!(req.session.user && req.cookies.user_sid)) {
            res.redirect('/login');
            return;
        }

        console.log('getFiltered request');

        let positionQuery = new Array();
        let placementQuery = new Array();

        let positionStatus = sanitize(req.query.position);
        let placementStatus = sanitize(req.query.placement);

        let dateStatus = parseDate(sanitize(req.query.date));

        if(Array.isArray(positionStatus)) {
            for(let i = 0; i < positionStatus.length; i++) {
                positionQuery.push(positionStatus[i]);
            }
        } else if (positionStatus) {
            positionQuery.push(positionStatus);
        } 
        else {
            positionQuery.push('Dentist', 'Dental Hygienist', 'Front Desk', 'Dental Assistant');
        }

        if(Array.isArray(placementStatus)) {
            for(let i = 0; i < placementStatus.length; i++) {
                placementQuery.push(placementStatus[i]);
            }
        } else if (placementStatus) {
            placementQuery.push(placementStatus);
        } 
        else {
            placementQuery.push('Permanent', 'Temporary');
        }

        db.findOne(Employer, {account: req.session.user}, '_id', function(emp){

            let page = sanitize(req.query.page);

            if (page == null) {
                page = 1;
            }

            let options = {
                lean: true,
                page: page,
                limit: 2,

                sort: {
                    dateStatus: -1
                }
            };

            let query = {
                employer  : emp._id,
                position  : { $in: positionQuery },
                placement : { $in : placementQuery}
            };
            
            Job.paginate(query, options,
                function(err, results) {
                console.log(results);

                let selectOptions = new Array()

                console.log(placementQuery);
                console.log(positionQuery);

                let placementLink = "";
                let positonLink = "";

                for(let i = 0; i < placementQuery.length; i++) {
                    if(i == 0)
                        placementLink += "placement=" + placementQuery[i];
                    else
                        placementLink += "&placement=" + placementQuery[i];
                }

                for(let i = 0; i < positionQuery.length; i++) {
                    positonLink += "&position=" + positionQuery[i];
                }

                for (let i = 0; i < results.pages; i++) {
                    let nPage = i + 1;

                    let options = {
                        pageLink: "/feed-emp?" + placementLink + positonLink + "&page=" + nPage,
                        pageNo : nPage,
                        isSelected : (results.page == nPage),
                    };

                    selectOptions.push(options);
                }

                //fix this logic

                let prevPageLink = (results.pages != 1) ? "/feed-emp?placement=" + query.placement + "&position=" + query.position + "$date=" + req.query.date + "&page=" + parseInt(results.page) - 1: "";
                let nextPageLink = (results.page == parseInt(results.limit)) ? "/feed-emp?placement=" + query.placement + "&position=" + query.position + "$date=" + req.query.date + "&page=" + parseInt(results.page) + 1 : "";
                    
                    res.render('feed', {
                        active_session: (req.session.user && req.cookies.user_sid),
                        active_user: req.session.user,
                        title: 'Job Feed | BookMeDental',
                        filter_route:'/feed-emp',
                        profile_active: true,
                        jobs: results.docs,

                        //Pagination
                        selectOptions: selectOptions,
                        hasPrev: results.hasPrevPage,
                        hasNext: results.hasNextPage,
                        prevPageLink: prevPageLink,
                        nextPageLink: nextPageLink
                    });
                })
            /*
            db.findMany(Job, query, '', function(result){
                Employer.populate(result, {path: 'employer', options: {lean: true}}, function (err, data){
                        if (err) throw err;
                        res.render('feed', {
                        active_session: (req.session.user && req.cookies.user_sid),
                        active_user: req.session.user,
                        title: 'Job Feed | BookMeDental',
                        filter_route:'/feed-emp',
                        profile_active: true,
                        jobs: data
                    });
                })
            })
            */
        });
    },

    getAppFeed: function (req, res) {

        if (!(req.session.user && req.cookies.user_sid)) {
            res.redirect('/login');
            return;
        }

        console.log('getFiltered request');

        let positionQuery = new Array();
        let placementQuery = new Array();

        let positionStatus = sanitize(req.query.position);
        let placementStatus = sanitize(req.query.placement);

        let dateStatus = parseDate(sanitize(req.query.date));

        if(positionStatus) {
            positionQuery = positionStatus;
        } else {
            positionQuery.push('Dentist', 'Dental Hygienist', 'Front Desk', 'Dental Assistant');
        }

        if(placementStatus) {
            placementQuery = placementStatus;
        } else {
            placementQuery.push('Permanent', 'Temporary');
        }

        console.log(positionQuery);
        console.log(placementQuery);

        let query = {
            position : { $in: positionQuery },
            placement : { $in : placementQuery}
        };

        db.findMany(Job, query, '', function(result){
            Employer.populate(result, {path: 'employer', options: {lean: true}}, function (err, data){
                if (err) throw err;
                res.render('feed', {
                    active_session: (req.session.user && req.cookies.user_sid),
                    active_user: req.session.user,
                    title: 'Applicant Feed | BookMeDental',
                    filter_route:'/feed-app',
                    profile_active: true,
                    jobs: data
                });
            });
        });
    },

    getIndivJob: function (req,res){
        db.findOne(Job, {_id: req.query._id}, '', function(result){
            if(result){
                result 
                    .populate('employer')
                    .execPopulate(function(err,data){
                        if (err) throw err;
                        res.render('details',{
                            active_session: (req.session.user && req.cookies.user_sid),
                            active_user: req.session.user,
                            title: data.placement + ' ' + data.position + ' | ' + 'BookMeDental',
                            profile_active: true,
                            jobData: data.toObject()
                        })
                    })
            }
            
        })
    },
};

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

// enables to export controller object when called in another .js file
module.exports = feedController;