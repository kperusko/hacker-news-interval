var mongoose = require('mongoose');
var validators = require('mongoose-validators');
var Score = require('./score');

var Story = new mongoose.Schema({
	_id: Number,
	title : { type: String, required: true },
	url: { type: String, required: true, validate: [ validators.isURL() ] },
	scores : { type: [ Score.schema ], required: true },
	by: { type: String, require: true },
	created: { type: Date, required: true}
});

module.exports = mongoose.model('Story', Story);
