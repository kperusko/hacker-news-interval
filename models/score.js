var mongoose = require('mongoose');

var Scores = new mongoose.Schema({
    date: Date,
    score: Number
});
