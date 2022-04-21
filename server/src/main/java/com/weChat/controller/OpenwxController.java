package com.weChat.controller;

import java.io.*;
import java.security.MessageDigest;
import java.security.NoSuchAlgorithmException;
import java.util.*;
import javax.servlet.http.HttpServletRequest;
import javax.servlet.http.HttpServletResponse;

import com.alibaba.fastjson.JSONObject;
import com.auth.entity.User;
import com.qq.weixin.mp.aes.AesException;
import com.qq.weixin.mp.aes.WXBizMsgCrypt;
import com.utils.Handle;
import com.utils.Model;
import com.utils.Page;
import com.weChat.api.ThirdAPI;
import com.weChat.api.WxConstants;
import com.weChat.entity.WxInfo;
import com.weChat.entity.WxComponent;
import com.weChat.service.OpenwxService;
import com.weChat.service.WxComponentService;
import net.minidev.json.JSONValue;
import org.apache.commons.lang3.StringUtils;
import org.apache.tomcat.util.http.fileupload.disk.DiskFileItem;
import org.dom4j.Document;
import org.dom4j.DocumentException;
import org.dom4j.DocumentHelper;
import org.dom4j.Element;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.CrossOrigin;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;
import org.springframework.web.multipart.MultipartFile;
import org.springframework.web.multipart.commons.CommonsMultipartFile;
import org.springframework.web.servlet.ModelAndView;

@RestController
@CrossOrigin
@RequestMapping("/openwx")
public class OpenwxController {

    @Autowired
    private WxComponentService wxComponentService;

    @Autowired
    private OpenwxService openwxService;

    @RequestMapping("/authorization")
    public void getTicket(HttpServletRequest request, HttpServletResponse response) throws IOException, AesException {
        processAuthorizeEvent(request);
        output(response, "success"); // 输出响应的内容。
    }

    /**
     *  授权事件处理
     * @param request
     * @throws IOException
     */
    public void processAuthorizeEvent(HttpServletRequest request) throws IOException, AesException {
        String nonce = request.getParameter("nonce");
        String timestamp = request.getParameter("timestamp");
        String signature = request.getParameter("signature");
        String msgSignature = request.getParameter("msg_signature");

        if (!StringUtils.isNotBlank(msgSignature))
            return;// 微信推送给第三方开放平台的消息一定是加过密的，无消息加密无法解密消息
        boolean isValid = checkSignature(WxConstants.COMPONENT_TOKEN, signature, timestamp, nonce);
        if (isValid) {
            StringBuilder sb = new StringBuilder();
            BufferedReader in = request.getReader();
            String line;
            while ((line = in.readLine()) != null) {
                sb.append(line);
            }
            String xml = sb.toString();
            xml = xml.replaceAll("AppId","ToUserName");
//            LogUtil.info("第三方平台全网发布-----------------------原始 Xml="+xml);
            String encodingAesKey = WxConstants.COMPONENT_ENCODINGAESKEY;// 第三方平台组件加密密钥
            //LogUtil.info("第三方平台全网发布-------------appid----------getAuthorizerAppidFromXml(xml)-----------appId="+appId);
            WXBizMsgCrypt pc = new WXBizMsgCrypt(WxConstants.COMPONENT_TOKEN, encodingAesKey, WxConstants.COMPONENT_APPID);
            xml = pc.DecryptMsg(msgSignature, timestamp, nonce, xml);
//            LogUtil.info("第三方平台全网发布-----------------------解密后 Xml="+xml);
            processAuthorizationEvent(xml);
        }


    }

    /**
     * 回复微信服务器"文本消息"
     * @param response
     * @param returnvaleue
     */
    public void output(HttpServletResponse response, String returnvaleue) {
        try {
            PrintWriter pw = response.getWriter();
            pw.write(returnvaleue);
            System.out.println("****************returnvaleue***************="+returnvaleue);
            pw.flush();
        } catch (IOException e) {
            e.printStackTrace();
        }
    }

    /**
     * 判断是否加密
     * @param token
     * @param signature
     * @param timestamp
     * @param nonce
     * @return
     */
    public static boolean checkSignature(String token,String signature,String timestamp,String nonce){
        boolean flag = false;
        if(signature!=null && !signature.equals("") && timestamp!=null && !timestamp.equals("") && nonce!=null && !nonce.equals("")){
            String sha1 = "";
            String[] ss = new String[] { token, timestamp, nonce };
            Arrays.sort(ss);
            for (String s : ss) {
                sha1 += s;
            }

            sha1 = AddSHA1.SHA1(sha1);

            if (sha1.equals(signature)){
                flag = true;
            }
        }
        return flag;
    }

    /**
     * 保存Ticket
     * @param xml
     */
    void processAuthorizationEvent(String xml) {
        Document doc;

        try {
            doc = DocumentHelper.parseText(xml);
            Element rootElt = doc.getRootElement();
            String ticket = rootElt.elementText("ComponentVerifyTicket");
            if(ticket!=null){
                WxComponent wxticket = new WxComponent();
                wxticket.setComponentVerifyTicket(ticket);
                wxComponentService.updateWxComponentTicket(wxticket);
            }
        } catch (DocumentException e) {
            e.printStackTrace();
        }
    }

    /**
     *消息与事件接收
     * @param request
     * @param response
     * @throws IOException
     * @throws AesException
     * @throws DocumentException
     */
    @RequestMapping(value = "{appid}/callback")
    public void acceptMessageAndEvent(HttpServletRequest request, HttpServletResponse response) throws IOException, AesException, DocumentException {
        String msgSignature = request.getParameter("msg_signature");
        if (!StringUtils.isNotBlank(msgSignature))
            return;// 微信推送给第三方开放平台的消息一定是加过密的，无消息加密无法解密消息

        StringBuilder sb = new StringBuilder();
        BufferedReader in = request.getReader();
        String line;
        while ((line = in.readLine()) != null) {
            sb.append(line);
        }
        in.close();
        String xml = sb.toString();
    }


    /**
     * 一键授权功能
     * @param request
     * @param response
     * @throws IOException
     * @throws AesException
     * @throws DocumentException
     */
    @RequestMapping(value = "/goAuthorization")
    public String goAuthorization(HttpServletRequest request, HttpServletResponse response,String callback) throws IOException, AesException, DocumentException {
        User user = (User)request.getSession().getAttribute("user");
        WxComponent wxc = wxComponentService.getWxComponent();
        //预授权码
        String preAuthCode = ThirdAPI.getPreAuthCode(wxc.getComponentAccessToken(), WxConstants.COMPONENT_APPID);
        String url = "https://mp.weixin.qq.com/cgi-bin/componentloginpage?component_appid=" + WxConstants.COMPONENT_APPID + "&pre_auth_code=" + preAuthCode + "&redirect_uri=https://pm.pinqidesign.com/pmapi/openwx/authorCallback?companyCode="+user.getCompanyCode();

        return callback + "(" + JSONValue.toJSONString(new Handle(0,null,url)) + ")";
    }

    /**
     * 授权后返回url
     * @param request
     * @param response
     * @throws IOException
     * @throws AesException
     * @throws DocumentException
     */
    @RequestMapping(value = "/authorCallback")
    public ModelAndView authorCallback(HttpServletRequest request, HttpServletResponse response, ModelAndView mo){

        String companyCode = request.getParameter("companyCode");
        String auth_code = request.getParameter("auth_code");

        WxComponent wxc = wxComponentService.getWxComponent();

        //使用授权码换取公众号
        JSONObject authObj = ThirdAPI.queryAuthObject(wxc.getComponentAccessToken(), WxConstants.COMPONENT_APPID, auth_code);
        String authorizer_appid = authObj.getString("authorizer_appid");
        String authorizer_access_token = authObj.getString("authorizer_access_token");
        String authorizer_refresh_token = authObj.getString("authorizer_refresh_token");
        //获取授权方的帐号基本信息
        JSONObject infoObj = ThirdAPI.getAuthorizerInfo(wxc.getComponentAccessToken(), WxConstants.COMPONENT_APPID, authorizer_appid);

        WxInfo wi = new WxInfo();
        wi.setCompanyCode(companyCode);
        wi.setAuthorizerAppid(authorizer_appid);
        wi.setAuthorizerAccessToken(authorizer_access_token);
        wi.setAuthorizerRefreshToken(authorizer_refresh_token);
        wi.setNickName(infoObj.getString("nick_name"));
        wi.setHeadImg(infoObj.getString("head_img"));
        wi.setUserName(infoObj.getString("user_name"));
        wi.setPrincipalName(infoObj.getString("principal_name"));
        wi.setServiceTypeInfo(infoObj.getJSONObject("service_type_info").getInteger("id"));
        wi.setVerifyTypeInfo(infoObj.getJSONObject("verify_type_info").getInteger("id"));
        wi.setAuthorizationCode(auth_code);
        openwxService.insertWxInfo(wi);

        System.out.println("authorCallback--授权成功---");
        mo.setViewName("authorCallback");
        return mo;
    }

    /**
     * 授权后返回url
     * @param request
     * @param response
     * @throws IOException
     * @throws AesException
     * @throws DocumentException
     */
    @RequestMapping(value = "/refreshToken")
    public void refreshAuthorizerToken(HttpServletRequest request, HttpServletResponse response){
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

    /**
     * 获取当前企业授权的公众号
     * @param request
     * @param response
     * @throws IOException
     * @throws AesException
     * @throws DocumentException
     */
    @RequestMapping(value = "/queryWxInfo")
    public String queryMaterial(HttpServletRequest request, HttpServletResponse response, String callback){
        User user = (User)request.getSession().getAttribute("user");
        if(user == null){
            return callback + "(" + JSONValue.toJSONString(new Handle(1,null)) + ")";
        }
        List<WxInfo> wxInfoList = openwxService.queryWxInfoList(new WxInfo(user.getCompanyCode()));
        return callback + "(" + JSONValue.toJSONString(new Handle(0,null,wxInfoList)) + ")";
    }

    /**
     * 获取素材列表
     * @param request
     * @param response
     * @throws IOException
     * @throws AesException
     * @throws DocumentException
     */
    @RequestMapping(value = "/material/queryMaterial")
    public String queryMaterial(HttpServletRequest request, HttpServletResponse response,Model model,String appid,String materialType, String callback){
        WxInfo wxInfo = openwxService.queryWxInByAppid(appid);
        if(wxInfo!=null){
            String access_token = wxInfo.getAuthorizerAccessToken();
            String type = materialType;
            Integer offset = model.getCurrentPage()-1;
            Integer count = model.getPageSize();
            Page page = ThirdAPI.getMaterialList(access_token, type, offset, count);
            return callback + "(" + JSONValue.toJSONString(page) + ")";
        }else{
            return callback + "(" + JSONValue.toJSONString(new Page()) + ")";
        }
    }

    /**
     * 新增素材
     * @param request
     * @param response
     * @throws IOException
     * @throws AesException
     * @throws DocumentException
     */
    @RequestMapping(value = "/material/insertMaterial")
    public String insertMaterial(HttpServletRequest request, HttpServletResponse response,String appid,String material,String callback){
        WxInfo wxInfo = openwxService.queryWxInByAppid(appid);
        JSONObject object = JSONObject.parseObject(material);
        material = object.getString("content").replace("news_item","articles");

        if(wxInfo!=null){
            String access_token = wxInfo.getAuthorizerAccessToken();
            JSONObject obj = ThirdAPI.addMaterial(access_token, material);
            Handle handle;
            if(obj.getString("media_id")==null){
                String errmsg = "";
                if("44004".equals(obj.getString("errcode"))){
                    errmsg = "内容不能为空！";
                }else if("40007".equals(obj.getString("errcode"))){
                    errmsg = "不合法的media_id,请确保图文都选择了封面！";
                }else{
                    errmsg = obj.getString("errmsg");
                }
                handle = new Handle(0,"提交失败,"+errmsg);
            }else{
                handle = new Handle(1,"提交成功",obj.getString("media_id"));
            }
            return callback + "(" + JSONValue.toJSONString(handle) + ")";
        }else{
            return callback + "(" + JSONValue.toJSONString(new Handle(0,"权限获取失败")) + ")";
        }
    }

    /**
     * 修改素材
     * @param request
     * @param response
     * @throws IOException
     * @throws AesException
     * @throws DocumentException
     */
    @RequestMapping(value = "/material/updateMaterial")
    public String updateMaterial(HttpServletRequest request, HttpServletResponse response,String appid,String material,String callback){
        WxInfo wxInfo = openwxService.queryWxInByAppid(appid);
        material = material.replace("news_item","articles");

        if(wxInfo!=null){
            String access_token = wxInfo.getAuthorizerAccessToken();
            JSONObject obj = ThirdAPI.updateMaterial(access_token, material);
            Handle handle;
            if("0".equals(obj.getString("errcode"))){
                handle = new Handle(1,"修改成功");
            }else{
                handle = new Handle(0,"修改失败");
            }
            return callback + "(" + JSONValue.toJSONString(handle) + ")";
        }else{
            return callback + "(" + JSONValue.toJSONString(new Handle(0,"权限获取失败")) + ")";
        }
    }

    /**
     * 删除素材
     * @param request
     * @param response
     * @throws IOException
     * @throws AesException
     * @throws DocumentException
     */
    @RequestMapping(value = "/material/deleteMaterial")
    public String deleteMaterial(HttpServletRequest request, HttpServletResponse response,String appid,String media_id,String callback){
        WxInfo wxInfo = openwxService.queryWxInByAppid(appid);

        if(wxInfo!=null){
            String access_token = wxInfo.getAuthorizerAccessToken();
            JSONObject obj = ThirdAPI.deleteMaterial(access_token, media_id);
            Handle handle;
            if("0".equals(obj.getString("errcode"))){
                handle = new Handle(1,"删除成功");
            }else{
                handle = new Handle(0,"提交失败");
            }
            return callback + "(" + JSONValue.toJSONString(handle) + ")";
        }else{
            return callback + "(" + JSONValue.toJSONString(new Handle(0,"权限获取失败")) + ")";
        }
    }

    /**
     * 群发素材
     * @param request
     * @param response
     * @throws IOException
     * @throws AesException
     * @throws DocumentException
     */
    @RequestMapping(value = "/material/sendMaterial")
    public String sendMaterial(HttpServletRequest request, HttpServletResponse response,String appid,String material,String callback){
        WxInfo wxInfo = openwxService.queryWxInByAppid(appid);
        if(wxInfo!=null){
            String access_token = wxInfo.getAuthorizerAccessToken();
            JSONObject obj = ThirdAPI.sendMaterial(access_token, material);
            Handle handle;
            if(obj.getString("media_id")==null){
                String errmsg = "";
                if("48001".equals(obj.getString("errcode"))){
                    errmsg = "此公众号未认证,无接口权限,请认证后使用！";
                }else{
                    errmsg = obj.getString("errmsg");
                }
                handle = new Handle(0,"发送失败,"+errmsg);
            }else{
                handle = new Handle(1,"发送成功",obj.getString("media_id"));
            }
            return callback + "(" + JSONValue.toJSONString(handle) + ")";
        }else{
            return callback + "(" + JSONValue.toJSONString(new Handle(0,"权限获取失败")) + ")";
        }
    }

    /**
     * 上传多媒体
     * @throws IOException
     * @throws AesException
     * @throws DocumentException
     */
    @RequestMapping(value = "/material/upload")
    public String materialUpload(HttpServletRequest request,@RequestParam("file")MultipartFile multifile) throws IOException {
        String appid = request.getParameter("appid");
        String type = request.getParameter("type");
        WxInfo wxInfo = openwxService.queryWxInByAppid(appid);
        if(wxInfo!=null){
            String fileName = multifile.getOriginalFilename();
            String prefix=fileName.substring(fileName.lastIndexOf("."));
            final File file = File.createTempFile(fileName.substring(0,fileName.lastIndexOf("."))+"_", prefix);
            multifile.transferTo(file);

            String access_token = wxInfo.getAuthorizerAccessToken();
            String thumb_media_id = ThirdAPI.uploadGetMediaId(access_token,file, type);
            return JSONValue.toJSONString(new Handle(thumb_media_id!=null?1:0,null,thumb_media_id));
        }else{
            return JSONValue.toJSONString(new Handle(0,null));
        }
    }

    @RequestMapping(value = "/wxAuthorize")
    public String wxAuthorize(HttpServletRequest request, HttpServletResponse response) throws Exception {
        String code = request.getParameter("code");//用户同意后返回的code

        JSONObject obj = ThirdAPI.getOauth2AccessToken(WxConstants.WEB_APPID, WxConstants.WEB_APPSECRET, code, "authorization_code");
        String access_token = obj.getString("access_token");
        String openid = obj.getString("openid");
        //获取授权微信用户信息
        JSONObject userInfo = ThirdAPI.getOauth2Userinfo(access_token, openid);

        User user= (User) request.getSession().getAttribute("user");
        if(userInfo.getString("openid")!=null && user !=null) {
            user.setUnionId(userInfo.getString("unionid"));
            user.setNickName(userInfo.getString("nickname"));
            Handle handle = openwxService.updateUserUnionId(user);
            return "(" +JSONValue.toJSONString(handle)+")";
        }else{
            return "(" +JSONValue.toJSONString(new Handle(0,"失败"))+")";
        }
    }

}

class AddSHA1 {
    public static String SHA1(String inStr) {
        MessageDigest md = null;
        String outStr = null;
        try {
            md = MessageDigest.getInstance("SHA-1"); // 选择SHA-1，也可以选择MD5
            byte[] digest = md.digest(inStr.getBytes()); // 返回的是byet[]，要转化为String存储比较方便
            outStr = bytetoString(digest);
        } catch (NoSuchAlgorithmException nsae) {
            nsae.printStackTrace();
        }
        return outStr;
    }
    public static String bytetoString(byte[] digest) {
        String str = "";
        String tempStr = "";
        for (int i = 0; i < digest.length; i++) {
            tempStr = (Integer.toHexString(digest[i] & 0xff));
            if (tempStr.length() == 1) {
                str = str + "0" + tempStr;
            } else {
                str = str + tempStr;
            }
        }
        return str.toLowerCase();
    }
}