package com.system.dao;

import com.common.jdbc.JdbcBase;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.Map;

@Repository
public class SystemDao  extends JdbcBase {
    public List<Map<String,Object>> getSelectOptions(Integer id) {
         String sql=this.getJdbcTemplate().queryForObject("select `sql` from system_sql where id=?",new Object[]{id},String.class);
         return this.getJdbcTemplate().queryForList(sql);
    }
    public List<Map<String,Object>> getRegionList(String address) {
        String sql = "SELECT id,mername,lng,lat,isadd FROM region WHERE mername LIKE CONCAT('%',?,'%')";
        return this.getJdbcTemplate().queryForList(sql,new Object[]{address});
    }
}
