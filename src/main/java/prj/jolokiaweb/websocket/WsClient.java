package prj.jolokiaweb.websocket;


import org.jolokia.client.request.J4pReadRequest;
import prj.jolokiaweb.jolokia.AgentInfo;
import prj.jolokiaweb.jolokia.JolokiaClient;

import java.util.*;
import java.util.concurrent.ConcurrentHashMap;

public class WsClient {
    public static final int DEFAULT_DASHBOARD_DELAY = 3; //3 SEC

    private int dashboardDelay = DEFAULT_DASHBOARD_DELAY;
    private int dashboardTick = 0;
    private Map<String, Set<String>> trackedAttributes = new ConcurrentHashMap<>();

    public Map<String, Set<String>> getTrackedAttributes() {
        return trackedAttributes;
    }

    public WsClient() {
    }

    public void setDashboardDelay(int dashboardDelay) {
        this.dashboardDelay = dashboardDelay;
    }

    public void clearDashboardTick() {
        this.dashboardTick = 0;
    }

    public void incDashboardTick() {
        this.dashboardTick += 1; // 1 sec
    }

    public boolean timeToUpdate() {
        if (dashboardTick >= dashboardDelay) {
            dashboardTick = 0;
            return true;
        }
        return false;
    }

    public boolean isTracking(String chartId) {
        for (Map.Entry<String, Set<String>> beanEntry : trackedAttributes.entrySet()) {
            for (String attrName : beanEntry.getValue()) {
                if (chartId.equals(beanEntry.getKey() + ":" + attrName)) {
                    return true;
                }
            }
        };
        return false;
    }

    public synchronized void trackAttribute(String beanId, String attribute){
        Set<String> beanAttrs = trackedAttributes.get(beanId);
        if (beanAttrs == null) {
            beanAttrs = new HashSet<>(Arrays.asList(attribute));
        } else {
            beanAttrs.add(attribute);
        }
        trackedAttributes.put(beanId, beanAttrs);
    }

    public synchronized void unTrackAttribute(String beanId, String attribute){
        Set<String> beanAttrs = trackedAttributes.get(beanId);
        if (beanAttrs != null) {
            beanAttrs.remove(attribute);
            if (beanAttrs.size() < 1) {
                trackedAttributes.remove(beanId);
            }
        }
    }
}
