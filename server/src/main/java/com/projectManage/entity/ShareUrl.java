package com.projectManage.entity;

public class ShareUrl {
    private String id;
    private String userName;//分享的用户名
    private String userId;//分享的用户ID
    private String shareDate;//分享创建时间
    private String srcUrl;//真实地址
    private String defineId;
    private String shareTitle;//分享的标题
    private String startTime;//分享开始时间，默认不限
    private String endTime;//分享结束时间，默认不限
    private String isConditions;//0表示不打开搜索条件
    private String updateTime;//更新时间
    private String showFlag;//过了分享时间就变为0，不能打开链接
    private String formTitle;//表单的标题
    private String formDescription;//表单的描述
    private String isIoseEfficacy;//表单的描述
    private String uuid;//表单的描述
    private String define;//表单的描述


    public String getDefine() {
        return define;
    }

    public void setDefine(String define) {
        this.define = define;
    }

    public String getUuid() {
        return uuid;
    }

    public void setUuid(String uuid) {
        this.uuid = uuid;
    }

    public String getIsIoseEfficacy() {
        return isIoseEfficacy;
    }

    public void setIsIoseEfficacy(String isIoseEfficacy) {
        this.isIoseEfficacy = isIoseEfficacy;
    }

    public String getShareTitle() {
        return shareTitle;
    }

    public void setShareTitle(String shareTitle) {
        this.shareTitle = shareTitle;
    }

    public String getFormTitle() {
        return formTitle;
    }

    public void setFormTitle(String formTitle) {
        this.formTitle = formTitle;
    }

    public String getFormDescription() {
        return formDescription;
    }

    public void setFormDescription(String formDescription) {
        this.formDescription = formDescription;
    }

    public String getDefineId() {
        return defineId;
    }

    public void setDefineId(String defineId) {
        this.defineId = defineId;
    }

    public String getId() {
        return id;
    }

    public void setId(String id) {
        this.id = id;
    }

    public String getUserName() {
        return userName;
    }

    public void setUserName(String userName) {
        this.userName = userName;
    }

    public String getUserId() {
        return userId;
    }

    public void setUserId(String userId) {
        this.userId = userId;
    }

    public String getShareDate() {
        return shareDate;
    }

    public void setShareDate(String shareDate) {
        this.shareDate = shareDate;
    }

    public String getSrcUrl() {
        return srcUrl;
    }

    public void setSrcUrl(String srcUrl) {
        this.srcUrl = srcUrl;
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

    public String getIsConditions() {
        return isConditions;
    }

    public void setIsConditions(String isConditions) {
        this.isConditions = isConditions;
    }

    public String getUpdateTime() {
        return updateTime;
    }

    public void setUpdateTime(String updateTime) {
        this.updateTime = updateTime;
    }

    public String getShowFlag() {
        return showFlag;
    }

    public void setShowFlag(String showFlag) {
        this.showFlag = showFlag;
    }
}
