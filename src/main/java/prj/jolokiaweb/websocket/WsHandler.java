package prj.jolokiaweb.websocket;

import com.fasterxml.jackson.databind.ObjectMapper;
import jdk.nashorn.internal.ir.ObjectNode;
import org.springframework.stereotype.Component;
import org.springframework.web.socket.CloseStatus;
import org.springframework.web.socket.TextMessage;
import org.springframework.web.socket.WebSocketSession;
import org.springframework.web.socket.handler.TextWebSocketHandler;


import java.util.concurrent.ConcurrentHashMap;


@Component
public class WsHandler extends TextWebSocketHandler {

    private ConcurrentHashMap<WebSocketSession, WsClient> clients = new ConcurrentHashMap();

    public int getClientNum(){
        return clients.size();
    }

    public ConcurrentHashMap<WebSocketSession, WsClient> getClients() {
        return clients;
    }

    @Override
    public void afterConnectionEstablished(WebSocketSession session) throws Exception {
        clients.put(session, new WsClient());
    }

    @Override
    public void afterConnectionClosed(WebSocketSession session, CloseStatus status) throws Exception {
        clients.remove(session);
    }

    @Override
    protected void handleTextMessage(WebSocketSession session, TextMessage result) throws Exception {
        String payload = result.getPayload();
        ObjectMapper mapper = new ObjectMapper();

        Message message = mapper.readValue(payload, Message.class);
        if (Message.EVENT_SETTINGS_CHANGE_DASHBOARD_DELAY.equals(message.getEvent())) {
            WsClient client = clients.get(session);
            if (client != null) {
                Integer delay = (Integer) message.getData().get("delay");
                if (delay > 0) {
                    client.setDashboardDelay(delay);
                    client.clearDashboardTick();
                }
            }
        } else if (Message.EVENT_SETTINGS_TRACK_ATTRIBUTE.equals(message.getEvent())) {
            WsClient client = clients.get(session);
            if (client != null) {
                client.trackAttribute((String)message.getData().get("id"), (String)message.getData().get("name"));
            }
        } else if (Message.EVENT_SETTINGS_UNTRACK_ATTRIBUTE.equals(message.getEvent())) {
            WsClient client = clients.get(session);
            if (client != null) {
                client.unTrackAttribute((String)message.getData().get("id"), (String)message.getData().get("name"));
            }
        }
    }
}
