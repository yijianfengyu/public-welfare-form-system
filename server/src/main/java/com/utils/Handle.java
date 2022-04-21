package com.utils;

import java.io.Serializable;

/**
 * Created by hppc on 2017-11-07.
 */
public class Handle implements Serializable {
    private Integer flag;// 0失败，1成功
    private String message;// 返回消息
    private Object obj;

    public Handle() {
    }

    public Handle(int i, String message2) {
        this.flag = i;
        this.message = message2;
    }

    public Handle(int i, String message2, Object obj) {
        this.flag = i;
        this.message = message2;
        this.obj = obj;
    }

    public Integer getFlag() {
        return flag;
    }

    public void setFlag(Integer flag) {
        this.flag = flag;
    }

    public String getMessage() {
        return message;
    }

    public void setMessage(String message) {
        this.message = message;
    }

    public Object getObj() {
        return obj;
    }

    public void setObj(Object obj) {
        this.obj = obj;
    }

}
