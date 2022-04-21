package com.utils;

import com.projectManage.entity.Template;

import java.util.List;
import java.util.Map;

/**
 * Created by Administrator on 2017-09-05.
 */
public class Page extends Model {

    private List<?> resultList;
    private Map<String, Object> statistics;
    private Template temp;
    private List<String> others;

    public List<String> getOthers() {
        return others;
    }

    public void setOthers(List<String> others) {
        this.others = others;
    }

    public List<?> getResultList() {
        return resultList;
    }

    public void setResultList(List<?> resultList) {
        this.resultList = resultList;
    }

    public Map<String, Object> getStatistics() {

        return statistics;
    }

    public void setStatistics(Map<String, Object> statistics) {

        this.statistics = statistics;
    }

    public Template getTemp() {
        return temp;
    }

    public void setTemp(Template temp) {
        this.temp = temp;
    }
}
