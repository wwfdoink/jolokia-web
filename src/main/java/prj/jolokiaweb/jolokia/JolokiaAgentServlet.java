package prj.jolokiaweb.jolokia;

import org.jolokia.config.Configuration;
import org.jolokia.http.AgentServlet;
import org.jolokia.config.ConfigKey;
import org.jolokia.restrictor.Restrictor;

import javax.servlet.ServletConfig;
import javax.servlet.ServletContext;
import javax.servlet.ServletException;
import java.util.Enumeration;
import java.util.Hashtable;
import java.util.Properties;


public class JolokiaAgentServlet extends AgentServlet {

    @Override
    public void init(ServletConfig pServletConfig) throws ServletException {
        ServletConfigWrapper pServletConfigWrapper = null;

        Properties properties = System.getProperties();
        for (String key : properties.stringPropertyNames()) {
            if (key.startsWith("jolokia.")) {
                String effectiveKey = key.substring(key.indexOf(".") + 1);
                if (containsEnum(effectiveKey)) {
                    String value = properties.getProperty(key);
                    if (value != null) {
                        if (pServletConfigWrapper == null) {
                            pServletConfigWrapper = new ServletConfigWrapper(pServletConfig);
                        }
                        pServletConfigWrapper.addProperty(effectiveKey, value);
                    }

                }
            }
        }
        if (pServletConfigWrapper != null) {
            super.init(pServletConfigWrapper);
        } else {
            super.init(pServletConfig);
        }

    }

    class ServletConfigWrapper implements ServletConfig {
        ServletConfig wrapped;
        Hashtable<String, String> ownProps;

        public ServletConfigWrapper(ServletConfig pServletConfig) {
            wrapped = pServletConfig;
            ownProps = new Hashtable<>();
        }

        @Override
        public String getServletName() {
            return wrapped.getServletName();
        }

        @Override
        public ServletContext getServletContext() {
            return wrapped.getServletContext();
        }

        @Override
        public String getInitParameter(String s) {
            if (ownProps.containsKey(s)) {
                return ownProps.get(s);
            }
            return wrapped.getInitParameter(s);
        }

        @Override
        public Enumeration getInitParameterNames() {
            return new TwoEnumerationsWrapper(ownProps.keys(), wrapped.getInitParameterNames());
        }

        public void addProperty(String key, String value) {
            ownProps.put(key, value);
        }
    }

    class TwoEnumerationsWrapper implements Enumeration<String> {
        Enumeration<String> a;
        Enumeration<String> b;

        public TwoEnumerationsWrapper(Enumeration a, Enumeration b) {
            this.a = a;
            this.b = b;
        }

        @Override
        public boolean hasMoreElements() {
            return a.hasMoreElements() || b.hasMoreElements();
        }

        @Override
        public String nextElement() {
            if (a.hasMoreElements()) {
                return a.nextElement();
            } else {
                return b.nextElement();
            }
        }
    }

    public static boolean containsEnum(String test) {
        for (ConfigKey c : ConfigKey.values()) {
            if (c.getKeyValue().equals(test)) {
                return true;
            }
        }
        return false;
    }

    @Override
    protected Restrictor createRestrictor(Configuration config) {
        return new JolokiaRestrictor();
    }
}
