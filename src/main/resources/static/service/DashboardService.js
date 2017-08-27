angular.module('jolokiaWeb').service("DashboardService", function(WebsocketService, LocalStorageService){
    var self = this;

    self.updateDashboardDelay = function(delay){
        WebsocketService.send(JSON.stringify({ 
                event: 'settings.changeDashboardDelay',
                data: { delay: delay }
        }));
    }

    self.trackAttribute = function(beanId, attrName){
        var trackedAttributes = LocalStorageService.get("trackedAttributes");
        if (trackedAttributes == null) { 
            trackedAttributes = [];
        }
        trackedAttributes.push({id: beanId, name: attrName});
        LocalStorageService.set("trackedAttributes", trackedAttributes);

        self.initAttribute(beanId, attrName);
    }

    self.initAttribute = function(beanId, attrName){
        var chartId = beanId + ":" + attrName;
        WebsocketService.send(JSON.stringify({ 
                event: 'settings.trackAttribute',
                data: { id: beanId, name: attrName }
        }));
        chartEvents[chartId] = new Rx.ReplaySubject(50);
        self.chartEvents[chartId] = chartEvents[chartId].asObservable();
    }

    self.unTrackAttribute = function(beanId, attrName){
        var chartId = beanId + ":" + attrName;
        WebsocketService.send(JSON.stringify({ 
                event: 'settings.unTrackAttribute',
                data: { id: beanId, name: attrName }
        }));

        var trackedAttributes = LocalStorageService.get("trackedAttributes");
        if (trackedAttributes != null) {
            trackedAttributes = _.reject(trackedAttributes, function(attr){ 
                return ((attr.id == beanId) && (attr.name == attrName));
            });
            LocalStorageService.set("trackedAttributes", trackedAttributes);
        }
        delete self.chartEvents[chartId];
    }

    WebsocketService.wsStatusEvent.subscribe(function(wsConnected) {
        if (wsConnected) {
            var delay = LocalStorageService.get("dashboardUpdateDelay");
            if (delay != null) {
                self.updateDashboardDelay(delay);
            }
            var trackedAttributes = LocalStorageService.get("trackedAttributes");
            if (trackedAttributes != null) {
                trackedAttributes.forEach(function(attr){
                    self.initAttribute(attr.id, attr.name);                    
                });
            }
        }
    });

    var chartEvents = {
        os: new Rx.ReplaySubject(50),
        memory: new Rx.ReplaySubject(50),
        thread: new Rx.ReplaySubject(50),
    }

    WebsocketService.messageEvent.filter(function(msg){ 
        return msg.event === 'chart.update';
    }).subscribe(function(msg) {
        if (chartEvents.hasOwnProperty(msg.chartId)) {
            chartEvents[msg.chartId].next(msg.data);
        }
    });

    self.chartEvents = {
        os: chartEvents.os.asObservable(),
        memory: chartEvents.memory.asObservable(),
        thread: chartEvents.thread.asObservable(),
    }
});
