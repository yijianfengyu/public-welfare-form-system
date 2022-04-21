package com.auth.controller;

import com.auth.entity.Contact;
import com.auth.entity.ContactRepeat;
import com.auth.entity.Organization;
import com.auth.entity.User;
import com.auth.service.UserService;
import com.utils.Handle;
import com.utils.Page;
import net.minidev.json.JSONArray;
import net.minidev.json.JSONValue;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.ModelAttribute;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import javax.servlet.http.HttpServletRequest;
import javax.servlet.http.HttpSession;
import java.util.ArrayList;
import java.util.List;
import java.util.Map;

/**
 * Created by dragon_eight on 2018/9/3.
 */
@RestController
@RequestMapping("/user")
public class UserController {
    @Autowired
    UserService service;

    //查询所有员工信息
    @RequestMapping(value = "/getAllUser")
    public String getAllUser(@ModelAttribute("data") User user,HttpServletRequest request, String callback) {
        HttpSession session = request.getSession();
        User userManager= (User) session.getAttribute("user");
        user.setCompanyCode(userManager.getCompanyCode());
        user.setId(userManager.getId());
        user.setRoleType(userManager.getRoleType());
        Page page = service.getAllUser(user);
        return callback + "(" + JSONValue.toJSONString(page) + ")";
    }
    @RequestMapping(value = "/getPersonalCenter")
    public String getPersonalCenter(HttpServletRequest request, String callback) {
        HttpSession session = request.getSession();
        User userManager= (User) session.getAttribute("user");
        Page page = service.getPersonalCenter(userManager);
        return callback + "(" + JSONValue.toJSONString(page) + ")";
    }

    //添加员工
    @RequestMapping(value = "/insertUser")
    public String insertUser(@ModelAttribute("data") User user,HttpServletRequest request, String callback) {
        HttpSession session = request.getSession();
        User userManager= (User) session.getAttribute("user");
        user.setCompanyCode(userManager.getCompanyCode());
        user.setId(userManager.getId());
        user.setRoleType(userManager.getRoleType());
        Handle addResult = service.insertUser(user);
        return callback + "(" + JSONValue.toJSONString(addResult) + ")";
    }

    //修改员工
    @RequestMapping("/updateUser")
    public String updateUser(@ModelAttribute("data") User user, String oldEmail, String oldTel,HttpServletRequest request, String callback) {
        HttpSession session = request.getSession();
        User userManager= (User) session.getAttribute("user");
        user.setCompanyCode(userManager.getCompanyCode());
        user.setRoleType(userManager.getRoleType());
        Handle addResult = service.updateUser(user,oldEmail,oldTel);
        return callback + "(" + JSONValue.toJSONString(addResult) + ")";
    }

    //删除员工
    @RequestMapping("/deleteUser")
    public String deleteUser(@ModelAttribute("data") User user,HttpServletRequest request, String callback) {
        HttpSession session = request.getSession();
        User userManager= (User) session.getAttribute("user");
        user.setCompanyCode(userManager.getCompanyCode());
        Handle addResult = service.deleteUser(user);
        return callback + "(" + JSONValue.toJSONString(addResult) + ")";
    }


    //查询所有联系人
    @RequestMapping("/getAllContact")
    public String getAllContact(@ModelAttribute("data") Contact contact,HttpServletRequest request, String callback) {
        HttpSession session = request.getSession();
        User user= (User) session.getAttribute("user");
        Page page = service.getAllContact(contact,user.getCompanyCode());
        return callback + "(" + JSONValue.toJSONString(page) + ")";
    }

    //添加联系人
    @RequestMapping(value = "/insertContact")
    public String insertContact(@ModelAttribute("data") Contact contact, HttpServletRequest request,String callback) {
        HttpSession session = request.getSession();
        User user= (User) session.getAttribute("user");
        if(user!=null){
            contact.setCompanyCode(user.getCompanyCode());
        }
        Handle addResult = service.insertContact(contact);
        return callback + "(" + JSONValue.toJSONString(addResult) + ")";
    }

    //修改联系人
    @RequestMapping(value = "/updateContact")
    public String updateContact(@ModelAttribute("data") Contact contact,HttpServletRequest request,String callback) {
        HttpSession session = request.getSession();
        User user= (User) session.getAttribute("user");
        contact.setCompanyCode(user.getCompanyCode());
        Handle addResult = service.updateContact(contact);
        return callback + "(" + JSONValue.toJSONString(addResult) + ")";
    }

    //删除联系人
    @RequestMapping(value = "/deleteContact")
    public String deleteContact(@ModelAttribute("data") Contact contact,HttpServletRequest request,String callback) {
        HttpSession session = request.getSession();
        User user= (User) session.getAttribute("user");
        contact.setCompanyCode(user.getCompanyCode());
        Handle addResult = service.deleteContact(contact);
        return callback + "(" + JSONValue.toJSONString(addResult) + ")";
    }

    //查询机构信息
    @RequestMapping(value = "/queryOrganization")
    public String queryOrganization(HttpServletRequest request, String callback) {
        HttpSession session = request.getSession();
        User user= (User) session.getAttribute("user");
        List list = service.queryOrganization(user.getCompanyCode());
        return callback + "(" + JSONValue.toJSONString(list) + ")";
    }

    //修改机构信息
    @RequestMapping(value = "/updateOrganization")
    public String updateOrganization(@ModelAttribute("data") Organization organization,HttpServletRequest request, String callback) {
        HttpSession session = request.getSession();
        User user= (User) session.getAttribute("user");
        organization.setCompanyCode(user.getCompanyCode());
        Handle addResult = service.updateOrganization(organization);
        return callback + "(" + JSONValue.toJSONString(addResult) + ")";
    }

    //查询重复联系人
    @RequestMapping(value = "/queryContactRepeatList")
    public String queryContactRepeatList(@ModelAttribute("data") Contact contact, HttpServletRequest request, String callback){
        HttpSession session = request.getSession();
        User user= (User) session.getAttribute("user");
        List list = service.queryContactRepeatList(contact,user);
        return callback + "(" + JSONValue.toJSONString(list) + ")";
    }

    //查询联系人对应的表单数据
    @RequestMapping(value = "/queryContactTempDataList")
    public String queryContactTempDataList(@ModelAttribute("data") Contact contact, HttpServletRequest request, String callback){
        HttpSession session = request.getSession();
        User user= (User) session.getAttribute("user");
        Page page = service.queryContactTempDataList(contact,user);
        return callback + "(" + JSONValue.toJSONString(page) + ")";
    }

    //下载联系人数据文件
    @RequestMapping("/downloadContactData")
    public String downloadContactData(@ModelAttribute("data") Contact contact,HttpServletRequest request,String callback) {
        String url = "";
        try {
            HttpSession session = request.getSession();
            User user= (User) session.getAttribute("user");
//            System.out.println("columns" + columns);
            url=service.downloadContactData(contact,user);
        } catch (Exception e) {
            e.printStackTrace();
        }
        List list = new ArrayList<String>();
        list.add(url);
        return callback + "(" + JSONValue.toJSONString(list) + ")";
    }
    //查询所有联系人
    @RequestMapping("/queryContactDefineDataList")
    public String queryContactDefineDataList(@ModelAttribute("data") Contact contact,String callback) {
        Page page = service.queryContactDefineDataList(contact);
        return callback + "(" + JSONValue.toJSONString(page) + ")";
    }

}
