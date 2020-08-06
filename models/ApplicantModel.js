const mongoose = require('mongoose');

const applicantSchema = mongoose.Schema({
    _id: mongoose.Schema.Types.ObjectId,
    fName: {
        type: String,
        required: true,
    },
    lName: {
        type: String,
        required: true,
    },
    streetAdd: {
        type: String,
        required: true,
    },
    houseNo: {
        type: String,
        required: true,
    },
    city: {
        type: String,
        required: true,
    },
    state: {
        type: String,
        required: true,
    },
    zip: {
        type: String,
        required: true,
    },
    phone: {
        type: String,
        required: true,
    },
    position: {
        type: String,
        enum: ['Front Desk, Dental Assistant, Dental Hygienist, Dentist'],
        required: true
    },
    yearExp: {
        type: Number,
        required: true,
    },
    dentalProg: {
        type: String,
        required: true,
    },
    secLanguage: {
        type: String, 
        required: true,
    },
    specialties: {
        type: String,
        required: true,
    },
    placement: {
        type: String,
        enum: ['Permanent Work', 'Temporary Work'],
        required: true,
    },
    rate: {
        type: Number,
        required: true,
    },
    availability: {
        type: String,
        required: true,
    },
    travel: {
        type: String,
        required: true,
    },
    profile: {
        type: String, 
        required: true,
    },
    avatar: {
        data: Buffer,
    },
    resume: {
        data: Buffer,
        required: true,
    },
    feedback: {
        type: String,
        required: true,
    }
});

module.exports = mongoose.model('Applicant', applicantSchema);