'use strict';

/* App Module */
var intervalApp = angular.module('intervalApp', [
  'ngRoute',
  'homeController'
]);

intervalApp.config(['$routeProvider',
  function ($routeProvider) {
    $routeProvider.
    when('/home', {
      templateUrl: 'js/views/home.html',
      controller: 'HomeCtrl'
    }).
    otherwise({
      redirectTo: '/home'
    });
  }
]);
