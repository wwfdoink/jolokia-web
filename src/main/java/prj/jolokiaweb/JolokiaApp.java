package prj.jolokiaweb;

import org.apache.catalina.Context;
import org.apache.catalina.LifecycleException;
import org.apache.catalina.startup.Tomcat;
import org.apache.commons.cli.*;
import org.apache.tomcat.websocket.server.WsSci;
import org.springframework.util.StringUtils;

import javax.servlet.ServletException;
import java.io.File;
import java.net.MalformedURLException;
import java.net.URL;
import java.util.Arrays;
import java.util.HashSet;
import java.util.Set;

public class JolokiaApp {
    public enum JolokiaBeanPermission {
        READ,WRITE,EXEC
    }
    private static final int DEFAULT_PORT = 8080;
    private static final String DEFAULT_CONTEXT_PATH = "";
    private static Tomcat tomcat;
    private static String baseUrl;
    private static String jolokiaUrl;
    private static String contextPath;

    private final Set<JolokiaBeanPermission> beanPermissions = new HashSet<>();

    /**
     * @param tomcatPort Web server listening port
     * @param beanPermissions Permissions for MBean tab READ,WRITE,EXEC
     */
    public JolokiaApp(final Integer tomcatPort, final String contextPath, final String jolokiaUrl, final JolokiaBeanPermission ... beanPermissions) throws ServletException {
        int port = (tomcatPort == null) ? DEFAULT_PORT : tomcatPort;
        tomcat = new Tomcat();
        tomcat.setPort(port);
        tomcat.setBaseDir(new File(System.getProperty("java.io.tmpdir")).getAbsolutePath());
        tomcat.getHost().setAppBase(".");
        Context ctx = tomcat.addWebapp(contextPath, new File(System.getProperty("java.io.tmpdir")).getAbsolutePath());
        ctx.addServletContainerInitializer(new WsSci(), null);

        //TODO fix this
        StringBuilder urlBuilder = new StringBuilder();
        urlBuilder.append("http://");
        urlBuilder.append(tomcat.getServer().getAddress());
        urlBuilder.append(":");
        urlBuilder.append(port);

        this.baseUrl = urlBuilder.toString();
        this.contextPath = contextPath;
        this.jolokiaUrl = jolokiaUrl;

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
        options.addOption(Option.builder()
                .argName("")
                .longOpt("contextPath")
                .optionalArg(true)
                .hasArg()
                .desc("Context Path, default is the root")
                .build());
        options.addOption(Option.builder()
                .argName("")
                .longOpt("jolokiaUrl")
                .optionalArg(true)
                .hasArg()
                .desc("Remote jolokia-jvm-agent url")
                .build());

        CommandLineParser parser = new DefaultParser();

        int port = DEFAULT_PORT;
        String contextPath = DEFAULT_CONTEXT_PATH;
        String jolokiaUrl = null;
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
            if (line.hasOption("contextPath") ) {
                contextPath = line.getOptionValue("contextPath");
                if (!contextPath.startsWith("/")) {
                    contextPath = "/" + contextPath;
                }
            }
            if (line.hasOption("jolokiaUrl") ) {
                jolokiaUrl = line.getOptionValue("jolokiaUrl");
                URL urlCheck = new URL(jolokiaUrl); // check url
            }

            JolokiaApp app = new JolokiaApp(port, contextPath, jolokiaUrl, beanPermissions.toArray(new JolokiaBeanPermission[beanPermissions.size()]));
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

    public static String getContextPath() {
        return contextPath;
    }

    public static String getContextUrl() {
        if (contextPath.length() > 0) {
            if (getBaseUrl().endsWith("/")) {
                return getBaseUrl() + getContextPath();
            } else {
                return getBaseUrl() + "/" + getContextPath();
            }
        }
        return baseUrl;
    }
    public static boolean isLocalJolokiaAgent(){
        return (jolokiaUrl == null);
    }
    public static String getJolokiaUrl() {
        if (jolokiaUrl == null) {
            return getContextUrl() + "/jolokia/"; // jolokia needs the trailing slash
        } else {
            return jolokiaUrl;
        }
    }

    /**
     * Builder class for JolokiaApp
     */
    public static class Builder {
        private Integer port;
        private String contextPath;
        private URL jolokiaUrl;
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
         * @param path Web server context path
         * @return this Builder
         */
        public Builder contextPath(final String path) {
            if (!contextPath.startsWith("/")) {
                contextPath = "/" + path;
            }
            this.contextPath = path;
            return this;
        }

        /**
         * @param url Remote jolokia agent url
         * @return this Builder
         */
        public Builder jolokiaUrl(final String url) throws MalformedURLException {
            this.jolokiaUrl = new URL(url);
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
            return new JolokiaApp(this.port, contextPath, jolokiaUrl.toString());
        }
    }
}
