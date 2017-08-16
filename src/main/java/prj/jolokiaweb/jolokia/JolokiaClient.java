package prj.jolokiaweb.jolokia;

import org.jolokia.client.J4pClient;
import org.jolokia.client.J4pClientBuilderFactory;
import org.springframework.stereotype.Service;
import prj.jolokiaweb.JolokiaApp;

public class JolokiaClient {
    private static J4pClient instance;

    private JolokiaClient(){
    }

    public static synchronized J4pClient getInstance() {
        if (instance == null) {
            instance = J4pClientBuilderFactory
                        .url(JolokiaApp.getJolokiaUrl())
                        .maxTotalConnections(2)
                        .build();
            ;
        }
        return instance;
    }
}
