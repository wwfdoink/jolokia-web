package prj.jolokiaweb.websocket;

import org.springframework.web.socket.WebSocketSession;

import java.util.Comparator;

public class WebSocketSessionComparator implements Comparator {
    @Override
    public int compare(Object o1, Object o2) {
        String id1 = ((WebSocketSession)o1).getId();
        String id2 = ((WebSocketSession)o2).getId();
        return id1.compareTo(id2);
    }
}
