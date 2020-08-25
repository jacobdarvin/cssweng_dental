const mongoose = require('mongoose');

const createJobSchema = mongoose.Schema({
    _id: mongoose.Schema.Types.ObjectId,
    account: {
        type: mongoose.Types.ObjectId,
        ref: 'Account'
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
    }
})

module.exports = mongoose.model('CreateJob', createJobSchema);