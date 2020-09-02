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
    location: {
        type: String,
        enum: ['Main Clinic'],
        required: true
    },
    clinicName: {
        type: String,
        required: true
    },
    date: {
        type: String,
        required: true
    },
    description: {
        type: String,
        required: true
    },
    software: {
        type: String,
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
})

JobSchema.plugin(mongoosePaginate);
module.exports = mongoose.model('Job', JobSchema);