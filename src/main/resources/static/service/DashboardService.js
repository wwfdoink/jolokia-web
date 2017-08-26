angular.module('jolokiaWeb').service("DashboardService", function(WebsocketService, LocalStorageService){
    var self = this;

    self.updateDashboardDelay = function(delay){
        WebsocketService.send(JSON.stringify(
            { 
                event: 'settings.changeDashboardDelay',
                data: { 
                    delay: delay
                }
            }
        ));
    }

    self.chartEvents = {
        os: new Rx.ReplaySubject(50),
        memory: new Rx.ReplaySubject(50),
        thread: new Rx.ReplaySubject(50),
    }

    WebsocketService.dashboardUpdateEvent.subscribe(
        function(data) {  
            self.chartEvents.os.next(data.os);
            self.chartEvents.memory.next(data.memory);
            self.chartEvents.thread.next(data.thread);
        }
    )
        

    WebsocketService.wsStatusEvent.subscribe(function(wsConnected) {
        if (wsConnected) {
            var delay = LocalStorageService.get("dashboardUpdateDelay");
            if (delay != null) {
                self.updateDashboardDelay(delay);            
            }
        }
    });

});