angular.module('jolokiaWeb').service("WebsocketService", function($websocket, jsPath){
    var self = this;

    var ws = $websocket(jsPath.ws, null, { 
        reconnectIfNotNormalClose: true,
        maxTimeout: 10,
        initialTimeout: 5
    });

    // WS status
    var wsStatusEvent = new Rx.BehaviorSubject(false);
    ws.onOpen(function(){ 
        wsStatusEvent.next(true);
    });
    ws.onClose(function(){ 
        wsStatusEvent.next(false);
    });
    self.wsStatusEvent = wsStatusEvent.asObservable();


    // WS error
    self.wsErrorEvent = Rx.Observable.create(function(observer) {
        ws.onError(function() { observer.next(); });
    });

    // All Messages
    var messageEvent = new Rx.Subject();
    // Error messages sent over ws
    var errorMessageEvent = new Rx.Subject();

    ws.onMessage(function(res) {
        var msg = JSON.parse(res.data);
        messageEvent.next(msg);

        if (msg.event == "error") {
            messageEvent.error(msg);
            errorMessageEvent.next(msg.data);
        }
    });
    // Expose
    self.messageEvent = messageEvent.asObservable();
    self.errorMessageEvent = errorMessageEvent.asObservable();

    self.send = function(data) {
        if (ws.readyState === 1) {
            ws.send(data);
        } else {
            console.error("ws.send() error: ", data)
        }
    }
});