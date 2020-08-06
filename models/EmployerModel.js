const mongoose = require('mongoose');

const nameSchema = mongoose.Schema({ first: String, last: String });

const employerSchema = mongoose.Schema({
    _id: mongoose.Schema.Types.ObjectId,
    account: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Account',
        required: true,
    },
    name: {
        type: nameSchema,
        required: true,
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
        type: mongoose.Schema({
            street: String,
            houseNo: String,
            city: String,
            state: String,
            zip: String,
        }),
        required: true,
    },
    clinicPhone: {
        type: String,
        required: true,
    },
    detailsSoftware: {
        type: [String],
        required: true,
    },
    detailsSpecialties: {
        type: [String],
        required: true,
    },
    detailsServices: {
        type: [String],
        required: true,
    },
    clinicContactName: {
        type: nameSchema,
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
});
