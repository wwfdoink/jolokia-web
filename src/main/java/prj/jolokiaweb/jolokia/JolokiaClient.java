package prj.jolokiaweb.jolokia;

import org.apache.http.conn.ssl.SSLConnectionSocketFactory;
import org.apache.http.conn.ssl.SSLContextBuilder;
import org.apache.http.conn.ssl.TrustSelfSignedStrategy;
import org.jolokia.client.J4pClient;
import org.jolokia.client.J4pClientBuilder;
import org.jolokia.client.J4pClientBuilderFactory;

import javax.net.ssl.SSLContext;

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
            String user = agentInfo.getAgentUsername();
            String password = agentInfo.getAgentPassword();
            if (agentInfo.requiresLocalAuth() && agentInfo.getAgentUsername() == null) {
                user = agentInfo.getWebUsername();
                password = agentInfo.getWebPassword();
            }

            J4pClientBuilder clientBuilder = J4pClientBuilderFactory
                        .url(agentInfo.getUrl())
                        .user(user)
                        .password(password)
                        .maxTotalConnections(MAX_CONNECTIONS);

            SSLConfig config = agentInfo.getSSLConfig();
            if (config.isSelfSignedCertAllowed()) {
                try {
                    SSLContext sslContext = new SSLContextBuilder()
                        .loadTrustMaterial(null, new TrustSelfSignedStrategy())
                        .build();

                    SSLConnectionSocketFactory sslConnection = new SSLConnectionSocketFactory(
                            sslContext,
                            SSLConnectionSocketFactory.ALLOW_ALL_HOSTNAME_VERIFIER
                    );

                    clientBuilder.sslConnectionSocketFactory(sslConnection);
                } catch (Exception e) {
                    e.printStackTrace();
                }
            }
            instance = clientBuilder.build();
        }
        return instance;
    }

    public static AgentInfo getAgentInfo() {
        return agentInfo;
    }
}
