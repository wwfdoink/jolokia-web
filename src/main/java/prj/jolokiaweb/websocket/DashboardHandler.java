package prj.jolokiaweb.websocket;

import org.json.simple.JSONObject;
import org.springframework.stereotype.Component;
import org.springframework.web.socket.TextMessage;
import org.springframework.web.socket.WebSocketSession;
import org.springframework.web.socket.handler.TextWebSocketHandler;

import java.util.ArrayList;
import java.util.List;

@Component
public class DashboardHandler extends TextWebSocketHandler {

    List<WebSocketSession> sessionList = new ArrayList<>();

    synchronized void addSession(WebSocketSession session) {
        this.sessionList.add(session);
    }
    synchronized void removeSession(WebSocketSession session) {
        this.sessionList.remove(session);
    }
    public int getClientNum(){
        return sessionList.size();
    }
    public void sendDashboardStats(Message msg) {
        for (WebSocketSession session : sessionList) {
            if (session.isOpen()) {
                try {
                    session.sendMessage(msg.toTextMessage());
                } catch (Exception e) {
                    e.printStackTrace();
                }
            }
        }
    }

    @Override
    public void afterConnectionEstablished(WebSocketSession session) {
        addSession(session);
    }

    @Override
    protected void handleTextMessage(WebSocketSession session, TextMessage message) throws Exception {
        if ("CLOSE".equalsIgnoreCase(message.getPayload())) {
            session.close();
            removeSession(session);
        }
    }
}
