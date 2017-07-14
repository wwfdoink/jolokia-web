package prj.jolokiaweb;

import org.apache.catalina.LifecycleException;
import org.apache.catalina.startup.Tomcat;

import javax.servlet.ServletException;
import java.io.File;
import java.util.Arrays;
import java.util.HashSet;
import java.util.Set;

public class JolokiaApp {
    public enum JolokiaBeanPermission {
        READ,WRITE,EXEC
    }
    private static final int DEFAULT_PORT = 8080;
    private static final String DEFAULT_JOLOKIA_URL = "http://localhost:8778/jolokia";
    private final Tomcat tomcat;
    private static String jolokiaUrl = null;
    private final Set<JolokiaBeanPermission> beanPermissions = new HashSet<>();

    /**
     * @param jolokiaUrl absolute URL to jolokia endpoint
     * @param tomcatPort Web server listening port
     * @param beanPermissions Permissions for MBean tab READ,WRITE,EXEC
     */
    public JolokiaApp(final String jolokiaUrl, final Integer tomcatPort, final JolokiaBeanPermission ... beanPermissions) throws ServletException {
        tomcat = new Tomcat();
        tomcat.setPort((tomcatPort == null) ? DEFAULT_PORT : tomcatPort);
        tomcat.setBaseDir(new File(System.getProperty("java.io.tmpdir")).getAbsolutePath());
        tomcat.getHost().setAppBase(".");
        tomcat.addWebapp("/jolokiaweb", new File(System.getProperty("java.io.tmpdir")).getAbsolutePath());
        this.jolokiaUrl = jolokiaUrl;
        this.beanPermissions.addAll(Arrays.asList(beanPermissions));
    }

    public static void main(String[] args) throws Exception {
        JolokiaApp app = new JolokiaApp(DEFAULT_JOLOKIA_URL, DEFAULT_PORT);
        app.startAndWait();
    }

    public static String getJolokiaUrl() {
        return jolokiaUrl;
    }

    public Set<JolokiaBeanPermission> getBeanPermissions() {
        return beanPermissions;
    }

    /**
     * Start tomcat server and return when server has started.
     */
    public void start() throws LifecycleException {
        tomcat.start();
    }

    /**
     * Start tomcat server then block
     * @throws LifecycleException
     */
    public void startAndWait() throws LifecycleException {
        start();
        tomcat.getServer().await();
    }

    public void stop() throws LifecycleException {
        try {
            tomcat.stop();
        } finally {
            tomcat.destroy();
        }
    }

    /**
     * Builder class for JolokiaApp
     */
    public static class Builder {
        private final String jolokiaUrl;
        private Integer port;
        private Set<JolokiaBeanPermission> beanPermissions = new HashSet<>();

        /**
         * @param jolokiaUrl absolute URL to the jolokia endpoint
         */
        public Builder(final String jolokiaUrl) {
            this.jolokiaUrl = jolokiaUrl;
            this.port = 8080;
        }

        /**
         * @param port Web server listening port
         * @return this Builder
         */
        public Builder port(final int port) {
            this.port = port;
            return this;
        }

        /**
         * @param permissionArray Permissions for MBean tab READ,WRITE,EXEC
         * @return
         */
        public Builder permissions(JolokiaBeanPermission ... permissionArray) {
            this.beanPermissions.clear();
            this.beanPermissions.addAll(Arrays.asList(permissionArray));
            return this;
        }

        /**
         * @return new JolokiaApp instance
         */
        public JolokiaApp build() throws ServletException {
            return new JolokiaApp(this.jolokiaUrl, this.port);
        }
    }
}
