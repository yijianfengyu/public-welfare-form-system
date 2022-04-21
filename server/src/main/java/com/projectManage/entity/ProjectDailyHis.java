package com.projectManage.entity;


public class ProjectDailyHis {
    public Integer id;
    public String projectId;
    public String uid;
    public String currenTime;

    public Integer getId() {
        return id;
    }

    public void setId(Integer id) {
        this.id = id;
    }

    public String getProjectId() {
        return projectId;
    }

    public void setProjectId(String projectId) {
        this.projectId = projectId;
    }

    public String getUid() {
        return uid;
    }

    public void setUid(String uid) {
        this.uid = uid;
    }

    public String getCurrenTime() {
        return currenTime;
    }

    public void setCurrenTime(String currenTime) {
        this.currenTime = currenTime;
    }
}
