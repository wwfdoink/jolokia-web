package prj.jolokiaweb.form;


import org.json.simple.JSONObject;

public class ExecForm {
    private String mbean;
    private String operation;
    private Object data;

    public String getMbean() {
        return mbean;
    }

    public void setMbean(String mbean) {
        this.mbean = mbean;
    }

    public String getOperation() {
        return operation;
    }

    public void setOperation(String operation) {
        this.operation = operation;
    }

    public Object getData() {
        return data;
    }

    public void setData(Object data) {
        this.data = data;
    }
}
