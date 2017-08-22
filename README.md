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

JolokiaApp app = new JolokiaApp.Builder()
    .port(8080) // tomcat listening port
    .contextPath("jolokiaweb") // webapp contextPath, default is the root path
    .jolokiaUrl("http://localhost:8778/jolokia") // connect to your already running jolokia-jvm-agent
    .policy(JolokiaPolicy.READ, JolokiaPolicy.WRITE, JolokiaPolicy.EXECUTE) // default is rwx
    .build();
app.start();
//app.startAndWait(); //blocking
```
Open your browser and navigate to http://yourhost:8080/
### CLI Usage
```sh
$ java -jar jolokia-web-all.jar
  --port=8080
  --contextPath=jolokiaweb
  --jolokiaUrl=http://localhost:8778/jolokia
  --policy=rwx
```
Open your browser and navigate to http://yourhost:8080/
