package com.auth.entity;

import com.utils.Model;

/**
 * Created by dragon_eight on 2018/12/2.
 */
public class ContactDefineData extends Model {

    private String id;
    private String contactId;
    private String defineDataId;
    private String defineId;
    private String submitDate;
    private String createDate;

    private String formTitle;


    public String getId() {
        return id;
    }

    public void setId(String id) {
        this.id = id;
    }

    public String getContactId() {
        return contactId;
    }

    public void setContactId(String contactId) {
        this.contactId = contactId;
    }

    public String getDefineDataId() {
        return defineDataId;
    }

    public void setDefineDataId(String defineDataId) {
        this.defineDataId = defineDataId;
    }

    public String getDefineId() {
        return defineId;
    }

    public void setDefineId(String defineId) {
        this.defineId = defineId;
    }

    public String getSubmitDate() {
        return submitDate;
    }

    public void setSubmitDate(String submitDate) {
        this.submitDate = submitDate;
    }

    public String getCreateDate() {
        return createDate;
    }

    public void setCreateDate(String createDate) {
        this.createDate = createDate;
    }

    public String getFormTitle() {
        return formTitle;
    }

    public void setFormTitle(String formTitle) {
        this.formTitle = formTitle;
    }
}
