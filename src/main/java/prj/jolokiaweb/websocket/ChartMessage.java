package prj.jolokiaweb.websocket;

import org.json.simple.JSONObject;

public class ChartMessage extends Message {
    public static final String EVENT_CHART_UPDATE = "chart.update";

    protected String chartId;

    public ChartMessage(String chartId, JSONObject data) {
        super(EVENT_CHART_UPDATE, data);
        this.chartId = chartId;
    }

    @Override
    public String toString() {
        JSONObject ret = new JSONObject();
        ret.put("event", this.event);
        ret.put("chartId", this.chartId);
        ret.put("data", this.data);
        return ret.toJSONString();
    }
}
