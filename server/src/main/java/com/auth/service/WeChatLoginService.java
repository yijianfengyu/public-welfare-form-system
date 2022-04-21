package com.auth.service;

import com.auth.dao.WeChatLoginDao;
import com.auth.entity.Account;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.sql.SQLException;
import java.util.List;

/**
 * @author WuDong
 * @date 2020/4/9 15:06
 */

@Service
public class WeChatLoginService {

    @Autowired
    WeChatLoginDao dao;

    public List<Account> getLogin(Account account){
      return   this.dao.getLogin(account);
    }

    public int register(Account account) throws SQLException {
            return this.dao.register(account);
    }

}
