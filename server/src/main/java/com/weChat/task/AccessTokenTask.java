package com.weChat.task;

import com.alibaba.fastjson.JSONObject;
import com.weChat.api.ThirdAPI;
import com.weChat.api.WxConstants;
import com.weChat.entity.WxInfo;
import com.weChat.entity.WxComponent;
import com.weChat.service.OpenwxService;
import com.weChat.service.WxComponentService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.scheduling.annotation.EnableScheduling;
import org.springframework.scheduling.annotation.Scheduled;
import org.springframework.stereotype.Repository;

import java.util.List;

/**
 * 更新授权的oken,接口令牌
 * 每个令牌是存在有效期（2小时）的，且令牌的调用不是无限制的
 * 第三方平台做好令牌的管理，在令牌快过期时（比如1小时50分）再进行刷新
 * Created by Administrator on 2018/10/18.
 */
@Repository
@EnableScheduling
public class AccessTokenTask {

    @Autowired
    WxComponentService wxComponentService;

    @Autowired
    OpenwxService openwxService;

    @Scheduled(cron ="0 0/110 * * * ?")
    public void run(){
        //获取当前component
        WxComponent wxc = wxComponentService.getWxComponent();
        //获取component_access_token
        String component_access_token = ThirdAPI.getComponentAccessToken(WxConstants.COMPONENT_APPID, WxConstants.COMPONENT_APPSECRET, wxc.getComponentVerifyTicket());

        if(component_access_token!=null && !"".equals(component_access_token)){
            //更新数据库token
            wxc.setComponentAccessToken(component_access_token);
            wxComponentService.updateWxComponentToken(wxc);

            List<WxInfo> list =  openwxService.queryWxInAll();//查询所有授权公众号
            for(int i = 0; i < list.size(); i++){
                WxInfo wxInfo = list.get(i);
                //获取（刷新）令牌
                JSONObject tokenObj = ThirdAPI.refreshAuthorizerToken(component_access_token, WxConstants.COMPONENT_APPID, wxInfo.getAuthorizerAppid(), wxInfo.getAuthorizerRefreshToken());
                String authorizer_access_token = tokenObj.getString("authorizer_access_token");
                String authorizer_refresh_token = tokenObj.getString("authorizer_refresh_token");

                if(authorizer_access_token!=null&&!"".equals(authorizer_access_token)){
                    wxInfo.setAuthorizerAccessToken(authorizer_access_token);
                    wxInfo.setAuthorizerRefreshToken(authorizer_refresh_token);
                    //更新数据库的token
                    openwxService.updateWxInfoToken(wxInfo);
                }
            }
        }
    }
}
