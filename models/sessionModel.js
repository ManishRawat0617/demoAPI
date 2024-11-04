const mongoose = require('mongoose');

const sessionSchema = new mongoose.Schema({
    roomId: String,
    offer: Object,
    answer: Object,
    candidates: Array,
    createdAt: { type: Date, default: Date.now }
});

module.exports = mongoose.model('Session', sessionSchema);
