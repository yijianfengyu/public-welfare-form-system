package com.auth.entity;

import com.utils.Model;

/**
 * Created by Administrator on 2017/7/7.
 */
public class Role  extends Model {
    private int id;
    private String roleDate;
    private String roleName;
    private String roleType;
    private String updateDate;

    public Role(String roleName,
                String roleType) {
        this.roleName = roleName;
        this.roleType = roleType;
    }

    public int getId() {
        return id;
    }

    public void setId(int id) {
        this.id = id;
    }

    public String getRoleDate() {
        return roleDate;
    }

    public void setRoleDate(String roleDate) {
        this.roleDate = roleDate;
    }

    public String getRoleName() {
        return roleName;
    }

    public void setRoleName(String roleName) {
        this.roleName = roleName;
    }

    public String getRoleType() {
        return roleType;
    }

    public void setRoleType(String roleType) {
        this.roleType = roleType;
    }

    public String getUpdateDate() {
        return updateDate;
    }

    public void setUpdateDate(String updateDate) {
        this.updateDate = updateDate;
    }
}
