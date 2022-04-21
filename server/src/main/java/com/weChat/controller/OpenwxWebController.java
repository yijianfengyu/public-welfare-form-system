package com.weChat.controller;

import com.alibaba.fastjson.JSONObject;
import com.utils.Handle;
import com.weChat.api.ThirdAPI;
import com.weChat.service.OpenwxService;
import net.minidev.json.JSONValue;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.CrossOrigin;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import javax.servlet.http.HttpServletRequest;
import javax.servlet.http.HttpServletResponse;
import java.io.UnsupportedEncodingException;

/**
 * Created by Administrator on 2018/10/17.
 */
@RestController
@CrossOrigin
@RequestMapping("/openwx")
public class OpenwxWebController {

    @Autowired
    private OpenwxService openwxService;

    private final static String COMPONENT_APPID = "wxf1a749a5bb6634ed"; //网站应用 APPID
    private final String COMPONENT_APPSECRET = "b8859a6ae5b0cdb0a7b3fcf6f0db1e1e";    //网站应用 秘钥

    @RequestMapping(value = "/oauth2/authorize")
    public String oauth2Authorize(String callback) throws UnsupportedEncodingException {
        String redirect_uri="http://113.240.224.231:9081/pmapi/openwx/oauth2/authorize/redirect";
        String url = "https://open.weixin.qq.com/connect/oauth2/authorize?appid="+COMPONENT_APPID+"&redirect_uri="+ java.net.URLEncoder.encode(redirect_uri, "UTF-8")+"&response_type=code&scope=snsapi_login&state=STATE#wechat_redirect";
        return callback + "(" + JSONValue.toJSONString(new Handle(0, null, url)) + ")";
    }

    /**
     * 重定向页面
     * 通过code换取access_token
     * @param request
     * @param response
     */
    @RequestMapping(value = "/oauth2/authorize/redirect")
    public String oauth2AuthorizeRedirect(HttpServletRequest request, HttpServletResponse response){
        String code = request.getParameter("code");//用户同意后返回的code
        String appid = request.getParameter("appid");//授权公众号的appid

        JSONObject obj = ThirdAPI.getOauth2AccessToken(COMPONENT_APPID, code, COMPONENT_APPSECRET,"");
        String access_token = obj.getString("access_token");
        String openid = obj.getString("openid");
        //获取授权微信用户信息
        JSONObject userObj = ThirdAPI.getOauth2Userinfo(access_token, openid);
        if(userObj.getString("errcode")!=null){//获取失败
            return JSONValue.toJSONString(new Handle(0,"获取微信用户信息失败",null));
        }else{  //成功,返回
            return JSONValue.toJSONString(new Handle(1,"获取微信用户信息成功",userObj));
        }


        /**
         * 重定向页面
         * 通过code换取access_token
         * @param request
         * @param response
         */
//    @RequestMapping(value = "/oauth2/authorize/redirect")
//    public String oauth2AuthorizeRedirect(HttpServletRequest request, HttpServletResponse response){
//        String code = request.getParameter("code");//用户同意后返回的code
//        String appid = request.getParameter("appid");//授权公众号的appid
//        WxInfo wxInfo = openwxService.queryWxInByAppid(appid);//根据apppid获取公众号授权信息
//        if(wxInfo!=null){
//            String grant_type = wxInfo.getAuthorizationCode();
//            String component_access_token = wxInfo.getAuthorizerAccessToken();
//            //通过code换取access_token和openid
//            JSONObject obj = ThirdAPI.getOauth2AccessToken(appid, code, grant_type, COMPONENT_APPID, component_access_token);
//            String access_token = obj.getString("access_token");
//            String openid = obj.getString("openid");
//            //获取授权微信用户信息
//            JSONObject userObj = ThirdAPI.getOauth2Userinfo(access_token,openid);
//            if(userObj.getString("errcode")!=null){//获取失败
//                return JSONValue.toJSONString(new Handle(0,"获取微信用户信息失败",null));
//            }else{  //成功,返回
//                return JSONValue.toJSONString(new Handle(1,"获取微信用户信息成功",userObj));
//            }
//        }else{
//            return JSONValue.toJSONString(new Handle(0,"获取公众号授权信息失败",null));
//        }
    }
}
