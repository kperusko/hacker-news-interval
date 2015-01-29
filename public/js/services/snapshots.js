var intervalServices = angular.module('intervalService', []);

intervalServices.factory('Snapshot', ['$http', '$q',
  function ($http, $q) {
    var service = {};

    // Get all snapshots
    service.getSnapshots = function () {
      var deferred = $q.defer();
      $http.get('api/snapshots')
        .success(function (data) {
          var snapshots = {
            ids: [],
            labels: [],
            values: []
          };

          // Transform the snapshots to more suitable format
          data.forEach(function (snapshot) {
            snapshots.ids.push(snapshot._id);
            snapshots.labels.push(new Date(snapshot.time));
            snapshots.values.push(snapshot.new_items);
          });
          deferred.resolve(snapshots);
        })
        .error(function () {
          deferred.reject('There was an error retrieving snapshots');
        });
      return deferred.promise;
    };

    return service;
  }
]);
