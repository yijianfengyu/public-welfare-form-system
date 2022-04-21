package com.upload.entity;

import cn.afterturn.easypoi.excel.annotation.Excel;

/**
 * Created by dragon_eight on 2018/9/11.
 */
public class ContactUpload {
    @Excel(name = "姓名(必填)")
    private String name;  //   姓名
    @Excel(name = "邮箱(必填)")
    private String email;  //   邮箱
    @Excel(name = "身份证")
    private String identityCard;  //   身份证
    @Excel(name = "手机号(必填)")
    private String tel;  // 电话
    @Excel(name = "性别")
    private String sex;  // 性别
    @Excel(name = "地址")
    private String address;  //  地址
    @Excel(name = "省份")
    private String province;  // 省份
    @Excel(name = "出生日期")
    private String birthdate;  //  出生日期
    @Excel(name = "描述")
    private String description;  //  描述
    @Excel(name = "邮编")
    private String postcode;  //  邮编
    @Excel(name = "负责人")
    private String principalName;  // 负责人
    @Excel(name = "QQ")
    private String qq;  // QQ
    @Excel(name = "微信")
    private String wechat;  // 微信
    @Excel(name = "备用手机")
    private String secondPhone;  //备用手机
    @Excel(name = "备用邮箱")
    private String secondaryEmail;  //备用邮箱
    @Excel(name = "机构名称")
    private String organizationNames;  //  机构名称
    @Excel(name = "所在部门")
    private String department;  //  所在部门
    @Excel(name = "编号")
    private String serialNumber;  //编号
    @Excel(name = "传真")
    private String fax;  //  传真
    @Excel(name = "单位职务")
    private String unitPosition;  // 单位职务
    @Excel(name = "单位电话")
    private String workTelephone;  // 单位电话


    public String getName() {
        return name;
    }

    public void setName(String name) {
        this.name = name;
    }

    public String getEmail() {
        return email;
    }

    public void setEmail(String email) {
        this.email = email;
    }

    public String getIdentityCard() {
        return identityCard;
    }

    public void setIdentityCard(String identityCard) {
        this.identityCard = identityCard;
    }

    public String getTel() {
        return tel;
    }

    public void setTel(String tel) {
        this.tel = tel;
    }

    public String getSex() {
        return sex;
    }

    public void setSex(String sex) {
        this.sex = sex;
    }

    public String getAddress() {
        return address;
    }

    public void setAddress(String address) {
        this.address = address;
    }

    public String getProvince() {
        return province;
    }

    public void setProvince(String province) {
        this.province = province;
    }

    public String getBirthdate() {
        return birthdate;
    }

    public void setBirthdate(String birthdate) {
        this.birthdate = birthdate;
    }

    public String getDescription() {
        return description;
    }

    public void setDescription(String description) {
        this.description = description;
    }

    public String getPostcode() {
        return postcode;
    }

    public void setPostcode(String postcode) {
        this.postcode = postcode;
    }

    public String getPrincipalName() {
        return principalName;
    }

    public void setPrincipalName(String principalName) {
        this.principalName = principalName;
    }

    public String getQq() {
        return qq;
    }

    public void setQq(String qq) {
        this.qq = qq;
    }

    public String getWechat() {
        return wechat;
    }

    public void setWechat(String wechat) {
        this.wechat = wechat;
    }

    public String getSecondPhone() {
        return secondPhone;
    }

    public void setSecondPhone(String secondPhone) {
        this.secondPhone = secondPhone;
    }

    public String getSecondaryEmail() {
        return secondaryEmail;
    }

    public void setSecondaryEmail(String secondaryEmail) {
        this.secondaryEmail = secondaryEmail;
    }

    public String getOrganizationNames() {
        return organizationNames;
    }

    public void setOrganizationNames(String organizationNames) {
        this.organizationNames = organizationNames;
    }

    public String getDepartment() {
        return department;
    }

    public void setDepartment(String department) {
        this.department = department;
    }

    public String getSerialNumber() {
        return serialNumber;
    }

    public void setSerialNumber(String serialNumber) {
        this.serialNumber = serialNumber;
    }

    public String getFax() {
        return fax;
    }

    public void setFax(String fax) {
        this.fax = fax;
    }

    public String getUnitPosition() {
        return unitPosition;
    }

    public void setUnitPosition(String unitPosition) {
        this.unitPosition = unitPosition;
    }

    public String getWorkTelephone() {
        return workTelephone;
    }

    public void setWorkTelephone(String workTelephone) {
        this.workTelephone = workTelephone;
    }

}
