var story = require('./story');
var snapshot = require('./snapshot');

module.exports = function(express) {
    var router = express.Router();

	// STORY
    router.route('/stories')
		.get(story.getStories);
	
	router.route('/story/:story_id([0-9]+)')
	    .get(story.getStory)
		.put(story.updateStory)
		.patch(story.updateScore);

	// SNAPSHOT
    router.route('/snapshots')
	    .get(snapshot.getSnapshots)
        .post(snapshot.addSnapshot);

	router.route('/snapshot/:snapshot_id([0-9]+)')
	    .get(snapshot.getSnapshot)
	    .put(snapshot.updateSnapshot);
	
    return router;
};

