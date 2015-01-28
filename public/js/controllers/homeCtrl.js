angular.module('homeController', ['chart.js', 'ui.bootstrap', 'ngTable',
  'intervalService'
]).controller('HomeCtrl', ['$scope', '$http', '$filter', 'Snapshot', 'ngTableParams',
  function ($scope, $http, $filter, Snapshot, ngTableParams) {
    var vm = this;

    // Chart data and settings
    $scope.chart = {
      data: {
        labels: [],
        values: []
      },
      // Chart settings
      series: ['New stories'],
      options: {
        bezierCurve: false,
        animationSteps: 10
      },
      // Pagination settings
      currentPage: 1,
      totalItems: 0,
      itemsPerPage: 8
    };

	// stores all snapshots that are later
	// sliced for pagination
    vm.allSnapshots = {
      labels: [],
      values: []
    };

    // Load data for chart
    Snapshot.getSnapshots()
      .then(function (snapshots) {
        vm.allSnapshots = snapshots;
        // Set the total items for the paginator
        $scope.chart.totalItems = vm.allSnapshots.values.length;

        // Go to last page 
        // This triggers the chart reloading and displaying data
        $scope.chart.currentPage =
          Math.ceil($scope.chart.totalItems / $scope.chart.itemsPerPage);
      });

    // Watch for paginator prev/next actions
    $scope.$watch('chart.currentPage', function () {
      var begin = (($scope.chart.currentPage - 1) * $scope.chart.itemsPerPage),
        end = begin + $scope.chart.itemsPerPage;

      // Get the chart data for the current page
      $scope.chart.data.values = 
			[vm.allSnapshots.values.slice(begin, end)];
      $scope.chart.data.labels = 
			vm.allSnapshots.labels.slice(begin, end);
    });

    var stories = [{
      title: 'Big story',
      rank: 1,
      score: 50,
      url: 'http://example.com'
    }, {
      title: 'HUGE story',
      rank: 2,
      score: 43,
      url: 'http://google.com'
    }];

    // Set up table options
    $scope.tableParams = new ngTableParams({
      page: 1, // show first page
      count: 50, // count per page
      sorting: {
        rank: 'asc' // initial sorting
      }
    }, {
      counts: [], // hide page counts control
      total: 1, // must be lower than count to hide pagination
      getData: function ($defer, params) {

        // use build-in angular filter
        var orderedData = params.sorting() ?
          $filter('orderBy')(stories, params.orderBy()) :
          stories;

        $defer.resolve(orderedData.slice((params.page() - 1) * params
          .count(), params.page() * params.count()));
      }
    });
  }
]);
