package prj.jolokiaweb.jolokia;

import java.util.Arrays;
import java.util.HashSet;
import java.util.Set;


public class AgentInfo {
    public enum JolokiaPermission {
        NONE,READ,WRITE,EXECUTE
    }

    private String url;
    private boolean isLocalAgent = false;
    private boolean requireAuth = false;
    private String agentUsername;
    private String agentPassword;

    private String webUsername;
    private String webPassword;
    private SSLConfig SSLConfig = new SSLConfig();

    private Set<JolokiaPermission> beanPermissions = new HashSet<>();

    public AgentInfo() {
    }

    public String getUrl() {
        return (url != null) ? url.toString() : null;
    }

    public void setUrl(String url) {
        this.url = url;
    }

    public String getAgentUsername() {
        return agentUsername;
    }

    public void setAgentUsername(String agentUsername) {
        this.agentUsername = agentUsername;
    }

    public String getAgentPassword() {
        return agentPassword;
    }

    public void setAgentPassword(String agentPassword) {
        this.agentPassword = agentPassword;
    }

    public String getWebUsername() {
        return webUsername;
    }

    public void setWebUsername(String webUsername) {
        this.webUsername = webUsername;
    }

    public String getWebPassword() {
        return webPassword;
    }

    public void setWebPassword(String webPassword) {
        this.webPassword = webPassword;
    }

    public boolean isLocalAgent() {
        return isLocalAgent;
    }

    public boolean requiresLocalAuth() {
        return webUsername != null;
    }

    public void setLocalAgent(boolean localAgent) {
        isLocalAgent = localAgent;
    }

    public boolean isRequireAuth() {
        return requireAuth;
    }

    public void setRequireAuth(boolean requireAuth) {
        this.requireAuth = requireAuth;
    }

    public void addPermission(JolokiaPermission ... permission) {
        this.beanPermissions.addAll(Arrays.asList(permission));
    }

    public void clearPermission() {
        this.beanPermissions.clear();
    }

    public Set<JolokiaPermission> getBeanPermissions() {
        return beanPermissions;
    }

    public SSLConfig getSSLConfig() {
        return SSLConfig;
    }

    public void setSSLConfig(SSLConfig SSLConfig) {
        this.SSLConfig = SSLConfig;
    }
}