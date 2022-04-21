package com.auth.dao;

import com.auth.entity.Account;
import com.auth.entity.WechatAccount;
import com.common.jdbc.JdbcBase;
import com.utils.Page;
import org.springframework.stereotype.Repository;

import java.util.ArrayList;
import java.util.List;

@Repository
public class AccountDao extends JdbcBase {
    public Page queryAccount(WechatAccount e) {
        List params = new ArrayList();
        String sql = "SELECT r.*,t.`name` teamName,t.`state` teamState,\n" +
                " t.`password` teamPassword,t.`team_no` teamNo,pp.`name` partnerName,pp.`id` partnerId FROM `t_auth_user` r \n" +
                " LEFT JOIN `sales_team_member` m ON r.`id`= m.`auth_user_id` \n" +
                " LEFT JOIN `sales_team` t ON m.`team_id`=t.`id`  \n" +
                " LEFT JOIN `sales_partner_r_user` pu ON r.`id`=pu.`user_id`\n" +
                " LEFT JOIN `sales_partner` pp ON pu.`sp_id`=pp.`id`  where 1=1 ";
        if (null != e.getName()&& !"".equals(e.getName())) {
            sql += " AND r.name like concat('%',?,'%') ";
            params.add(e.getName());
        }
        if (null != e.getPhone()&& !"".equals(e.getPhone())) {
            sql += " AND r.phone like concat('%',?,'%') ";
            params.add(e.getPhone());
        }
        if (null != e.getTeamName()&& !"".equals(e.getTeamName())) {
            sql += " AND t.`name` like concat('%',?,'%') ";
            params.add(e.getTeamName());
        }

        sql += " GROUP BY r.id ORDER BY r.id DESC ";
        Page page = this.queryForPage(sql, params,e.getCurrentPage(), 10, WechatAccount.class);
        return page;
    }

    public void updateUserPartner(String userId, String partnerId) {
        String parterName=this.getJdbcTemplate().queryForObject(" SELECT `name` FROM `sales_partner` WHERE id=?"
        ,new Object[]{partnerId},String.class);
        this.getJdbcTemplate().update("UPDATE t_auth_user t SET t.organId=?,t.`partnerName`=? WHERE AND t.id=?"
        ,new Object[]{partnerId,parterName,userId});
    }
}
