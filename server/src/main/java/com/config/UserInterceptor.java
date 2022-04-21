package com.config;

import net.minidev.json.JSONValue;
import org.springframework.web.bind.annotation.CrossOrigin;
import org.springframework.web.servlet.HandlerInterceptor;
import org.springframework.web.servlet.ModelAndView;

import javax.servlet.http.HttpServletRequest;
import javax.servlet.http.HttpServletResponse;
import javax.servlet.http.HttpSession;
import java.io.PrintWriter;
import java.util.*;

/**
 * Created by hppc on 2017-12-19.
 */
public class UserInterceptor implements HandlerInterceptor {


    //用来记录用户名和该session进行绑定

    /**
     * 在controller方法执行前执行
     */
    @Override
    public boolean preHandle(HttpServletRequest httpServletRequest, HttpServletResponse httpServletResponse, Object o) throws Exception {
        HttpSession session = httpServletRequest.getSession();
        String sessionId=session.getId();
        //过滤预检请求
        if("OPTIONS".equals(httpServletRequest.getMethod())){
            return true;
        }else{
            //跨域配置
            String ss= httpServletRequest.getHeader("Origin");
            httpServletResponse.setHeader("Access-Control-Allow-Origin", httpServletRequest.getHeader("Origin"));
            httpServletResponse.setHeader("Access-Control-Allow-Methods", "POST, GET, OPTIONS, DELETE");
            httpServletResponse.setHeader("Access-Control-Max-Age", "3600");
            httpServletResponse.setHeader("Access-Control-Allow-Headers", "Authentication,Origin, X-Requested-With, Content-Type, Accept, multipart/form-data, authorization,boundary");
            httpServletResponse.setHeader("Access-Control-Allow-Credentials", "true");
            httpServletResponse.setHeader("XDomainRequestAllowed","1");
        }

        String url = httpServletRequest.getRequestURI();
        if (httpServletRequest.getParameterMap().size() > 0) {
            if (url.indexOf("getRolesAndCompanys") >= 0 || url.indexOf("getLoginPage") >= 0
                    ||url.indexOf("jsloadamapjs")>=0
                    ||url.indexOf("getMenu")>=0
                    ||url.indexOf("amapjs03")>=0
                    ||url.indexOf("amapjs02")>=0
                    ||url.indexOf("amapjs01")>=0
                    ||url.indexOf("baidu")>=0
                    ||url.indexOf("vertifyPw")>=0
                    ||url.indexOf("openEditDataModal")>=0
                    ||url.indexOf("modifyFormDataByPw")>=0
                    ||url.indexOf("importCashExcel")>=0
                    || url.indexOf("pohtoUpload")>=0||url.indexOf("importExcel")>=0
                    ||url.indexOf("importContactExcel")>=0 ||url.indexOf("importExcelCustomerTemp")>=0
                    ||url.indexOf("importExcelVendorContact")>=0 ||url.indexOf("importExcelVendor")>=0
                    ||url.indexOf("fileUpload")>=0 ||url.indexOf("quotationUpload")>=0
                    || url.indexOf("getCreateMaxNumber")>=0  || url.indexOf("goodsPictureUpload")>=0
                    || url.indexOf("queryProject/tree")>=0
                    || url.indexOf("projectResourceUpload")>=0
                    || url.indexOf("registerUser")>=0
                    || url.indexOf("toSms")>=0
                    || url.indexOf("selectAccount")>=0
                    || url.indexOf("importExcelContact")>=0 || url.indexOf("importExcelTempTable")>=0 || url.indexOf("importExcelTempWithData")>=0
                    || url.indexOf("uploadTempFile")>=0 || url.indexOf("uploadTempPictures")>=0
                    || url.indexOf("queryAllTempData")>=0 || url.indexOf("queryAllTempDataByPage")>=0  || url.indexOf("queryAllTempDataByDefineId")>=0
                    || url.indexOf("queryTempDataById")>=0 || url.indexOf("queryTempTableById")>=0 || url.indexOf("createTempData")>=0
                    || url.indexOf("queryProjectReport")>=0 || url.indexOf("updateProjectReport")>=0
                    || url.indexOf("insertContact")>=0 || url.indexOf("insertUser")>=0 || url.indexOf("formDataShare")>=0
                    || url.indexOf("openwx")>=0|| url.indexOf("dataShare")>=0|| url.indexOf("createProjectDaily")>=0|| url.indexOf("shareInsertDaily")>=0||
                    url.indexOf("teletextShare")>=0|| url.indexOf("dataFrom")>=0||url.indexOf("queryAllActiveUser")>=0||url.indexOf("/wechat/login")>=0
                    ||url.indexOf("/wechat/queryAllTempDataByDefineId")>=0||url.indexOf("/wechat/accessAccount")>=0
                    ||url.indexOf("/wechat/uploadView")>=0||url.indexOf("/wechat/uploadFile")>=0||url.indexOf("/wechat/selectAccount")>=0
                    ||url.indexOf("/wechatLogin/getLogin")>=0||url.indexOf("/wechatLogin/register")>=0||url.indexOf("/wechat/queryProject")>=0
                    ||url.indexOf("/wechat/queryVolunteerapply")>=0||url.indexOf("/wechat/queryTeam")>=0||url.indexOf("/wechat/joinTeam")>=0
                    ||url.indexOf("/wechat/audit")>=0||url.indexOf("/wechat/count")>=0||url.indexOf("/wechat/queryApplicationResearch")>=0
                    ||url.indexOf("/wechat/AccountInfo")>=0||url.indexOf("/wechat/queryComment")>=0||url.indexOf("/wechat/addComment")>=0
                    ||url.indexOf("/wechat/isCreate")>=0|| url.indexOf("/wechat/queryWaterSource")>=0 || url.indexOf("/wechat/queryProjectDetails")>=0
                    ||url.indexOf("/wechat/queryTempDataByIdButton")>=0||url.indexOf("/wechat/setupComplete")>=0||url.indexOf("/wechat/teaminfo")>=0
                    ||url.indexOf("/wechat/updateStatus")>=0||url.indexOf("/wechat/uploadTempPictures")>=0||url.indexOf("/wechat/updateAccount")>=0
                    ||url.indexOf("/wechat/remind")>=0||url.indexOf("/wechat/statistics")>=0||url.indexOf("/wechat" + "/statisticsData")>=0
                    ||url.indexOf("/wechat/kick")>=0||url.indexOf("/wechat/save")>=0||url.indexOf("/wechat/myReport")>=0||url.indexOf("/wehat/answerInfo")>=0
                    ||url.indexOf("/wehat/dianzanFollow")>=0) {

                return true;
            } else {
                Object user = session.getAttribute("user");
                //session未过期不必拦截
                if (null != session.getAttribute("user") && !"".equals(session.getAttribute("user"))
                        ||null != session.getAttribute("wechatUser") && !"".equals(session.getAttribute("wechatUser"))) {
                    return true;
                } else {
//                    session.removeAttribute("lastVisitUrl");
                    //过期
                    //删除登录记录
//                    Staff.loginStaff.singnOutLogin(Staff.loginStaff);
                    System.out.println("会话过期，删除登录记录");
                    Map map = new HashMap();
                    map.put("login", "out");
                    List list = new ArrayList();
                    list.add(map);
                    PrintWriter pw = httpServletResponse.getWriter();
                    if(httpServletRequest.getParameterMap().get("callback")!=null){
                        String callback = httpServletRequest.getParameterMap().get("callback")[0];
                        pw.print(callback + "(" + JSONValue.toJSONString(list) + ")");
                    }else {
                        map.put("flag",3);
                        pw.print(JSONValue.toJSONString(map));
                    }


                    pw.flush();
                    pw.close();
                    //@刘琪 即使没登录也记录最后访问的url地址，在登录后跳转到这个地址
                    if(url!=null&&!"".equals(url)) {
                        session.setAttribute("last_visit_url", url);
                    }
                    return false;

                }
            }

        } else {
            return true;
        }
//
        //返回false 停止执行，返回true 继续执行
//        return true;
    }

    /**
     * 在controller方法执行之后，在视图渲染之前执行
     */
    @Override
    public void postHandle(HttpServletRequest httpServletRequest, HttpServletResponse httpServletResponse, Object o, ModelAndView modelAndView) throws Exception {
//        AuthController.backToLogin("123");
    }

    /**
     * 在处理结束之后
     */
    @Override
    public void afterCompletion(HttpServletRequest httpServletRequest, HttpServletResponse httpServletResponse, Object o, Exception e) throws Exception {
        ;
    }
}
