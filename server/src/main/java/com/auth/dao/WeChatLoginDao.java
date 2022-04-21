package com.auth.dao;

import com.auth.entity.Account;
import com.common.jdbc.JdbcBase;
import org.springframework.jdbc.core.BeanPropertyRowMapper;
import org.springframework.stereotype.Repository;

import java.sql.SQLException;
import java.util.List;
import java.util.Map;

/**
 * @author WuDong
 * @date 2020/4/9 15:06
 */

@Repository
public class WeChatLoginDao extends JdbcBase {

    public List<Account> getLogin(Account account){
        String sql="SELECT*FROM account WHERE phone=? AND password=?";
       List<Account> list= this.getJdbcTemplate().query(sql, new Object[]{account.getPhone(), account.getPassword()},new BeanPropertyRowMapper<>(Account.class));
        if(list.size()==0){
            return null;
        }else{
            //判断用户是否为队长或没有加入过团队()
            if(this.getJdbcTemplate().queryForObject("SELECT COUNT(*) FROM team WHERE creator="+list.get(0).getId(),
                    Integer.class)>0||this.getJdbcTemplate().queryForObject("SELECT COUNT(*) FROM team_member WHERE account_id="+list.get(0).getId(),
                    Integer.class)<=0){
                list.get(0).setIsCreateProject(1);
            }else{
                list.get(0).setIsCreateProject(0);
            }

            if(list.get(0).getRoleId()==2){
                list.get(0).setStatus(0);// 普通用户（审核中）
            }else if(list.get(0).getRoleId()==3){
                list.get(0).setStatus(1);// 志愿者（认证已通过）
            }
            return list;
        }
    }


    public int register(Account account) throws SQLException {
        if(this.phoneSole(account.getPhone()).size()>0){
            return -1;
        }else{
            String sql="INSERT INTO account (account_name,phone,`password`)VALUE(?,?,?)";
            int insert = this.insert(sql, new Object[]{account.getAccountName(), account.getPhone(), account.getPassword()});
//            int update = this.getJdbcTemplate().update(sql, new Object[]{account.getAccount_name(), account.getPhone(), account.getPassword()});
            return insert;
        }
    }


    public List<Map<String, Object>> phoneSole(String phone){
            String sql="SELECT*FROM account WHERE phone=?";
        List<Map<String, Object>> list = this.getJdbcTemplate().queryForList(sql, new Object[]{phone});
        return list;
    }



}
