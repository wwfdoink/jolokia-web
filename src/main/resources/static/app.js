var app = angular.module('myApp', ['ngRoute', 'ui.bootstrap', 'angular-websocket', 'chart.js', 'angularTreeview']);

app.config(function($routeProvider) {
    var tplDir = "/static/tpl";
  $routeProvider
  .when('/', {
    templateUrl : tplDir+'/dashboard.html',
    controller  : 'DashboardController'
  })
  .when('/mbean', {
    templateUrl : tplDir+'/mbean.html',
    controller  : 'MbeanController'
  })
  .when('/version', {
    templateUrl : tplDir+'/version.html',
    controller  : 'VersionController'
  })
  .otherwise({redirectTo: '/'});
});

app.run(function(DashboardService){
});
