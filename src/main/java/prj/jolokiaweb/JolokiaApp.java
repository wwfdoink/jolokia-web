package prj.jolokiaweb;

import org.apache.catalina.Context;
import org.apache.catalina.LifecycleException;
import org.apache.catalina.startup.Tomcat;
import org.apache.commons.cli.*;
import org.apache.tomcat.websocket.server.WsSci;
import org.jolokia.client.J4pClient;

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
    private static Tomcat tomcat;
    private static String baseUrl;

    private final Set<JolokiaBeanPermission> beanPermissions = new HashSet<>();

    /**
     * @param tomcatPort Web server listening port
     * @param beanPermissions Permissions for MBean tab READ,WRITE,EXEC
     */
    public JolokiaApp(final Integer tomcatPort, final JolokiaBeanPermission ... beanPermissions) throws ServletException {
        int port = (tomcatPort == null) ? DEFAULT_PORT : tomcatPort;
        tomcat = new Tomcat();
        tomcat.setPort(port);
        tomcat.setBaseDir(new File(System.getProperty("java.io.tmpdir")).getAbsolutePath());
        tomcat.getHost().setAppBase(".");
        Context ctx = tomcat.addWebapp("/", new File(System.getProperty("java.io.tmpdir")).getAbsolutePath());
        ctx.addServletContainerInitializer(new WsSci(), null);

        //TODO fix this
        baseUrl = "http://" + tomcat.getServer().getAddress() + ":" + port;

        this.beanPermissions.addAll(Arrays.asList(beanPermissions));
    }

    public static void main(String[] args) throws Exception {
        Options options = new Options();

        options.addOption(Option.builder()
                .argName("1-65534")
                .longOpt("port")
                .optionalArg(true)
                .hasArg()
                .desc("Tomcat listening port, default: " + DEFAULT_PORT)
                .build());
        options.addOption(Option.builder()
                .argName("rwx")
                .longOpt("access")
                .optionalArg(true)
                .hasArg()
                .desc("MBean permissions, r|w|x|rw|rx|wx|rwx")
                .build());

        CommandLineParser parser = new DefaultParser();

        int port = DEFAULT_PORT;
        Set<JolokiaBeanPermission> beanPermissions = new HashSet<>();

        try {
            CommandLine line = parser.parse(options, args);

            if (line.hasOption("port") ) {
                port = Integer.parseInt(line.getOptionValue("port"));
                if (port < 1 || port > 65534) {
                    throw new RuntimeException("Invalid port number");
                }
            } else {
                System.out.println("Using default port: " + port);
            }

            if (line.hasOption("access") ) {
                String permStr = line.getOptionValue("access");
                if (permStr.contains("r")) {
                    beanPermissions.add(JolokiaBeanPermission.READ);
                }
                if (permStr.contains("w")) {
                    beanPermissions.add(JolokiaBeanPermission.WRITE);
                }
                if (permStr.contains("x")) {
                    beanPermissions.add(JolokiaBeanPermission.EXEC);
                }
            }

            JolokiaApp app = new JolokiaApp(port, beanPermissions.toArray(new JolokiaBeanPermission[beanPermissions.size()]));
            app.startAndWait();
        } catch(Exception e) {
            System.out.println("Invalid input:" + e.getMessage());
            HelpFormatter formatter = new HelpFormatter();
            formatter.printHelp( "java -jar jolokiaweb-all.jar", options);
        }
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

    public static String getBaseUrl() {
        return baseUrl;
    }

    public static String getJolokiaUrl() {
        return getBaseUrl() + "/jolokia/";
    }

    /**
     * Builder class for JolokiaApp
     */
    public static class Builder {
        private Integer port;
        private Set<JolokiaBeanPermission> beanPermissions = new HashSet<>();

        public Builder() {
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
            return new JolokiaApp(this.port);
        }
    }
}
