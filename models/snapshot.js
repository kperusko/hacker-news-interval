var mongoose = require('mongoose');
var validators = require('mongoose-validators');
var autoIncrement = require('mongoose-auto-increment');

autoIncrement.initialize(mongoose.connection);

var Snapshot = new mongoose.Schema({
    time: { type: Date, required: true},
});

Snapshot.plugin(autoIncrement.plugin, 'Snapshot');
module.exports = mongoose.model('Snapshot', Snapshot);
