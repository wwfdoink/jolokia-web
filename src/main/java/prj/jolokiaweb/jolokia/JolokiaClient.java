package prj.jolokiaweb.jolokia;

import org.jolokia.client.J4pClient;
import org.springframework.stereotype.Service;
import prj.jolokiaweb.JolokiaApp;

@Service
public class JolokiaClient {
    private J4pClient client;

    public J4pClient getClient() {
        if (client == null) {
            client = new J4pClient(JolokiaApp.getJolokiaUrl());
        }
        return client;
    }
}
