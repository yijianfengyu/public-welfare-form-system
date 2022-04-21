package com.auth.entity;

import com.utils.Model;

public class Comment extends Model {
    private Integer id;
    private String content;
    private String imgUrl;
    private Integer type;
    private String defineId="295";//评论defineId默认295
    private String companyCode;
    private String projectId;
    private String dataUuid;
    private String creator;
    private String creatorName;
    private String dateCreated;
    private String dateUpdated;
    private String status;
    private String systemEnvironment;
    private String channel;
    private String remark;
    private String rowDataId;
    private String rowDefineId;

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

    public String getImgUrl() {
        return imgUrl;
    }

    public void setImgUrl(String imgUrl) {
        this.imgUrl = imgUrl;
    }

    public String getDefineId() {
        return defineId;
    }

    public void setDefineId(String defineId) {
        this.defineId = defineId;
    }

    public String getCompanyCode() {
        return companyCode;
    }

    public void setCompanyCode(String companyCode) {
        this.companyCode = companyCode;
    }

    public String getProjectId() {
        return projectId;
    }

    public void setProjectId(String projectId) {
        this.projectId = projectId;
    }

    public String getDataUuid() {
        return dataUuid;
    }

    public void setDataUuid(String dataUuid) {
        this.dataUuid = dataUuid;
    }

    public String getCreator() {
        return creator;
    }

    public void setCreator(String creator) {
        this.creator = creator;
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

    public String getDateUpdated() {
        return dateUpdated;
    }

    public void setDateUpdated(String dateUpdated) {
        this.dateUpdated = dateUpdated;
    }

    public String getStatus() {
        return status;
    }

    public void setStatus(String status) {
        this.status = status;
    }

    public String getSystemEnvironment() {
        return systemEnvironment;
    }

    public void setSystemEnvironment(String systemEnvironment) {
        this.systemEnvironment = systemEnvironment;
    }

    public String getChannel() {
        return channel;
    }

    public void setChannel(String channel) {
        this.channel = channel;
    }

    public String getRemark() {
        return remark;
    }

    public void setRemark(String remark) {
        this.remark = remark;
    }

    public String getRowDataId() {
        return rowDataId;
    }

    public void setRowDataId(String rowDataId) {
        this.rowDataId = rowDataId;
    }

    public String getRowDefineId() {
        return rowDefineId;
    }

    public void setRowDefineId(String rowDefineId) {
        this.rowDefineId = rowDefineId;
    }

    public Integer getType() {
        return type;
    }

    public void setType(Integer type) {
        this.type = type;
    }

    public Comment(String content, Integer type) {
        this.content = content;
        this.type = type;
    }


    public Comment() {
    }
}
