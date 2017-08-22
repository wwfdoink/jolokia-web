angular.module("jolokiaWeb").component('dashboardPage', {
    templateUrl: function(jsPath) { 
        return jsPath.component + '/page/dashboard/dashboardPage.html';
    },
    bindings: {
    },
    controller: function(){
    }
});
