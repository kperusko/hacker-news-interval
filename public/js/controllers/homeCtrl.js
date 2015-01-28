angular.module('homeController', ['chart.js', 'ui.bootstrap', 'ngTable',
  'intervalService'
]).controller('HomeCtrl', ['$scope', '$http', '$filter',
  'Snapshot', 'Story', 'ngTableParams',
  function ($scope, $http, $filter, Snapshot, Story, ngTableParams) {
    var vm = this;

    // stores all data for chart
    // snapshots that are later sliced for pagination
    vm.allSnapshots = {
      ids: [], // snapshot id
      labels: [], // snapshot time
      values: []
    };

    // currently selected snapshot Id
    $scope.currentSnapshotId = null;

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

    // Load all data for chart only once
    Snapshot.getSnapshots()
      .then(function (snapshots) {
        vm.allSnapshots = snapshots;
        // Set the total items for the paginator
        // totalItems must be >= num of data points
        // so that the last page is correctly displayed
        var itemNum = vm.allSnapshots.values.length;
        $scope.chart.totalItems = itemNum + (itemNum % $scope.chart.itemsPerPage);

        // Go to last page 
        // This triggers the chart reloading and displaying data
        $scope.chart.currentPage =
          Math.ceil($scope.chart.totalItems / $scope.chart.itemsPerPage);

        $scope.currentSnapshotId =
          vm.allSnapshots.ids[vm.allSnapshots.ids.length - 1];
      });

    // Watch for paginator prev/next actions
    $scope.$watch('chart.currentPage', function () {
      var begin = (($scope.chart.currentPage - 1) * $scope.chart.itemsPerPage),
        end = begin + $scope.chart.itemsPerPage;

      // Get the chart data for the current page
      $scope.chart.data.values = [vm.allSnapshots.values.slice(begin,
        end)];
      // Get the chart labels and format the date 
      $scope.chart.data.labels =
        vm.allSnapshots.labels.slice(begin, end).map(function (date) {
          return $filter('date')(date, 'short');
        });
    });

    $scope.$watch('currentSnapshotId', function () {
      if ($scope.currentSnapshotId !== null) {
        $scope.tableParams.reload();
      }
    });

    // load saved stories for that snapshot
    $scope.chart.onClick = function (points, evt) {
      // Get the snapshotId by finding label idx 
      var idx = $scope.chart.data.labels.indexOf(points[0].label);
      var snapshotIdx = idx +
        (($scope.chart.currentPage - 1) * $scope.chart.itemsPerPage);

      // This will load stories for that snapshot
      $scope.currentSnapshotId = vm.allSnapshots.ids[snapshotIdx];
    };

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
        if ($scope.currentSnapshotId === null) {
          $defer.resolve([], 0);
        } else {
          Story.getStories($scope.currentSnapshotId)
            .then(function (stories) {
              // use build-in angular filter
              var orderedData = params.sorting() ?
                $filter('orderBy')(stories, params.orderBy()) :
                stories;

              $defer.resolve(orderedData.slice((params.page() - 1) *
                params.count(),
                params.page() * params.count()));
            });
        }
      },
      $scope: {
        $data: {}
      }
    });
  }
]);
