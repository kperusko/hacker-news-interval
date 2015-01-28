angular.module('homeController', ['chart.js', 'ui.bootstrap', 'ngTable']).controller(
  'HomeCtrl',
  function ($scope, $http, $filter, ngTableParams) {
    var normalizeDate = function (date) {
      date = new Date(date);
      return date.toLocaleTimeString();
    };

    $scope.chart = {
      data: [],
      labels: [],
      series: ['New stories'],
      options: {
        bezierCurve: false,
        animationSteps: 10,
        //        responsive: true,
      },
      currentPage: 1,
      totalItems: 0,
      itemsPerPage: 8
    };
    var chartLabels = [],
      chartData = [];

    $http.get('api/snapshots').success(function (data) {
      data.forEach(function (snapshot) {
        chartLabels.push(normalizeDate(snapshot.time));
        chartData.push(snapshot.new_items);
      });
      $scope.chart.totalItems = chartData.length;

      // Go to last page 
      // This triggers the chart reloading and displaying data
      $scope.chart.currentPage =
        Math.ceil($scope.chart.totalItems / $scope.chart.itemsPerPage);
    });

    $scope.$watch('chart.currentPage', function () {
      var begin = (($scope.chart.currentPage - 1) * $scope.chart.itemsPerPage),
        end = begin + $scope.chart.itemsPerPage;

      $scope.chart.data = [chartData.slice(begin, end)];
      $scope.chart.labels = chartLabels.slice(begin, end);
    });

    var stories = [{
      title: 'Big story',
      rank: 1,
      score: 50
    }, {
      title: 'Huge',
      rank: 2,
      score: 43
    }];

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

  });
