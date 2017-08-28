angular.module("jolokiaWeb").component('settingsPage', {
    templateUrl: function(jsPath) { 
        return jsPath.component + '/page/settings/settingsPage.html';
    },
    bindings: {
    },
    controller: function(DashboardService, LocalStorageService, WebsocketService, Notification) {
        var self = this;

        self.$onInit = function () {
            self.minView = LocalStorageService.get("minView");

            self.trackedAttributes = LocalStorageService.get("trackedAttributes");

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
                Notification.error({
                    title: '<i class="fa fa-exclamation-triangle"></i> Dashboard update delay',
                    message: 'Invalid value!',
                    delay: 8000
                });
                return;
            }
            LocalStorageService.set("dashboardUpdateDelay", self.dashboardUpdateDelay);
            DashboardService.updateDashboardDelay(self.dashboardUpdateDelay);
            Notification.success({
                title: '<i class="fa fa-check"></i> Dashboard update delay',
                message: 'New delay saved successfully...',
                delay: 5000
            });
        }

        self.removeAttributeSubscription = function(attr){
            DashboardService.unTrackAttribute(attr.id,attr.name);
            self.trackedAttributes = LocalStorageService.get("trackedAttributes");
            Notification.success({
                title: '<i class="fa fa-check"></i> Attribute is no longer tracked...',
                message: attr.name + '<br>' + attr.id,
                delay: 5000
            });            
        }
        
        self.$onDestroy = function(){
            self.wsStatusSub.unsubscribe();
        }
    }
});