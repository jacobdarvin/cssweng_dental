const mongoose = require('mongoose');
const mongoosePaginate = require('mongoose-paginate');

const JobSchema = mongoose.Schema({
    _id: mongoose.Schema.Types.ObjectId,
    employer: {
        type: mongoose.Types.ObjectId,
        ref: 'Employer'
    },
    applicants: [{
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Applicant'
    }],
    placement: {
        type: String,
        enum: ['Permanent', 'Temporary'],
        required: true,
    },
    position: {
        type: String,
        enum: ['Front Desk', 'Dental Assistant', 'Dental Hygienist', 'Dentist'],
        required: true,
    },
    clinicName: {
        type: String,
        required: true
    },

    date_start: {
        type: Date,
        default: Date(-8640000000000000),
        required: true
    },

    date_end: {
        type: Date,
        default: Date(8640000000000000),
        required: true
    },

    description: {
        type: String,
        required: true
    },
    software: {
        type: [String],
        default: "None"
    },
    experience: {
        type: String,
        required: true
    },
    created: {
        type: Date,
        default: Date.now,
    },
    posted: {
        type: String,
    },
    clinic_city: {
        type: String,
        default: "",
    },
    clinic_state: {
        type: String,
        default: "",
    },
})

JobSchema.plugin(mongoosePaginate);
module.exports = mongoose.model('Job', JobSchema);