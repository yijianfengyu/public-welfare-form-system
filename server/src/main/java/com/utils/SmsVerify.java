package com.utils;

import com.aliyuncs.DefaultAcsClient;
import com.aliyuncs.IAcsClient;
import com.aliyuncs.exceptions.ClientException;
import com.aliyuncs.exceptions.ServerException;
import com.aliyuncs.profile.DefaultProfile;
import com.aliyuncs.profile.IClientProfile;
import com.aliyuncs.sms.model.v20160927.SingleSendSmsRequest;
import com.aliyuncs.sms.model.v20160927.SingleSendSmsResponse;

public class SmsVerify {
    /**
     * 模板为验证码${code}，您正在注册成为${product}用户，感谢您的支持！
     */
    public static String sendCode(String code,String phone) {
        IClientProfile profile = DefaultProfile.getProfile("", "", "");
        try {
            DefaultProfile.addEndpoint("", "", "",  "sms.aliyuncs.com");
            IAcsClient client = new DefaultAcsClient(profile);
            SingleSendSmsRequest request = new SingleSendSmsRequest();
            request.setSignName("注册验证");
            request.setTemplateCode("");
            request.setParamString("{\"code\":\""+code+"\",\"product\":\"项目管理系统\"}");
            request.setRecNum(phone);
            SingleSendSmsResponse httpResponse = client.getAcsResponse(request);
        }catch (ServerException e) {
            e.printStackTrace();
        }catch (ClientException e) {
            if("InvalidRecNum.Malformed".equals(e.getErrCode())){
                return "获取失败，手机号不正确！";
            }else if("InvalidSendSms".equals(e.getErrCode())){
                return "当前操作频繁，请稍后再试！";
            }else{
                return "验证码获取失败！";
            }
        }
        return "";
    }


}
