package prj.jolokiaweb.form;

import java.util.ArrayList;
import java.util.List;

public class ExecForm {
    private String mbean;
    private String operation;
    private List<Object> data = new ArrayList<>();

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

    public List<Object> getData() {
        return data;
    }

    public void setData(List<Object> data) {
        this.data = data;
    }
}
