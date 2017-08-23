angular.module("jolokiaWeb").component('settingsPage', {
    templateUrl: function(jsPath) { 
        return jsPath.component + '/page/settings/settingsPage.html';
    },
    bindings: {
    },
    controller: function(LocalStorageService, $rootScope) {
        var self = this;
        self.$onInit = function () {
            self.minView = LocalStorageService.get("minView");
        }
        self.toggleMinView = function(){
            self.minView = !self.minView;
            LocalStorageService.set("minView", self.minView);
        }
    }
});