package com.auth.controller;

//import com.akka.ActorAgent;

import com.alibaba.fastjson.JSONObject;
import com.auth.entity.*;
import com.auth.entity.User;
import com.auth.service.UserService;
import com.utils.*;
import net.minidev.json.JSONArray;
import net.minidev.json.JSONValue;
import org.apache.commons.codec.digest.DigestUtils;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.ModelAttribute;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import javax.servlet.http.HttpServletRequest;
import javax.servlet.http.HttpSession;
import java.sql.SQLException;
import java.util.ArrayList;
import java.util.HashMap;
import java.util.List;
import java.util.Map;

/**
 * 登录业务
 */
@RestController
@RequestMapping("/login")
public class LoginController {

    @Autowired
    UserService service;
    @Autowired
    HttpSession session;

    //公司注册
    @RequestMapping(value = "/registerUser")
    public String registerUser(@ModelAttribute("data") Organization organization, String callback) {

        Handle addResult = service.registerUser(organization);
        return callback + "(" + JSONValue.toJSONString(addResult) + ")";
    }

    @RequestMapping("/singnOutLogin")
    public String singnOutLogin(HttpServletRequest request, String callback) {
        HttpSession session = request.getSession();
        session.removeAttribute("user");
        return callback + "(" + JSONValue.toJSONString(1) + ")";
    }

    //登录
    @RequestMapping("/getLoginPage")
    public String getLoginPage(@ModelAttribute("data") User user, HttpServletRequest request, String callback) {
        try {
            //user.setPassword(DigestUtils.sha1Hex(user.getPassword()));
            List list = service.getAndVertifyUser(user);
            List resultList = new ArrayList();
            Map<String, Object> result = new HashMap<String, Object>();
            //HttpSession session = request.getSession();
            if (list.size() == 0) {
                //未注册
                result.put("loginResult", "unlogin");
                resultList.add(result);
            } else {
                List<User> dbUser = this.accessAccountUser(list, user);
                if (dbUser.size() == 0) {
                    result.put("loginResult", "0");
                    resultList.add(result);
                } else if (dbUser.size() == 1) {
                    User userInfo = dbUser.get(0);
                    result.put("loginResult", "1");
                    String lastVisitUrl = session.getAttribute("last_visit_url") == null ? null : (String.valueOf(session.getAttribute("last_visit_url")).contains("/pmapi/") ? "/" : String.valueOf(session.getAttribute("last_visit_url")));
                    result.put("last_visit_url", lastVisitUrl);
                    resultList.add(result);
                    resultList.add(userInfo);
                    String sessionId=session.getId();
                    session.setAttribute("user", userInfo);
                    session.removeAttribute("last_visit_url");
                } else {
                    result.put("loginResult", "1");
                    String lastVisitUrl = session.getAttribute("last_visit_url") == null ? null : (String.valueOf(session.getAttribute("last_visit_url")).contains("/pmapi/") ? "/" : String.valueOf(session.getAttribute("last_visit_url")));
                    result.put("last_visit_url", lastVisitUrl);
                    resultList.add(result);
                    resultList.add(dbUser);
                    session.removeAttribute("last_visit_url");
                }
            }
            return callback + "(" + JSONArray.toJSONString(resultList) + ")";
        } catch (Exception e) {
            List resultList = new ArrayList();
            Map<String, Object> result = new HashMap<String, Object>();
            result.put("loginResult", "Network Error ");
            LoggerUtil.errorOut("登录:" + e.getMessage());
            resultList.add(result);
            return callback + "(" + JSONArray.toJSONString(resultList) + ")";
        }

    }

    //判断密码
    public List<User> accessAccountUser(List<User> list, User user) {
        List<User> userList = new ArrayList<>();
        String ipass = DigestUtils.sha1Hex(user.getPassword());
        for (User u : list) {
            if (u.getPassword().equals(ipass)) {
                u.setPassword("");
                userList.add(u);
            }
        }
        return userList;
    }

    @RequestMapping(value = "/selectAccount")
    public String selectAccount(@ModelAttribute("data")User user, HttpServletRequest request,String callback) {
        HttpSession session = request.getSession();
        User userInfo=service.selectAccount(user);
        userInfo.setPassword("");
        session.setAttribute("user", userInfo);
        return callback + "(" + JSONValue.toJSONString(new Handle(1,"",userInfo)) + ")";
    }

    /**
     * 获取验证码(注册)
     */
    @RequestMapping("/toSms")
    public String toSms(@ModelAttribute("data") VerifyCode vc, String callback) {
        String message = service.insertCodeToSms(vc.getVerifyPhone());
        if (!"".equals(message)) {
            return callback + "(" + JSONValue.toJSONString(new Handle(0, message)) + ")";
        } else {
            return callback + "(" + JSONValue.toJSONString(new Handle(1, "发送成功")) + ")";
        }

    }

    //登陆成功后获取当前用户的角色及菜单
    @RequestMapping("/getMenu")
    public String getStaffInfoById(@ModelAttribute("data") User su, String callback) {
        List<Map<String, Object>> list = service.getRootMenu(su);
        return callback + "(" + JSONValue.toJSONString(new Handle(1,"", list)) + ")";
    }

    //登陆成功后获取当前用户的角色及菜单
    @RequestMapping("/addMenu")
    public String insert(@ModelAttribute("data") Menu su, String callback) throws SQLException {
        service.insertMenu(su);
        return callback + "(" + JSONValue.toJSONString(new Handle(1,"", null)) + ")";
    }

}
