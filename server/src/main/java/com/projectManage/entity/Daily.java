package com.projectManage.entity;

import com.utils.DaoHelp;

import java.util.List;

/**
 * Created by Administrator on 2018/7/26.
 */
public class Daily extends Model{

    private Long dataId;
    private String content;
    private String createId;
    private String createName;
//    private String updateId;
//    private String updateName;
    private String createDate;
    private String updateDate;
    private String groupId;
    private String projectName;
    private String projectId;
    private String projectPath;
    private String startTime;
    private String endTime;
    private String dailyUrl;
    private String status;
    private String resourcesId;
    private Integer dailyCommentCounts;
    private String uuid;
    private String projectProcess;
    private String processName;
    private List<ProjectResource> prList;

    public List<ProjectResource> getPrList() {
        return prList;
    }

    public void setPrList(List<ProjectResource> prList) {
        this.prList = prList;
    }

    public String getUuid() {
        return uuid;
    }

    public void setUuid(String uuid) {
        this.uuid = uuid;
    }

    public String getStatus() {
        return status;
    }

    public void setStatus(String status) {
        this.status = status;
    }

    public String getResourcesId() {
        return resourcesId;
    }

    public void setResourcesId(String resourcesId) {
        this.resourcesId = resourcesId;
    }

    public String getDailyUrl() {
        return dailyUrl;
    }

    public void setDailyUrl(String dailyUrl) {
        this.dailyUrl = dailyUrl;
    }

    private String dailyType; //日志类型(暂定work(工作),resources(上传资源),child(新建子节点))

    public Long getDataId() {
        return dataId;
    }

    public void setDataId(Long dataId) {
        this.dataId = dataId;
    }

    public String getContent() {
        return content;
    }

    public void setContent(String content) {
        this.content = content;
    }

    public String getCreateId() {
        return createId;
    }

    public void setCreateId(String createId) {
        this.createId = createId;
    }

    public String getCreateName() {
        return createName;
    }

    public void setCreateName(String createName) {
        this.createName = createName;
    }

    public String getCreateDate() {
        return createDate;
    }

    public void setCreateDate(String createDate) {
        this.createDate = DaoHelp.simpleDateFormat(createDate,"yyyy-MM-dd HH:mm:ss");
    }

    public String getUpdateDate() {
        return updateDate;
    }

    public void setUpdateDate(String updateDate) {
        this.updateDate = DaoHelp.simpleDateFormat(updateDate,"yyyy-MM-dd HH:mm:ss");
    }

    public String getGroupId() {
        return groupId;
    }

    public void setGroupId(String groupId) {
        this.groupId = groupId;
    }

    public String getProjectName() {
        return projectName;
    }

    public void setProjectName(String projectName) {
        this.projectName = projectName;
    }

    public String getProjectId() {
        return projectId;
    }

    public void setProjectId(String projectId) {
        this.projectId = projectId;
    }

    public String getProjectPath() {
        return projectPath;
    }

    public void setProjectPath(String projectPath) {
        this.projectPath = projectPath;
    }

    public String getStartTime() {
        return startTime;
    }

    public void setStartTime(String startTime) {
        this.startTime = startTime;
    }

    public String getEndTime() {
        return endTime;
    }

    public void setEndTime(String endTime) {
        this.endTime = endTime;
    }

    public String getDailyType() {
        return dailyType;
    }

    public void setDailyType(String dailyType) {
        this.dailyType = dailyType;
    }

    public Integer getDailyCommentCounts() {
        return dailyCommentCounts;
    }

    public void setDailyCommentCounts(Integer dailyCommentCounts) {
        this.dailyCommentCounts = dailyCommentCounts;
    }

    public String getProjectProcess() {
        return projectProcess;
    }

    public void setProjectProcess(String projectProcess) {
        this.projectProcess = projectProcess;
    }

    public String getProcessName() {
        return processName;
    }

    public void setProcessName(String processName) {
        this.processName = processName;
    }
}
