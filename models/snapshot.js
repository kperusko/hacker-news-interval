var mongoose = require('mongoose');
var validators = require('mongoose-validators');
var autoIncrement = require('mongoose-auto-increment');

// init plugin for auto-incrementing _id field
autoIncrement.initialize(mongoose.connection);

// Represents a point in time when the data for was collected
var Snapshot = new mongoose.Schema({
    time: { type: Date, required: true }, // Date when the snapshot is gathered
	new_items: { type: Number, min: 0 } // number of new items collected for that snapshot
});

// automatically create auto increment on _id field
Snapshot.plugin(autoIncrement.plugin, 'Snapshot');

module.exports = mongoose.model('Snapshot', Snapshot);
