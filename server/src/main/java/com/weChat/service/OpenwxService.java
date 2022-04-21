package com.weChat.service;

import com.auth.entity.User;
import com.utils.Handle;
import com.weChat.dao.OpenwxDao;
import com.weChat.entity.WxInfo;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.List;

/**
 * Created by Administrator on 2018/10/15.
 */
@Service
public class OpenwxService {
    @Autowired
    OpenwxDao dao;

    public Handle insertWxInfo(WxInfo wi) {
        return dao.insertWxInfo(wi);
    }

    public List<WxInfo> queryWxInfoList(WxInfo wi) {
        return dao.queryWxInfoList(wi);
    }

    public List<WxInfo> queryWxInAll() {
        return dao.queryWxInAll();
    }

    public WxInfo queryWxInByAppid(String appid) {
        return dao.queryWxInByAppid(appid);
    }

    public Handle updateWxInfoToken(WxInfo wi){
        return dao.updateWxInfoToken(wi);
    }

    public Handle updateUserUnionId(User user){
        return dao.updateUserUnionId(user);
    }

}
