var app = angular.module('myApp', ['ngRoute', 'chart.js', 'angularTreeview']);

app.config(function($routeProvider) {
    var pre = "/jolokiaweb/static/";
  $routeProvider
  .when('/', {
    templateUrl : pre+'tpl/dashboard.html',
    controller  : 'DashboardController'
  })
  .when('/mbean', {
    templateUrl : pre+'tpl/mbean.html',
    controller  : 'MbeanController'
  })
  .when('/version', {
    templateUrl : pre+'tpl/version.html',
    controller  : 'VersionController'
  })
  .otherwise({redirectTo: '/'});
});
