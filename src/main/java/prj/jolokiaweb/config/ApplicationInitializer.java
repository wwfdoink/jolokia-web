package prj.jolokiaweb.config;

import org.apache.tomcat.websocket.server.WsSci;
import org.springframework.web.WebApplicationInitializer;
import org.springframework.web.context.ContextLoaderListener;
import org.springframework.web.context.support.AnnotationConfigWebApplicationContext;
import org.springframework.web.servlet.DispatcherServlet;
import prj.jolokiaweb.JolokiaApp;
import prj.jolokiaweb.jolokia.JolokiaAgentServlet;

import javax.servlet.ServletContext;
import javax.servlet.ServletException;
import javax.servlet.ServletRegistration;


public class ApplicationInitializer implements WebApplicationInitializer {
    @Override
    public void onStartup(ServletContext servletContext) throws ServletException {
        AnnotationConfigWebApplicationContext context = new AnnotationConfigWebApplicationContext();
        context.setConfigLocation("prj.jolokiaweb.config");
        servletContext.addListener(new ContextLoaderListener(context));

        /*
        * Jolokia Servlet
        */
        if (JolokiaApp.isLocalJolokiaAgent()) {
            ServletRegistration.Dynamic jolokiaDispatcher = servletContext.addServlet("jolokia", new JolokiaAgentServlet());
            jolokiaDispatcher.setLoadOnStartup(1);
            jolokiaDispatcher.addMapping("/jolokia/*");
        }

        /*
         * Spring Servlet
         */
        ServletRegistration.Dynamic dispatcher = servletContext.addServlet("spring", new DispatcherServlet(context));
        dispatcher.setLoadOnStartup(1);
        dispatcher.addMapping("/");


    }
}
