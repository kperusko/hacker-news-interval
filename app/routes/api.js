'use strict';

module.exports = function (express) {
  var router = express.Router();

  var story = require('../controllers/story');
  var snapshot = require('../controllers/snapshot');

  // STORY
  router.route('/stories/:snapshot_id([0-9]+)')
    .get(story.getStories);

  router.route('/story/:story_id([0-9]+)')
    .get(story.getStory)
    .put(story.updateStory)
    .patch(story.updateScore);

  router.route('/story/ids')
    .get(story.getStoryIds);

  // SNAPSHOT
  router.route('/snapshots')
    .get(snapshot.getSnapshots)
    .post(snapshot.addSnapshot);

  router.route('/snapshot/:snapshot_id([0-9]+)')
    .get(snapshot.getSnapshot)
    .put(snapshot.updateSnapshot);

  return router;
};
