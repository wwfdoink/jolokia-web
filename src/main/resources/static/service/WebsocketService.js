angular.module('jolokiaWeb').service("WebsocketService", function($websocket, jsPath){
    var self = this;

    var ws = $websocket(jsPath.ws, null, { 
        reconnectIfNotNormalClose: true,
        maxTimeout: 10,
        initialTimeout: 5
    });

    // WS status
    self.wsStatusEvent = new Rx.BehaviorSubject(false);
    ws.onOpen(() => { 
        self.wsStatusEvent.next(true);
    });
    ws.onClose(() => { 
        self.wsStatusEvent.next(false);
    });

    // WS error
    self.wsErrorEvent = Rx.Observable.create((observer) => {
        ws.onError(() => { observer.next(); });
    });

    // All Messages
    self.messageEvent = new Rx.Subject();
    // Error messages sent over ws
    self.errorMessageEvent = new Rx.Subject();
    // Dashboard update messages
    self.dashboardUpdateEvent = new Rx.Subject(),

    ws.onMessage(function(res) {
        var msg = JSON.parse(res.data);
        self.messageEvent.next(msg);

        if (msg.event == "dashboard") {
            self.dashboardUpdateEvent.next(msg.data);
        } else if (msg.event == "error") {
            self.messageEvent.error(msg.data);
            self.errorMessageEvent.next(msg.data);
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