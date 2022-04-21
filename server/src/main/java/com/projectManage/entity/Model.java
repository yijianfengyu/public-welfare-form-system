package com.projectManage.entity;

/**
 * Created by Administrator on 2017-09-05.
 */
public class Model {
    protected int currentPage = 1;// 当前第几页
    protected int pageSize = 10;// 每页的数据行数，默认10条，系统参数
    protected int totalPages = 0;
    protected int total = 0;
    protected Long id;


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

    public Long getId() {
        return id;
    }

    public void setId(Long id) {
        this.id = id;
    }
}
