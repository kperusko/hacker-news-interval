angular.module('homeController', ['chart.js', 'ui.bootstrap']).controller(
  'HomeCtrl',
  function ($scope, $http) {
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
        responsive: true,
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
  });
