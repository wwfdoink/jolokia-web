var app = angular.module('myApp', ['ngRoute', 'ui.bootstrap', 'angular-websocket', 'chart.js']);

app.config(function($routeProvider) {
  $routeProvider
  .when('/', {
    template: "<dashboard-page></dashboard-page>",
  })
  .when('/mbean', {
    template: "<mbean-page></mbean-page>",
  })
  .when('/version', {
    template: "<version-page></version-page>",
  })
  .otherwise({redirectTo: '/'});
});

app.run(function(DashboardService){
});
