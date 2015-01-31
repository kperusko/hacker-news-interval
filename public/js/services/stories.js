var intervalServices = angular.module('intervalService');

intervalServices.factory('Story', ['$http', '$q',
  function ($http, $q) {
    var service = {};

    /**
     * Get stories for that snapshot
     * Score/rank for the story will be set to the
     * score and rank from the Score object
     * created for that snapshot
     */
    service.getStories = function (snapshotId) {
      var deferred = $q.defer();

      $http.get('api/stories/' + snapshotId)
        .success(function (data) {
          // Format story result so that we get only
          // fields that we're displaying
          var stories = data.map(function (story) {
            var result = {
              id: story._id,
              title: story.title,
              rank: 0,
              score: 0,
              url: story.url,
              isNew: false
            };

            // Find Score for provided snapshotId
            // and set rank/score accordingly
            for (var idx = 0; idx < story.scores.length; idx++) {
              if (story.scores[idx].snapshot === snapshotId) {
                result.rank = story.scores[idx].rank;
                result.score = story.scores[idx].score;
                result.isNew = idx === 0;
                break;
              }
            }

            return result;
          });
          deferred.resolve(stories);
        })
        .error(function () {
          deferred.reject('There was an error retrieving snapshots');
        });
      return deferred.promise;
    };

    return service;
  }
]);
