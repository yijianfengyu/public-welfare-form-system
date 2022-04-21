package com.utils;

import java.io.Serializable;

/**
 * Created by Administrator on 2017-09-05.
 */
public class Model implements Serializable {
    protected int currentPage = 1;// 当前第几页
    protected int pageSize = 10;// 每页的数据行数，默认50条，系统参数
    protected int totalPages = 0;
    protected int total = 0;
//    protected String fromDate;
//    protected String toDate;
//    protected Boolean auditPermission = false;//VPO的审核权限


    public int getCurrentPage() {
        return currentPage;
    }

    public void setCurrentPage(int currentPage) {
        this.currentPage = currentPage;
    }

    public int getPageSize() {
        return pageSize;
    }

    public void setPageSize(int pageSize) {
        this.pageSize = pageSize;
    }

    public int getTotalPages() {
        return totalPages;
    }

    public void setTotalPages(int totalPages) {
        this.totalPages = totalPages;
    }

    public int getTotal() {
        return total;
    }

    public void setTotal(int total) {
        this.total = total;
    }
//
//    public String getFromDate() {
//        return fromDate;
//    }
//
//    public void setFromDate(String fromDate) {
//        this.fromDate = fromDate;
//    }
//
//    public String getToDate() {
//        return toDate;
//    }
//
//    public void setToDate(String toDate) {
//        this.toDate = toDate;
//    }
//
//    public Boolean getAuditPermission() {
//        return auditPermission;
//    }
//
//    public void setAuditPermission(Boolean auditPermission) {
//        this.auditPermission = auditPermission;
//    }
}
