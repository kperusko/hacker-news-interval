var Story = require('../models/story');
var Score = require('../models/score');
var Snapshot = require('../models/snapshot');

module.exports = function(app, express) {
    var router = express.Router();

	router.route('/stories')
		.get(function(req, res){			
			Story.find(function(err, stories) {
				if (err) res.send(err);
				
				res.json(stories);
			});
		});

	router.route('/story/:story_id')
	    .get(function(req, res, next){			
            Story.findOne({ _id: req.params.story_id }, function(err, story) {					
				if (err) return res.send(err);
				if (!story) next(); // return 404 if story doesn't exist
				
				res.json(story);
			});
		})
	
		.put(function(req, res) {
			Story.findById(req.params.story_id, function(err, story) {
        		if (err) return res.send(err);

				var isNew = false;
				if (!story) {
					story = new Story();	
					isNew = true;
				}
				
				story._id = req.params.story_id;
				story.title = req.body.title;
				story.url = req.body.url;
				story.by = req.body.by;
				story.created = req.body.created;

				story.scores = req.body.scores;
			    				
				story.save(function(err) {
					if (err) return res.send(err);
					if (isNew) 
						res.status(201);

					res.json(story);
				});
			});
		})

		.patch(function(req, res, next){
			Story.findById(req.params.story_id, function(err, story) {
				if (err) return res.send(err);

				// We're supporting only adding scores
				if (req.body.op != 'add' || req.body.path != 'scores'){
					var err = new Error('Unprocessable Entity');
                    err.status = 422;
                    next(err);
				}else{
					story.scores.push(req.body.score);

					story.save(function(err) {
						if (err) return res.send(err);
						res.json(story)
					});
				}
			});
		});

    router.route('/snapshots')
	    .get(function(req, res){            
            Snapshot.find(function(err, snapshots) {
                if (err) res.send(err);
                
                res.json(snapshots);
            });
        })

        .post(function(req, res){
			var snapshot = new Snapshot();
		    
			snapshot.time = req.body.time;

			snapshot.save(function(err) {
				if (err) return res.send(err);
				res.json(snapshot);
			})
		});

	router.route('/snapshot/:snapshot_id')
	    .put(function(req, res, next){
			Snapshot.findById(req.params.snapshot_id, function(err, snapshot) {
        		if (err) return res.send(err);

				if (snapshot) {
					snapshot.time = req.body.time;

					// Save the story and check for errors				
					snapshot.save(function(err) {
						if (err) return res.send(err);
						res.json(story)
					});
				}else{
					next(new Error('').status(404));
				}			    
			});
		});
	
    return router;
};
