package prj.jolokiaweb.jolokia;

import org.jolokia.restrictor.Restrictor;
import org.jolokia.util.HttpMethod;
import org.jolokia.util.RequestType;
import prj.jolokiaweb.JolokiaApp;

import javax.management.MalformedObjectNameException;
import javax.management.ObjectName;
import java.util.ArrayList;
import java.util.Set;

public class JolokiaRestrictor implements Restrictor {
    @Override
    public boolean isHttpMethodAllowed(HttpMethod pMethod) {
        return true;
    }

    @Override
    public boolean isTypeAllowed(RequestType pType) {
        Set<AgentInfo.JolokiaPermission> permissions = JolokiaClient.getAgentInfo().getBeanPermissions();

        if (RequestType.READ.equals(pType)) {
            return true;
        } else if (RequestType.LIST.equals(pType) || RequestType.SEARCH.equals(pType)) {
            return permissions.contains(AgentInfo.JolokiaPermission.READ);
        } else if (RequestType.WRITE.equals(pType)) {
            return permissions.contains(AgentInfo.JolokiaPermission.WRITE);
        } else if (RequestType.EXEC.equals(pType)) {
            return permissions.contains(AgentInfo.JolokiaPermission.EXECUTE);
        }
        // we allow all other types
        return true;
    }

    @Override
    public boolean isAttributeReadAllowed(ObjectName pName, String pAttribute) {
        if (JolokiaClient.getAgentInfo().getBeanPermissions().contains(AgentInfo.JolokiaPermission.READ)) {
            return true;
        }

        // We always allow the dashboard data
        ArrayList allowedBeans = new ArrayList<ObjectName>();
        try {
            allowedBeans.add(new ObjectName("java.lang:type=OperatingSystem"));
            allowedBeans.add(new ObjectName("java.lang:type=Threading"));
            allowedBeans.add(new ObjectName("java.lang:type=Memory"));
        } catch (MalformedObjectNameException e) { ; }

        if (allowedBeans.contains(pName)) {
            return true;
        }
        return false;
    }

    @Override
    public boolean isAttributeWriteAllowed(ObjectName pName, String pAttribute) {
        return true;
    }

    @Override
    public boolean isOperationAllowed(ObjectName pName, String pOperation) {
        return true;
    }

    @Override
    public boolean isRemoteAccessAllowed(String ... pHostOrAddress) {
        return true;
    }

    @Override
    public boolean isOriginAllowed(String pOrigin, boolean pIsStrictCheck) {
        return false;
    }
}
