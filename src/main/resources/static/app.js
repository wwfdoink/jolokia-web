angular.module('jolokiaWeb', ['ngRoute', 'ui.bootstrap', 'angular-websocket', 'chart.js'])
.config(function($routeProvider) {
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
})
.constant('jsPath', {
  component: './static/component',
  api: './api',
  ws: (window.location.protocol.startsWith("https") ? "wss://" : "ws://") + window.location.host + window.location.pathname + ((window.location.pathname.endsWith("/")) ? "ws" : "/ws")
})
.run(function(DashboardService, JolokiaService, $rootScope){
  $rootScope.policyList = [];
  $rootScope.hasPolicy = function(arg){
    return (_.indexOf($rootScope.policyList, arg) > -1);
  }
  JolokiaService.checkPolicy().then(function(result){
    $rootScope.policyList = result.data.policy;
  });
});
