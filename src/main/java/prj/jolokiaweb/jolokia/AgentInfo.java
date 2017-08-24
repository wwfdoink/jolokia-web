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
    private String username;
    private String password;
    private Set<JolokiaPermission> beanPermissions = new HashSet<>();

    public AgentInfo() {
    }

    public String getUrl() {
        return (url != null) ? url.toString() : null;
    }

    public void setUrl(String url) {
        this.url = url;
    }

    public String getUsername() {
        return username;
    }

    public void setUsername(String username) {
        this.username = username;
    }

    public String getPassword() {
        return password;
    }

    public void setPassword(String password) {
        this.password = password;
    }

    public boolean isLocalAgent() {
        return isLocalAgent;
    }

    public void setLocalAgent(boolean localAgent) {
        isLocalAgent = localAgent;
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
}