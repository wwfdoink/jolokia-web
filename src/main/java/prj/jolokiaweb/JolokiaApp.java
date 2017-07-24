package prj.jolokiaweb;

import org.apache.catalina.LifecycleException;
import org.apache.catalina.startup.Tomcat;
import org.apache.commons.cli.*;

import javax.servlet.ServletException;
import java.io.File;
import java.net.URL;
import java.util.Arrays;
import java.util.HashSet;
import java.util.Set;

public class JolokiaApp {
    public enum JolokiaBeanPermission {
        READ,WRITE,EXEC
    }
    private static final int DEFAULT_PORT = 8080;
    private static final String DEFAULT_JOLOKIA_URL = "http://localhost:8778/jolokia/";
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
        JolokiaApp.jolokiaUrl = jolokiaUrl;
        this.beanPermissions.addAll(Arrays.asList(beanPermissions));
    }

    public static void main(String[] args) throws Exception {
        Options options = new Options();

        options.addOption(Option.builder()
                .argName("1-65534")
                .longOpt("port")
                .optionalArg(true)
                .hasArg()
                .desc("Tomcat listening port")
                .build());
        options.addOption(Option.builder()
                .argName("jolokia-url")
                .longOpt("url")
                .optionalArg(false)
                .hasArg()
                .desc("Jolokia agent URL")
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
        String jolokiaUrl = DEFAULT_JOLOKIA_URL;
        Set<JolokiaBeanPermission> beanPermissions = new HashSet<>();

        try {
            CommandLine line = parser.parse( options, args );
            if (line.hasOption("url") ) {
                String url = line.getOptionValue("url");
                URL checkUrl = new URL(url); //check url validity
                if (!url.endsWith("/")) {
                    jolokiaUrl = url + "/";
                } else {
                    jolokiaUrl = url;
                }
                System.out.println(jolokiaUrl);
            } else {
                throw new RuntimeException("Jolokia url not set");
            }

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

            JolokiaApp app = new JolokiaApp(jolokiaUrl, port, beanPermissions.toArray(new JolokiaBeanPermission[beanPermissions.size()]));
            app.startAndWait();
        } catch(Exception e) {
            System.out.println("Invalid input:" + e.getMessage());
            HelpFormatter formatter = new HelpFormatter();
            formatter.printHelp( "java -jar jolokiaweb-all.jar", options);
        }
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
            // bulk request and multi attribute requests requires the trailing slash
            if (jolokiaUrl.endsWith("/")) {
                this.jolokiaUrl = jolokiaUrl;
            } else {
                this.jolokiaUrl = jolokiaUrl+"/";
            }
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
