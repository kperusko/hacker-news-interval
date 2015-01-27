angular.module('homeController', ['chart.js', 'ui.bootstrap']).controller('HomeCtrl',
  function ($scope, $http) {
	var chart = {};

	var normalizeDate = function(date) {
		date = new Date(date);
		date.setMinutes (date.getMinutes() + 30);
		date.setMinutes (0);
		return date.toLocaleTimeString();
	};

	$http.get('api/snapshots').success(function(data) {
		var chartLabels = [],
      		chartData = []; 
	
		data.forEach(function(snapshot){
			chartLabels.push(normalizeDate(snapshot.time));
			chartData.push(snapshot.new_items);
		});

		console.log(chartLabels);
	});

	$scope.labels = [];
    $scope.series = ['New stories', 'Bla'];
    $scope.chartData = [
		[28, 48, 40, 19, 86, 27, 90],

		[60, 20, 30, 50]
    ];
    $scope.options = { 
		bezierCurve: false,
		animationSteps: 10, 
		responsive: true,
	};

	$scope.onClick = function (points, evt) {
		$scope.chartData = [[22, 23, 43]];
	};

	$scope.totalItems = 50;
	$scope.currentPage = 2;
});
