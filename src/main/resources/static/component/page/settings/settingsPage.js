angular.module("jolokiaWeb").component('settingsPage', {
    templateUrl: function(jsPath) { 
        return jsPath.component + '/page/settings/settingsPage.html';
    },
    bindings: {
    },
    controller: function(DashboardService, LocalStorageService, WebsocketService) {
        var self = this;

        self.$onInit = function () {
            self.minView = LocalStorageService.get("minView");

            var delay = LocalStorageService.get("dashboardUpdateDelay");
            self.dashboardUpdateDelay = (delay === null) ? 3 : parseInt(delay);

            self.wsStatus = WebsocketService.wsStatus;
            self.wsStatusSub = WebsocketService.wsStatusEvent.subscribe(
                function(status) { self.wsStatus = status; }
            );
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

        self.$onDestroy = function(){
            self.wsStatusSub.unsubscribe();
        }
    }
});