const db = require('../models/db');
const Job = require('../models/JobModel');
const Applicant = require('../models/ApplicantModel');
const { validationResult } = require('express-validator');

const dashboardAppController = {
    createSearchJobRoute: function (appDoc) {
        return `/feed-app?placement=${appDoc.placement.replace(
            ' Work',
            '',
        )}&position=${appDoc.position}&clinic_state=${appDoc.state}&clinic_city=${appDoc.city}`;
    },

    getJobMatchCount: function (appDoc) {
        return Job.countDocuments({
            placement: appDoc.placement.replace(' Work', ''),
            position: appDoc.position,
            clinic_state: appDoc.state,
            clinic_city: appDoc.city
        }).exec();
    },

    getMatchingJobs: function (appDoc) {
        return Job.find({
            placement: appDoc.placement.replace(' Work', ''),
            position: appDoc.position,
            clinic_state: appDoc.state,
            clinic_city: appDoc.city
        })
            .populate('employer')
            .sort('-created')
            .limit(3)
            .lean()
            .exec();
    },

    getAppliedJobs: function (app_id) {
        return Applicant.findById(app_id, 'appliedJobs')
            .populate({
                path: 'appliedJobs',
                options: { limit: 3, lean: true },
                populate: {
                    path: 'employer',
                    select: 'clinicName',
                    options: { lean: true },
                },
            })
            .exec();
    },

    getAppliedJobsCount: function (app_id) {
        return Job.countDocuments({ applicants: app_id }).exec();
    },

    // edit applicant description
    postEditDescription: function (req, res) {
        var profile = req.body.profile.trim();
        db.updateOne(
            Applicant,
            { _id: req.params.appId },
            { profile },
            result => {
                if (result) res.send({ profile });
                else res.status(500).send('An error occurred in the server.');
            },
        );
    },

    getPopulateEditProfile: function (req, res) {
        Applicant.findOne({ account: req.session.user }, '')
            .exec()
            .then(doc =>
                res.render(
                    './partials/editProfileForm',
                    { profileData: doc.toObject(), layout: false },
                    (err, html) => {
                        if (err) throw err;
                        res.send(html);
                    },
                ),
            )
            .catch(err => {
                console.log(err);
                res.send(err);
            });
    },

    postEditProfile: function (req, res) {
        var errors = validationResult(req);

        if (!errors.isEmpty()) {
            errors = errors.errors;

            res.send(errors.map(e => e.msg));
        } else {
            const {
                fname,
                lname,
                streetAdd,
                house,
                state,
                city,
                zip,
                phone,
                payrate,
                position,
                placement,
            } = req.body;

            // update database
            var obj = {
                fName: fname,
                lName: lname,
                streetAdd: streetAdd,
                houseNo: house,
                state: state,
                city: city,
                zip: zip,
                phone: phone,
                rate: placement === 'Temporary Work' ? payrate : 0,
                position: position,
                placement: placement,
            };

            db.updateOne(Applicant, { _id: req.params.appId }, obj, result => {
                if (result) {
                    res.send(obj);
                } else {
                    res.status(500).send('An error occurred in the server');
                }
            });
        }
    },

    postEditWage: (req, res) => {
        var rate = Number(req.body.rate.trim());
        db.updateOne(Applicant, { _id: req.params.appId }, { rate }, result => {
            if (result) res.send({ rate });
            else res.status(500).send('An error occurred in the server.');
        });
    },
};

// enables to export controller object when called in another .js file
module.exports = dashboardAppController;
