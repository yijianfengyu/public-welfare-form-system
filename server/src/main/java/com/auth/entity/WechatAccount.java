package com.auth.entity;

import com.utils.Model;

public class WechatAccount extends Model {
    private Long id;
    private String   code;
    private String   teamName;
    private String   teamState;
    private String   teamPassword;
    private String   teamNo;
    private String   pwd;
    private String   name;
    private String   state;
    private String   openId;
    private String   registerDate;
    private String   useState;
    private String   lastLoginTime;
    private String   remark;
    private String   organId;
    private String   ruleIds;
    private String   filedIds;
    private String   signedUrl;
    private String   phototUrl;
    private String   phone;
    private String   wxgzhOpenId;


    public Long getId() {
        return id;
    }

    public void setId(Long id) {
        this.id = id;
    }

    public String getCode() {
        return code;
    }

    public void setCode(String code) {
        this.code = code;
    }

    public String getPwd() {
        return pwd;
    }

    public void setPwd(String pwd) {
        this.pwd = pwd;
    }

    public String getName() {
        return name;
    }

    public void setName(String name) {
        this.name = name;
    }

    public String getState() {
        return state;
    }

    public void setState(String state) {
        this.state = state;
    }

    public String getOpenId() {
        return openId;
    }

    public void setOpenId(String openId) {
        this.openId = openId;
    }

    public String getRegisterDate() {
        return registerDate;
    }

    public void setRegisterDate(String registerDate) {
        this.registerDate = registerDate;
    }

    public String getUseState() {
        return useState;
    }

    public void setUseState(String useState) {
        this.useState = useState;
    }

    public String getLastLoginTime() {
        return lastLoginTime;
    }

    public void setLastLoginTime(String lastLoginTime) {
        this.lastLoginTime = lastLoginTime;
    }

    public String getRemark() {
        return remark;
    }

    public void setRemark(String remark) {
        this.remark = remark;
    }

    public String getOrganId() {
        return organId;
    }

    public void setOrganId(String organId) {
        this.organId = organId;
    }

    public String getRuleIds() {
        return ruleIds;
    }

    public void setRuleIds(String ruleIds) {
        this.ruleIds = ruleIds;
    }

    public String getFiledIds() {
        return filedIds;
    }

    public void setFiledIds(String filedIds) {
        this.filedIds = filedIds;
    }

    public String getSignedUrl() {
        return signedUrl;
    }

    public void setSignedUrl(String signedUrl) {
        this.signedUrl = signedUrl;
    }

    public String getPhototUrl() {
        return phototUrl;
    }

    public void setPhototUrl(String phototUrl) {
        this.phototUrl = phototUrl;
    }

    public String getPhone() {
        return phone;
    }

    public void setPhone(String phone) {
        this.phone = phone;
    }


    public String getTeamName() {
        return teamName;
    }

    public void setTeamName(String teamName) {
        this.teamName = teamName;
    }

    public String getTeamState() {
        return teamState;
    }

    public void setTeamState(String teamState) {
        this.teamState = teamState;
    }

    public String getTeamPassword() {
        return teamPassword;
    }

    public void setTeamPassword(String teamPassword) {
        this.teamPassword = teamPassword;
    }

    public String getTeamNo() {
        return teamNo;
    }

    public void setTeamNo(String teamNo) {
        this.teamNo = teamNo;
    }

    public String getWxgzhOpenId() {
        return wxgzhOpenId;
    }

    public void setWxgzhOpenId(String wxgzhOpenId) {
        this.wxgzhOpenId = wxgzhOpenId;
    }
}
