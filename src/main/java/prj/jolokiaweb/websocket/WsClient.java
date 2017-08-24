package prj.jolokiaweb.websocket;


public class WsClient {
    public static final int DEFAULT_DASHBOARD_DELAY = 3; //3 SEC

    private int dashboardDelay = DEFAULT_DASHBOARD_DELAY;
    private int dashboardTick = 0;

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
}
