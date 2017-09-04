package prj.jolokiaweb.controller;

import org.jolokia.client.exception.J4pException;
import org.jolokia.client.request.*;
import org.json.simple.JSONArray;
import org.json.simple.JSONObject;
import org.springframework.http.MediaType;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMethod;
import org.springframework.web.bind.annotation.RestController;
import org.springframework.web.bind.annotation.RequestMapping;
import prj.jolokiaweb.JolokiaApp;
import prj.jolokiaweb.form.ExecForm;
import prj.jolokiaweb.form.ReadForm;
import prj.jolokiaweb.form.WriteForm;
import prj.jolokiaweb.jolokia.AgentInfo;
import prj.jolokiaweb.jolokia.JolokiaClient;

import javax.management.MalformedObjectNameException;
import java.util.*;


@RestController
public class ApiController {

    @RequestMapping(value = "/api/checkPermissions", method = RequestMethod.GET, produces = MediaType.APPLICATION_JSON_VALUE)
    public ResponseEntity<JSONObject> checkPermissions() {
        JSONObject result = new JSONObject();
        JSONArray arr = new JSONArray();
        result.put("permissions", arr);

        if (JolokiaClient.getAgentInfo().getBeanPermissions().size() < 1) {
            arr.add(AgentInfo.JolokiaPermission.NONE);
        } else {
            for (AgentInfo.JolokiaPermission p: JolokiaClient.getAgentInfo().getBeanPermissions()) {
                arr.add(p);
            }
        }
        return ResponseEntity.ok(result);
    }

    @RequestMapping(value = "/api/beans", method = RequestMethod.GET, produces = MediaType.APPLICATION_JSON_VALUE)
    public ResponseEntity<JSONObject> beans() {
        JSONObject result = new JSONObject();

        try {
            String path = null; // null means full tree
            Map<J4pQueryParameter,String> params = new HashMap<>();;
            params.put(J4pQueryParameter.CANONICAL_NAMING,"false");
            result = JolokiaClient.getInstance().execute(new J4pListRequest(path), params).asJSONObject();
        } catch(Exception e) {
            result.put("error", e.getMessage());
            return ResponseEntity.badRequest().body(result);
        }
        return ResponseEntity.ok(result);
    }

    @RequestMapping(value = "/api/version", method = RequestMethod.GET, produces = MediaType.APPLICATION_JSON_VALUE)
    public ResponseEntity<JSONObject> version() {
        JSONObject result = new JSONObject();

        try {
            J4pReadRequest runtimeReq = new J4pReadRequest("java.lang:type=Runtime");
            J4pReadResponse runtimeRes = JolokiaClient.getInstance().execute(runtimeReq);
            J4pVersionResponse versionRes = JolokiaClient.getInstance().execute(new J4pVersionRequest());

            result.put("runtime", runtimeRes.getValue());
            result.put("version", versionRes.getValue());
        } catch (Exception e) {
            result.put("error", e.getMessage());
            return ResponseEntity.badRequest().body(result);
        }
        return ResponseEntity.ok(result);
    }

    @RequestMapping(value = "/api/read", method = RequestMethod.POST, produces = MediaType.APPLICATION_JSON_VALUE)
    public ResponseEntity<JSONObject> read(@RequestBody ReadForm readForm) {
        JSONObject result = new JSONObject();

        try {
            J4pReadRequest readReq = new J4pReadRequest(readForm.getMbean());
            readReq.setPreferredHttpMethod("POST");
            Map<J4pQueryParameter,String> params = new HashMap<>();
            params.put(J4pQueryParameter.IGNORE_ERRORS,"true");
            J4pReadResponse readRes = JolokiaClient.getInstance().execute(readReq, params);
            result = readRes.getValue();
        } catch (MalformedObjectNameException e) {
            result.put("error", e.getMessage());
            return ResponseEntity.badRequest().body(result);
        } catch (J4pException e) {
            result.put("error", e.getMessage());
            return ResponseEntity.badRequest().body(result);
        }
        return ResponseEntity.ok(result);
    }

    @RequestMapping(value = "/api/execute", method = RequestMethod.POST, produces = MediaType.APPLICATION_JSON_VALUE)
    public ResponseEntity<JSONObject> execute(@RequestBody ExecForm execForm) {
        JSONObject result = new JSONObject();

        try {
            J4pExecRequest execReq;
            if (execForm.getData() != null && execForm.getData().size() > 0) {
                execReq = new J4pExecRequest(execForm.getMbean(), execForm.getOperation(), execForm.getData().toArray());
            } else {
                execReq = new J4pExecRequest(execForm.getMbean(), execForm.getOperation());
            }
            execReq.setPreferredHttpMethod("POST");
            J4pExecResponse execRes = JolokiaClient.getInstance().execute(execReq);
            result = execRes.asJSONObject();
        } catch (MalformedObjectNameException e) {
            result.put("error", e.getMessage());
            return ResponseEntity.badRequest().body(result);
        } catch (J4pException e) {
            result.put("error", e.getMessage());
            return ResponseEntity.badRequest().body(result);
        }
        return ResponseEntity.ok(result);
    }

    @RequestMapping(value = "/api/write", method = RequestMethod.POST, produces = MediaType.APPLICATION_JSON_VALUE)
    public ResponseEntity<JSONObject> write(@RequestBody WriteForm form) {
        JSONObject result = new JSONObject();

        try {
            J4pWriteRequest writeReq = new J4pWriteRequest(form.getMbean(), form.getAttribute(), form.getValue());
            J4pWriteResponse writeRes = JolokiaClient.getInstance().execute(writeReq);
            result = writeRes.asJSONObject();
        } catch (MalformedObjectNameException e) {
            result.put("error", e.getMessage());
            return ResponseEntity.badRequest().body(result);
        } catch (J4pException e) {
            result.put("error", e.getMessage());
            return ResponseEntity.badRequest().body(result);
        }
        return ResponseEntity.ok(result);
    }

    @RequestMapping(value = "/api/gcRun", method = RequestMethod.GET, produces = MediaType.APPLICATION_JSON_VALUE)
    public ResponseEntity<JSONObject> gcRun() {
        JSONObject result = new JSONObject();

        try {
            J4pExecRequest execReq = new J4pExecRequest("com.sun.management:type=DiagnosticCommand","gcRun()");
            execReq.setPreferredHttpMethod("POST");
            J4pExecResponse execRes = JolokiaClient.getInstance().execute(execReq);
            result = execRes.asJSONObject();
        } catch (MalformedObjectNameException e) {
            result.put("error", e.getMessage());
            return ResponseEntity.badRequest().body(result);
        } catch (J4pException e) {
            result.put("error", e.getMessage());
            return ResponseEntity.badRequest().body(result);
        }
        return ResponseEntity.ok(result);
    }

}
