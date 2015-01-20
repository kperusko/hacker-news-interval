var mongoose = require('mongoose');
var validators = require('mongoose-validators');
var Score = require('./score');

var Story = new mongoose.Schema({
    _id: { type: Number, required: true },
    title : { type: String, required: true },
    url: { type: String, required: true, validate: [validators.isURL()] },
	scores : { type: [Score], required: true },
    by:  String,
    created: Date
});

module.exports = mongoose.model('Story', Story);
