var Snapshot = require('../models/snapshot');

module.exports.getSnapshots = function(req, res, next){            
    Snapshot.find(function(err, snapshots) {
        if (err) return next(err);
        
        res.json(snapshots);
    });
};

module.exports.addSnapshot = function(req, res, next){
	var snapshot = new Snapshot();
	
	snapshot.time = req.body.time;

	snapshot.save(function(err) {
		if (err) return next(err);
		
		res.json(snapshot);
	})
};

module.exports.updateSnapshot = function(req, res, next){
	Snapshot.findById(req.params.snapshot_id, function(err, snapshot) {
        if (err) return next(err);

		if (snapshot) {
			snapshot.time = req.body.time;

			// Save the story and check for errors				
			snapshot.save(function(err) {
				if (err) return next(err);
				res.json(story)
			});
		}else{
			next(); // 404 
		}			    
	});
};
