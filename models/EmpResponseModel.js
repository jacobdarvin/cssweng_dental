const mongoose = require('mongoose');

const EmpResponseSchema = mongoose.Schema({
    _id: mongoose.Schema.Types.ObjectId,
    accEmpId: {
        type: mongoose.Types.ObjectId,
        ref: 'Account'
    },
    jobId: {
        type: mongoose.Types.ObjectId,
        ref: 'Job'
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
        type: String
    },
    body: {
        type: String
    },
    clinic_name: {
        type: String,
        required: true,
    },
    clinic_city: {
        type: String,
        required: true,
    },
    clinic_state: {
        type: String,
        required: true,
    },
    clinic_phone: {
        type: String,
        required: true,
    },
    clinic_email: {
        type: [String],
        required: true,
    },
    created: {
        type: Date,
        default: Date.now,
    },
});

module.exports = mongoose.model('Response', EmpResponseSchema);
