const mongoose = require('mongoose');

const employerSchema = mongoose.Schema({
    _id: mongoose.Schema.Types.ObjectId,
    account: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Account',
        required: true,
    },
    name: {
        first: String,
        last: String,
    },
    title: {
        type: String,
        required: true,
    },
    phone: {
        type: String,
        required: true,
    },
    businessName: {
        type: String,
        required: true,
    },
    clinicName: {
        type: String,
        required: true,
    },
    clinicAddress: {
        street: String,
        houseNo: String,
        city: String,
        state: String,
        zip: String,
    },
    clinicPhone: {
        type: String,
        required: true,
    },
    detailsSoftware: {
        type: String,
        required: true,
    },
    detailsSpecialties: {
        type: String,
        required: true,
    },
    detailsServices: {
        type: String,
        required: true,
    },
    clinicContactName: {
        type: String,
        required: true,
    },
    clinicContactTitle: {
        type: String,
        required: true,
    },
    clinicContactEmails: {
        type: [String],
        required: true,
    },
    accepted: {
        type: Boolean,
        default: false,
    },
    feedback: {
        type: String,
        required: true,
    },
});
