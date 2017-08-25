angular.module("jolokiaWeb").component('dashboardPage', {
    templateUrl: function(jsPath) { 
        return jsPath.component + '/page/dashboard/dashboardPage.html';
    },
    bindings: {
    },
    controller: function(jsPath, WebsocketService){
        var self = this;
        self.$onInit = function(){
            self.wsUrl = jsPath.ws;
            
            self.errorSub = WebsocketService.messageEvent.subscribe(
                function(data) {}, // all messages
                function(data) {   // error messages
                    self.clientError = data.error;
                },
            );
        }

        self.$onDestroy = function(){
            self.errorSub.unsubscribe();
        }
    }
});
