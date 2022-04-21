package com.common.jdbc;

import com.utils.*;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.dao.support.DaoSupport;
import org.springframework.expression.ParseException;
import org.springframework.jdbc.CannotGetJdbcConnectionException;
import org.springframework.jdbc.core.BeanPropertyRowMapper;
import org.springframework.jdbc.core.JdbcTemplate;
import org.springframework.jdbc.core.PreparedStatementCreator;
import org.springframework.jdbc.datasource.DataSourceUtils;
import org.springframework.jdbc.support.GeneratedKeyHolder;
import org.springframework.jdbc.support.KeyHolder;
import org.springframework.jdbc.support.SQLExceptionTranslator;

import javax.servlet.http.HttpSession;
import javax.sql.DataSource;
import java.math.BigDecimal;
import java.sql.Connection;
import java.sql.PreparedStatement;
import java.sql.SQLException;
import java.sql.Statement;
import java.text.SimpleDateFormat;
import java.util.Date;
import java.util.List;
import java.util.Map;


public class JdbcBase extends DaoSupport {

    private JdbcTemplate jdbcTemplate;
    private static Object index_lock = new Object();
    private static Object sequence_lock = new Object();
    private HttpSession session;

    public Page queryForPage(String sql, List<String> params, Object obj) {
        return queryForPage(sql, params, ((Model) obj).getCurrentPage(),
                ((Model) obj).getPageSize(), obj.getClass());
    }


    public Page queryForPage(String sql, List<String> params, Integer currentPage, Integer pageSize, Class<?> cls) {
        Page page = new Page();
        String count = "SELECT COUNT(1) num FROM (" + sql + ") r";
        Integer total = this.getJdbcTemplate().queryForObject(count, params.toArray(new Object[params.size()]), Integer.class);
        page.setTotal(total);

        page.setTotalPages(((Integer) total / pageSize) + 1);
        page.setCurrentPage(currentPage);
        page.setPageSize(pageSize);

        sql += " LIMIT " + (currentPage - 1) * pageSize + ", " + pageSize;
        page.setResultList(this.getJdbcTemplate().query(sql, params.toArray(new Object[params.size()]), new BeanPropertyRowMapper(cls)));
        return page;
    }

    public Page queryForPage(String sql, String statisticsSql, List<String> params, Object obj) {
        return queryForPage(sql, statisticsSql, params.toArray(new Object[params.size()]), ((Model) obj).getCurrentPage(), ((Model) obj).getPageSize(), obj.getClass());
    }

    public Page queryForPage(String sql, String statisticsSql, Object[] params, Integer currentPage, Integer pageSize, Class<?> cls) {
        Page page = new Page();
        statisticsSql = "SELECT COUNT(1) total," + statisticsSql + " FROM (" + sql + ") r";
        Map<String, Object> totalResult = this.getJdbcTemplate().queryForMap(statisticsSql, params);
        page.setStatistics(totalResult);
        Integer total = Integer.valueOf(String.valueOf(totalResult.get("total")));
        page.setTotal(total);
        page.setTotalPages((total / pageSize) + 1);
        page.setCurrentPage(currentPage);
        page.setPageSize(pageSize);
        sql += " LIMIT " + (currentPage - 1) * pageSize + ", " + pageSize;
        page.setResultList(this.getJdbcTemplate().query(sql, params, new BeanPropertyRowMapper(cls)));
        return page;
    }


    @Autowired
    public void setDataSource(DataSource dataSource) {
        if (this.jdbcTemplate == null || dataSource != this.jdbcTemplate.getDataSource()) {
            this.jdbcTemplate = createJdbcTemplate(dataSource);
            initTemplateConfig();
        }
    }


    public Long getTableNextId(String table) {
        synchronized (index_lock) {
            List<Map<String, Object>> ls = this.getJdbcTemplate().queryForList(

                    "SHOW TABLE STATUS WHERE NAME= ?", new Object[]{table});
            Long index = null;
            if (ls.size() == 1) {
                Map m = ls.get(0);
                index = Long.valueOf((m.get("Auto_increment").toString()));
            }
            return index;
        }
    }

    /**
     * 精确到月
     * @param str
     * @return
     */
    public String queryNextWillNo(String str) {
        String sql = "SELECT willnextval(?)";
        return this.getJdbcTemplate().queryForObject(sql, new Object[]{str},
                String.class);
    }

    /**
     * 精确到月
     *
     * @param str
     * @return
     */
    public String queryNextNo(String str) {
        synchronized (sequence_lock) {
            String sql = "SELECT nextval(?)";
            return this.getJdbcTemplate().queryForObject(sql, new Object[]{str},
                    String.class);
        }
    }

    /**
     * 精确到日
     *
     * @param str
     * @return
     */
    public String queryNextWillNoDay(String str) {

        return this.willnextvalDay(str);
    }

    private String currval(String seqName) {
        String sql = " SELECT CONCAT(pre_string,SUBSTRING( DATE_FORMAT(CURDATE(), '%Y%m%d%H'),3,4),LPAD(current_value,digit,'0')) " +
                " FROM sequence  WHERE NAME = '" + seqName + "'";
        return this.getJdbcTemplate().queryForObject(sql, String.class);
    }

    private String willnextval(String seqName) {
        String sql = " SELECT CONCAT(pre_string,SUBSTRING( DATE_FORMAT(CURDATE(), '%Y%m%d%H'),3,4),LPAD(current_value+1,digit,'0')) " +
                " FROM sequence  WHERE NAME = '" + seqName + "'";
        return this.getJdbcTemplate().queryForObject(sql, String.class);
    }

    public String nextval(String seqName) {
        String sql = " UPDATE sequence SET current_value = current_value+increment WHERE NAME = '" + seqName + "'";
        this.getJdbcTemplate().update(sql);
        return currval(seqName);
    }

    public String nextvalDay(String seqName) {
        String sql = " UPDATE sequence SET current_value = current_value+increment WHERE NAME = '" + seqName + "'";
        this.getJdbcTemplate().update(sql);
        return currvalDay(seqName);
    }

    private String setval(String seqName, Integer value) {
        String sql = " UPDATE sequence SET current_value = '" + value + "' WHERE NAME = '" + seqName + "';";
        this.getJdbcTemplate().update(sql);
        return currval(seqName);
    }

    private String currvalDay(String seqName) {
        String sql = " SELECT CONCAT(pre_string,SUBSTRING( DATE_FORMAT(CURDATE(), '%Y%m%d%H'),3,6),LPAD(current_value,digit,'0')) " +
                " FROM sequence  WHERE NAME = '" + seqName + "'";
        return this.getJdbcTemplate().queryForObject(sql, String.class);
    }

    private String willnextvalDay(String seqName) {
        String sql = " SELECT CONCAT(pre_string,SUBSTRING( DATE_FORMAT(CURDATE(), '%Y%m%d%H'),3,6),LPAD(current_value+1,digit,'0')) " +
                " FROM sequence  WHERE NAME = '" + seqName + "'";
        return this.getJdbcTemplate().queryForObject(sql, String.class);
    }

    public String getDate() {
        SimpleDateFormat fomat = new SimpleDateFormat("yyyy-MM-dd");
        return fomat.format(new Date());
    }

    public String getDatetime() {
        SimpleDateFormat fomat = new SimpleDateFormat("yyyy-MM-dd HH:mm:ss");
        return fomat.format(new Date());
    }

    public Integer getStockNextIndex(String table) {
        synchronized (index_lock) {
            List<Map<String, Object>> ls = this.getJdbcTemplate().queryForList(
                    "SHOW TABLE STATUS WHERE NAME= ?", new Object[]{table});
            Integer index = 0;
            if (ls.size() == 1) {
                Map m = ls.get(0);
                index = Integer.parseInt(m.get("Auto_increment").toString());
            }
            return index;
        }
    }

    public Integer getStockNextIndex(String clolumnName, String table) {
        synchronized (index_lock) {
            List<Map<String, Object>> ls = this.getJdbcTemplate().queryForList(
                    "SHOW TABLE STATUS WHERE NAME= ?", new Object[]{table});
            Integer index = 0;
            if (ls.size() == 1) {
                Map m = ls.get(0);
                index = Integer.parseInt(m.get("Auto_increment").toString());
            }
            return index;
        }
    }

    protected JdbcTemplate createJdbcTemplate(DataSource dataSource) {
        return new JdbcTemplate(dataSource);
    }

    /**
     * Return the JDBC DataSource used by this DAO.
     */
    public final DataSource getDataSource() {
        return (this.jdbcTemplate != null ? this.jdbcTemplate.getDataSource() : null);
    }


    public final void setJdbcTemplate(JdbcTemplate jdbcTemplate) {
        this.jdbcTemplate = jdbcTemplate;
        initTemplateConfig();
    }


    public final JdbcTemplate getJdbcTemplate() {
        return this.jdbcTemplate;
    }


    protected void initTemplateConfig() {
    }

    @Override
    protected void checkDaoConfig() {
        if (this.jdbcTemplate == null) {
            throw new IllegalArgumentException("'dataSource' or 'jdbcTemplate' is required");
        }
    }


    protected final SQLExceptionTranslator getExceptionTranslator() {
        return getJdbcTemplate().getExceptionTranslator();
    }


    protected final Connection getConnection() throws CannotGetJdbcConnectionException {
        return DataSourceUtils.getConnection(getDataSource());
    }


    protected final void releaseConnection(Connection con) {
        DataSourceUtils.releaseConnection(con, getDataSource());
    }

    protected boolean vertify(String str) {
        return null == str || "".equals(str) ? false : true;
    }

    protected boolean vertify(Integer str) {
        return null == str ? false : true;
    }

    protected boolean vertify(Long str) {
        return null == str ? false : true;

    }

    protected boolean vertify(BigDecimal str) {
        if (null == str) {
            return false;
        }
        BigDecimal mid = str.setScale(4, BigDecimal.ROUND_HALF_UP);
        return 0 == mid.doubleValue() ? false : true;
    }

    protected boolean vertify(Date str) {
        return null == str ? false : true;
    }

    /**
     * 插入数据并返回数据ID
     * @param insertSql
     * @param params
     * @return
     * @throws SQLException
     * @throws ParseException
     */
    public int insert(String insertSql,List<String> params) throws SQLException,ParseException
    {
        KeyHolder keyHolder = new GeneratedKeyHolder();
        getJdbcTemplate().update(
                new PreparedStatementCreator() {
                    public PreparedStatement createPreparedStatement(Connection con) throws SQLException
                    {

                        PreparedStatement ps = con.prepareStatement(insertSql, Statement.RETURN_GENERATED_KEYS);
                        for(int i=0;i<params.size();i++) {
                            ps.setString(i+1, params.get(i));
                        }

                        return ps;
                    }
                }, keyHolder);

        return keyHolder.getKey().intValue();
    }

    /**
     * 插入数据并返回数据ID
     * @param insertSql
     * @param params
     * @return
     * @throws SQLException
     * @throws ParseException
     */
    public int insert(String insertSql,Object[] params) throws SQLException,ParseException
    {
        KeyHolder keyHolder = new GeneratedKeyHolder();
        getJdbcTemplate().update(
                new PreparedStatementCreator() {
                    public PreparedStatement createPreparedStatement(Connection con) throws SQLException
                    {

                        PreparedStatement ps = con.prepareStatement(insertSql, Statement.RETURN_GENERATED_KEYS);
                        for(int i=0;i<params.length;i++) {
                            ps.setString(i+1, params[i]==null?null:params[i].toString());
                        }

                        return ps;
                    }
                }, keyHolder);

        return keyHolder.getKey().intValue();
    }


    public void updateAnswerProjectId(String projectId, String uuid) {
        String sql="UPDATE `project_exam_answer` p " +
                "SET p.projectId=? " +
                "WHERE p.`answerUserUUID`=?;";
        this.getJdbcTemplate().update(sql,new Object[]{projectId,uuid});
    }
}
