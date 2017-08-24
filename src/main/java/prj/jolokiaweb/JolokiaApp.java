package prj.jolokiaweb;

import org.apache.catalina.Context;
import org.apache.catalina.LifecycleException;
import org.apache.catalina.startup.Tomcat;
import org.apache.commons.cli.*;
import org.apache.tomcat.websocket.server.WsSci;
import prj.jolokiaweb.jolokia.AgentInfo;
import prj.jolokiaweb.jolokia.JolokiaClient;

import javax.servlet.ServletException;
import java.io.File;
import java.net.MalformedURLException;
import java.net.URL;

public class JolokiaApp {
    private static final int DEFAULT_PORT = 8080;
    private static final String DEFAULT_CONTEXT_PATH = "";
    private static Tomcat tomcat;
    private static String baseUrl;
    private static String contextPath;

    /**
     * @param tomcatPort Web server listening port
     * @param contextPath Tomcat context path
     * @param agentInfo Jolokia AgentInfo
     */
    public JolokiaApp(final Integer tomcatPort, final String contextPath, final AgentInfo agentInfo) throws ServletException {
        int port = (tomcatPort == null) ? DEFAULT_PORT : tomcatPort;
        tomcat = new Tomcat();
        tomcat.setPort(port);
        tomcat.setBaseDir(new File(System.getProperty("java.io.tmpdir")).getAbsolutePath());
        tomcat.getHost().setAppBase(".");
        Context ctx = tomcat.addWebapp(contextPath, new File(System.getProperty("java.io.tmpdir")).getAbsolutePath());
        ctx.addServletContainerInitializer(new WsSci(), null);

        StringBuilder urlBuilder = new StringBuilder();
        urlBuilder.append("http://");
        urlBuilder.append(tomcat.getServer().getAddress());
        urlBuilder.append(":");
        urlBuilder.append(port);

        this.baseUrl = urlBuilder.toString();
        this.contextPath = contextPath;
        if (agentInfo.getUrl() == null) {
            agentInfo.setLocalAgent(true);
            agentInfo.setUrl(getContextUrl() + "/jolokia/");
        } else {
            agentInfo.setLocalAgent(false);
        }
        JolokiaClient.init(agentInfo);
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
                .argName("rwxd")
                .longOpt("permissions")
                .optionalArg(true)
                .hasArg()
                .desc("r:read, w:write, x:execute, n:none, default is: rwx")
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
                .longOpt("remoteAgentUrl")
                .optionalArg(true)
                .hasArg()
                .desc("Remote jolokia-jvm-agent url")
                .build());
        options.addOption(Option.builder()
                .argName("")
                .longOpt("remoteAgentUsername")
                .optionalArg(true)
                .hasArg()
                .desc("Remote jolokia-jvm-agent username")
                .build());
        options.addOption(Option.builder()
                .argName("")
                .longOpt("remoteAgentPassword")
                .optionalArg(true)
                .hasArg()
                .desc("Remote jolokia-jvm-agent password")
                .build());

        CommandLineParser parser = new DefaultParser();

        int port = DEFAULT_PORT;
        String contextPath = DEFAULT_CONTEXT_PATH;
        AgentInfo agentInfo = new AgentInfo();

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

            if (line.hasOption("permissions") ) {
                String permStr = line.getOptionValue("permissions");
                if (permStr.contains("r")) {
                    agentInfo.addPermission(AgentInfo.JolokiaPermission.READ);
                }
                if (permStr.contains("w")) {
                    agentInfo.addPermission(AgentInfo.JolokiaPermission.WRITE);
                }
                if (permStr.contains("x")) {
                    agentInfo.addPermission(AgentInfo.JolokiaPermission.EXECUTE);
                }
            } else {
                //default behavior
                agentInfo.addPermission(
                    AgentInfo.JolokiaPermission.READ,
                    AgentInfo.JolokiaPermission.WRITE,
                    AgentInfo.JolokiaPermission.EXECUTE
                );
            }

            if (line.hasOption("contextPath") ) {
                contextPath = line.getOptionValue("contextPath");
                if (!contextPath.startsWith("/")) {
                    contextPath = "/" + contextPath;
                }
            }
            if (line.hasOption("agentUrl") ) {
                String url = line.getOptionValue("agentUrl");
                if (!url.endsWith("/")) {
                    url += "/";
                }
                URL urlCheck = new URL(url); // check url
                agentInfo.setUrl(url);
            }
            if (line.hasOption("agentUsername") ) {
                agentInfo.setUsername(line.getOptionValue("agentUsername"));
            }
            if (line.hasOption("agentPassword") ) {
                agentInfo.setPassword(line.getOptionValue("agentPassword"));
            }

            JolokiaApp app = new JolokiaApp(port, contextPath, agentInfo);
            app.startAndWait();
        } catch(Exception e) {
            System.out.println("Invalid input:" + e.getMessage());
            HelpFormatter formatter = new HelpFormatter();
            formatter.printHelp( "java -jar jolokiaweb-all.jar", options);
        }
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

    /**
     * Builder class for JolokiaApp
     */
    public static class Builder {
        private Integer port;
        private String contextPath;
        private AgentInfo agentInfo = new AgentInfo();

        public Builder() {
            this.port = DEFAULT_PORT;
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
         * @param url Remote jolokia-agent url
         * @return this Builder
         */
        public Builder agentUrl(final String url) throws MalformedURLException {
            this.agentInfo.setUrl(url.endsWith("/") ? url : url+"/");
            return this;
        }

        /**
         * @param username Remote jolokia-agent username
         * @param password Remote jolokia-agent password
         * @return this Builder
         */
        public Builder agentAuth(final String username, final String password) {
            this.agentInfo.setUsername(username);
            this.agentInfo.setPassword(password);
            return this;
        }

        /**
         * @param permissionArray Permissions for MBean tab READ,WRITE,EXEC
         * @return
         */
        public Builder permissions(AgentInfo.JolokiaPermission... permissionArray) {
            agentInfo.clearPermission();
            agentInfo.addPermission(permissionArray);
            return this;
        }

        /**
         * @return new JolokiaApp instance
         */
        public JolokiaApp build() throws ServletException {
            return new JolokiaApp(this.port, contextPath, agentInfo);
        }
    }
}
