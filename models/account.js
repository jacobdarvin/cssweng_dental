const mongoose = require('mongoose');

const accountSchema = mongoose.Schema({
    _id: mongoose.Schema.Types.ObjectId,
    accType: {
        type: String,
        enum: ['applicant', 'employer'],
    },
    accEmail: {
        type: String,
        required: true
    },
    password: {
        type: String,
        required: true
    },
    accStatus: {
        type: String,
        enum: ['active', 'inactive'],
        default: 'active'
    }
});

module.exports = mongoose.model('Account', accountSchema);
