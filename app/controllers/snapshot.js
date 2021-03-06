'use strict';

var Snapshot = require('../models/snapshot');

// Get all snapshots sorted by _id
module.exports.getSnapshots = function (req, res, next) {
  Snapshot.find().sort('_id').exec(function (err, snapshots) {
    if (err) return next(err);

    res.json(snapshots);
  });
};

// Create a snapshot
module.exports.addSnapshot = function (req, res, next) {
  var snapshot = new Snapshot();

  snapshot.time = req.body.time;
  snapshot.new_items = req.body.new_items;

  snapshot.save(function (err) {
    if (err) return next(err);

    res.json(snapshot);
  });
};

// Get a single snapshot
module.exports.getSnapshot = function (req, res, next) {
  Snapshot.findOne({
    _id: req.params.snapshot_id
  }, function (err, snapshot) {
    if (err) return next(err);
    if (!snapshot) return next(); // return 404 if snapshot doesn't exist

    res.json(snapshot);
  });
};

// Update snapshot
module.exports.updateSnapshot = function (req, res, next) {
  Snapshot.findById(req.params.snapshot_id, function (err, snapshot) {
    if (err) return next(err);

    if (snapshot) {
      snapshot.time = req.body.time;
      snapshot.new_items = req.body.new_items;

      // Save the story and check for errors				
      snapshot.save(function (err) {
        if (err) return next(err);
        res.json(snapshot);
      });
    } else {
      next(); // 404 
    }
  });
};
