package prj.jolokiaweb.config;

import org.json.simple.JSONObject;
import org.springframework.web.servlet.handler.HandlerInterceptorAdapter;
import prj.jolokiaweb.jolokia.AgentInfo;
import prj.jolokiaweb.jolokia.JolokiaClient;

import javax.servlet.http.HttpServletRequest;
import javax.servlet.http.HttpServletResponse;

public class PermissionCheckInterceptor extends HandlerInterceptorAdapter {
    @Override
    public boolean preHandle(HttpServletRequest request, HttpServletResponse response, Object handler) throws Exception {
        if (request.getRequestURI().startsWith("/api/beans")) {
            if (!JolokiaClient.getAgentInfo().getBeanPermissions().contains(AgentInfo.JolokiaPermission.READ)) {
                accessDeniedMessage(response);
                return false;
            }
        } else if (request.getRequestURI().startsWith("/api/read")) {
            if (!JolokiaClient.getAgentInfo().getBeanPermissions().contains(AgentInfo.JolokiaPermission.READ)) {
                accessDeniedMessage(response);
                return false;
            }
        } else if (request.getRequestURI().startsWith("/api/write")) {
            if (!JolokiaClient.getAgentInfo().getBeanPermissions().contains(AgentInfo.JolokiaPermission.WRITE)) {
                accessDeniedMessage(response);
                return false;
            }
        } else if (request.getRequestURI().startsWith("/api/execute")) {
            if (!JolokiaClient.getAgentInfo().getBeanPermissions().contains(AgentInfo.JolokiaPermission.EXECUTE)) {
                accessDeniedMessage(response);
                return false;
            }
        } else if (request.getRequestURI().startsWith("/api/gcRun")) {
            if (!JolokiaClient.getAgentInfo().getBeanPermissions().contains(AgentInfo.JolokiaPermission.EXECUTE)) {
                accessDeniedMessage(response);
                return false;
            }
        }
        return super.preHandle(request, response, handler);
    }

    public void accessDeniedMessage(HttpServletResponse response) throws Exception {
        JSONObject result = new JSONObject();
        result.put("error", "Access Denied!");

        response.addHeader("Content-Type","application/json");
        response.sendError(HttpServletResponse.SC_FORBIDDEN, result.toJSONString());
    }
}
