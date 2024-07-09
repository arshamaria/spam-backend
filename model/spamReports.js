const mongoose = require('mongoose');
const Schema = mongoose.Schema;
const types = ['SMS', 'Call'];

const spamReports = new Schema({
    id: { type: Schema.Types.ObjectId, auto: true },
    type: { type: String, enum: types, required: true },
    phone_number: { type: String, required: true },
    message: { type: String, default: null },
    call_info: { type: String, default: null },
    call_duration: { type: Number, default: null },
    report_time: { type: Date, default: Date.now }
});

module.exports = mongoose.model('SpamReport', spamReports);
