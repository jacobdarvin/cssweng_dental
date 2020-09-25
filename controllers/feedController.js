const helper = require('../helpers/helper');
const db = require('../models/db');

const Job = require('../models/JobModel');
const Applicant = require('../models/ApplicantModel');
const Employer = require('../models/EmployerModel');
const Response = require('../models/EmpResponseModel');
const pagination = require('../helpers/pagination');
const { validationResult } = require('express-validator');

const fs = require('fs');
const path = require('path');
const { SSL_OP_NO_TLSv1_1 } = require('constants');

const buffer = fs.readFileSync(
    path.resolve(__dirname, '../public/json/us_cities_and_states.json'),
);
const citiesAndStates = JSON.parse(buffer);

const feedController = {
    getEmpFeed: function (req, res) {
        if (!(req.session.user && req.cookies.user_sid)) {
            res.redirect('/login');
            return;
        }

        if (req.session.accType != 'employer') {
            res.render('404', {
                active_session: req.session.user && req.cookies.user_sid,
                active_user: req.session.user,
                title: '404 Page Not Found | BookMeDental',
            });
        }

        console.log('getFiltered request');

        let positionQuery = new Array();
        let placementQuery = new Array();

        let positionStatus = helper.sanitize(req.query.position);
        let placementStatus = helper.sanitize(req.query.placement);

        let stateQuery = new Array();
        let cityQuery = new Array();

        let stateStatus = helper.sanitize(req.query.clinic_state);
        let cityStatus = helper.sanitize(req.query.clinic_city);

        let date_start = helper.parseDate(
            helper.sanitize(req.query.date_start),
        );
        let unparsed_start = req.query.date_start;

        let date_end = helper.parseDate(helper.sanitize(req.query.date_end));
        let unparsed_end = req.query.date_end;

        if (date_start == null) {
            date_start = new Date(-8640000000000000);
        }

        if (date_end == null) {
            date_end = new Date(8640000000000000);
        }

        if (Array.isArray(positionStatus)) {
            for (let i = 0; i < positionStatus.length; i++) {
                positionQuery.push(positionStatus[i]);
            }
        } else if (positionStatus) {
            positionQuery.push(positionStatus);
        } else {
            positionQuery.push(
                'Dentist',
                'Dental Hygienist',
                'Front Desk',
                'Dental Assistant',
            );
        }

        if (Array.isArray(placementStatus)) {
            for (let i = 0; i < placementStatus.length; i++) {
                placementQuery.push(placementStatus[i]);
            }
        } else if (placementStatus) {
            placementQuery.push(placementStatus);
        } else {
            placementQuery.push('Permanent', 'Temporary');
        }

        if (stateStatus == undefined || stateStatus == '') {
            stateQuery = Object.keys(citiesAndStates).sort();
        } else {
            stateQuery.push(stateStatus);
        }

        if (cityStatus == undefined || cityStatus == '') {
            cityQueryLoad = new Array();

            cityQueryLoad = Object.values(citiesAndStates).sort();

            for (let i = 0; i < cityQueryLoad.length; i++) {
                for (let j = 0; j < cityQueryLoad[i].length; j++) {
                    cityQuery.push(cityQueryLoad[i][j]);
                }
            }
        } else {
            cityQuery.push(cityStatus);
        }

        //console.log(stateQuery);
        //console.log(cityQuery);

        db.findOne(Employer, { account: req.session.user }, '_id', function (
            emp,
        ) {
            let page = helper.sanitize(req.query.page);

            if (page == null) {
                page = '1';
            }

            let options = {
                populate: 'employer',
                lean: true,
                page: page,
                limit: 4,

                sort: {
                    created: -1,
                },
            };

            let query = {
                employer: emp._id,
                position: { $in: positionQuery },
                placement: { $in: placementQuery },

                clinic_city: { $in: cityQuery },
                clinic_state: { $in: stateQuery },

                // date_start: { $gte: date_start.toISOString() },
                // date_end: { $lte: date_end.toISOString() },
            };

            helper.updatePostedDate();
            Job.paginate(query, options, function (err, results) {
                // console.log(results);

                let selectOptions = new Array();

                //console.log(placementQuery);
                //console.log(positionQuery);

                let placementLink = '';
                let positonLink = '';

                let cityLink = '';
                let stateLink = '';

                let dstartLink = '&date_start=' + unparsed_start;
                let dendLink = '&date_end=' + unparsed_end;

                for (let i = 0; i < placementQuery.length; i++) {
                    if (i == 0)
                        placementLink += 'placement=' + placementQuery[i];
                    else placementLink += '&placement=' + placementQuery[i];
                }

                for (let i = 0; i < positionQuery.length; i++) {
                    positonLink += '&position=' + positionQuery[i];
                }

                if (stateStatus == null) {
                    cityLink = '&clinic_city=';
                } else {
                    cityLink = '&clinic_city=' + cityStatus;
                }

                if (cityStatus == null) {
                    stateLink = '&clinic_state=';
                } else {
                    stateLink = '&clinic_state=' + stateStatus;
                }

                for (let i = 0; i < results.pages; i++) {
                    let nPage = i + 1;

                    let options = {
                        pageLink:
                            '/feed-emp?' +
                            placementLink +
                            positonLink +
                            stateLink +
                            cityLink +
                            dstartLink +
                            dendLink +
                            '&page=' +
                            nPage,
                        pageNo: nPage,
                        isSelected: results.page == nPage,
                    };

                    selectOptions.push(options);
                }

                //fix this logic

                let nextPageNumber = parseInt(results.page) + 1;
                let prevPageNumber = parseInt(results.page) - 1;

                let prevPageLink =
                    results.page != '1'
                        ? '/feed-emp?' +
                          placementLink +
                          positonLink +
                          stateLink +
                          cityLink +
                          dstartLink +
                          dendLink +
                          '&page=' +
                          prevPageNumber
                        : '';
                let nextPageLink =
                    results.page != results.pages
                        ? '/feed-emp?' +
                          placementLink +
                          positonLink +
                          stateLink +
                          cityLink +
                          dstartLink +
                          dendLink +
                          '&page=' +
                          nextPageNumber
                        : '';

                let hasPrevPage = true;
                let hasNextPage = true;

                if (prevPageLink) {
                    hasPrevPage = true;
                } else {
                    hasPrevPage = false;
                }

                if (nextPageLink) {
                    hasNextPage = true;
                } else {
                    hasNextPage = false;
                }

                //console.log(parseInt(results.page) + 1);

                let resultWarn = '';

                if (results.total == 0) {
                    resultWarn = 'No Jobs returned From Filter';
                }

                res.render('feed', {
                    active_session: req.session.user && req.cookies.user_sid,
                    active_user: req.session.user,
                    title: 'Job Feed | BookMeDental',
                    filter_route: '/feed-emp',
                    profile_active: true,
                    jobs: results.docs,
                    warn: resultWarn,

                    //cities and states
                    states: Object.keys(citiesAndStates).sort(),
                    cities: req.body.clinic_state
                        ? citiesAndStates[req.body.clinic_state].sort()
                        : '',
                    // navbar indicator
                    accType: req.session.accType,

                    //Pagination
                    selectOptions: selectOptions,
                    hasPrev: hasPrevPage,
                    hasNext: hasNextPage,
                    prevPageLink: prevPageLink,
                    nextPageLink: nextPageLink,
                });
            });
        });
    },

    getAppFeed: function (req, res) {
        if (!(req.session.user && req.cookies.user_sid)) {
            res.redirect('/login');
            return;
        }

        if (req.session.accType != 'applicant') {
            res.render('404', {
                active_session: req.session.user && req.cookies.user_sid,
                active_user: req.session.user,
                title: '404 Page Not Found | BookMeDental',
            });
        }
        console.log('getFiltered request');

        let positionQuery = new Array();
        let placementQuery = new Array();

        let positionStatus = helper.sanitize(req.query.position);
        let placementStatus = helper.sanitize(req.query.placement);

        let stateQuery = new Array();
        let cityQuery = new Array();

        let stateStatus = helper.sanitize(req.query.clinic_state);
        let cityStatus = helper.sanitize(req.query.clinic_city);

        let date_start = helper.parseDate(
            helper.sanitize(req.query.date_start),
        );
        let unparsed_start = req.query.date_start;

        let date_end = helper.parseDate(helper.sanitize(req.query.date_end));
        let unparsed_end = req.query.date_end;

        if (date_start == null) {
            date_start = new Date(-8640000000000000);
        }

        if (date_end == null) {
            date_end = new Date(8640000000000000);
        }

        if (Array.isArray(positionStatus)) {
            for (let i = 0; i < positionStatus.length; i++) {
                positionQuery.push(positionStatus[i]);
            }
        } else if (positionStatus) {
            positionQuery.push(positionStatus);
        } else {
            positionQuery.push(
                'Dentist',
                'Dental Hygienist',
                'Front Desk',
                'Dental Assistant',
            );
        }

        if (Array.isArray(placementStatus)) {
            for (let i = 0; i < placementStatus.length; i++) {
                placementQuery.push(placementStatus[i]);
            }
        } else if (placementStatus) {
            placementQuery.push(placementStatus);
        } else {
            placementQuery.push('Permanent', 'Temporary');
        }

        if (stateStatus == undefined || stateStatus == '') {
            stateQuery = Object.keys(citiesAndStates).sort();
        } else {
            stateQuery.push(stateStatus);
        }

        if (cityStatus == undefined || cityStatus == '') {
            cityQueryLoad = new Array();

            cityQueryLoad = Object.values(citiesAndStates).sort();

            for (let i = 0; i < cityQueryLoad.length; i++) {
                for (let j = 0; j < cityQueryLoad[i].length; j++) {
                    cityQuery.push(cityQueryLoad[i][j]);
                }
            }
        } else {
            cityQuery.push(cityStatus);
        }

        let page = helper.sanitize(req.query.page);

        if (page == null) {
            page = '1';
        }

        let options = {
            populate: 'employer',
            lean: true,
            page: page,
            limit: 4,

            sort: {
                created: -1,
            },
        };

        let query = {
            position: { $in: positionQuery },
            placement: { $in: placementQuery },

            clinic_city: { $in: cityQuery },
            clinic_state: { $in: stateQuery },

            date_start: { $gte: date_start.toISOString() },
            date_end: { $lte: date_end.toISOString() },
        };

        helper.updatePostedDate();
        Job.paginate(query, options, function (err, results) {
            console.log(results);

            let selectOptions = new Array();

            console.log(placementQuery);
            console.log(positionQuery);

            let placementLink = '';
            let positonLink = '';

            let cityLink = '';
            let stateLink = '';

            let dstartLink = '&date_start=' + unparsed_start;
            let dendLink = '&date_end=' + unparsed_end;

            for (let i = 0; i < placementQuery.length; i++) {
                if (i == 0) placementLink += 'placement=' + placementQuery[i];
                else placementLink += '&placement=' + placementQuery[i];
            }

            for (let i = 0; i < positionQuery.length; i++) {
                positonLink += '&position=' + positionQuery[i];
            }

            if (stateStatus == null) {
                cityLink = '&clinic_city=';
            } else {
                cityLink = '&clinic_city=' + cityStatus;
            }

            if (cityStatus == null) {
                stateLink = '&clinic_state=';
            } else {
                stateLink = '&clinic_state=' + stateStatus;
            }

            for (let i = 0; i < results.pages; i++) {
                let nPage = i + 1;

                let options = {
                    pageLink:
                        '/feed-app?' +
                        placementLink +
                        positonLink +
                        stateLink +
                        cityLink +
                        dstartLink +
                        dendLink +
                        '&page=' +
                        nPage,
                    pageNo: nPage,
                    isSelected: results.page == nPage,
                };

                selectOptions.push(options);
            }

            //fix this logic

            let nextPageNumber = parseInt(results.page) + 1;
            let prevPageNumber = parseInt(results.page) - 1;

            let prevPageLink =
                results.page != '1'
                    ? '/feed-app?' +
                      placementLink +
                      positonLink +
                      stateLink +
                      cityLink +
                      dstartLink +
                      dendLink +
                      '&page=' +
                      prevPageNumber
                    : '';
            let nextPageLink =
                results.page != results.pages
                    ? '/feed-app?' +
                      placementLink +
                      positonLink +
                      stateLink +
                      cityLink +
                      dstartLink +
                      dendLink +
                      '&page=' +
                      nextPageNumber
                    : '';

            let hasPrevPage = true;
            let hasNextPage = true;

            if (prevPageLink) {
                hasPrevPage = true;
            } else {
                hasPrevPage = false;
            }

            if (nextPageLink) {
                hasNextPage = true;
            } else {
                hasNextPage = false;
            }

            let resultWarn = '';

            if (results.total == 0) {
                resultWarn = 'No Jobs returned From Filter';
            }

            console.log(parseInt(results.page) + 1);

            res.render('feed', {
                active_session: req.session.user && req.cookies.user_sid,
                active_user: req.session.user,
                title: 'Job Feed | BookMeDental',
                filter_route: '/feed-app',
                profile_active: true,
                jobs: results.docs,
                warn: resultWarn,

                //cities and states
                states: Object.keys(citiesAndStates).sort(),
                cities: req.body.clinic_state
                    ? citiesAndStates[req.body.clinic_state].sort()
                    : '',
                // navbar indicator
                accType: req.session.accType,

                //Pagination
                selectOptions: selectOptions,
                hasPrev: hasPrevPage,
                hasNext: hasNextPage,
                prevPageLink: prevPageLink,
                nextPageLink: nextPageLink,
            });
        });
    },

    getIndivJob: function (req, res, next) {
        if (!(req.session.user && req.cookies.user_sid)) {
            res.redirect('/login');
            return;
        }
        var sntJobId = helper.sanitize(req.params.jobId);

        db.findOne(Job, { _id: sntJobId }, '', function (job) {
            if (job) {
                var url;

                if (req.session.accType == 'applicant') {
                    url = `/jobs/${job._id}`;
                } else if (req.session.accType == 'employer') {
                    url = `/jobs/${job._id}/applicants`;
                }

                job.populate(
                    { path: 'employer', options: { lean: true } },
                    async function (err, data) {
                        if (err) throw err;

                        var applied;

                        if (req.session.accType == 'applicant') {
                            var applicant = await Applicant.findOne(
                                { account: req.session.user },
                                '_id',
                            ).exec();
                            applied = data.applicants.includes(applicant._id);
                            helper.updatePostedDate();
                            db.findOne(
                                Response,
                                { applicantId: applicant._id, jobId: sntJobId },
                                '',
                                function (response) {
                                    if (response) {
                                        res.render('details', {
                                            active_session:
                                                req.session.user &&
                                                req.cookies.user_sid,
                                            active_user: req.session.user,
                                            title:
                                                data.placement +
                                                ' ' +
                                                data.position +
                                                ' | ' +
                                                'BookMeDental',
                                            profile_active: true,
                                            jobData: data.toObject(),
                                            date: helper.formatDate(
                                                data.created,
                                            ),
                                            response: response.toObject(),
                                            type: response.type,

                                            // additional config
                                            accType: req.session.accType,
                                            url,
                                            applied,
                                        });
                                    } else {
                                        res.render('details', {
                                            active_session:
                                                req.session.user &&
                                                req.cookies.user_sid,
                                            active_user: req.session.user,
                                            title:
                                                data.placement +
                                                ' ' +
                                                data.position +
                                                ' | ' +
                                                'BookMeDental',
                                            profile_active: true,
                                            jobData: data.toObject(),
                                            date: helper.formatDate(
                                                data.created,
                                            ),
                                            await: true,

                                            // additional config
                                            accType: req.session.accType,
                                            url,
                                            applied,
                                        });
                                    }
                                },
                            );
                        } else {
                            console.log(data);
                            helper.updatePostedDate();
                            res.render('details', {
                                active_session:
                                    req.session.user && req.cookies.user_sid,
                                active_user: req.session.user,
                                title:
                                    data.placement +
                                    ' ' +
                                    data.position +
                                    ' | ' +
                                    'BookMeDental',
                                profile_active: true,
                                jobData: data.toObject(),
                                date: helper.formatDate(data.created),

                                // additional config
                                accType: req.session.accType,
                                url,
                                applied,
                            });
                        }
                    },
                );
            } else {
                res.status(404);
                next();
            }
        });
    },

    postIndivJob: function (req, res) {
        if (!(req.session.user && req.cookies.user_sid)) {
            res.redirect('/login');
            return;
        }

        db.findOne(Applicant, { account: req.session.user }, '_id', function (
            applicant,
        ) {
            var sntJobId = helper.sanitize(req.params.jobId);

            db.updateOne(
                Job,
                { _id: sntJobId },
                { $push: { applicants: applicant._id } },
                function (result) {
                    helper.updatePostedDate();
                    if (result) {
                        db.updateOne(
                            Applicant,
                            { _id: applicant._id },
                            { $push: { appliedJobs: sntJobId } },
                            function (result) {
                                if (result) {
                                    res.redirect('/feed-app');
                                } else {
                                    res.redirect(`/jobs/${sntJobId}`);
                                }
                            },
                        );
                    } else res.redirect(`/jobs/${sntJobId}`);
                },
            );
        });
    },

    getJobApplicants: function (req, res, next) {
        if (!(req.session.user && req.cookies.user_sid)) {
            res.redirect('/login');
            return;
        }

        if (req.session.accType != 'employer') {
            // res.status(403).send('Forbidden: you are not an employer');
            // return;
            res.render('404', {
                active_session: req.session.user && req.cookies.user_sid,
                active_user: req.session.user,
                title: '404 Page Not Found | BookMeDental',
            });
        }

        var sntJobId = helper.sanitize(req.params.jobId);

        db.findOne(Job, { _id: sntJobId }, 'applicants', function (job) {
            if (job) {
                let placementQuery = pagination.initQueryArray(
                    helper.sanitize(req.query.placement),
                    ['Permanent Work', 'Temporary Work'],
                );
                let positionQuery = pagination.initQueryArray(
                    helper.sanitize(req.query.position),
                    [
                        'Dentist',
                        'Dental Hygienist',
                        'Front Desk',
                        'Dental Assistant',
                    ],
                );

                let page = helper.sanitize(req.query.page);
                if (page == null) page = '1';

                let options = {
                    select: 'avatar fName lName placement position',
                    lean: true,
                    page: page,
                    limit: 6,
                };

                let query = {
                    account: { $exists: true },
                    _id: { $in: job.applicants },
                    position: { $in: positionQuery },
                    placement: { $in: placementQuery },
                };

                Applicant.paginate(query, options, function (err, results) {
                    if (err) throw err;
                    let route = `/jobs/${sntJobId}/applicants`;

                    let placementLink = pagination.createQueryLink(
                        placementQuery,
                        'placement',
                    );
                    let positionLink = pagination.createQueryLink(
                        positionQuery,
                        'position',
                    );

                    let queryLinks = [];
                    queryLinks.push(positionLink);
                    queryLinks.push(placementLink);
                    const {
                        selectOptions,
                        prevPageLink,
                        nextPageLink,
                        hasPrevPage,
                        hasNextPage,
                    } = pagination.configPagination(results, route, queryLinks);

                    let resultWarn = '';

                    if (results.total == 0) {
                        resultWarn = 'No Applicants returned From Filter';
                    }

                    res.render('feed-app', {
                        active_session:
                            req.session.user && req.cookies.user_sid,
                        active_user: req.session.user,
                        title: 'Applicants | BookMeDental',
                        filter_route: route,
                        profile_active: true,
                        applicants: results.docs,
                        profile_route: `/jobs/${sntJobId}/applicants`,

                        warn: resultWarn,

                        // Pagination
                        selectOptions: selectOptions,
                        hasPrev: hasPrevPage,
                        hasNext: hasNextPage,
                        prevPageLink: prevPageLink,
                        nextPageLink: nextPageLink,
                    });
                });
            } else {
                res.status(404);
                next();
            }
        });
    },

    getAppProfile: function (req, res, next) {
        if (!(req.session.user && req.cookies.user_sid)) {
            res.redirect('/login');
            return;
        }

        if (req.session.accType != 'employer') {
            // res.status(403).send('Forbidden: you are not an employer');
            // return;
            res.render('404', {
                active_session: req.session.user && req.cookies.user_sid,
                active_user: req.session.user,
                title: '404 Page Not Found | BookMeDental',
            });
        }

        var sntAppId = helper.sanitize(req.params.appId);
        var jobId = helper.sanitize(req.params.jobId);
        db.findOne(
            Response,
            {
                accEmpId: req.session.user,
                applicantId: sntAppId,
                type: 'hire',
                jobId: jobId,
            },
            '',
            function (response) {
                db.findOne(Applicant, { _id: sntAppId }, '', function (
                    applicant,
                ) {
                    if (applicant) {
                        applicant.populate(
                            {
                                path: 'account',
                                select: 'accEmail -_id',
                                options: { lean: true },
                            },
                            function (err, result) {
                                if (err) throw err;

                                if (response) {
                                    res.render('details-app', {
                                        active_session:
                                            req.session.user &&
                                            req.cookies.user_sid,
                                        active_user: req.session.user,
                                        title: `Applicant ${applicant.fName} ${applicant.lName} | BookMeDental`,
                                        appData: result.toObject(),
                                        profile_active: true,
                                        jobId: req.params.jobId,
                                        type: 'hire',
                                        response: true,

                                        // additional config
                                        from: 'jobs',
                                    });
                                } else {
                                    res.render('details-app', {
                                        active_session:
                                            req.session.user &&
                                            req.cookies.user_sid,
                                        active_user: req.session.user,
                                        title: `Applicant ${applicant.fName} ${applicant.lName} | BookMeDental`,
                                        appData: result.toObject(),
                                        profile_active: true,
                                        jobId: req.params.jobId,
                                        type: 'hire',

                                        // additional config
                                        from: 'jobs',
                                    });
                                }
                            },
                        );
                    } else {
                        res.status(404);
                        next();
                    }
                });
            },
        );
    },

    getAppliedAppFeed: function (req, res, next) {
        if (!(req.session.user && req.cookies.user_sid)) {
            res.redirect('/login');
            return;
        }

        if (req.session.accType != 'applicant') {
            res.render('404', {
                active_session: req.session.user && req.cookies.user_sid,
                active_user: req.session.user,
                title: '404 Page Not Found | BookMeDental',
            });
        }

        let placementQuery = pagination.initQueryArray(
            helper.sanitize(req.query.placement),
            ['Permanent', 'Temporary'],
        );

        let positionQuery = pagination.initQueryArray(
            helper.sanitize(req.query.position),
            ['Dentist', 'Dental Hygienist', 'Front Desk', 'Dental Assistant'],
        );

        let stateQuery = pagination.initQueryArray(
            helper.sanitize(req.query.clinic_state),
            Object.keys(citiesAndStates).sort(),
        );

        let allCities = [].concat.apply(
            [],
            Object.values(citiesAndStates).sort(),
        );

        let cityQuery = pagination.initQueryArray(
            helper.sanitize(req.query.clinic_city),
            allCities,
        );

        let page = helper.sanitize(req.query.page);
        if (page == null) page = '1';

        Applicant.findOne({ account: req.session.user }, 'appliedJobs')
            .exec()
            .then(doc => {
                let options = {
                    populate: 'employer',
                    lean: true,
                    page: page,
                    limit: 4,
                };

                let query = {
                    position: { $in: positionQuery },
                    placement: { $in: placementQuery },

                    clinic_city: { $in: cityQuery },
                    clinic_state: { $in: stateQuery },
                    _id: { $in: doc.appliedJobs },
                };

                helper.updatePostedDate();

                return Job.paginate(query, options);
            })
            .then(results => {
                let route = `/feed-app/applied-jobs`;

                let placementLink = pagination.createQueryLink(
                    placementQuery,
                    'placement',
                );
                let positionLink = pagination.createQueryLink(
                    positionQuery,
                    'position',
                );

                let cityLink = pagination.createQueryLink(
                    req.query.clinic_city ? cityQuery : '',
                    'clinic_city',
                );

                let stateLink = pagination.createQueryLink(
                    stateQuery,
                    'clinic_state',
                );

                let queryLinks = [];
                queryLinks.push(positionLink);
                queryLinks.push(placementLink);
                queryLinks.push(cityLink);
                queryLinks.push(stateLink);

                const {
                    selectOptions,
                    prevPageLink,
                    nextPageLink,
                    hasPrevPage,
                    hasNextPage,
                } = pagination.configPagination(results, route, queryLinks);

                let resultWarn = '';

                if (results.total == 0) {
                    resultWarn = 'No Applicants returned From Filter';
                }

                res.render('feed', {
                    active_session: req.session.user && req.cookies.user_sid,
                    active_user: req.session.user,
                    title: 'Job Feed | BookMeDental',
                    filter_route: route,
                    profile_active: true,
                    jobs: results.docs,
                    warn: resultWarn,

                    //cities and states
                    states: Object.keys(citiesAndStates).sort(),
                    cities: req.body.clinic_state
                        ? citiesAndStates[req.body.clinic_state].sort()
                        : '',
                    // navbar indicator
                    accType: req.session.accType,

                    //Pagination
                    selectOptions: selectOptions,
                    hasPrev: hasPrevPage,
                    hasNext: hasNextPage,
                    prevPageLink: prevPageLink,
                    nextPageLink: nextPageLink,
                });
            })
            .catch(err => {
                console.log(err);
                res.status(404);
                next();
            });
    },

    postEditDescription: function (req, res) {
        var description = req.body.description.trim();
        db.updateOne(
            Job,
            { _id: req.params.jobId },
            { description },
            result => {
                if (result) res.send({ description });
                else res.status(500).send('An error occurred in the server.');
            },
        );
    },

    getPopulatedJobDetails: async function (req, res) {
        try {
            const job = await Job.findById(req.params.jobId)
                .populate('employer')
                .exec();
            res.render(
                './partials/editJobForm',
                { jobData: job.toObject(), layout: false },
                (err, html) => {
                    if (err) throw err;
                    res.send(html);
                },
            );
        } catch (error) {
            console.log(error);
            res.send(error);
        }
    },

    postEditJobDetails: function (req, res) {
        var errors = validationResult(req);

        if (!errors.isEmpty()) {
            errors = errors.errors;

            res.send(errors.map(e => e.msg));
        } else {
            const { date_start, date_end, ...rest } = req.body;

            const obj =
                rest.placement === 'Temporary'
                    ? { ...rest, date_start, date_end }
                    : { ...rest, $unset: { date_start, date_end } };

            // update database
            db.updateOne(Job, { _id: req.params.jobId }, obj, result => {
                if (result) {
                    res.send(obj);
                } else {
                    res.status(500).send('An error occurred in the server');
                }
            });
        }
    },
};

// enables to export controller object when called in another .js file
module.exports = feedController;
