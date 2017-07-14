# jolokia-web

Jolokia Web interface library.
  - Embed Tomcat
  - Spring
  - Angular 1.6
  - Bootstrap

### Build
```sh
$ gradle build onejar
```
This will create the fatJar `build/libs/jolokia-web-all.jar`

### Usage
```java
import prj.jolokiaweb.JolokiaApp;

JolokiaApp app = new JolokiaApp.Builder("http://localhost:8778/jolokia")
    .port(8081)
    .build();
app.start();
//app.startAndWait();
```
