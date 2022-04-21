package com.weChat.service;

import com.weChat.dao.WxComponentDao;
import com.weChat.entity.WxComponent;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

/**
 * Created by Administrator on 2018/10/12.
 */
@Service
public class WxComponentService {
    @Autowired
    WxComponentDao wxComponentDao;

    public void updateWxComponentTicket(WxComponent wxc){
        wxComponentDao.updateWxComponentTicket(wxc);
    }

    public void updateWxComponentToken(WxComponent wxc){
        wxComponentDao.updateWxComponentToken(wxc);
    }

    public WxComponent getWxComponent(){
        return wxComponentDao.getWxComponent();
    }
}
