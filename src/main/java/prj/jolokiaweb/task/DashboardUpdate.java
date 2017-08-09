package prj.jolokiaweb.task;

import org.jolokia.client.J4pClient;
import org.jolokia.client.exception.J4pException;
import org.jolokia.client.request.J4pReadRequest;
import org.jolokia.client.request.J4pRequest;
import org.jolokia.client.request.J4pResponse;
import org.json.simple.JSONObject;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.scheduling.annotation.Scheduled;
import org.springframework.stereotype.Component;
import prj.jolokiaweb.JolokiaApp;
import prj.jolokiaweb.websocket.DashboardHandler;
import prj.jolokiaweb.websocket.Message;

import javax.management.MalformedObjectNameException;
import java.util.List;

@Component
public class DashboardUpdate {

    @Autowired
    private DashboardHandler handler;

    @Scheduled(fixedDelay=3000)
    public void publishUpdates(){
        if (handler.getClientNum() < 1) {
            return;
        }
        JSONObject result = new JSONObject();
        J4pClient j4pClient = new J4pClient(JolokiaApp.getJolokiaUrl());
        try {
            J4pReadRequest cpuReq = new J4pReadRequest("java.lang:type=OperatingSystem","ProcessCpuLoad","SystemCpuLoad");
            J4pReadRequest threadReq = new J4pReadRequest("java.lang:type=Threading","ThreadCount","PeakThreadCount");
            J4pReadRequest memoryHeapReq = new J4pReadRequest("java.lang:type=Memory","HeapMemoryUsage");
            List<J4pResponse<J4pRequest>> responseList = j4pClient.execute(cpuReq, threadReq, memoryHeapReq);

            result.put("CpuLoad", responseList.get(0).getValue());
            result.put("Thread", responseList.get(1).getValue());
            result.put("HeapMemoryUsage", responseList.get(2).getValue());

            handler.sendDashboardStats(new Message("dashboard", result));
        } catch (MalformedObjectNameException e) {
            System.err.println(e.getMessage());
        } catch (J4pException e) {
            System.err.println(e.getMessage());
        }
    }
}
