package com.auth.controller;

import com.auth.entity.Account;
import com.auth.entity.WechatAccount;
import com.auth.service.AccountService;
import com.auth.service.WeChatService;
import com.utils.Page;
import net.minidev.json.JSONValue;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.CrossOrigin;
import org.springframework.web.bind.annotation.ModelAttribute;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

@RestController
@CrossOrigin
@RequestMapping("/account")
public class AccountController {
    @Autowired
    AccountService service;

    /**
     * 查询通过网络注册的用户
     * @param account
     * @param callback
     * @return
     */
    @RequestMapping(value = "/queryAccount")
    public String queryList(@ModelAttribute("data") WechatAccount account, String callback) {
        Page page = service.queryAccount(account);
        return callback + "(" + JSONValue.toJSONString(page) + ")";
    }
    /**
     * 查询通过网络注册的用户
     * @param userId
     * @param partnerId
     * @param callback
     * @return
     */
    @RequestMapping(value = "/updateUserPartner")
    public String updateUserPartner(String userId,String partnerId, String callback) {
        service.updateUserPartner(userId,partnerId);
        return callback + "(" + JSONValue.toJSONString("") + ")";
    }
}
