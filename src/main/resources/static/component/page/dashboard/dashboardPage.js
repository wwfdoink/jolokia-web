angular.module("jolokiaWeb").component('dashboardPage', {
    templateUrl: function(jsPath) { 
        return jsPath.component + '/page/dashboard/dashboardPage.html';
    },
    bindings: {
    },
    controller: function(jsPath, DashboardService){
        var self = this;

        self.wsUrl = jsPath.ws;

        self.hideError = function(){
            DashboardService.clearError();
        }
    }
});
