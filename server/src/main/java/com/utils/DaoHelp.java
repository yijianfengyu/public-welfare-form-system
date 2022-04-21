package com.utils;

import java.lang.reflect.Field;
import java.lang.reflect.InvocationTargetException;
import java.sql.ResultSet;
import java.sql.SQLException;
import java.text.ParseException;
import java.text.SimpleDateFormat;
import java.util.*;

//import com.pi.entity.PiItem;
import org.apache.log4j.Logger;
import org.springframework.jdbc.core.BeanPropertyRowMapper;
import org.springframework.jdbc.core.RowCallbackHandler;
import org.springframework.jdbc.core.RowMapper;
import org.springframework.jdbc.core.support.JdbcDaoSupport;
import org.springframework.stereotype.Component;
import org.springframework.stereotype.Repository;
import org.springframework.transaction.annotation.Transactional;


public class DaoHelp extends JdbcDaoSupport {

    /**
     * 获取Pagination
     *
     * @param sql
     * @param params
     * @param cls
     * @param
     * @return
     */
    public Pagination queryForPagination(String sql, Object[] params,
                                         Class<?> cls, Pagination pagination) {

        int currencylPages = pagination.getCurrencylPages();
        int pageSize = pagination.getPageSize();

        int from = (currencylPages - 1) * pageSize;
        int size = 0;
        if (params.length == 0) {
            size = this.getJdbcTemplate().queryForObject("SELECT COUNT(1) FROM (" + sql + ") r", Integer.class);
        } else {
            size = this.getJdbcTemplate().queryForObject("SELECT COUNT(1) FROM (" + sql + ") r", Integer.class, params);
        }

        pagination.setDataTotalSize(size);
        int pagesSize = size / pagination.getPageSize() + 1;
        pagination.setTotalPages(pagesSize);
        sql += " LIMIT " + from + "," + pageSize;
        pagination.setResultList(this.getJdbcTemplate().query(sql, params,
                new BeanPropertyRowMapper(cls)));

        return pagination;
    }

    /**
     * 查找应用系统参数键值对
     *
     * @param codeTable  所属于表
     * @param codeColumn 列名
     * @return
     */
    public List<Map<String, String>> querysKeyValue(String codeTable,
                                                    String codeColumn) {
        String sql = "SELECT code_name , " + " code_name_en, " + " code_value "
                + " FROM " + " sys_domain "
                + " WHERE code_table=? AND code_column=?";
        final List<Map<String, String>> results = new ArrayList<Map<String, String>>();
        // 添加首个空的值
        Map<String, String> empty = new HashMap<String, String>();
        empty.put("key", "");
        empty.put("value", "");
        results.add(empty);
        class handler implements RowCallbackHandler {
            public void processRow(ResultSet rs) throws SQLException {
                Map<String, String> priceType = new HashMap<String, String>();
                priceType.put("key", rs.getString("code_name_en"));
                priceType.put("value", rs.getString("code_value"));
                results.add(priceType);
            }
        }
        this.getJdbcTemplate().query(sql,
                new Object[]{codeTable, codeColumn}, new handler());
        return results;
    }

    public static Object getFirstObject(List list) {
        if (list.size() > 0) {
            return list.get(0);
        } else {
            return null;
        }

    }

    /**
     * 将list转化为数据库使用的Object[]对象，以便于动态的修改查询sql语句
     *
     * @param
     * @return
     */
    public static Object[] listToStringArray(List<String> params) {
        if (null == params || params.size() == 0) {
            return new Object[]{};
        } else {
            Object[] strs = new Object[params.size()];
            for (int i = 0; i < params.size(); i++) {
                strs[i] = params.get(i);
            }
            return strs;
        }
    }

    /**
     * 将list转化为数据库使用的Object[]对象，以便于动态的修改查询sql语句
     *
     * @param
     * @return
     */
    public static Object[] listToStringArrayNull(List<String> params) {
        if (null == params || params.size() == 0) {
            return new Object[]{};
        } else {
            Object[] strs = new Object[params.size()];
            for (int i = 0; i < params.size(); i++) {
                strs[i] = "".equals(params.get(i).trim()) ? null : params
                        .get(i).trim();
            }
            return strs;
        }
    }


    public String currval(String seqName) {
        String sql = " SELECT CONCAT(pre_string,SUBSTRING( DATE_FORMAT(CURDATE(), '%Y%m%d%H'),3,4),LPAD(current_value,digit,'0')) "
                + " FROM sequence  WHERE NAME = '" + seqName + "'";
        return this.getJdbcTemplate().queryForObject(sql, String.class);
    }

    public String willnextval(String seqName) {
        String sql = " SELECT CONCAT(pre_string,SUBSTRING( DATE_FORMAT(CURDATE(), '%Y%m%d%H'),3,4),LPAD(current_value+1,digit,'0')) "
                + " FROM sequence  WHERE NAME = '" + seqName + "'";
        return this.getJdbcTemplate().queryForObject(sql, String.class);
    }

    public String nextval(String seqName) {
        String sql = " UPDATE sequence SET current_value = current_value+increment WHERE NAME = '"
                + seqName + "'";
        this.getJdbcTemplate().update(sql);
        return currval(seqName);
    }

    public String nextvalDay(String seqName) {
        String sql = " UPDATE sequence SET current_value = current_value+increment WHERE NAME = '"
                + seqName + "'";
        this.getJdbcTemplate().update(sql);
        return currvalDay(seqName);
    }

    public String setval(String seqName, int value) {
        String sql = " UPDATE sequence SET current_value = '" + value
                + "' WHERE NAME = '" + seqName + "';";
        this.getJdbcTemplate().update(sql);
        return currval(seqName);
    }

    public String currvalDay(String seqName) {
        String sql = " SELECT CONCAT(pre_string,SUBSTRING( DATE_FORMAT(CURDATE(), '%Y%m%d%H'),3,6),LPAD(current_value,digit,'0')) "
                + " FROM sequence  WHERE NAME = '" + seqName + "'";
        return this.getJdbcTemplate().queryForObject(sql, String.class);
    }

    public String willnextvalDay(String seqName) {
        String sql = " SELECT CONCAT(pre_string,SUBSTRING( DATE_FORMAT(CURDATE(), '%Y%m%d%H'),3,6),LPAD(current_value+1,digit,'0')) "
                + " FROM sequence  WHERE NAME = '" + seqName + "'";
        return this.getJdbcTemplate().queryForObject(sql, String.class);
    }

    public List<Map<String, Object>> queryUserMenus(int userId)
            throws Exception {
        String sql = "SELECT r.menu_id id, r.user_id userId, r.display display,n.parent_id parentId,"
                + " n.label label,n.data DATA,n.enable ENABLE , n.role role"
                + " FROM (SELECT m.* FROM menu_user m LEFT JOIN staff s ON s.staff_id = m.user_id WHERE s.staff_id = ?) r "
                + "LEFT JOIN menu n ON r.menu_id= n.id WHERE 1=1 ORDER BY label DESC";

        return this.getJdbcTemplate()
                .queryForList(sql, new Object[]{userId});
    }

    public Map<String, String> filterDataAuthority(
            Map<String, String> tableColumns) {
        // @@在这里搜索权限，并过滤掉超出权限的列
        return tableColumns;
    }

    /**
     * 精确到月
     *
     * @param str
     * @return
     */
    public String queryNextWillNo(String str) {
        String sql = "SELECT willnextval(?)";
        return this.getJdbcTemplate().queryForObject(sql, new Object[]{str},
                String.class);
    }

    //格式化时间  年月日

    public static String simpleDateFormat(String date, String matter) {
        if (null != date && !"".equals(date)) {
            SimpleDateFormat formats = new SimpleDateFormat(matter);
            try {
                return formats.format(formats.parse(date));
            } catch (Exception e) {
                LoggerUtil.infoOut("SimpleDateFormatException:" + e.getMessage());
                return date;
            }
        }
        return date;
    }

}
