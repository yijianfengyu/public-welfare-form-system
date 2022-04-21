package com.utils;

import java.util.List;

public class Pagination {
    private int totalPages;
    private int dataTotalSize = 0;// 当此数据查询的总书目
    private int currencylPages = 1;// 当前第几页
    private int pageSize = 10;// 每页的数据行数，默认50条，系统参数
    private List<?> resultList;// 数据为serverSessionSize*pageSize条
    Pagination pagination;

    public Pagination getPagination() {
        return pagination;
    }

    public void setPagination(Pagination pagination) {
        this.pagination = pagination;
    }

    public int getTotalPages() {
        return totalPages;
    }

    public void setTotalPages(int totalPages) {
        this.totalPages = totalPages;
    }

    public int getDataTotalSize() {
        return dataTotalSize;
    }

    public void setDataTotalSize(int dataTotalSize) {

        this.dataTotalSize = dataTotalSize;
    }

    public int getCurrencylPages() {
        return currencylPages;
    }

    public void setCurrencylPages(int currencylPages) {

        this.currencylPages = currencylPages;
    }

    public int getPageSize() {
        return pageSize;
    }

    public void setPageSize(int pageSize) {

        this.pageSize = pageSize;
    }

    public List<?> getResultList() {
        return resultList;
    }

    public void setResultList(List<?> resultList) {

        this.resultList = resultList;
    }

}
