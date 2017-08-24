angular.module("jolokiaWeb").component('settingsPage', {
    templateUrl: function(jsPath) { 
        return jsPath.component + '/page/settings/settingsPage.html';
    },
    bindings: {
    },
    controller: function(LocalStorageService, DashboardService, $rootScope) {
        var self = this;
        self.$onInit = function () {
            self.minView = LocalStorageService.get("minView");

            var delay = LocalStorageService.get("dashboardUpdateDelay");
            self.dashboardUpdateDelay = (delay === null) ? 3 : parseInt(delay);
        }
        self.toggleMinView = function(){
            self.minView = !self.minView;
            LocalStorageService.set("minView", self.minView);
        }
        self.updateDashboardDelay = function(){
            if (!self.dashboardUpdateDelay) {
                alert("Invalid input!");
                return;
            }
            LocalStorageService.set("dashboardUpdateDelay", self.dashboardUpdateDelay);
            DashboardService.updateDashboardDelay(self.dashboardUpdateDelay);
        }
    }
});