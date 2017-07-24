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

JolokiaApp app = new JolokiaApp.Builder("http://localhost:8778/jolokia")
    .port(8080)
    .build();
app.start();
//app.startAndWait(); //blocking
```
Open your browser and navigate to http://yourhost:8080/jolokiaweb
### CLI Usage example
```sh
$ java -jar jolokia-web-all.jar --port=8080 --url=http://localhost:8778/jolokia
```
Open your browser and navigate to http://yourhost:8080/jolokiaweb
