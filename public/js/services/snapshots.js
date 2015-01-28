var intervalServices = angular.module('intervalService', []);

intervalServices.factory('Snapshot', ['$http', '$q',
  function ($http, $q) {
    var service = {};


	service.getSnapshots = function() {
		function normalizeDate(date) {
			date = new Date(date);
			return date.toLocaleTimeString();
		}

		var deferred = $q.defer();
		$http.get('api/snapshots')
			.success(function(data){
				var snapshots = {
					labels: [],
					values: []
				};
				
				data.forEach(function (snapshot) {
					snapshots.labels.push(normalizeDate(snapshot.time));
					snapshots.values.push(snapshot.new_items);
				});
				deferred.resolve(snapshots);
			})
		    .error(function(){
				deferred.reject('There was an error retrieving snapshots');
			});
		return deferred.promise;
	};
	
	return service;
  }
]);
