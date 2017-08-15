package prj.jolokiaweb.websocket;

import org.json.simple.JSONObject;
import org.springframework.stereotype.Component;
import org.springframework.web.socket.CloseStatus;
import org.springframework.web.socket.TextMessage;
import org.springframework.web.socket.WebSocketSession;
import org.springframework.web.socket.handler.TextWebSocketHandler;

import java.util.ArrayList;
import java.util.Comparator;
import java.util.Iterator;
import java.util.List;
import java.util.concurrent.ConcurrentSkipListSet;

@Component
public class WsHandler extends TextWebSocketHandler {

    private ConcurrentSkipListSet<WebSocketSession> sessionList = new ConcurrentSkipListSet(new WebSocketSessionComparator());

    public int getClientNum(){
        return sessionList.size();
    }

    public void sendDashboardStats(Message msg) {
        Iterator<WebSocketSession> itr = sessionList.iterator();
        while (itr.hasNext()){
            WebSocketSession session = itr.next();
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
    public void afterConnectionEstablished(WebSocketSession session) throws Exception {
        sessionList.add(session);
    }

    @Override
    public void afterConnectionClosed(WebSocketSession session, CloseStatus status) throws Exception {
        sessionList.remove(session);
    }

}
