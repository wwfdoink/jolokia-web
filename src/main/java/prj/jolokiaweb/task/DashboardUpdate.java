package prj.jolokiaweb.task;

import org.jolokia.client.exception.J4pException;
import org.jolokia.client.request.J4pReadRequest;
import org.jolokia.client.request.J4pReadResponse;
import org.jolokia.client.request.J4pRequest;
import org.jolokia.client.request.J4pResponse;
import org.json.simple.JSONObject;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.scheduling.annotation.Scheduled;
import org.springframework.stereotype.Component;
import org.springframework.web.socket.WebSocketSession;
import prj.jolokiaweb.jolokia.AgentInfo;
import prj.jolokiaweb.jolokia.JolokiaClient;
import prj.jolokiaweb.websocket.ChartMessage;
import prj.jolokiaweb.websocket.WsClient;
import prj.jolokiaweb.websocket.WsHandler;
import prj.jolokiaweb.websocket.Message;

import javax.management.MalformedObjectNameException;
import javax.management.ObjectName;
import java.io.IOException;
import java.util.*;
import java.util.concurrent.ConcurrentHashMap;
import java.util.concurrent.ConcurrentSkipListSet;

@Component
public class DashboardUpdate {

    @Autowired
    private WsHandler ws;

    @Scheduled(fixedDelay=1000)
    public void dashboardUpdateTick(){
        if (ws.getClientNum() < 1) {
            return;
        }

        // tick all clients and check who need to be updated
        Map<WebSocketSession, WsClient> updatableClients = new HashMap<>();
        for (ConcurrentHashMap.Entry<WebSocketSession, WsClient> clientEntry: ws.getClients().entrySet()) {
            WsClient client = clientEntry.getValue();
            client.incDashboardTick();
            if (client.timeToUpdate()) {
                updatableClients.put(clientEntry.getKey(), clientEntry.getValue());
            }
        }

        // if someone needs to be updated
        if (updatableClients.size() > 0) {
            List<Message> dashboardMessageList = getDashboardUpdateMessages();
            List<Message> trackedAttributeMessageList = getTrackedAttributeMessages();

            for (ConcurrentHashMap.Entry<WebSocketSession, WsClient> clientEntry : updatableClients.entrySet()) {
                try {
                    //broadcast default chart data
                    for (Message msg : dashboardMessageList) {
                        clientEntry.getKey().sendMessage(msg.toTextMessage());
                    }
                    //broadcast tracking attributes for charts
                    for (Message msg : trackedAttributeMessageList) {
                        if (msg instanceof ChartMessage) {
                            ChartMessage chartMessage = (ChartMessage) msg;
                            // only send this attribute info if the client is tracking it
                            if (clientEntry.getValue().isTracking(chartMessage.getChartId())) {
                                clientEntry.getKey().sendMessage(chartMessage.toTextMessage());
                            }
                        } else {
                            // error message
                            clientEntry.getKey().sendMessage(msg.toTextMessage());
                        }
                    }

                } catch (IOException e) {
                    //ignore if user closing his browser while sending data
                }
            }
        }
    }

    public List<Message> getDashboardUpdateMessages(){
        List<Message> result = new ArrayList<>();

        try {
            // Don't forget to update the JolokiaRestrictor if you get different mbeans
            J4pReadRequest osReq = new J4pReadRequest("java.lang:type=OperatingSystem",
                    "ProcessCpuLoad",
                    "SystemCpuLoad",
                    "TotalSwapSpaceSize",
                    "FreeSwapSpaceSize",
                    "TotalPhysicalMemorySize",
                    "FreePhysicalMemorySize"
            );
            J4pReadRequest threadReq = new J4pReadRequest("java.lang:type=Threading","ThreadCount","PeakThreadCount");
            J4pReadRequest memoryHeapReq = new J4pReadRequest("java.lang:type=Memory","HeapMemoryUsage", "NonHeapMemoryUsage");
            List<J4pResponse<J4pRequest>> responseList = JolokiaClient.getInstance().execute(osReq, threadReq, memoryHeapReq);

            result.add(new ChartMessage("os", responseList.get(0).getValue()));
            result.add(new ChartMessage("thread", responseList.get(1).getValue()));
            result.add(new ChartMessage("memory", responseList.get(2).getValue()));
        } catch (Exception e) {
            JSONObject err = new JSONObject();
            err.put("error", "J4pClient error: " + e.getMessage());
            result.add(new Message(Message.EVENT_ERROR, err));
        }
        return result;
    }

    public List<Message> getTrackedAttributeMessages() {
        List<Message> result = new ArrayList<>();

        // if READ is not allowed, we just don't care
        if (!JolokiaClient.getAgentInfo().getBeanPermissions().contains(AgentInfo.JolokiaPermission.READ)) {
            return result;
        }

        try {
            List<J4pReadRequest> requestList = new ArrayList<>();

            for (ConcurrentHashMap.Entry<WebSocketSession, WsClient> clientEntry : ws.getClients().entrySet()) {
                for (Map.Entry<String, Set<String>> attributeEntry : clientEntry.getValue().getTrackedAttributes().entrySet()) {
                    J4pReadRequest readReq = new J4pReadRequest(attributeEntry.getKey(), attributeEntry.getValue().toArray(new String[attributeEntry.getValue().size()]));
                    requestList.add(readReq);
                };
            }
            List<J4pResponse<J4pRequest>> responseList = JolokiaClient.getInstance().execute(requestList.toArray(new J4pReadRequest[requestList.size()]));

            for (J4pResponse valueResponse : responseList) {
                for (String attrName: ((J4pReadResponse) valueResponse).getAttributes()) {
                    JSONObject obj = new JSONObject();
                    if (valueResponse.getValue() instanceof JSONObject) {
                        obj.put(attrName, ((JSONObject) valueResponse.getValue()).get(attrName));
                    } else {
                        obj.put(attrName, valueResponse.getValue());
                    }
                    result.add(new ChartMessage((((J4pReadResponse) valueResponse).getObjectNames().toArray()[0].toString()) + ":" + attrName, obj));
                }
            }
        } catch (Exception e) {
            JSONObject err = new JSONObject();
            err.put("error", "J4pClient error: " + e.getMessage());
            result.add(new Message(Message.EVENT_ERROR, err));
        }
        return result;
    }

}
