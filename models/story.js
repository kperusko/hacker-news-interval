var mongoose = require('mongoose');
var validators = require('mongoose-validators');
var Score = require('./score');

// Represents a story/news item
var Story = new mongoose.Schema({
	_id: Number,
	title : { type: String, required: true }, // title of the story 
	url: { type: String, required: true, validate: [ validators.isURL() ] }, // URL it points to
	scores : { type: [ Score.schema ], required: true }, // scores that story had at specific intervals
	by: { type: String, require: true }, // user that submitted story
	created: { type: Date, required: true} // date when the story was created
});

module.exports = mongoose.model('Story', Story);
