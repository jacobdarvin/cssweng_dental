const mongoose = require('mongoose');

const accountSchema = mongoose.Schema({
    _id: mongoose.Schema.Types.ObjectId,
    accType: {
        type: String,
        enum: ['applicant', 'employer'],
        required: true
    },
    accEmail: {
        type: String,
        required: true,
    },
    password: {
        type: String,
        required: true,
    },
    accStatus: {
        type: String,
        enum: ['Verified', 'Unverified'],
        default: 'Unverified',
    },
    created: {
        type: Date,
        default: Date.now,
    },
});

module.exports = mongoose.model('Account', accountSchema);
