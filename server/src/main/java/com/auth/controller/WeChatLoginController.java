package com.auth.controller;

import com.auth.entity.Account;
import com.auth.service.WeChatLoginService;
import com.utils.Handle;
import net.minidev.json.JSONValue;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.CrossOrigin;
import org.springframework.web.bind.annotation.ModelAttribute;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import javax.servlet.http.HttpServletRequest;
import javax.servlet.http.HttpSession;
import java.sql.SQLException;
import java.util.List;

/**
 * @author WuDong
 * @date 2020/4/9 14:59
 */

@RestController
@RequestMapping("/wechatLogin")
@CrossOrigin
public class WeChatLoginController {

        @Autowired
    WeChatLoginService service;

    /**
     *  登录
     * @param account
     * @return
     */
    @RequestMapping("/getLogin")
        public String getLogin(@ModelAttribute("data") Account account,HttpServletRequest request){
        List<Account> login = this.service.getLogin(account);
        if(login==null){
                return JSONValue.toJSONString(new Handle(0,"账号或密码错误",login));
            }else{
            HttpSession session= request.getSession();
            session.setAttribute("account",login.get(0));
            login.get(0).setOpenId(session.getId());
                return JSONValue.toJSONString(new Handle(1,"登录成功",login.get(0)));
            }
        }

    /**
     *  注册
     * @param account
     * @return
     */
    @RequestMapping("/register")
    public String register(Account account,HttpServletRequest request) throws SQLException {
        int register = this.service.register(account);
        if(register>0){
            this.getLogin(account,request);
            account.setRoleId(2);//默认为普通用户
            account.setId(register); //写入用户id并返回
            return JSONValue.toJSONString(new Handle(1,"注册成功",account));
        }else if(register==-1){
            return JSONValue.toJSONString(new Handle(-1,"手机号已被使用",register));
        }else {
            return JSONValue.toJSONString(new Handle(0,"注册失败",register));
        }
    }






}
