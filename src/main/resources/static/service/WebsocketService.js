angular.module('jolokiaWeb').service("WebsocketService", function($websocket, JolokiaService, LocalStorageService, jsPath){
    var self = this;

    var ws = $websocket(jsPath.ws, null, { 
        reconnectIfNotNormalClose: true,
        maxTimeout: 10,
        initialTimeout: 5
    });

    // WS open
    self.openEvent = Rx.Observable.create((observer) => {
        ws.onOpen(() => { observer.next(); });
    });
    // WS close
    self.closeEvent = Rx.Observable.create((observer) => {
        ws.onClose(() => { observer.next(); });
    });
    // WS error
    self.errorEvent = Rx.Observable.create((observer) => {
        ws.onError(() => { observer.next(); });
    });

    // All Messages
    self.messageEvent = new Rx.Subject();
    // Dashboard update messages
    self.dashboardUpdateEvent = new Rx.Subject();
    
    ws.onMessage(function(res) {
        var msg = JSON.parse(res.data);
        self.messageEvent.next(msg);

        if (msg.event == "dashboard") {
            self.dashboardUpdateEvent.next(msg.data);
        } else if (msg.event == "error") {
            self.messageEvent.error(msg.data);
        }
    });

    self.send = function(data) {
        if (ws.readyState === 1) {
            ws.send(data);
        } else {
            console.error("ws.send() error: ", data)
        }
    }
});