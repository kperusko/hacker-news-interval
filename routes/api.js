var story = require('./story');
var snapshot = require('./snapshot');

module.exports = function(app, express) {
    var router = express.Router();

	router.route('/stories')
		.get(story.getStories);
	
	router.route('/story/:story_id')
	    .get(story.getStory)
		.put(story.updateStory)
		.patch(story.updateScore);

    router.route('/snapshots')
	    .get(snapshot.getSnapshots)
        .post(snapshot.addSnapshot);

	router.route('/snapshot/:snapshot_id')	
	    .put(snapshot.updateSnapshot);
	
    return router;
};
