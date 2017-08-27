package prj.jolokiaweb.websocket;

import org.json.simple.JSONObject;
import org.springframework.web.socket.TextMessage;

public class Message {
    public static final String EVENT_ERROR = "error";
    public static final String EVENT_SETTINGS_CHANGE_DASHBOARD_DELAY = "settings.changeDashboardDelay";
    public static final String EVENT_SETTINGS_TRACK_ATTRIBUTE = "settings.trackAttribute";
    public static final String EVENT_SETTINGS_UNTRACK_ATTRIBUTE = "settings.unTrackAttribute";

    protected String event;
    protected JSONObject data;

    public Message(){
    }

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
