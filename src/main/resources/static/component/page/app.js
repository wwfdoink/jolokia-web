angular.module("jolokiaWeb").component('app', {
    templateUrl: function(jsPath) {
        return jsPath.component + '/page/app.html';
    },
    bindings: {
    },
    controller: function(jsPath, JolokiaService, WebsocketService) {
        var self = this;

        self.$onInit = function(){
            self.wsUrl = jsPath.ws;
            
            self.hasPermission = JolokiaService.hasPermission;

            self.wsStatus = WebsocketService.wsStatus;
            self.wsStatusSub = WebsocketService.wsStatusEvent.subscribe(
                function(status) { self.wsStatus = status; }
            );

            self.clientError = null;
            self.clientErrorSub = WebsocketService.errorMessageEvent.subscribe(
                function(message) { self.clientError = message; }
            );
        }

        self.$onDestroy = function(){
            self.wsStatusSub.unsubscribe();
            self.clientErrorSub.unsubscribe();
        }
    }
});
