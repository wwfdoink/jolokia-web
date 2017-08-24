package prj.jolokiaweb.jolokia;

import org.jolokia.client.J4pClient;
import org.jolokia.client.J4pClientBuilderFactory;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import prj.jolokiaweb.JolokiaApp;

public class JolokiaClient {
    private static final int MAX_CONNECTIONS = 2;
    private static J4pClient instance;
    private static AgentInfo agentInfo;


    private JolokiaClient(){
    }

    public static J4pClient init(AgentInfo initialAgentInfo){
        if (instance != null) {
            return instance;
        }
        agentInfo = initialAgentInfo;
        return getInstance();
    }

    public static synchronized J4pClient getInstance() {
        if (instance == null) {
            instance = J4pClientBuilderFactory
                        .url(agentInfo.getUrl())
                        .user(agentInfo.getUsername())
                        .password(agentInfo.getPassword())
                        .maxTotalConnections(MAX_CONNECTIONS)
                        .build();
            ;
        }
        return instance;
    }

    public static AgentInfo getAgentInfo() {
        return agentInfo;
    }
}
