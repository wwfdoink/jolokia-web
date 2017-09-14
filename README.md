# jolokia-web

Jolokia Web interface.
  - Embed Tomcat 8.5
  - Spring 4.3
  - Angular 1.6
  - Bootstrap 3

### Build
```sh
$ gradle build onejar
```
This will create the fatJar `build/libs/jolokia-web-all.jar`

### Lib Usage example
```java
import prj.jolokiaweb.JolokiaApp;
import prj.jolokiaweb.jolokia.AgentInfo;

JolokiaApp app = new JolokiaApp.Builder()
    .port(8080)                                // tomcat listening port, default: 8080
    .contextPath("jolokiaweb")                 // webapp contextPath, default is the root path
    .agentUrl("http://localhost:8778/jolokia") // connect to your already running jolokia-jvm-agent
    .agentAuth("user","password")              // remote agent credentials
    .permissions(
        AgentInfo.JolokiaPermission.NONE,      // NONE means dashboard only
        AgentInfo.JolokiaPermission.READ,      // Permission to read MBean values
        AgentInfo.JolokiaPermission.WRITE,     // Permission to change MBean values
        AgentInfo.JolokiaPermission.EXECUTE    // Permission to execute MBean operations
    ) // default is rwx
    .ssl()                                     // use the bundled self-signed cert
    .ssl("keyStorePath"                        // keystore file path
         "keyStorePassword",                   // keystore password
         "keyStoreAlias")                      // keystore alias
    .allowSelfSignedCert()                     // allow self-signed cert
    .requireAuth("username", "password")       // enable Basic-Auth
    .build();
app.start();
//app.startAndWait(); //blocking
...
app.stop();
```
Open your browser and navigate to http://yourhost:8080/
### CLI Usage
```sh
$ java -jar jolokia-web-all.jar
  --port=8080
  --contextPath=jolokiaweb
  --permissions=rwxn
  --remoteAgentUrl=http://localhost:8778/jolokia
  --remoteAgentUsername=user
  --remoteAgentPassword=password
  --ssl
  --sslKeyStorePath
  --sslKeyStoreAlias
  --sslKeyStorePassword
  --allowSelfSignedCert
  --requireAuth=<username>,<password>
```
Open your browser and navigate to http://yourhost:8080/

##### Dashboard
![dashboard](https://user-images.githubusercontent.com/9130989/30425931-0913f2c8-994b-11e7-9a44-7190678ca021.jpg)
##### Managed-Beans
![mbeans](https://user-images.githubusercontent.com/9130989/30425944-14129684-994b-11e7-8b4c-211d22b6b089.jpg)
##### Edit MBean attributes
![attrib](https://user-images.githubusercontent.com/9130989/30425953-19fd0246-994b-11e7-91b8-36ed09b7e777.jpg)
##### Dealing with non-primitive types
![vi](https://user-images.githubusercontent.com/9130989/30426095-1e42c4e4-994b-11e7-9648-136b39fb0033.jpg)
##### Execute MBean operations
![ops](https://user-images.githubusercontent.com/9130989/30426131-2d511e4a-994b-11e7-895f-a015bae4b809.jpg)
