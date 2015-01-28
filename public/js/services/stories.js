var intervalServices = angular.module('intervalService');

intervalServices.factory('Story', ['$http', '$q',
  function ($http, $q) {
    var service = {};

    service.getStories = function (snapshotId) {
      var deferred = $q.defer();

      $http.get('api/stories/' + snapshotId)
        .success(function (data) {
          // Format story result so that we get only
          // fields that we're displaying
          var stories = data.map(function (story) {
            // Find score for that that snapshot
            var result = {
              title: story.title,
              rank: 0,
              score: 0,
              url: story.url
            };

            for (var idx = 0; idx < story.scores.length; idx++) {
              if (story.scores[idx].snapshot === snapshotId) {
                result.rank = story.scores[idx].rank;
                result.score = story.scores[idx].score;
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
