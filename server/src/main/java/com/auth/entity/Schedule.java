package com.auth.entity;

import com.utils.Model;

import java.text.ParsePosition;
import java.text.SimpleDateFormat;

/**
 * Created by zk on 2019/2/27.
 */
public class Schedule extends Model {
    private Integer id;
    private String companyCode;
    private Integer userId;
    private String content;
    private String scheduleDate;
    private String createDate;

    final static SimpleDateFormat format=new SimpleDateFormat("yyyy-MM-dd");

    public Integer getId() {
        return id;
    }

    public void setId(Integer id) {
        this.id = id;
    }

    public String getCompanyCode() {
        return companyCode;
    }

    public void setCompanyCode(String companyCode) {
        this.companyCode = companyCode;
    }

    public Integer getUserId() {
        return userId;
    }

    public void setUserId(Integer userId) {
        this.userId = userId;
    }

    public String getContent() {
        return content;
    }

    public void setContent(String content) {
        this.content = content;
    }

    public String getScheduleDate() {
        return scheduleDate;
    }

    public void setScheduleDate(String scheduleDate) {
        this.scheduleDate = scheduleDate;
    }

    public String getCreateDate() {
        return createDate;
    }

    public void setCreateDate(String createDate) {
        this.createDate = createDate;
    }
}
