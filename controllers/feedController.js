const moment = require('moment');

const db = require('../models/db');
const sanitize = require('mongo-sanitize');

const Job = require('../models/JobModel');
const Applicant = require('../models/ApplicantModel');
const Employer = require('../models/EmployerModel');
const pagination = require('../helpers/pagination');

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

        db.findOne(Employer, { account: req.session.user }, '_id', function (
            emp,
        ) {
            let page = sanitize(req.query.page);

            if (page == null) {
                page = '1';
            }

            let options = {
                populate: 'employer',
                lean: true,
                page: page,
                limit: 2,
            };

            let query = {
                employer: emp._id,
                position: { $in: positionQuery },
                placement: { $in: placementQuery },
            };

            Job.paginate(query, options, function (err, results) {
                console.log(results);

                let selectOptions = new Array();

                console.log(placementQuery);
                console.log(positionQuery);

                let placementLink = '';
                let positonLink = '';

                for (let i = 0; i < placementQuery.length; i++) {
                    if (i == 0)
                        placementLink += 'placement=' + placementQuery[i];
                    else placementLink += '&placement=' + placementQuery[i];
                }

                for (let i = 0; i < positionQuery.length; i++) {
                    positonLink += '&position=' + positionQuery[i];
                }

                for (let i = 0; i < results.pages; i++) {
                    let nPage = i + 1;

                    let options = {
                        pageLink:
                            '/feed-emp?' +
                            placementLink +
                            positonLink +
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
                          '&page=' +
                          prevPageNumber
                        : '';
                let nextPageLink =
                    results.page != results.pages
                        ? '/feed-emp?' +
                          placementLink +
                          positonLink +
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

                console.log(parseInt(results.page) + 1);

                res.render('feed', {
                    active_session: req.session.user && req.cookies.user_sid,
                    active_user: req.session.user,
                    title: 'Job Feed | BookMeDental',
                    filter_route: '/feed-emp',
                    profile_active: true,
                    jobs: results.docs,
                    // employer_active: true,

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
            res.status(403).send('Forbidden: you are not an applicant');
            return;
        }
        console.log('getFiltered request');

        let positionQuery = new Array();
        let placementQuery = new Array();

        let positionStatus = sanitize(req.query.position);
        let placementStatus = sanitize(req.query.placement);

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

        let page = sanitize(req.query.page);

        if (page == null) {
            page = '1';
        }

        let options = {
            populate: 'employer',
            lean: true,
            page: page,
            limit: 2,
        };

        let query = {
            position: { $in: positionQuery },
            placement: { $in: placementQuery },
        };

        Job.paginate(query, options, function (err, results) {
            console.log(results);

            let selectOptions = new Array();

            console.log(placementQuery);
            console.log(positionQuery);

            let placementLink = '';
            let positonLink = '';

            for (let i = 0; i < placementQuery.length; i++) {
                if (i == 0) placementLink += 'placement=' + placementQuery[i];
                else placementLink += '&placement=' + placementQuery[i];
            }

            for (let i = 0; i < positionQuery.length; i++) {
                positonLink += '&position=' + positionQuery[i];
            }

            for (let i = 0; i < results.pages; i++) {
                let nPage = i + 1;

                let options = {
                    pageLink:
                        '/feed-app?' +
                        placementLink +
                        positonLink +
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
                      '&page=' +
                      prevPageNumber
                    : '';
            let nextPageLink =
                results.page != results.pages
                    ? '/feed-app?' +
                      placementLink +
                      positonLink +
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

            console.log(parseInt(results.page) + 1);

            res.render('feed', {
                active_session: req.session.user && req.cookies.user_sid,
                active_user: req.session.user,
                title: 'Job Feed | BookMeDental',
                filter_route: '/feed-app',
                profile_active: true,
                jobs: results.docs,
                // applicant_active: true,

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
        var sntJobId = sanitize(req.params.jobId);

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
                        }

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

                            // additional config
                            accType: req.session.accType,
                            url,
                            applied,
                        });
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
            var sntJobId = sanitize(req.params.jobId);

            db.updateOne(
                Job,
                { _id: sntJobId },
                { $push: { applicants: applicant._id } },
                function (result) {
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
            res.status(403).send('Forbidden: you are not an employer');
            return;
        }

        var sntJobId = sanitize(req.params.jobId);

        db.findOne(Job, { _id: sntJobId }, 'applicants', function (job) {
            if (job) {
                let positionQuery = pagination.initQueryArray(
                    sanitize(req.query.position),
                    [
                        'Dentist',
                        'Dental Hygienist',
                        'Front Desk',
                        'Dental Assistant',
                    ],
                );

                let page = sanitize(req.query.page);
                if (page == null) page = '1';

                let options = {
                    select: 'avatar fName lName position',
                    lean: true,
                    page: page,
                    limit: 6,
                };

                let query = {
                    account: { $exists: true },
                    _id: { $in: job.applicants },
                    position: { $in: positionQuery },
                };

                Applicant.paginate(query, options, function (err, results) {
                    if (err) throw err;
                    let route = `/jobs/${sntJobId}/applicants`;

                    let positionLink = pagination.createQueryLink(
                        positionQuery,
                        'position',
                    );

                    let queryLinks = [];
                    queryLinks.push(positionLink);

                    const {
                        selectOptions,
                        prevPageLink,
                        nextPageLink,
                        hasPrevPage,
                        hasNextPage,
                    } = pagination.configPagination(results, route, queryLinks);

                    res.render('feed-app', {
                        active_session:
                            req.session.user && req.cookies.user_sid,
                        active_user: req.session.user,
                        title: 'Applicants | BookMeDental',
                        filter_route: route,
                        profile_active: true,
                        applicants: results.docs,
                        profile_route: `/jobs/${sntJobId}/applicants`,

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

    getAppProfile: function (req, res) {
        if (!(req.session.user && req.cookies.user_sid)) {
            res.redirect('/login');
            return;
        }

        if (req.session.accType != 'employer') {
            res.status(403).send('Forbidden: you are not an employer');
            return;
        }

        var sntAppId = sanitize(req.params.appId);
        db.findOne(Applicant, { _id: sntAppId }, '', function (applicant) {
            if (applicant) {
                applicant.populate(
                    {
                        path: 'account',
                        select: 'accEmail -_id',
                        options: { lean: true },
                    },
                    function (err, result) {
                        if (err) throw err;

                        res.render('details-app', {
                            active_session:
                                req.session.user && req.cookies.user_sid,
                            active_user: req.session.user,
                            title: `Applicant ${applicant.fName} ${applicant.lName} | BookMeDental`,
                            appData: result.toObject(),
                            profile_active: true,

                            // additional config
                            from: 'jobs',
                        });
                    },
                );
            } else {
                res.status(404);
                next();
            }
        });
    },
};

function parseDate(s) {
    if (!moment(s, 'YYYY-MM-DD', true).isValid()) {
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
