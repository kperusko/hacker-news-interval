var mongoose = require('mongoose');
var Snapshot = require('./snapshot')

// Represents a score that post had at the time of the snapshot
var Score = new mongoose.Schema({
    _id : false, // embedded document, so we don't need _id
    score: { type: Number, required: true }, // represents score for the post
    snapshot: { type: Number, ref: 'Snapshot', required: true } // snapshot
});

module.exports = mongoose.model('Score', Score);
