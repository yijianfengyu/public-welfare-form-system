package com.homePage.entity;

import org.springframework.stereotype.Component;

@Component
public class ClickCount {

    private String id;
    private String type1;
    private String type2;
    private String name;
    private Integer count;
    private String remark;
    private String[] validType2;   //头部查询存有效点击的框

    public String getId() {
        return id;
    }

    public void setId(String id) {
        this.id = id;
    }

    public String getType1() {
        return type1;
    }

    public void setType1(String type1) {
        this.type1 = type1;
    }

    public String getType2() {
        return type2;
    }

    public void setType2(String type2) {
        this.type2 = type2;
    }

    public String getName() {
        return name;
    }

    public void setName(String name) {
        this.name = name;
    }

    public Integer getCount() {
        return count;
    }

    public void setCount(Integer count) {
        this.count = count;
    }

    public String getRemark() {
        return remark;
    }

    public void setRemark(String remark) {
        this.remark = remark;
    }

    public String[] getValidType2() {
        return validType2;
    }

    public void setValidType2(String[] validType2) {
        this.validType2 = validType2;
    }
}
