package com.projectManage.entity;

/**
 * Created by dragon_eight on 2018/9/20.
 */
public class ProjectReport {

    private Integer id;
    private String content;
    private String projectId;
    private String resourcesUuid;
    private String createDate;
    private String updateDate;
    private String resourcesName;

    public Integer getId() {
        return id;
    }

    public void setId(Integer id) {
        this.id = id;
    }

    public String getContent() {
        return content;
    }

    public void setContent(String content) {
        this.content = content;
    }

    public String getProjectId() {
        return projectId;
    }

    public void setProjectId(String projectId) {
        this.projectId = projectId;
    }

    public String getResourcesUuid() {
        return resourcesUuid;
    }

    public void setResourcesUuid(String resourcesUuid) {
        this.resourcesUuid = resourcesUuid;
    }

    public String getCreateDate() {
        return createDate;
    }

    public void setCreateDate(String createDate) {
        this.createDate = createDate;
    }

    public String getUpdateDate() {
        return updateDate;
    }

    public void setUpdateDate(String updateDate) {
        this.updateDate = updateDate;
    }

    public String getResourcesName() {
        return resourcesName;
    }

    public void setResourcesName(String resourcesName) {
        this.resourcesName = resourcesName;
    }
}
