var Story = require('../models/story');
var Score = require('../models/score');

module.exports.getStories = function(req, res, next){			
	Story.find(function(err, stories) {
		if (err) return next(err);
		
		res.json(stories);
	});
};

module.exports.getStory = function(req, res, next){
	
    Story.findOne({ _id: req.params.story_id }, function(err, story) {					
		if (err) return next(err);
		if (!story) return next(); // return 404 if story doesn't exist
		
		res.json(story);
	});
};

module.exports.updateStory = function(req, res, next) {
	Story.findById(req.params.story_id, function(err, story) {
        if (err) return next(err);

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
			if (err) return next(err);
			if (isNew) 
				res.status(201);

			res.json(story);
		});
	});
};

module.exports.updateScore = function(req, res, next){
	Story.findById(req.params.story_id, function(err, story) {
		if (err) return next(err);

		// We're supporting only adding scores
		if (req.body.op != 'add' || req.body.path != 'scores'){
			var err = new Error('Unprocessable Entity');
            err.status = 422;
            next(err);
		}else{
			story.scores.push(req.body.score);

			story.save(function(err) {
				if (err) return next(err);
				res.json(story)
			});
		}
	});
};
