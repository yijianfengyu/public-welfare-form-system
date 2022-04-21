package com.auth.entity;


import com.utils.Model;

/**
 * @author WuDong
 * @date 2020/4/9 15:59
 */
public class Project extends Model {


    private Integer id;
    private String project_name;
    private String address;
    private String period;
    private Integer number;
    private Integer define_id;
    private Integer creator;
    private String creatorName;
    private Integer status;
    private String dateCreated;
    private Integer sort;
    private Integer water_source;

    public Integer getWater_source() {
        return water_source;
    }

    public void setWater_source(Integer water_source) {
        this.water_source = water_source;
    }

    public Integer getSort() {
        return sort;
    }

    public void setSort(Integer sort) {
        this.sort = sort;
    }

    public String getCreatorName() {
        return creatorName;
    }

    public void setCreatorName(String creatorName) {
        this.creatorName = creatorName;
    }

    public String getDateCreated() {
        return dateCreated;
    }

    public void setDateCreated(String dateCreated) {
        this.dateCreated = dateCreated;
    }

    public Integer getId() {
        return id;
    }

    public void setId(Integer id) {
        this.id = id;
    }

    public String getProject_name() {
        return project_name;
    }

    public void setProject_name(String project_name) {
        this.project_name = project_name;
    }

    public String getAddress() {
        return address;
    }

    public void setAddress(String address) {
        this.address = address;
    }

    public String getPeriod() {
        return period;
    }

    public void setPeriod(String period) {
        this.period = period;
    }

    public Integer getNumber() {
        return number;
    }

    public void setNumber(Integer number) {
        this.number = number;
    }

    public Integer getDefine_id() {
        return define_id;
    }

    public void setDefine_id(Integer define_id) {
        this.define_id = define_id;
    }

    public Integer getCreator() {
        return creator;
    }

    public void setCreator(Integer creator) {
        this.creator = creator;
    }

    public Integer getStatus() {
        return status;
    }

    public void setStatus(Integer status) {
        this.status = status;
    }
}
