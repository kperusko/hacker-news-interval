var mongoose = require('mongoose');

var Score = new mongoose.Schema({
    date: Date,
    score: Number
});

module.exports = mongoose.model('Score', Score);
