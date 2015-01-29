var mongoose = require('mongoose');

// Represents a score that post had at the time of the snapshot
var Score = new mongoose.Schema({
  _id: false, // embedded document, so we don't need _id	
  score: {
    type: Number,
    required: true
  }, // represents score for the post
  rank: {
    type: Number,
    required: true
  }, // represents the ranking of the post
  snapshot: {
    type: Number,
    ref: 'Snapshot',
    required: true
  } // represents snapshot
});

module.exports = mongoose.model('Score', Score);
