package com.auth.entity;

import com.utils.Model;

/**
 * @author WuDong
 * @date 2020/4/9 15:00
 */
public class Account  extends Model {

    private Integer id;
    private String accountName;
    private String phone;
    private String password;
    private Integer roleId;
    private String portrait;
    private String registerType;
    private String openId;
    private Integer status;
    private Integer isImpower;
    private Integer isCreateProject;//是否可以创建项目（1=是，0=否）


    public String getRegisterType() {
        return registerType;
    }

    public void setRegisterType(String registerType) {
        this.registerType = registerType;
    }

    public Integer getIsCreateProject() {
        return isCreateProject;
    }

    public void setIsCreateProject(Integer isCreateProject) {
        this.isCreateProject = isCreateProject;
    }

    public Integer getStatus() {
        return status;
    }

    public void setStatus(Integer status) {
        this.status = status;
    }


    public String getPortrait() {
        return portrait;
    }

    public void setPortrait(String portrait) {
        this.portrait = portrait;
    }

    public Integer getId() {
        return id;
    }

    public void setId(Integer id) {
        this.id = id;
    }

    public String getAccountName() {
        return accountName;
    }

    public void setAccount_name(String accountName) {
        this.accountName = accountName;
    }

    public String getPhone() {
        return phone;
    }

    public void setPhone(String phone) {
        this.phone = phone;
    }

    public String getPassword() {
        return password;
    }

    public void setPassword(String password) {
        this.password = password;
    }


    public Integer getRoleId() {
        return roleId;
    }

    public void setRoleId(Integer role_id) {
        this.roleId = role_id;
    }

    public String getOpenId() {
        return openId;
    }

    public void setOpenId(String openId) {
        this.openId = openId;
    }

    public Integer getIsImpower() {
        return isImpower;
    }

    public void setIsImpower(Integer isImpower) {
        this.isImpower = isImpower;
    }

    @Override
    public String toString() {
        return "Account{" +
                "id=" + id +
                ", account_name='" + accountName + '\'' +
                ", phone='" + phone + '\'' +
                ", password='" + password + '\'' +
                ", role_id=" + roleId +
                '}';
    }
}
