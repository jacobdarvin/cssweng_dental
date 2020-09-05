const sanitize = require('mongo-sanitize');
const mongoose = require('mongoose');
const moment = require('moment');
const dateformat = require('dateformat');
const fs = require('fs');
const Job = require('../models/JobModel');
const db = require('../models/db');

const helper = {
    sanitize: function (query) {
        return sanitize(query);
    },

    renameAvatar: function (req, newName) {
        var origName = req.files['avatar'][0].originalname;
        var extension = origName.substring(origName.lastIndexOf('.'));
        const newURL =
            req.files['avatar'][0].destination + '/' + newName + extension;

        fs.renameSync(req.files['avatar'][0].path, newURL);
        return newName + extension;
    },

    renameResume: function (req, newName) {
        var origName = req.files['resume'][0].originalname;
        var extension = origName.substring(origName.lastIndexOf('.'));
        const newURL =
            req.files['resume'][0].destination + '/' + newName + extension;

        fs.renameSync(req.files['resume'][0].path, newURL);
        return newName + extension;
    },

    formatDate: function (date) {
        var diff_seconds = Math.round((+new Date() - date) / 1000);

        var minute = 60,
            hour = minute * 60,
            day = hour * 24,
            week = day * 7;

        var time;

        if (diff_seconds < 30) {
            time = 'just then';
        } else if (diff_seconds < minute) {
            time = diff_seconds + ' seconds ago';
        } else if (diff_seconds < 2 * minute) {
            time = 'a minute ago';
        } else if (diff_seconds < hour) {
            time = Math.floor(diff_seconds / minute) + ' minutes ago';
        } else if (Math.floor(diff_seconds / hour) == 1) {
            time = '1 hour ago';
        } else if (diff_seconds < day) {
            time = Math.floor(diff_seconds / hour) + ' hours ago';
        } else if (diff_seconds == day) {
            time = 'yesterday';
        } else if (diff_seconds < day * 7) {
            time = Math.floor(diff_seconds / day) + ' days ago';
        } else if (diff_seconds == week) {
            time = '1 week ago'; 
        } else if (diff_seconds == week * 2){
        	time = '2 weeks ago'; 
		} else if (diff_seconds == week * 3){
        	time = '3 weeks ago'; 
		} else if (diff_seconds == week * 4){
        	time = '1 month ago'; 
		} else if ((diff_seconds > week) && (diff_seconds < week * 2)) {
			time = 'more than 1 week ago' 
        } else if ((diff_seconds > week) && (diff_seconds < week * 4)) {
			time = 'more than ' + Math.floor(diff_seconds / week) + ' weeks ago' 
        } else {
            time = 'on ' + dateformat(date, 'mmm dd, yyyy');
        }


        return time;
    },

    parseDate: function (s) {
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
    },

    getActiveJobPost: function (emp) {
        //this.updatePostedDate();
        return Job.find({ employer: emp })
            .populate('employer')
            .sort('-created')
            .limit(2)
            .lean();
    },

    getTempCount: function (emp) {
        return Job.countDocuments({
            employer: emp,
            placement: 'Temporary',
        }).exec();
    },

    getPermCount: function (emp) {
        return Job.countDocuments({
            employer: emp,
            placement: 'Permanent',
        }).exec();
    },

    updatePostedDate: function (){
        var yes;
        var self = this;
        // yes = this.formatDate("2020-09-05T04:49:10.324+00:00");
        // console.log(yes);
       Job.find({}, function(err, results){
           results.forEach(function(jobs){
            //     yes = self.formatDate(jobs.created)
            //     console.log(yes);
            //    console.log(jobs.created);
            //   db.updateOne(Job,{_id: jobs._id}, {posted: self.formatDate(jobs.created)}, function(res){}).exec();
                Job.updateOne({_id: jobs._id}, {posted: self.formatDate(jobs.created)}).exec();
           })

       })
    }
};

module.exports = helper;
