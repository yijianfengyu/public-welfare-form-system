package com.utils;

import org.springframework.beans.BeansException;
import org.springframework.beans.factory.BeanFactory;
import org.springframework.beans.factory.BeanFactoryAware;
import org.springframework.beans.factory.annotation.Autowired;

import java.lang.reflect.ParameterizedType;
import java.lang.reflect.Type;

/**
 * Created by Administrator on 2017/8/7.
 */
public abstract class Entity<T> extends Model implements BeanFactoryAware {

    protected static BeanFactory context;
    @Autowired
    protected T dao;

    @Override
    public void setBeanFactory(BeanFactory beanFactory) throws BeansException {
        this.context = beanFactory;
    }


    //给实体类添加行为
    public void superMan() {
        if (context == null) {
            throw new NullPointerException("BeanFactory is null!");
        }
        Type f = this.getClass().getGenericSuperclass();
        ParameterizedType pt = (ParameterizedType) f;
        Class genericClazz = (Class) pt.getActualTypeArguments()[0];
        String sbn = genericClazz.getSimpleName();
        String beanName = String.valueOf(Character.toLowerCase(sbn.charAt(0))).concat(sbn.substring(1));
        dao = (T) context.getBean(beanName);
    }


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
}
