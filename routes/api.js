var Story = require('../models/story');
var Score = require('../models/score');

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
	    .get(function(req, res){			
            Story.find({ _id: req.params.story_id }, function(err, story) {				
				if (err) return res.send(err);
				res.json(story);
			});
		})
	
		.put(function(req, res) {
			Story.findById(req.params.story_id, function(err, story) {
        		if (err) return res.send(err);

				if (!story) {
					story = new Story();	
				}
				
				story._id = req.params.story_id;
				story.title = req.body.title;
				story.url = req.body.url;
				story.by = req.body.by;
				story.created = req.body.created;

				story.scores = req.body.scores;
				
				// Save the story and check for errors				
				story.save(function(err) {
					if (err) return res.send(err);
					res.json(story)
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
	
    router.get('/', function(req, res) {
        res.json({ message: 'It works!' });
    });
	
    return router;
};
