package prj.jolokiaweb.websocket;

import org.json.simple.JSONObject;
import org.springframework.web.socket.TextMessage;

public class Message {
    private String event;
    private JSONObject data;

    public Message(String event, JSONObject data) {
        this.event = event;
        this.data = data;
    }

    public String getEvent() {
        return event;
    }

    public void setEvent(String event) {
        this.event = event;
    }

    public JSONObject getData() {
        return data;
    }

    public void setData(JSONObject data) {
        this.data = data;
    }

    @Override
    public String toString() {
        JSONObject ret = new JSONObject();
        ret.put("event", this.event);
        ret.put("data", this.data);
        return ret.toJSONString();
    }

    public TextMessage toTextMessage() {
        return new TextMessage(this.toString());
    }
}
