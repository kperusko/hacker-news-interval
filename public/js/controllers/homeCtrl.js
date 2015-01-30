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

    // Default date format for all dates
    vm.dateFormat = 'short';

    vm.defaultItemsPerPage = 8;

    // currently selected snapshot Id
    $scope.currentSnapshotId = null;
    // currently selected snapshot value
    $scope.currentSnapshotValue = '';

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
        animationSteps: 10,
        scaleBeginAtZero: true,
        responsive: true, // resize chart on browser resize

        // We need to set it to false, otherwise
        // the chart height will be to small on small screens.
        // There seems to be a bug with setting this to false
        // because chart constantly grows when reloading data
        // if the height of the container div is not fixed/limited.
        maintainAspectRatio: false
      },
      // Pagination settings
      currentPage: 1,
      totalItems: 0,
      itemsPerPage: vm.defaultItemsPerPage
    };

    // load saved stories for that snapshot
    $scope.chart.onClick = function (points, evt) {
      if (points.length <= 0) return;
      // Get the snapshotId by finding label idx 
      var idx = $scope.chart.data.labels.indexOf(points[0].label);

      // Calculate offset for the current page
      var missingItems = vm.getFullPageMissingItems();
      var beginIdx = (($scope.chart.currentPage - 1) * $scope.chart.itemsPerPage) -
        missingItems;
      if (beginIdx < 0) beginIdx = 0;

      var snapshotIdx = idx + beginIdx;

      // This will load stories for that snapshot
      $scope.currentSnapshotId = vm.allSnapshots.ids[snapshotIdx];
    };

    // Get number of items that are missing for full page
    vm.getFullPageMissingItems = function () {
      var itemNum = vm.allSnapshots.values.length;
      var missingItems = vm.defaultItemsPerPage - (itemNum % vm.defaultItemsPerPage);
      if (missingItems === vm.defaultItemsPerPage) {
        missingItems = 0;
      }
      return missingItems;
    };

    // Load all data for chart only once
    Snapshot.getSnapshots()
      .then(function (snapshots) {
        vm.allSnapshots = snapshots;
        // Set the total items for the paginator
        // totalItems must be >= num of data points
        var itemNum = vm.allSnapshots.values.length,
          missingItems = vm.getFullPageMissingItems();

        if (missingItems === 0) { // not 1
          // We have data to display full last page
          $scope.chart.itemsPerPage = vm.defaultItemsPerPage;
          $scope.chart.totalItems = itemNum;
        } else {
          $scope.chart.itemsPerPage = vm.defaultItemsPerPage;
          $scope.chart.totalItems = itemNum + missingItems;
        }

        // Go to last page 
        // This triggers the chart reloading and displaying data
        $scope.chart.currentPage =
          Math.ceil($scope.chart.totalItems / $scope.chart.itemsPerPage);

        $scope.currentSnapshotId =
          vm.allSnapshots.ids[vm.allSnapshots.ids.length - 1];
      });

    vm.getTableData = function ($defer, params) {
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
      getData: vm.getTableData,
      $scope: {
        $data: {}
      }
    });

    // Watch for paginator prev/next actions
    $scope.$watch('chart.currentPage', function () {
      var missingItems = vm.getFullPageMissingItems();

      var begin = (($scope.chart.currentPage - 1) * $scope.chart.itemsPerPage) -
        missingItems;
      if (begin < 0) begin = 0;
      var end = begin + $scope.chart.itemsPerPage;

      // Get the chart data for the current page
      $scope.chart.data.values = [vm.allSnapshots.values.slice(begin,
        end)];
      // Get the chart labels and format the date 
      $scope.chart.data.labels =
        vm.allSnapshots.labels.slice(begin, end).map(function (date) {
          return $filter('date')(date, vm.dateFormat);
        });
    });

    // Watch for changing snapshot ids and reload table data
    $scope.$watch('currentSnapshotId', function () {
      if ($scope.currentSnapshotId !== null) {
        var idx = vm.allSnapshots.ids.indexOf($scope.currentSnapshotId);
        $scope.currentSnapshotValue =
          $filter('date')(vm.allSnapshots.labels[idx], vm.dateFormat);
        // Reload data for selected snapshot
        $scope.tableParams.reload();
      }
    });
  }
]);
