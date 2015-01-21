var mongoose = require('mongoose');
var Snapshot = require('./snapshot')

var Score = new mongoose.Schema({
    _id : false,
    score: { type: Number, required: true },
    snapshot: { type: Number, ref: 'Snapshot' }
});

module.exports = mongoose.model('Score', Score);
