package com.auth.entity;

import com.utils.DaoHelp;

/**
 * Created by dragon_eight on 2018/11/14.
 */
public class ContactRepeat {
    private String id;
    private String companyCode;
    private String contactId;//原联系人id
    private String repeatPart;//重复部分
    private String createDate;
    private String updateDate;

    public String getId() {
        return id;
    }

    public void setId(String id) {
        this.id = id;
    }

    public String getCompanyCode() {
        return companyCode;
    }

    public void setCompanyCode(String companyCode) {
        this.companyCode = companyCode;
    }

    public String getContactId() {
        return contactId;
    }

    public void setContactId(String contactId) {
        this.contactId = contactId;
    }

    public String getRepeatPart() {
        return repeatPart;
    }

    public void setRepeatPart(String repeatPart) {
        this.repeatPart = repeatPart;
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
}
