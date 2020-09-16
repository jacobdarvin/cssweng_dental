const mongoose = require('mongoose');

const EmpResponseSchema = mongoose.Schema({
    _id: mongoose.Schema.Types.ObjectId,
    accEmpId: {
        type: mongoose.Types.ObjectId,
        ref: 'Account'
    },
    jobId: {
        type: mongoose.Types.ObjectId,
        ref: 'JobId'
    },
    applicantId: {
        type: mongoose.Types.ObjectId,
        ref: 'Applicant'
    },
    type: {
        type: String,
        enum: ['hire', 'decline', 'contact']
    },
    subject: {
        type: String,
        default: "Default subject"
    },
    body: {
        type: String,
        default: "Default body"
    },
});

module.exports = mongoose.model('Response', EmpResponseSchema);
