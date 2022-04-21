package com.auth.service;

import com.auth.dao.AccountDao;
import com.auth.dao.UserDao;
import com.auth.entity.*;
import com.fasterxml.jackson.core.JsonProcessingException;
import com.fasterxml.jackson.databind.ObjectMapper;
import com.utils.Handle;
import com.utils.Page;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.sql.SQLException;
import java.util.ArrayList;
import java.util.List;
import java.util.Map;

/**
 * Created by dragon_eight on 2018/9/3.
 */
@Service
public class AccountService {
    @Autowired
    AccountDao dao;

    public Page queryAccount(WechatAccount account) {
        return dao.queryAccount(account);
    }

    public void updateUserPartner(String userId,String partnerId ) {
         dao.updateUserPartner(userId,partnerId);
    }
}
