package com.auth.dao;

import com.auth.entity.*;
import com.common.jdbc.JdbcBase;
import com.projectManage.dao.TempTableDao;
import com.projectManage.entity.Project;
import com.projectManage.entity.*;
import com.utils.*;
import net.minidev.json.JSONValue;
import net.sf.json.JSONArray;
import net.sf.json.JSONObject;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.jdbc.core.BeanPropertyRowMapper;
import org.springframework.stereotype.Repository;

import java.math.RoundingMode;
import java.sql.SQLException;
import java.text.NumberFormat;
import java.util.*;


/**
 * Created by Administrator on 2019/1/8.
 */
@Repository
public class WeChatApiDao extends JdbcBase {


    @Autowired
    private TempTableDao td;

    public Page queryUserProject(Integer currentPage, User user) {
        List<String> params = new ArrayList<String>();
        params.add(String.valueOf(user.getId()));
        String sql = "SELECT p.*,IF(IFNULL(p.actualEndTime,NOW())>p.expectedEndTime,'YES','NO') isOverdue,IF((SELECT MAX(createDate) FROM project_daily d WHERE d.projectId=p.id)\n" +
                ">=IFNULL((SELECT currenTime FROM project_daily_his n WHERE n.projectId=p.`id` AND n.uid=" + user.getId() + "),'0000-00-00'),'YES','NO') renewal\n" +
                "FROM project_data p WHERE `status`<>'Cancel' AND executor=? ORDER BY `status`,updateDate DESC ";
        return this.queryForPage(sql, params, currentPage, 10, Project.class);
    }


    //验证并且获得员工相关信息
    public List getAndVertifyStaff(User user) {
        String sql = "SELECT u.id,u.userName,u.password,u.tel,u.email,u.createDate,u.updateDate,u.roleId,u.status,u.companyCreator,r.roleName,r.roleType,orz.logo,orz.companyName,orz.companyCode FROM system_user u INNER JOIN system_role r ON u.roleID = r.id INNER JOIN system_organization orz ON u.companyCode=orz.companyCode WHERE 1=1 ";
        if (user.getTel() != null && !"".equals(user.getTel())) {
            Boolean flag = user.getTel().indexOf("@") >= 0 ? true : false;
            if (flag) {
                //邮箱登录
                sql += " AND u.email='" + user.getTel() + "'";
            } else {
                //手机登陆
                sql += " AND u.tel='" + user.getTel() + "'";
            }
//            sql += " AND u.password ='"+user.getPassword()+"'";
        } else {
            sql += " AND u.unionId='" + user.getUnionId() + "'";
        }
        List list = this.getJdbcTemplate().query(sql, new BeanPropertyRowMapper(User.class));
        return list;
    }

    //添加日志
    public Handle createProjectDaily(Daily daily, String companyCode) {
        String sql = "INSERT INTO project_daily (projectId, content,createId,createName,createDate,updateDate,projectPath,groupId,`uuid`)VALUES(?,?,?,?,NOW(),NOW(),?,?,?)";
        List<String> params = new ArrayList<>();
        params.add(daily.getProjectId());
        params.add(daily.getContent());
        params.add(daily.getCreateId());
        params.add(daily.getCreateName());
        params.add(daily.getProjectPath());
        params.add(daily.getGroupId());
        params.add(daily.getUuid());
        int id = 0;
        try {
            id = this.insert(sql, params);
        } catch (Exception e) {
            e.printStackTrace();
            System.out.println(e);
        }
        if (id > 0) {
            //更新修改项目时间
            this.updateProjectUpdateDate(daily.getProjectId(), companyCode);
            return new Handle(1, "操作成功", id);
        } else {
            return new Handle(0, "操作失败，请稍后重试");
        }

    }

    //修改日志
    public Handle updateProjectDaily(Daily daily, String companyCode) {
        String sql = "UPDATE project_daily SET content=?, updateDate=NOW() WHERE id=? ";
        int flag = this.getJdbcTemplate().update(sql, new Object[]{daily.getContent(), daily.getId()});
        if (flag > 0) {
            //更新修改项目时间
            this.updateProjectUpdateDate(daily.getProjectId(), companyCode);
        }
        return CommonUtils.getHandle(flag);
    }

    //更新修改项目时间
    public int updateProjectUpdateDate(String projectId, String companyCode) {
        String sql = "UPDATE project_data SET updateDate=NOW() WHERE id =? AND companyCode = ? ";
        return this.getJdbcTemplate().update(sql, new Object[]{projectId, companyCode});
    }

    //绑定账号
    public int updateUuid(User user) {
        String sql = "UPDATE system_user SET avatarUrl=? ,nickName=? , unionId=? WHERE id =? AND companyCode = ?";
        return this.getJdbcTemplate().update(sql, new Object[]{user.getAvatarUrl(), user.getNickName(), user.getUnionId(), user.getId(), user.getCompanyCode()});
    }

    public Page queryProjectDaily(Daily daily, Integer parentId, Integer currentPage) {
        String sql = "SELECT y.*,a.projectName FROM project_daily y LEFT JOIN project_data a ON y.projectId=a.id where 1=1 ";
        List params = new ArrayList();
        if (parentId == 0) {
            sql += " AND y.groupId =?";
            params.add(daily.getGroupId());
        } else {
            sql += " AND y.projectId =?";
            params.add(daily.getProjectId());
        }
        sql += " order by y.updateDate desc";

        return this.queryForPage(sql, params, currentPage, 5, Daily.class);
    }

    //首页资源 (相关文档)查询
    public Page dashboardQueryProjectResources(Integer currentPage, ProjectResource pr) {
        List params = new ArrayList();
        String sql = " SELECT pr.* FROM project_resources pr WHERE 1=1";
        if (null != pr.getProjectId() && !"".equals(pr.getProjectId())) {
            sql += " AND pr.projectId=? ";
            params.add(pr.getProjectId());
        }
        sql += " GROUP BY pr.id ORDER BY pr.updateDate DESC ";
        return this.queryForPage(sql, params, currentPage, 5, ProjectResource.class);
    }

    public Page queryTempTable(Template template, Integer currentPage, User user) {
        List<String> params = new ArrayList<String>();
        String sql = "SELECT pd.*,(SELECT id FROM project_focus f WHERE f.projectId=pd.id AND TYPE='form') focusId, (SELECT COUNT(*) FROM project_define_data pdd WHERE pdd.define_id = pd.id)AS dataCounts  FROM project_define pd WHERE 1=1 AND pd.companyCode=? ";

        params.add(user.getCompanyCode());
        //不是admin时，只查项目为自己负责或者可视人里面有自己的表单
        if (!"admin".equals(user.getRoleType())) {
            sql += " AND (pd.id IN(SELECT id FROM project_define WHERE creator=?) or viewPeople like ? or viewPeople='All' ) ";
            params.add(user.getId());
            params.add("%".concat(user.getId()).concat("%"));
        }

        if (this.vertify(template.getFormTitle())) {
            sql += " AND pd.formTitle LIKE ?";
            params.add("%" + template.getFormTitle() + "%");
        }
        if (this.vertify(template.getCreator())) {
            sql += " AND pd.creator LIKE ?";
            params.add("%" + template.getCreator() + "%");
        }
        if (this.vertify(template.getDateCreated())) {
            sql += " AND pd.dateCreated LIKE CONCAT('%',?,'%') ";
            params.add(template.getDateCreated());
        }
        sql += " ORDER BY pd.dateCreated DESC";
        Page page = this.queryForPage(sql, params, currentPage, 10, Template.class);
        List<?> templateList = page.getResultList();
        for (int i = 0; i < templateList.size(); i++) {
            //首次查表单时拼接固定参数
            TablesUtil.firstAddDefine((Template) templateList.get(i));
        }

        return page;
    }

    public Page queryAllTempDataByDefineId(String define_id, Integer pageSize, Integer currentPage) {
        Template temp = td.queryTempTableById(Long.valueOf(define_id));
        TablesUtil.firstAddDefine(temp);
        TemplateTableRow templateTableRow = new TemplateTableRow();
        templateTableRow.setDefine(temp.getDefine());
        templateTableRow.setPageSize(pageSize);
        templateTableRow.setCurrentPage(currentPage);
        //allOrPage 区分查所有或者分页
        return td.queryAllTempDataByPage(temp);
    }


    //修改进度
    public Handle insertProjectProgress(ProjectProgress projectProgress, User user) {
        String sql = "INSERT INTO project_progress (projectId,remark,projectProgress,createDate,updateDate)VALUES(?,?,?,NOW(),NOW())";
        List<String> params = new ArrayList<>();
        params.add(projectProgress.getProjectId());
        params.add(projectProgress.getRemark());
        params.add(projectProgress.getProjectProgress());
        Project p = new Project();
        if (projectProgress.getProjectProgress().equals("100")) {
            p.setStatus("Completed");
        }
        p.setId(projectProgress.getProjectId());
        p.setCompanyCode(user.getCompanyCode());
        p.setProjectProgress(projectProgress.getProjectProgress());
        int update = this.updateProject(p);
        int id = 0;
        ProjectProgress pp = this.querysRemark(projectProgress);
        System.out.println("pp:" + pp.getId());
        if (pp.getId() != 0) {
            String updatesql = "UPDATE project_progress SET remark=?,updateDate=NOW() WHERE id=?";
            id = this.getJdbcTemplate().update(updatesql, new Object[]{projectProgress.getRemark(), pp.getId()});
        } else {
            try {
                id = this.insert(sql, params);
            } catch (Exception e) {
                e.printStackTrace();
                System.out.println(e);
            }
        }
        Map<Object, Object> map = new HashMap();
        map.put("id", id);
        if (update > 0) {
            return new Handle(1, "修改成功", map);
        } else {
            return new Handle(2, "修改失败", map);
        }
    }

    public int updateProject(Project p) {
        String sql = "";
        int i = -1;
        if (!this.vertify(p.getStatus())) {
            sql = "UPDATE project_data SET projectProgress=?,updateDate=NOW() WHERE id =? AND companyCode = ? ";
            i = this.getJdbcTemplate().update(sql, new Object[]{p.getProjectProgress(), p.getId(), p.getCompanyCode()});
        } else {
            sql = "UPDATE project_data SET projectProgress=?,status=?,updateDate=NOW() WHERE id =? AND companyCode = ? ";
            i = this.getJdbcTemplate().update(sql, new Object[]{p.getProjectProgress(), p.getStatus(), p.getId(), p.getCompanyCode()});
        }
        return i;
    }

    //跟据id查询备注
    public ProjectProgress querysRemark(ProjectProgress projectProgress) {
        String sql = "SELECT * FROM project_progress WHERE projectId=? and projectProgress=?";
        List<ProjectProgress> result = this.getJdbcTemplate().query(sql, new Object[]{projectProgress.getProjectId(), projectProgress.getProjectProgress()}, new BeanPropertyRowMapper<>(ProjectProgress.class));
        if (result.size() > 0) {
            return result.get(0);
        } else {
            return new ProjectProgress();
        }
    }

    //跟据id查询进度
    public List<ProjectProgress> querysProjectProgress(ProjectProgress projectProgress) {
        String sql = "SELECT * FROM project_progress WHERE projectId=? ORDER BY projectProgress ASC";
        return this.getJdbcTemplate().query(sql, new Object[]{projectProgress.getProjectId()}, new BeanPropertyRowMapper<>(ProjectProgress.class));
    }

    public Page queryFocusProject(Integer currentPage, User user) {
        List<String> params = new ArrayList<String>();
        String sql = "SELECT DISTINCT p.*,f.id AS focusId,IF(IFNULL(p.actualEndTime,NOW())>p.expectedEndTime,'YES','NO') isOverdue,\n" +
                "IF((SELECT MAX(createDate) FROM project_daily d WHERE d.projectId=p.id)\n" +
                ">=IFNULL((SELECT currenTime FROM project_daily_his n WHERE n.projectId=p.`id` AND n.uid=" + user.getId() + "),'0000-00-00'),'YES','NO') renewal \n" +
                "FROM project_focus f,project_data p \n" +
                "WHERE f.projectId=p.id AND f.type='project' \n" +
                "AND p.`status`<>'Cancel' "; // AND p.parentid=0
        sql += " AND p.companyCode=?";
        params.add(String.valueOf(user.getCompanyCode()));
        sql += " AND f.userId=?";
        params.add(String.valueOf(user.getId()));
        sql += " ORDER BY p.`status`,p.updateDate DESC ";
        return this.queryForPage(sql, params, currentPage, 10, Project.class);
//        return this.queryForPage(sql, params, currentPage, 10, Project.class).getResultList();
    }

    public Page queryFocusFrom(Template template, Integer currentPage, User user) {
        List<String> params = new ArrayList<String>();
        String sql = "SELECT DISTINCT p.*,f.id AS focusId,(SELECT COUNT(*) FROM project_define_data pdd WHERE pdd.define_id = p.id)AS dataCounts FROM project_focus f,project_define p \n" +
                "WHERE f.projectId=p.id AND f.type='form'";
        if (this.vertify(template.getFormTitle())) {
            sql += " AND p.formTitle LIKE ?";
            params.add("%" + template.getFormTitle() + "%");
        }
        sql += " AND p.companyCode=?";
        params.add(String.valueOf(user.getCompanyCode()));
        sql += " AND f.userId=?";
        params.add(String.valueOf(user.getId()));
        sql += " ORDER BY p.dateUpdated DESC ";

        return this.queryForPage(sql, params, currentPage, 10, Template.class);
    }

    public Page queryNewDaliy(Daily daily, User user) {
        String sql = "SELECT pda.*,pd.projectName  FROM  project_daily pda  \n" +
                "LEFT JOIN project_data pd ON pda.`projectId`=pd.`id`\n" +
                "WHERE  pd.`companyCode`=?\n";

        List params = new ArrayList();
        params.add(user.getCompanyCode());
        if (daily.getCreateId() != null && daily.getCreateId() != "") {
            sql += " AND pda.createId=? ";
            params.add(daily.getCreateId());
        }
        if (daily.getUpdateDate() != null && daily.getUpdateDate() != "") {
            sql += " AND DATE_FORMAT(pda.updateDate,'%Y-%m-%d')=? ";
            params.add(daily.getUpdateDate());
        }
        sql += "ORDER BY pda.updateDate DESC";
        Page page = this.queryForPage(sql, params, daily.getCurrentPage(), 10, Daily.class);
        List<Daily> dailies = (List<Daily>) page.getResultList();
        for (int i = 0; i < dailies.size(); i++) {
            int dailyCommentCounts = this.queryDailyCommentCounts(dailies.get(i).getId().toString());
            dailies.get(i).setDailyCommentCounts(dailyCommentCounts);
        }

        return page;
    }

    //今日缺日志数量p
    public List<Project> querysLackOfLogCount(User user) {
        String sql = "SELECT pd.*, COUNT(pda.id) cp  FROM  project_data pd  \n" +
                "LEFT JOIN project_daily pda ON pd.`id`=pda.`projectId` \n" +
                "AND pda.`createDate`>= DATE(NOW()) AND pda.`createDate` < DATE_ADD(DATE(NOW()),INTERVAL 1 DAY)\n" +
                "WHERE pd.`executor`=? AND pd.`status`<>'Completed' GROUP BY pd.id HAVING cp =0";
        return this.getJdbcTemplate().query(sql, new Object[]{user.getId()}, new BeanPropertyRowMapper<>(Project.class));
    }

    public Map<Object, Object> logProfile(Project p, User u) {
        Map<Object, Object> map = new HashMap();
        String viewPeople = p.getViewPeople();
        int num = 0;
        if (viewPeople.equals("All")) {
            String sqlOne = "SELECT id FROM system_user WHERE companyCode=?";
            List<User> listTwo = this.getJdbcTemplate().query(sqlOne, new Object[]{u.getCompanyCode()}, new BeanPropertyRowMapper<>(User.class));
            map.put("participant", listTwo.size());
            map.put("toWeekCount", listTwo.size() * 5);
            String[] strings = new String[]{};
            if (listTwo.size() > 0) {
                for (User s : listTwo) {
                    String sqlTwo = "SELECT *  FROM project_daily WHERE createId=? AND projectId=? AND createDate>= DATE(NOW()) AND createDate < DATE_ADD(DATE(NOW()),INTERVAL 1 DAY)";
                    List<Daily> listDaily = this.getJdbcTemplate().query(sqlTwo, new Object[]{s.getId(), p.getId()}, new BeanPropertyRowMapper<>(Daily.class));
                    if (listDaily.size() <= 0) {
                        num = num + 1;
                    } else {
                        continue;
                    }
                }
            }
        } else {
            String[] strings = viewPeople.split(",");
            map.put("participant", strings.length);
            map.put("toWeekCount", strings.length * 5);
            for (String s : strings) {
                String sqlTwo = "SELECT *  FROM project_daily WHERE createId=? AND projectId=? AND createDate>= DATE(NOW()) AND createDate < DATE_ADD(DATE(NOW()),INTERVAL 1 DAY)";
                List<Daily> listDaily = this.getJdbcTemplate().query(sqlTwo, new Object[]{s, p.getId()}, new BeanPropertyRowMapper<>(Daily.class));
                if (listDaily.size() <= 0) {
                    num = num + 1;
                } else {
                    continue;
                }
            }
        }
        String sqlTree = "SELECT COUNT(DISTINCT DATE_FORMAT(createDate,'%m-%d-%Y')) AS completed FROM project_daily WHERE createDate >= SUBDATE(CURDATE(),DATE_FORMAT(CURDATE(),'%w')-1) AND projectId=?";
        int result = this.getJdbcTemplate().queryForObject(sqlTree, new Object[]{p.getId()}, Integer.class);
        int toWeekCount = (int) map.get("toWeekCount") - result;
        map.put("toWeekNotLog", toWeekCount);
        map.put("toDayNotLog", num);
        return map;
    }

    public Handle deleteProjectDaily(Daily daily, User user) {
        if (daily.getCreateId().equals(user.getId())) {
            String sql = "DELETE FROM project_daily WHERE id=? ";
            int flag = this.getJdbcTemplate().update(sql, new Object[]{daily.getId()});
            if (flag > 0) {
                return new Handle(1, "操作成功");
            } else {
                return new Handle(0, "操作失败，请稍后重试");
            }
        } else {
            return new Handle(2, "这不是您的日志，您不能删除");
        }

    }

    public User selectAccount(User u) {
        String sql = "SELECT u.id,u.userName,u.password,u.tel,u.email,u.createDate,u.updateDate,u.roleId,u.status,u.companyCreator,r.roleName,r.roleType,orz.logo,orz.companyName,orz.companyCode FROM system_user u INNER JOIN system_role r ON u.roleID = r.id INNER JOIN system_organization orz ON u.companyCode=orz.companyCode WHERE 1=1 ";
        sql += " AND u.id ='" + u.getId() + "'";
        List<User> result = this.getJdbcTemplate().query(sql, new BeanPropertyRowMapper(User.class));
        if (result.size() > 0) {
            return result.get(0);
        } else {
            return new User();
        }
    }

    public Project projectDetails(Project project) {
        String sql = "SELECT p.*,IF(IFNULL(p.actualEndTime,NOW())>p.expectedEndTime,'YES','NO') isOverdue,u.avatarUrl FROM project_data  p LEFT JOIN `system_user` u ON p.executor=u.id WHERE p.id=?";
        List<Project> result = this.getJdbcTemplate().query(sql, new Object[]{project.getId()}, new BeanPropertyRowMapper<>(Project.class));
        if (result.size() > 0) {
            return result.get(0);
        } else {
            return new Project();
        }
    }

    public Daily projectLogValue(Daily project) {
        String sql = "SELECT pda.*,pd.projectName  FROM  project_data pd  \n" +
                "LEFT JOIN project_daily pda ON pd.`id`=pda.`projectId` WHERE  pda.id=?  ORDER BY pda.updateDate DESC";
        List<Daily> result = this.getJdbcTemplate().query(sql, new Object[]{project.getId()}, new BeanPropertyRowMapper<>(Daily.class));

        if (result.size() > 0) {
            Daily daily = result.get(0);
            String sqlPr = "SELECT * FROM project_resources pr WHERE `uuid`=? ";
            List<ProjectResource> prResult = this.getJdbcTemplate().query(sqlPr, new Object[]{daily.getUuid()}, new BeanPropertyRowMapper<>(ProjectResource.class));
            daily.setPrList(prResult);
            return daily;
        } else {
            return new Daily();
        }
    }

    public Handle insertSchedule(Schedule schedule) {
        try {
            String sql = "INSERT INTO `schedule` (companyCode,userId,content,scheduleDate,createDate)VALUES(?,?,?,DATE_FORMAT(?,'%Y-%m-%d'),NOW())";
            int id = this.insert(sql, new Object[]{schedule.getCompanyCode(), schedule.getUserId(), schedule.getContent(), schedule.getScheduleDate()});
            return new Handle(1, "保存成功", id);
        } catch (SQLException e) {
            return new Handle(0, "保存失败");
        }
    }

    public List<String> queryScheduleDaysByMonth(Schedule schedule) {
        String sql = "SELECT DISTINCT DATE_FORMAT(scheduleDate,'%d') days FROM `schedule` WHERE  DATE_FORMAT(scheduleDate,'%Y-%m')= DATE_FORMAT(?,'%Y-%m') AND userId=? AND companyCode=?";
        List<String> list = this.getJdbcTemplate().queryForList(sql, new Object[]{schedule.getScheduleDate(), schedule.getUserId(), schedule.getCompanyCode()}, String.class);
        return list;
    }

    public Schedule queryScheduleById(Integer id) {
        String sql = "SELECT * FROM `schedule` WHERE id=?";
        List<Schedule> result = this.getJdbcTemplate().query(sql, new Object[]{id}, new BeanPropertyRowMapper<>(Schedule.class));
        if (result.size() > 0) {
            return result.get(0);
        } else {
            return new Schedule();
        }
    }

    public Handle updateSchedule(Schedule schedule) {
        String sql = "UPDATE `schedule` SET content=? WHERE id=?";
        int flag = this.getJdbcTemplate().update(sql, new Object[]{schedule.getContent(), schedule.getId()});
        return new Handle(flag, flag == 0 ? "保存失败" : "保存成功");
    }

    public Handle deleteScheduleById(Integer id) {
        String sql = "DELETE FROM `schedule` WHERE id=? ";
        int flag = this.getJdbcTemplate().update(sql, new Object[]{id});
        return new Handle(flag, flag == 0 ? "删除失败" : "删除成功");
    }

    public Page queryScheduleList(Schedule schedule) {
        List params = new ArrayList();
        String sql = " SELECT * FROM `schedule` WHERE 1=1 ";
        if (this.vertify(schedule.getScheduleDate())) {
            sql += " AND scheduleDate=DATE_FORMAT(?,'%Y-%m-%d') ";
            params.add(schedule.getScheduleDate());
        }
        if (this.vertify(schedule.getUserId())) {
            sql += " AND userId=? ";
            params.add(schedule.getUserId());
        }
        if (this.vertify(schedule.getCompanyCode())) {
            sql += " AND companyCode=? ";
            params.add(schedule.getCompanyCode());
        }
        sql += " GROUP BY createDate DESC ";
        return this.queryForPage(sql, params, schedule.getCurrentPage(), 10, Schedule.class);
    }

    public List queryAllUsers(String companyCode) {
        String sql = "SELECT id,userName FROM system_user WHERE companyCode = ? ";
        List list = this.getJdbcTemplate().queryForList(sql, new Object[]{companyCode});
        return list;
    }

    public Page queryCommentList(DailyComment comment) {
        String sql = "SELECT * FROM project_daily_comment pdc WHERE pdc.dailyId=? ORDER BY pdc.createDate DESC ";

        List params = new ArrayList();
        params.add(comment.getDailyId());
        return this.queryForPage(sql, params, comment.getCurrentPage(), 10, DailyComment.class);
    }

    public Handle insertDailyComment(DailyComment comment) {
        try {
            String sql = "INSERT INTO project_daily_comment ( content, dailyId, createId, createName, createDate )VALUES(?,?,?,?,NOW());";
            int id = this.insert(sql, new Object[]{comment.getContent(), comment.getDailyId(), comment.getCreateId(), comment.getCreateName()});
            return new Handle(1, "保存成功", id);
        } catch (SQLException e) {
            return new Handle(0, "保存失败");
        }
    }

    public int queryDailyCommentCounts(String dailyId) {
        String sql = "SELECT COUNT(1) FROM project_daily_comment pdc WHERE pdc.dailyId=? AND STATUS=1";
        int result = this.getJdbcTemplate().queryForObject(sql, new Object[]{dailyId}, Integer.class);
        return result;
    }


    public Map createTempData(TemplateTableRow templateTableRow, String columns, Account account) {
        String tableNameSql = "SELECT tableName FROM project_define WHERE id=?";
        String tableName = this.getJdbcTemplate().queryForObject(tableNameSql, new Object[]{templateTableRow.getDefine_id()}, String.class);
        String sqlTemp = "INSERT INTO " + tableName + " (define_id,data_uuid,dateCreated,dateUpdated,systemEnvironment,channel ";
        String valTemp = "values(?,?,NOW(),NOW(),?,?";
        List listTemp = new ArrayList();//将values 有序的存储
        listTemp.add(templateTableRow.getDefine_id());
        listTemp.add(templateTableRow.getData_uuid());
        listTemp.add(templateTableRow.getSystemEnvironment());
        listTemp.add(templateTableRow.getChannel());
        if (account != null) {
//            if (this.vertify(account.getCompanyCode())) {
//                sqlTemp += " ,companyCode";
//                valTemp += ",?";
//                listTemp.add(user.getCompanyCode());
//            }
            if (this.vertify(account.getId())) {
                sqlTemp += " ,creator";
                valTemp += ",?";
                listTemp.add(String.valueOf(account.getId()));
            }
            if (this.vertify(account.getAccountName())) {
                sqlTemp += " ,creatorName";
                valTemp += ",?";
                listTemp.add(account.getAccountName());
            }
        }

        if (this.vertify(templateTableRow.getRowDataId())) {
            //rowDataId，rowDefineId是为了数据的父子关系建的列
            sqlTemp += " ,rowDataId";
            valTemp += ",?";
            listTemp.add(templateTableRow.getRowDataId());

            Map<String, Object> item = this.getJdbcTemplate().queryForMap("SELECT  d.`define_id` FROM " + tableName + " d WHERE d.`id`=?", new Object[]{templateTableRow.getRowDataId()});
            if (item != null && item.get("define_id") != null) {
                sqlTemp += " ,rowDefineId";
                valTemp += ",?";
                listTemp.add(String.valueOf(item.get("define_id")));
            }
        }
        //columns = "{\"columns\":[\"col_data1\":\"报名人数\",\"col_data2\":\"签到人数\",\"col_data3\":\"手机号\"]}";
        if (this.vertify(templateTableRow.getProjectId())) {
            sqlTemp += " ,projectId";
            valTemp += ",?";
            listTemp.add(templateTableRow.getProjectId());
        }

        net.sf.json.JSONObject jsonObject = net.sf.json.JSONObject.fromObject(templateTableRow.getDefine());

        Map mapUtil = TablesUtil.parseQuerySql(jsonObject, "add", tableName);

        Map contactTypeMap = (Map<String, String>) mapUtil.get("contactTypeMap");
        Map<String, String> contactMap = new HashMap();
        Map jsonMap = TablesUtil.parseMap(templateTableRow.getDefine());
        Set<Map.Entry<String, Object>> entrys = jsonMap.entrySet();
        for (Map.Entry<String, Object> entry : entrys) {
            if(!WXUtils.checkcountname(entry.getKey())){//判断key是否为汉字
                sqlTemp += "," + entry.getKey();
                valTemp += ",?";
                listTemp.add(entry.getValue() == null || "null".equals(entry.getValue()) ? "" : entry.getValue());
            }
            if (contactTypeMap.size() > 0) {
                Set<Map.Entry<String, String>> entrysContactType = contactTypeMap.entrySet();
                for (Map.Entry<String, String> ect : entrysContactType) {
                    if (entry.getKey().equals(ect.getKey())) {
                        contactMap.put(ect.getValue(), entry.getValue().toString());
                    }
                }
            }

        }
        sqlTemp += ") ";
        valTemp += ") ";
        sqlTemp += valTemp;
        int resultTempId = 0;
        Map<String, Object> statistics=new HashMap<>();
        try {
            resultTempId = this.insert(sqlTemp, listTemp);
            if(resultTempId>0){
                if("team".equals(tableName)){//判断创建团队时把用户插入团队表
                    String sql="INSERT INTO team_member(team_id,account_id,add_time,`status`) VALUES(?,?,NOW(),1)";
                    this.getJdbcTemplate().update(sql,new Object[]{resultTempId,account.getId()});
                }
                if("volunteerapply".equals(tableName)){//自愿者申请同时注册用户
                    Map<String, Object> map = tableDate(tableName, resultTempId);
                    String sql="INSERT INTO account (account_name,phone,`password`,portrait)VALUE(?,?,?,?)";
                    int insert = this.insert(sql, new Object[]{map.get("volName"),map.get("phone"), map.get("password"),
                            "".equals(map.get("photo"))?map.get("photo"):JSONArray.fromObject(map.get("photo")).get(0)});
                    String updateVolunteerapply=" UPDATE volunteerapply SET creator=? WHERE id=? ";
                    int update = this.getJdbcTemplate().update(updateVolunteerapply, new Object[]{insert, resultTempId});
                }

                if(!"team".equals(tableName)&&!"volunteerapply".equals(tableName)){
                    if("project".equals(tableName)){//创建项目是添加点评动态
                        Map<String, Object> map = this.tableDate(tableName, resultTempId);
                        Comment comment=new Comment("创建了["+map.get("project_name")+"]项目",1);
                        this.addComment(comment,account.getAccountName(),Integer.valueOf(map.get("id").toString()),account.getId());
                    }else{//提交数据关联项目的添加点评
                        Map<String, Object> map = this.tableDate(tableName, resultTempId);
                        Comment comment=new Comment("提交了"+map.get("formTitle"),1);
                        this.addComment(comment,account.getAccountName(), Integer.valueOf(map.get("project").toString()),account.getId());
                    }
                }

                if("online_research".equals(tableName)||"site_investigation".equals(tableName)){
                    statistics = this.statistics(Integer.parseInt(templateTableRow.getDefine_id()), null, account.getId());
                    }
            }

        } catch (SQLException e) {
            e.printStackTrace();
        }

        //将表单数据与联系人存入关系表
//        this.addContactDefindData(resultTempId, contactMap, templateData, true);
        //表单数据与团队关联
        statistics.put("i",resultTempId);
        return statistics;
    }


    //根据表名和id查询某一条数据
    public Map<String,Object> tableDate(String tableName,Integer tableId){
        String sql="SELECT *,(SELECT formTitle FROM project_define WHERE id=define_id) AS 'formTitle' FROM "+tableName+" WHERE id="+tableId;
        List<Map<String, Object>> list = this.getJdbcTemplate().queryForList(sql);
        return list.get(0);
    }

    public Template queryTempTableById(Long id) {
        String sql = "SELECT id,id define_id,tableName, dateCreated,companyCode, creator, formTitle, define, formDescription, MODIFIER, dateUpdated, usableRange,sub, (CASE WHEN (SELECT COUNT(*) FROM project_define_data pdd WHERE pdd.define_id = pd.id) > 0 THEN 'true' WHEN (SELECT COUNT(*) FROM project_define_data pdd WHERE pdd.define_id=pd.id) = 0 THEN 'false' END)AS dataCounts FROM project_define pd where id = ?";
        List<Template> list = this.getJdbcTemplate().query(sql, new Object[]{id}, new BeanPropertyRowMapper<Template>(Template.class));

        String sql2 = "SELECT target_table,value,`key` FROM project_table_relation WHERE this_table=(SELECT tableName FROM project_define WHERE id=" + id + ")";
        List<Map<String, Object>> mapList1 = this.getJdbcTemplate().queryForList(sql2);
        JSONObject jsonObject = JSONObject.fromObject(list.get(0).getDefine());
        if (mapList1.size() > 0) {
            for (Map<String, Object> map : mapList1) {
                String sql3 = "SELECT " + map.get("value") + " AS 'value' FROM " + map.get("target_table");
                List<Map<String, Object>> mapList = this.getJdbcTemplate().queryForList(sql3);

                jsonObject.getJSONObject("schema").getJSONObject(map.get("target_table").toString()).put("options", mapList);
                jsonObject.getJSONObject("schema").getJSONObject(map.get("target_table").toString()).put("value", map.get("key"));
            }
        }

        JSONObject schema=TablesUtil.addIndex(jsonObject.getJSONObject("schema"));

        jsonObject.put("schema",schema);
        list.get(0).setDefine(JSONValue.toJSONString(jsonObject));

        if (list.size() > 0) {
            return list.get(0);
        } else {
            return null;
        }
    }

    //根据表id和用户id查出已审核STATUS=1的内容
    public Template queryTempTableById(Long id, Integer accountId,String city,Integer projectId,String province) {
        // 查询define
        String sql = "SELECT id,id define_id,tableName, dateCreated,companyCode, creator, formTitle, define, formDescription, MODIFIER, dateUpdated, usableRange,sub, (CASE WHEN (SELECT COUNT(*) FROM project_define_data pdd WHERE pdd.define_id = pd.id) > 0 THEN 'true' WHEN (SELECT COUNT(*) FROM project_define_data pdd WHERE pdd.define_id=pd.id) = 0 THEN 'false' END)AS dataCounts FROM project_define pd where id = ?";
        List<Template> list = this.getJdbcTemplate().query(sql, new Object[]{id}, new BeanPropertyRowMapper<Template>(Template.class));
        //查询关系表并拼接到define中
        JSONObject jsonObject = this.addOptions(id, accountId, city);

        Map address=new HashMap();
        if(this.vertify(city)&&this.vertify(province)){
            address.put("province",province);
            address.put("city",city);
            address.put("TableName",list.get(0).getTableName());
        }

        String valueSql="SELECT*FROM "+list.get(0).getTableName()+" WHERE  creator=?  ";
        List patams=new ArrayList();
        if(list.get(0).getTableName().equals("online_research")||list.get(0).getTableName().equals("site_investigation")
            ||list.get(0).getTableName().equals("research_report") ||list.get(0).getTableName().equals("record_action")
            ||list.get(0).getTableName().equals("rectification") ){
            patams.add(accountId);
            //判断是队长或没有加入了团队
            if(this.isCaptain(accountId)){
                if(this.vertify(projectId)){
                    valueSql+=" AND project=? ";
                    patams.add(projectId);
                }
            }else{
                if(this.vertify(projectId)){
                    valueSql+=" AND project=? ";
                    patams.add(projectId);
                }else{
                    valueSql+=" AND FIND_IN_SET(project,(SELECT GROUP_CONCAT(id) FROM project WHERE creator=(SELECT " +
                            "creator FROM team WHERE id=(SELECT team_id FROM team_member WHERE account_id=?)))) ";
                    patams.add(accountId);
                }
            }
        }else{
            //查询最新数据并拼接到define中每项value里面
            patams.add(accountId);
            if(list.get(0).getTableName().equals("application_research")||list.get(0).getTableName().equals("project")){
                valueSql+=" AND address LIKE  ? ";
                patams.add("%"+city+"%");
            }
            if(this.vertify(projectId)){
                if(list.get(0).getTableName().equals("project")){
                    valueSql+=" AND water_source=? ";
                }else{
                    valueSql+=" AND project=? ";
                }

                patams.add(projectId);
            }
        }

        valueSql+=" ORDER BY dateUpdated DESC ";
        List<Map<String, Object>> dataValue = this.getJdbcTemplate().queryForList(valueSql,patams.toArray());

        JSONObject schema=jsonObject.getJSONObject("schema");

        if(list.get(0).getTableName().equals("record_action")){//问题解决清空历史记录，每次提交都创建一条数据
            dataValue.clear();
        }


        if(dataValue.size()==0){//是否提交过数据
            list.get(0).setStatus("createData");//区分添加数据还是修改数据
            if(list.get(0).getTableName().equals("team")){
                String accountInfoSql="SELECT volName,email,phone FROM volunteerapply WHERE creator="+accountId;
                List<Map<String, Object>> accountInfo = this.getJdbcTemplate().queryForList(accountInfoSql);
                schema.getJSONObject("principal_name").put("value",accountInfo.get(0).get("volName"));
                schema.getJSONObject("email").put("value",accountInfo.get(0).get("email"));
                schema.getJSONObject("contact").put("value",accountInfo.get(0).get("phone"));
            }else if(list.get(0).getTableName().equals("application_research")){
                schema.getJSONObject("address").put("addr",province+","+city);
                JSONObject addrvalue=new JSONObject();
                addrvalue.put("first",province);
                addrvalue.put("sencond",city);
                addrvalue.put("addr",province+","+city);
                schema.getJSONObject("address").put("value",addrvalue);
                schema.getJSONObject("period").put("value",JSONObject.fromObject("{period_end:'',period_start:''}"));
            }else if(list.get(0).getTableName().equals("project")){
                schema.getJSONObject("address").put("addr",province+","+city);
                JSONObject addrvalue=new JSONObject();
                addrvalue.put("first",province);
                addrvalue.put("sencond",city);
                addrvalue.put("addr",province+","+city);
                schema.getJSONObject("address").put("value",addrvalue);
                if(this.vertify(projectId)){
                    String sqlWaterSourceName="SELECT waterSourceName FROM water_source WHERE id="+projectId;
                    String waterSourceName= this.getJdbcTemplate().queryForObject(sqlWaterSourceName, String.class);
                    schema.getJSONObject("project_name").put("value",waterSourceName);
                }
            }
//            else if(list.get(0).getTableName().equals("research_report")){
//                //现场调研分值
//                Map<String, Object> siteInvestigation = this.statistics(290, projectId, accountId);
//                //网络调研分值
//                Map<String, Object> onlineResearch = this.statistics(291, projectId, accountId);
//                schema.getJSONObject("health_degree").put("value", Double.parseDouble(siteInvestigation.get("total").toString())+Double.parseDouble(onlineResearch.get("total").toString()));
//            }
        }else{
            list.get(0).setStatus("UpdateData");
            list.get(0).setFormDataId(Integer.parseInt(dataValue.get(0).get("id").toString()));
            //判断是否为调研报告，发布更新健康程度分数
                if(list.get(0).getTableName().equals("research_report")){
                //现场调研分值
                Map<String, Object> siteInvestigation = this.statistics(290, Integer.parseInt(dataValue.get(0).get("project").toString()), accountId);
                //网络调研分值
                Map<String, Object> onlineResearch = this.statistics(291,  Integer.parseInt(dataValue.get(0).get("project").toString()), accountId);
                    dataValue.get(0).put("health_degree", Double.parseDouble(siteInvestigation.get("total").toString())+Double.parseDouble(onlineResearch.get("total").toString()));
                }
            schema=TablesUtil.addValue(dataValue, schema,address);
        }

        //调研报告查询雷达图数据
        if(list.get(0).getTableName().equals("research_report")){
            //统计雷达图数据
            Integer projectIds=this.vertify(projectId) ? projectId : dataValue.size()>0? Integer.parseInt(dataValue.get(0).get("project").toString()):0;
            Map<String, Object> radar = this.radarData(projectIds,accountId);
            schema.getJSONObject("RadarImage").put("value",radar);
//            schema.getJSONObject("RadarImage").getJSONObject("value").put("indicator","[{\"max\":36,\"name\":\"实地环境现状\"},{\"max\":20,\"name\":\"水质信息公开\"},{\"max\":4,\"name\":\"管理信息公开\"},{\"max\":28,\"name\":\"水质达标\"},{\"max\":12,\"name\":\"水量满足\"}]");
//            schema.getJSONObject("RadarImage").getJSONObject("value").put("value","[0, \"14.1\", \"1.8\", \"28\", \"12\"]");
        }

        jsonObject.put("schema",schema);
        list.get(0).setDefine(JSONValue.toJSONString(jsonObject));
        //网络调研和实地调研默认数据
        if(list.get(0).getTableName().equals("online_research") || list.get(0).getTableName().equals("site_investigation")){
            if(dataValue.size()>0){
                list.get(0).setProjectId(dataValue.get(0).get("project").toString());
                String sql2 = "SELECT*FROM " + list.get(0).getTableName() + " WHERE project=? AND creator=? ORDER BY dateUpdated DESC ";
                List<Map<String, Object>> list2 = this.getJdbcTemplate().queryForList(sql2, new Object[]{dataValue.get(0).get("project"), accountId});
                jsonObject = this.addColumn(Integer.parseInt(id.toString()), list.get(0), list2);
                //第一次进入网络调研和实地调研不需要value，
                jsonObject.remove("value");
            }else{
                jsonObject = this.addColumn(Integer.parseInt(id.toString()), list.get(0),new ArrayList());
            }
        }
        //给define中的schema添加index下标
        JSONObject  schemaIndex=TablesUtil.addIndex(jsonObject.getJSONObject("schema"));
        jsonObject.put("schema",schemaIndex);

        list.get(0).setDefine(JSONValue.toJSONString(jsonObject));
        if (list.size() > 0) {
            return list.get(0);
        } else {
            return null;
        }
    }


    public Template queryTempTableByIdButton(Long id) {
        String sql = "SELECT id,id define_id,tableName, dateCreated,companyCode, creator, formTitle, define, formDescription, MODIFIER, dateUpdated, usableRange,sub, (CASE WHEN (SELECT COUNT(*) FROM project_define_data pdd WHERE pdd.define_id = pd.id) > 0 THEN 'true' WHEN (SELECT COUNT(*) FROM project_define_data pdd WHERE pdd.define_id=pd.id) = 0 THEN 'false' END)AS dataCounts FROM project_define pd where id = ?";
        List<Template> list = this.getJdbcTemplate().query(sql, new Object[]{id}, new BeanPropertyRowMapper<Template>(Template.class));

        String sql2 = "SELECT target_table,value,`key` FROM project_table_relation WHERE this_table=(SELECT tableName FROM project_define WHERE id=" + id + ")";
        List<Map<String, Object>> mapList1 = this.getJdbcTemplate().queryForList(sql2);
        JSONObject jsonObject = JSONObject.fromObject(list.get(0).getDefine());
        jsonObject.remove("fieldsets");
        if (mapList1.size() > 0) {
            for (Map<String, Object> map : mapList1) {
                String sql3 = "SELECT " + map.get("value") + " AS 'value' FROM " + map.get("target_table");
                List<Map<String, Object>> mapList = this.getJdbcTemplate().queryForList(sql3);

                jsonObject.getJSONObject("schema").getJSONObject(map.get("target_table").toString()).put("options", mapList);
                jsonObject.getJSONObject("schema").getJSONObject(map.get("target_table").toString()).put("value", map.get("key"));
            }
        }

        //给define中schema下的对象添加index下标
        JSONObject schema=TablesUtil.addIndex(jsonObject.getJSONObject("schema"));
        jsonObject.put("schema",schema);
        list.get(0).setDefine(JSONValue.toJSONString(jsonObject));

        if (list.size() > 0) {
            return list.get(0);
        } else {
            return null;
        }
    }

    /**
     * 查询团队表单
     *
     * @return
     */
    public List<Map<String, Object>> queryTeam() {
        String sql = "SELECT id,team_name FROM team";
        return this.getJdbcTemplate().queryForList(sql);
    }

    public Map updateTempData(TemplateTableRow templateTableRow, Account account) {
        net.sf.json.JSONObject jsonObject = net.sf.json.JSONObject.fromObject(templateTableRow.getDefine());
        String define_id = templateTableRow.getDefine_id() == null ? TablesUtil.parseDefineId(jsonObject) : templateTableRow.getDefine_id();
        Template temp = this.queryTempTableById(Long.valueOf(String.valueOf(define_id)));
        Map mapUtil = TablesUtil.parseQuerySql(jsonObject, "add", temp.getTableName());

        String sql = "UPDATE  " + temp.getTableName() + " SET ";
        List list = new ArrayList();

        Map contactTypeMap = (Map<String, String>) mapUtil.get("contactTypeMap");
        Map jsonMap = TablesUtil.parseMap(templateTableRow.getDefine());
        Map<String, String> contactMap = new HashMap();
        Set<Map.Entry<String, Object>> entrys = jsonMap.entrySet();  //此行可省略，直接将map.entrySet()写在for-each循环的条件中
        for (Map.Entry<String, Object> entry : entrys) {
            sql += " " + entry.getKey() + "= ? ,";
            list.add(entry.getValue() == null || "null".equals(entry.getValue()) ? "" : entry.getValue());
            if (contactTypeMap.size() > 0) {
                Set<Map.Entry<String, String>> entrysContactType = contactTypeMap.entrySet();
                for (Map.Entry<String, String> ect : entrysContactType) {
                    if (entry.getKey().equals(ect.getKey())) {
                        contactMap.put(ect.getValue(), entry.getValue().toString());
                    }
                }
            }
        }
//        sql += " dateUpdated = NOW() WHERE define_id = ? AND data_uuid = ? "; // AND tcompanyCode = ?
        if (this.vertify(templateTableRow.getStatus())) {
            sql += "status = ? ,";
            list.add(templateTableRow.getStatus());
        }
        sql += " dateUpdated = NOW() WHERE id = ? ";
        list.add(templateTableRow.getId());
        int i = 0;
        i = this.getJdbcTemplate().update(sql, list.toArray());

        //添加点评
        String tableNameSql = "SELECT tableName FROM project_define WHERE id=?";
        String tableName = this.getJdbcTemplate().queryForObject(tableNameSql, new Object[]{templateTableRow.getDefine_id()}, String.class);
        if("project".equals(tableName)){//创建项目是添加点评动态
            Map<String, Object> map = this.tableDate(tableName, Integer.parseInt(templateTableRow.getId().toString()));
            Comment comment=new Comment("更新了["+map.get("project_name")+"]项目",3);
            try {
                this.addComment(comment,account.getAccountName(),Integer.valueOf(map.get("id").toString()),account.getId());
            } catch (SQLException e) {
                e.printStackTrace();
            }
        }

        if("volunteerapply".equals(tableName)){//自愿者修改申请同时修改用户信息
            Account a=new Account();
            a.setId(account.getId());
            a.setAccount_name(jsonMap.get("volName").toString());
            a.setPassword(jsonMap.get("password").toString());
            a.setPortrait("".equals(jsonMap.get("photo"))?jsonMap.get("photo").toString():JSONArray.fromObject(jsonMap.get("photo")).get(0).toString());
            a.setPhone(jsonMap.get("phone").toString());
            int i1 = this.updateAccount(a);
        }

//        if (i > 0) {
//            this.addContactDefindData(templateData.getId().intValue(), contactMap, templateData, false);
//        }
        Map<String, Object> statistics=new HashMap<>();
        if(temp.getTableName().equals("online_research")||temp.getTableName().equals("site_investigation")&&i>0){
             statistics = this.statistics(Integer.parseInt(templateTableRow.getDefine_id()), null, account.getId());
        }
        statistics.put("i",i);
        return statistics;
    }


    public Page queryAllTempDataByPage(TemplateTableRow templateTableRow) {
        net.sf.json.JSONObject jsonObject = net.sf.json.JSONObject.fromObject(templateTableRow.getDefine());
        String define_id = TablesUtil.parseDefineId(jsonObject);
        Template temp = this.queryTempTableById(Long.valueOf(define_id));
        //把前台传过来的tableName改为服务器获取，免得被窃取信息
        Map queryMap = TablesUtil.parseQuerySql(jsonObject, "query", temp.getTableName());

        String sql = queryMap.get("sql") + "";

        Page page = new Page();


        getPageList(page, sql, templateTableRow, (List) queryMap.get("listSqlWhere"));
        temp.setDefine(templateTableRow.getDefine());
        page.setTemp(temp);

        return page;
    }


    public Page getPageList(Page page, String sql, TemplateTableRow templateTableRow, List params) {
        String count = "SELECT COUNT(1) num FROM (" + sql + ") r";
        Integer total = this.getJdbcTemplate().queryForObject(count, params.toArray(new Object[params.size()]), Integer.class);
        page.setTotal(total);
        page.setTotalPages(((Integer) total / templateTableRow.getPageSize()) + 1);
        page.setCurrentPage(templateTableRow.getCurrentPage());
        page.setPageSize(templateTableRow.getPageSize());
        sql += " LIMIT " + (templateTableRow.getCurrentPage() - 1) * templateTableRow.getPageSize() + ", " + templateTableRow.getPageSize();
        List list = this.getJdbcTemplate().queryForList(sql, params.toArray(new Object[params.size()]));
        page.setResultList(list);
        return page;
    }


    //添加关系
    public int addVlounteerapply_r_team(Integer teamId, Integer volunteerapplyId) {
        String sql = "INSERT INTO vlounteerapply_r_team (team_id,volunteerapply_id,create_time)VALUES(?,?,NOW())";
        return this.getJdbcTemplate().update(sql, new Object[]{teamId, volunteerapplyId});
    }

    public Page queryTempDataById(TemplateTableRow templateTableRow) {
        List<String> params = new ArrayList<String>();
        JSONObject jsonObject = JSONObject.fromObject(templateTableRow.getDefine());
        JSONObject schema = jsonObject.getJSONObject("schema");
        Iterator<String> keys = schema.keys();
        StringBuffer column = new StringBuffer();
        while (keys.hasNext()) {
            String teams = keys.next();
            column.append("pdd." + teams + ",");
        }
        String sql = "SELECT " + column + " pd.formTitle,pd.formDescription, pd.usableRange, pd.sub FROM " + templateTableRow.getTableName() + " pdd INNER JOIN project_define pd ON pdd.define_id=pd.id WHERE 1=1";

//        String sql = "SELECT pdd.*,pd.formTitle,pd.formDescription, pd.usableRange FROM "+templateData.getTableName()+" pdd INNER JOIN project_define pd ON pdd.define_id=pd.id WHERE 1=1";

        if (this.vertify(templateTableRow.getId())) {
            sql += " AND pdd.id = ? ";
            params.add(templateTableRow.getId().toString());
        }
        if (this.vertify(templateTableRow.getDefine_id())) {
            sql += " AND pdd.define_id = ? ";
            params.add(templateTableRow.getDefine_id());
        }
        if (this.vertify(templateTableRow.getProjectId())) {
            sql += " AND projectId = ? ";
            params.add(templateTableRow.getProjectId());
        }
        if (this.vertify(templateTableRow.getData_uuid())) {
            sql += " AND pdd.data_uuid = ? ";
            params.add(templateTableRow.getData_uuid());
        }
        List<Map<String, Object>> list = this.getJdbcTemplate().queryForList(sql, params.toArray());
        Page page = new Page();
        if (list.size() > 0) {
            page.setResultList(list);
            return page;
        } else {
            return null;
        }
    }


    public Page queryProject(com.auth.entity.Project project, Integer accountId) {
        String sql = "SELECT * FROM project WHERE 1=1";
        List params = new ArrayList();

        if (this.vertify(accountId)) {
            if (!"admin".equals(this.queryAccountAuth(accountId))) {
                sql += " AND id IN (SELECT water_source FROM application_research WHERE creator=? AND `STATUS`=1)";
                params.add(accountId);
            }
        }

        if (this.vertify(project.getProject_name())) {
            sql += " AND (project_name LIKE  ? OR id IN (SELECT water_source FROM application_research WHERE creatorName LIKE  ?) ) ";
            params.add("%" + project.getProject_name() + "%");
            params.add("%" + project.getProject_name() + "%");
        }

        if(this.vertify(project.getAddress())){
            sql+=" AND address LIKE  ? ";
            params.add("%"+project.getAddress()+"%");
        }

        if (this.vertify(project.getStatus())) {
            sql += " AND `STATUS`=? ";
            params.add(project.getStatus());
        }

        if(this.vertify(project.getSort())){
            if(project.getSort()==1){
                sql+=" ORDER BY dateCreated DESC";
            }else{
                sql+=" ORDER BY dateCreated  ";
            }
        }else{
            sql+=" ORDER BY dateCreated DESC";
        }

//        if(this.vertify(project.getDateCreated())){
//            sql+=" ORDER BY dateCreated";
//        }else{
//            sql+=" ORDER BY dateCreated DESC";
//        }


        Page page = this.queryForPage(sql, params, project.getCurrentPage(), project.getPageSize(), com.auth.entity.Project.class);
        if (page.getResultList().size() == 0) {
            return null;
        } else {
            return page;
        }
    }


    public Page queryVolunteerapply(VolunteerApply volunteerApply) {
        String sql = "SELECT * FROM volunteerapply WHERE 1=1 ";
        List params = new ArrayList();

        if (this.vertify(volunteerApply.getStatus())) {
            sql += " AND status=? ";
            params.add(volunteerApply.getStatus());
        }

        if (this.vertify(volunteerApply.getVolName())) {
            sql += " AND volName Like ?";
            params.add("%" + volunteerApply.getVolName() + "%");
        }
        Page page = this.queryForPage(sql, params, volunteerApply.getCurrentPage(), volunteerApply.getPageSize(), VolunteerApply.class);
        return page;
    }


    public int updateRole(int accountId){
        String sql="UPDATE  account SET role_id=3 WHERE id=?";
        return this.getJdbcTemplate().update(sql,new Object[]{accountId});
    }

    public int audit(Integer defineId, Integer tableId, Integer status) {
        String tableNameSpl = "SELECT tableName FROM project_define WHERE id=" + defineId;
        String tableName = this.getJdbcTemplate().queryForObject(tableNameSpl, String.class);
        if(tableName.equals("project")&&status==4){//设置项目完成
            return this.isFinish(tableId, status);
        }else {
            String sql = "UPDATE " + tableName + " SET `STATUS`=? WHERE id=?";
            int update = this.getJdbcTemplate().update(sql, new Object[]{status, tableId});
            if (update > 0) {
                if (tableName.equals("volunteerapply")){ //判断是否为志愿者审核
                    String sql2 = "SELECT creator FROM volunteerapply WHERE id=" + tableId;
                    this.updateRole(this.getJdbcTemplate().queryForObject(sql2, Integer.class));
                }
                if (tableName.equals("application_research")) {//判断是否为调研申请
                    String projectid = "SELECT project FROM application_research WHERE id=" + tableId;
                    Integer integer = this.getJdbcTemplate().queryForObject(projectid, Integer.class);
                    String sql2 = " UPDATE project SET `STATUS`=2 WHERE id=" + integer;
                    int update1 = this.getJdbcTemplate().update(sql2);
                }
            }
            return update;
        }
    }



    public Page queryTeam(Team team, int accountId) {
        String sql = "SELECT t.*,(CASE WHEN creator=? THEN 1 ELSE 0 END) AS 'sort',\n" +
                "(CASE WHEN creator=? THEN 1 WHEN  (SELECT `STATUS` FROM team_member WHERE team_id=t.id AND account_id=?)=0 THEN 3\n" +
                "WHEN (SELECT `STATUS` FROM team_member WHERE team_id=t.id AND account_id=?)=1 THEN 2\n" +
                "ELSE 0 END) AS 'type',\n" +
                "(CASE WHEN (SELECT COUNT(team_id) FROM team_member WHERE `STATUS`=1 AND team_id=t.id GROUP BY team_id)>=0 THEN \n" +
                "(SELECT COUNT(team_id) FROM team_member WHERE `STATUS`=1 AND team_id=t.id GROUP BY team_id) ELSE 0 END) AS 'member' " +
                "FROM team t WHERE 1=1 ";
        List params = new ArrayList();
        params.add(accountId);
        params.add(accountId);
        params.add(accountId);
        params.add(accountId);


        if (this.vertify(team.getStatus())) {
            sql += " AND `STATUS`=? ";
            params.add(team.getStatus());
        }


        if (this.vertify(team.getTeam_name())) {
            sql += "  AND team_name LIKE  ?";
            params.add("%" + team.getTeam_name() + "%");
        }

        sql += " ORDER BY sort DESC,create_time DESC";
        Page page = this.queryForPage(sql, params, team.getCurrentPage(), team.getPageSize(), Team.class);
        return page;
    }


    public int countTeam(Integer teamId) {
        String sql = "select  COUNT(1) FROM team_member WHERE team_id=? ";
        int count = this.getJdbcTemplate().queryForObject(sql, new Object[]{teamId},Integer.class);
        return count;
    }

    public int joinTeam(Integer teamId, Integer accountId) {
        String s = this.queryAccountAuth(accountId);//查询用户角色
        if ("normal".equals(s)) {
            return 2;
        } else {
            String sql1 = "SELECT COUNT(*) FROM team_member WHERE account_id=" + accountId;//查询用户是否有团队
            Integer integer = this.getJdbcTemplate().queryForObject(sql1, Integer.class);
            if (integer > 0) {
                return 3;
            } else {
                String sql = "INSERT INTO team_member(team_id,account_id,add_time) VALUE(?,?,NOW());";
                int update = this.getJdbcTemplate().update(sql, new Object[]{teamId, accountId});
                return update;
            }
        }
    }


    public Map<String, Object> count(Integer accountId) {
        Map<String, Object> map = new HashMap<>();
        String sql = "SELECT COUNT(*) FROM volunteerapply WHERE `STATUS`=0";//志愿者申请数
        Integer integer = this.getJdbcTemplate().queryForObject(sql, Integer.class);
        map.put("volunteerapply", integer);
        String sql2 = "SELECT COUNT(*) FROM team WHERE `STATUS`=0";//团队审核数
        Integer integer2 = this.getJdbcTemplate().queryForObject(sql2, Integer.class);
        map.put("team", integer2);
        String sql3 = "SELECT COUNT(*) FROM project WHERE `STATUS`=3";//项目完成数
        Integer integer3 = this.getJdbcTemplate().queryForObject(sql3, Integer.class);
        map.put("project", integer3);
        String sql7="SELECT COUNT(*) FROM record_action where DATE_SUB(CURDATE(), INTERVAL 7 DAY) >=dateUpdated AND creator="+accountId;
        Integer integer1=this.getJdbcTemplate().queryForObject(sql7,Integer.class);
        map.put("report",integer1);
        String sql6 = "SELECT COUNT(*) FROM application_research WHERE `STATUS`=0";//调研申请审核数
        Integer integer6 = this.getJdbcTemplate().queryForObject(sql6, Integer.class);
        map.put("unauditedApplication_research", integer6);
        String sql4 = "SELECT COUNT(*) FROM application_research WHERE creator=? AND (`STATUS`=-1 OR `STATUS`=0)";//用户待审核和已拒绝的调研申请数
        Integer integer4 = this.getJdbcTemplate().queryForObject(sql4, new Object[]{accountId}, Integer.class);
        map.put("application_research", integer4);
        String sql5 = "SELECT COUNT(*) AS 'audit_project',(SELECT COUNT(*) FROM project WHERE id IN (SELECT water_source FROM application_research WHERE creator=? " +
                "AND `STATUS`=1) AND `STATUS`=2) AS 'execution' FROM project WHERE id IN (SELECT water_source FROM application_research WHERE creator=? AND `STATUS`=1) AND `STATUS`=4";//用户已完成和执行中的项目数
        List<Map<String, Object>> list = this.getJdbcTemplate().queryForList(sql5, new Object[]{accountId, accountId});
        map.put("audit_project", list.get(0).get("audit_project"));
        map.put("execution", list.get(0).get("execution"));
        return map;
    }



    public String queryAccountAuth(Integer accountId) {
        String sql = "SELECT r.roleType FROM account a LEFT JOIN system_role r ON a.role_id=r.id WHERE a.id=? ";
        String type = this.getJdbcTemplate().queryForObject(sql, new Object[]{accountId}, String.class);
        return type;
    }


    public Page queryApplicationResearch(Integer accountId, Integer status,String project_name) {
        List<String> params = new ArrayList<String>();

        String sql = "SELECT ar.id,ar.creator,ar.creatorName,(SELECT project_name FROM project WHERE id=ar.project) " +
                "AS 'project_name',date_format(ar.dateCreated,'%Y-%m-%d') AS 'executionCycle',ar.status,ar.define_id,ar.project,\n" +
                "(SELECT team_name FROM team WHERE id=(SELECT team_id FROM team_member  WHERE account_id=ar.creator GROUP BY account_id)) AS 'team_name',period\n" +
                "FROM application_research ar  WHERE 1=1 ";

        if (!"admin".equals(this.queryAccountAuth(accountId))) {
            sql += " AND ar.creator=?  AND (ar.`STATUS`=0 OR ar.`STATUS`=-1) ";
            params.add(String.valueOf(accountId));
        }

        if (this.vertify(status)) {
            sql += " AND ar.`STATUS`=? ";
            params.add(String.valueOf(status));
        }

        if(this.vertify(project_name)){
            sql+=" AND (SELECT project_name FROM project WHERE id=ar.project) LIKE  ? ";
            params.add("%"+project_name+"%");
        }

        sql += " ORDER BY ar.`STATUS` DESC";

        List<Map<String, Object>> list = this.getJdbcTemplate().queryForList(sql, params.toArray());
        Page page = new Page();
        if (list.size() > 0) {
            page.setResultList(list);
            return page;
        } else {
            return null;
        }
    }

    public Page queryComment(Comment comment) {
        List<String> params = new ArrayList<String>();

        String sql = "SELECT id,content,img_url,`type`,creator,creatorName,DATE_FORMAT(dateCreated,'%Y-%m-%d %H:%i') as 'dateCreated' FROM  comment WHERE 1=1 AND projectId="+comment.getProjectId();

        sql += " ORDER BY id DESC ";
        List<Map<String, Object>> list = this.getJdbcTemplate().queryForList(sql, params.toArray());
        Page page = new Page();
        if (list.size() > 0) {
            page.setResultList(list);
            return page;
        } else {
            return null;
        }
    }

    public Comment addComment(Comment comment, String accountName, Integer project_id, Integer accountId) throws SQLException {
        if(accountId==null||"".equals(accountId)){
            accountName="游客";
            comment.setCreatorName("游客");
            accountId=0;
        }
        String sql = "INSERT INTO comment(content,img_url,type,creator,creatorName,define_id,projectId,dateCreated) " +
                "VALUE(?,?,?,?,?,?,?,NOW());";
        int insert = this.insert(sql, new Object[]{comment.getContent(), comment.getImgUrl(),comment.getType(),
                accountId, accountName,comment.getDefineId(),project_id});
        if (insert > 0) {
            Comment comment1 = new Comment();
            comment1 = comment;
            comment1.setCreator(accountId.toString());
            comment1.setId(insert);
            return comment1;
        } else {
            return null;
        }
    }


    public List<Map<String, Object>> AccountInfo(Integer accountId) {
        String sql = "SELECT*FROM account WHERE id=" + accountId;
        List<Map<String, Object>> list = this.getJdbcTemplate().queryForList(sql);
        //判断用户是否为队长或没有加入过团队()
        if(this.getJdbcTemplate().queryForObject("SELECT COUNT(*) FROM team WHERE creator="+list.get(0).get("id"),
                Integer.class)>0||this.getJdbcTemplate().queryForObject("SELECT COUNT(*) FROM team_member WHERE account_id="+list.get(0).get("id"),
                Integer.class)<=0){
            list.get(0).put("isCreateProject",1);
        }else{
            list.get(0).put("isCreateProject",0);
        }

        if(Integer.parseInt(list.get(0).get("role_id").toString())==2){
            list.get(0).put("status",0);
        }else{
            list.get(0).put("status",1);
        }
        return list;
    }


    public Map<String, Object> isCreate(Integer accountId, Integer defineId, Integer ProjectId,String city) {
        Map<String, Object> map = new HashMap<>();
        String province="";
        String sqlDefine="SELECT tableName FROM project_define WHERE id="+defineId;
        String tableName= this.getJdbcTemplate().queryForObject(sqlDefine, String.class);
        if(tableName.equals("project")){
            String addressSql="SELECT address FROM water_source WHERE id="+ProjectId;
            String[] address= this.getJdbcTemplate().<String>queryForObject(addressSql, String.class).split(",");
            province=address[0];
            city=address[1];
        }else{
            String addressSql="SELECT address FROM project WHERE id="+ProjectId;//获取项目所在地址
            String address = this.getJdbcTemplate().queryForObject(addressSql, String.class);
            province= JSONObject.fromObject(address).get("first").toString();
            city=JSONObject.fromObject(address).get("sencond").toString();
        }


        Template template = this.queryTempTableById(Long.valueOf(defineId),accountId,city,ProjectId,province);
        String sql="";
        List<Map<String, Object>> list=new ArrayList<>();
        List<Map<String, Object>> list1=new ArrayList<>();
        if(tableName.equals("project")){
             sql = "SELECT*FROM " + template.getTableName() + " WHERE water_source=? and creator=? ";
             list= this.getJdbcTemplate().queryForList(sql, new Object[]{ProjectId,accountId});
        }else if(tableName.equals("research_report")){
             //查询供应人口和面积并与建议评估合并到一起
            sql=" SELECT suggest,image FROM " + template.getTableName() +" WHERE project=? AND creator=? ";
            list= this.getJdbcTemplate().queryForList(sql, new Object[]{ProjectId,accountId});
            //查询评估建议和评估图片
             list1 = this.getJdbcTemplate().queryForList("SELECT number as " +
                    "'supply_population',intro as 'area' FROM project WHERE id="+ProjectId);
            if(list.size()>0){
                list1.get(0).putAll(list.get(0));
            }else{
                list1.get(0).put("suggest","");
                list1.get(0).put("image",new ArrayList());
            }
           //现场调研分值
            Map<String, Object> siteInvestigation = this.statistics(290, ProjectId, accountId);
            //网络调研分值
            Map<String, Object> onlineResearch = this.statistics(291, ProjectId, accountId);
            list1.get(0).put("health_degree", Double.parseDouble(siteInvestigation.get("total").toString())+Double.parseDouble(onlineResearch.get("total").toString()));
                // 把调研报告中的值拼接到define，先调用TablesUtil.addValue获取到带value的“schema”，再改变template里面的“schema”，最后转换成json字符串set到template
            JSONObject jsonObject = TablesUtil.addValue(list1, JSONObject.fromObject(template.getDefine()).getJSONObject("schema"), null);
            JSONObject schema=new JSONObject();
            schema.put("schema",jsonObject);
            schema.put("fieldsets",JSONObject.fromObject(template.getDefine()).getJSONObject("fieldsets"));
            template.setDefine(JSONValue.toJSONString(schema));
        }else{
             sql = "SELECT*FROM " + template.getTableName() + " WHERE project=? AND creator=?";
            list= this.getJdbcTemplate().queryForList(sql, new Object[]{ProjectId,accountId});
        }

        //问题解决不用初始化值，每次提交都创建一条数据
        if(tableName.equals("record_action")){
            list.clear();
        }

        //判断是否有提交过数据
        if (list.size() == 0) {
            map.put("status", "create");
            JSONObject jsonObject=new JSONObject();
            //判断是否为调研报告
            if(tableName.equals("research_report")){
                jsonObject= this.addColumn(defineId, template, list1);
            }else{
                 jsonObject = this.addColumn(defineId, template, list);
            }

            if(template.getTableName().equals("record_action")){
                JSONArray question=new JSONArray();
                //现场调研答题状况
                Map<String, Object>  siteInvestigation= this.statistics(290, ProjectId, accountId);
                //网络调研答题状况
                Map<String, Object>  onlineResearch= this.statistics(291, ProjectId, accountId);

                //新建一个list用于存储已完成的答题，方便循环取问题点
                List<JSONObject> jsons=new ArrayList();
                jsons.add(JSONObject.fromObject(siteInvestigation.get("finish")==""?"{\"schema\":{}}":siteInvestigation.get("finish")));
                jsons.add(JSONObject.fromObject(onlineResearch.get("finish")==""?"{\"schema\":{}}":onlineResearch.get("finish")));
                //水源地调研数据
                for (JSONObject json:jsons) {
                    Iterator<String> it = json.getJSONObject("schema").keys();
                    while (it.hasNext()) {
                        String key = it.next();
                        if (!"project".equals(key) && json.size() > 0 && this.vertify(json.getJSONObject("schema").getJSONObject(key).getJSONObject("value").getString(key))) {
                            JSONArray options = JSONArray.fromObject(json.getJSONObject("schema").getJSONObject(key).getString("options"));
                            if (this.vertify(json.getJSONObject("schema").getJSONObject(key).getJSONObject("value").getString(key))) {
                                String value = json.getJSONObject("schema").getJSONObject(key).getJSONObject("value").getString(key);
                                if (!options.get(0).toString().equals(value)) {
                                    question.add(json.getJSONObject("schema").getJSONObject(key).getString("title"));
                                }
                            }
                        }
                    }
                }
                jsonObject.getJSONObject("schema").getJSONObject("question").put("options",question);


            }

            int index=0;//临时下标变量
            if(tableName.equals("project")){
                for(Object o:jsonObject.getJSONObject("schema").getJSONObject("water_source").getJSONArray("options")){
                    JSONObject options= (JSONObject) o;
                    if(options.get("id").toString().equals(ProjectId.toString())){//比较value，取下标
                        jsonObject.getJSONObject("schema").getJSONObject("water_source").put("valuesTemp",index);//添加选中项目下标
                        jsonObject.getJSONObject("schema").getJSONObject("water_source").put("value",ProjectId);//添加选中项目下标
                    }
                    index++;
                }
            }else{
                for(Object o:jsonObject.getJSONObject("schema").getJSONObject("project").getJSONArray("options")){
                    JSONObject options= (JSONObject) o;
                    if(options.get("id").toString().equals(ProjectId.toString())){//比较value，取下标
                        jsonObject.getJSONObject("schema").getJSONObject("project").put("valuesTemp",index);//添加选中项目下标
                        jsonObject.getJSONObject("schema").getJSONObject("project").put("value",ProjectId);//添加选中项目下标
                    }
                    index++;
                }
            }
            map.put("define", JSONValue.toJSONString(jsonObject));
        } else {
            map.put("status","update");
            map.put("formDataId",list.get(0).get("id"));
            JSONObject jsonObject = this.addColumn(defineId, template, list);
            int index=0;//临时下标变量
            if(tableName.equals("project")){
                for(Object o:jsonObject.getJSONObject("schema").getJSONObject("water_source").getJSONArray("options")){
                    JSONObject options= (JSONObject) o;
                    if(options.get("id").toString().equals(ProjectId.toString())){//比较value，取下标
                        jsonObject.getJSONObject("schema").getJSONObject("water_source").put("valuesTemp",index);//添加选中项目下标
                        jsonObject.getJSONObject("schema").getJSONObject("water_source").put("value",ProjectId);//添加选中项目下标
                    }
                    index++;
                }
            }else{
                for(Object o:jsonObject.getJSONObject("schema").getJSONObject("project").getJSONArray("options")){
                    JSONObject options= (JSONObject) o;
                    if(options.get("id").toString().equals(ProjectId.toString())){//比较value，取下标
                        jsonObject.getJSONObject("schema").getJSONObject("project").put("valuesTemp",index);//添加选中项目下标
                        jsonObject.getJSONObject("schema").getJSONObject("project").put("value",ProjectId);//添加选中项目下标
                    }
                    index++;
                }
            }
            map.put("define", JSONValue.toJSONString(jsonObject));
        }

        return map;
    }


    public Page queryWaterSource() {
        String sql = "SELECT * FROM  water_source WHERE 1=1 ";
        sql += " ORDER BY id DESC ";
        List<String> params = new ArrayList<String>();
        List<Map<String, Object>> list = this.getJdbcTemplate().queryForList(sql, params.toArray());
        Page page = new Page();
        if (list.size() > 0) {
            page.setResultList(list);
            return page;
        } else {
            return null;
        }
    }


    public List queryObjectTopOne(Integer id) {
        List lists = new ArrayList();

        //String sql = "SELECT online_research.* FROM online_research LEFT JOIN online_research_r_project ON online_research.id=online_research_r_project.online_research_id WHERE online_research_r_project.project_id=? ORDER BY online_research_r_project.createtime DESC LIMIT 0,1 ";//网络调研
        String sql = "select *,DATE_FORMAT(dateCreated,'%Y-%m-%d %H:%m') AS 'dateCreatedFormat' FROM online_research " +
                "WHERE project=? ORDER BY dateCreated DESC LIMIT 0,1 ";
        List<Map<String, Object>> list = this.getJdbcTemplate().queryForList(sql, new Object[]{id});
        Map<String, Object> online_research = new HashMap<>();
        online_research.put("title", "网络调研");
        online_research.put("id", list.size() > 0 ? list.get(0).get("id") : null);
        online_research.put("define_id", list.size() > 0 ? list.get(0).get("define_id") : null);
        online_research.put("creator", list.size() > 0 ? list.get(0).get("creator") : null);
        online_research.put("creatorName", list.size() > 0 ? list.get(0).get("creatorName") : null);
        online_research.put("dateCreated", list.size() > 0 ? list.get(0).get("dateCreatedFormat") : null);
        lists.add(online_research);
        // String sql2 = " SELECT site_investigation.* FROM site_investigation LEFT JOIN site_investigation_r_project  ON site_investigation.id=site_investigation_r_project.site_investigation_id WHERE site_investigation_r_project.project_id=?  ORDER BY site_investigation_r_project.createtime DESC LIMIT 0,1  ";//现场调研
        String sql2 = " select *,DATE_FORMAT(dateCreated,'%Y-%m-%d %H:%m') AS 'dateCreatedFormat'FROM " +
                "site_investigation WHERE project=? ORDER  BY dateCreated DESC LIMIT 0,1 ";
        list = this.getJdbcTemplate().queryForList(sql2, new Object[]{id});
        Map<String, Object> site_investigation = new HashMap<>();
        site_investigation.put("title", "现场调研");
        site_investigation.put("id", list.size() > 0 ? list.get(0).get("id") : null);
        site_investigation.put("define_id", list.size() > 0 ? list.get(0).get("define_id") : null);
        site_investigation.put("creator", list.size() > 0 ? list.get(0).get("creator") : null);
        site_investigation.put("creatorName", list.size() > 0 ? list.get(0).get("creatorName") : null);
        site_investigation.put("dateCreated", list.size() > 0 ? list.get(0).get("dateCreatedFormat") : null);
        lists.add(site_investigation);
//        String sql3 = " SELECT research_report.* FROM research_report LEFT JOIN research_report_r_project ON research_report.id=research_report_r_project.research_report_id WHERE research_report_r_project.project_id=? ORDER BY research_report_r_project.createtime DESC LIMIT 0,1 ";//调研报告
        String sql3 = "select *,DATE_FORMAT(dateCreated,'%Y-%m-%d %H:%m') AS 'dateCreatedFormat' FROM research_report" +
                " WHERE project=? ORDER BY dateCreated DESC LIMIT 0,1 ";
        list = this.getJdbcTemplate().queryForList(sql3, new Object[]{id});
        Map<String, Object> research_report = new HashMap<>();
        research_report.put("title", "调研报告");
        research_report.put("id", list.size() > 0 ? list.get(0).get("id") : null);
        research_report.put("define_id", list.size() > 0 ? list.get(0).get("define_id") : null);
        research_report.put("creator", list.size() > 0 ? list.get(0).get("creator") : null);
        research_report.put("creatorName", list.size() > 0 ? list.get(0).get("creatorName") : null);
        research_report.put("dateCreated", list.size() > 0 ? list.get(0).get("dateCreatedFormat") : null);
        lists.add(research_report);
        // String sql4 = "SELECT rectification.* FROM rectification LEFT JOIN rectification_r_project ON rectification.id=rectification_r_project.rectification_id WHERE rectification_r_project.project_id=?  ORDER BY rectification_r_project.createtime DESC LIMIT 0,1 ";//记录改变
        String sql4 = " select *,DATE_FORMAT(dateCreated,'%Y-%m-%d %H:%m') AS 'dateCreatedFormat' FROM rectification " +
                "WHERE project=? ORDER BY  dateCreated DESC LIMIT 0,1 ";
        list = this.getJdbcTemplate().queryForList(sql4, new Object[]{id});
        Map<String, Object> rectification = new HashMap<>();
        rectification.put("title", "记录改变");
        rectification.put("id", list.size() > 0 ? list.get(0).get("id") : null);
        rectification.put("define_id", list.size() > 0 ? list.get(0).get("define_id") : null);
        rectification.put("creator", list.size() > 0 ? list.get(0).get("creator") : null);
        rectification.put("creatorName", list.size() > 0 ? list.get(0).get("creatorName") : null);
        rectification.put("dateCreated", list.size() > 0 ? list.get(0).get("dateCreatedFormat") : null);
        lists.add(rectification);
        String sql5 = " select *,DATE_FORMAT(dateCreated,'%Y-%m-%d %H:%m') AS 'dateCreatedFormat' FROM record_action WHERE project=? ORDER BY dateCreated DESC LIMIT 0,1 ";//解决问题
        list = this.getJdbcTemplate().queryForList(sql5, new Object[]{id});
        Map<String, Object> record_action = new HashMap<>();
        record_action.put("title", "解决问题");
        record_action.put("id", list.size() > 0 ? list.get(0).get("id") : null);
        record_action.put("define_id", list.size() > 0 ? list.get(0).get("define_id") : null);
        record_action.put("creator", list.size() > 0 ? list.get(0).get("creator") : null);
        record_action.put("creatorName", list.size() > 0 ? list.get(0).get("creatorName") : null);
        record_action.put("dateCreated", list.size() > 0 ? list.get(0).get("dateCreatedFormat") : null);
        lists.add(record_action);
//        String sql6 = "";//发布求助
        Map<String, Object> map2 = new HashMap<>();
        map2.put("title", "发布求助");
        lists.add(map2);
//        String sql7 = "";//投诉建议
        Map<String, Object> map3 = new HashMap<>();
        map3.put("title", "投诉建议");
        lists.add(map3);
        return lists;
    }




    public Page queryAllTempData(TemplateTableRow templateTableRow) {
        net.sf.json.JSONObject jsonObject = net.sf.json.JSONObject.fromObject(templateTableRow.getDefine());
        String define_id = TablesUtil.parseDefineId(jsonObject);
        Template temp = this.queryTempTableById(Long.valueOf(define_id));
        Map queryMap = TablesUtil.parseQuerySql(jsonObject, "query", temp.getTableName());
        String sql = queryMap.get("sql") + "";

        Page page = new Page();
        //Template temp = this.queryTempTableById(Long.valueOf(String.valueOf(queryMap.get("define_id"))));
        temp.setDefine(templateTableRow.getDefine());
        page.setTemp(temp);
        List paramsList = (List) queryMap.get("listSqlWhere");

        page.setResultList(TablesUtil.changeData(this.getJdbcTemplate().queryForList(sql, paramsList.toArray(new Object[paramsList.size()]))));

        return page;
    }

    public Map<String,Object> teaminfo(Integer  teamId,Integer accountId){
        Map<String,Object> map=new HashMap<>();
        String sql="SELECT *,(SELECT COUNT(*) FROM team_member WHERE team_id=? AND `STATUS`=1) AS 'member'," +
                "(SELECT COUNT(*) FROM team_member WHERE team_id=? AND `STATUS`=0) AS 'applicant' " +
                "FROM team WHERE id=?";//团队详情
        List<Map<String, Object>> team = this.getJdbcTemplate().queryForList(sql,new Object[]{teamId,teamId,teamId});
        map.put("team",team.get(0));
        String sql1="SELECT a.*,(CASE WHEN (SELECT creator FROM team t WHERE t.id=?)=a.id THEN 1 ELSE 2 END) AS 'type' " +
                "FROM account a WHERE a.id IN (SELECT account_id FROM team_member WHERE team_id=? AND `STATUS`=1) ORDER BY type ";//团队成员
        List<Map<String, Object>> member = this.getJdbcTemplate().queryForList(sql1, new Object[]{teamId,teamId});
        map.put("member",member);
        String sql2="SELECT*FROM account WHERE id IN (SELECT account_id FROM team_member WHERE team_id=? AND `STATUS`=0)";//申请加入用户
        List<Map<String, Object>> applicant = this.getJdbcTemplate().queryForList(sql2, new Object[]{teamId});
        map.put("applicant",applicant);
        String sql3=" SELECT id,project_name,address,period,number,water_source,intro,define_id,creator,creatorName,dateCreated," +
                "`status` AS 'status' FROM project WHERE creator IN (SELECT account_id FROM team_member WHERE team_id=?) AND `STATUS`=1";//成员项目列表
        List<Map<String, Object>> project = this.getJdbcTemplate().queryForList(sql3, new Object[]{teamId});
        map.put("project",project);
        return  map;
    }

    public int updateStatus(Integer  teamId,Integer accountId,Integer status){
        if(status==1){
            String sql="UPDATE  team_member SET `status`=?  WHERE account_id=? AND team_id=?";
            int update = this.getJdbcTemplate().update(sql, new Object[]{status,accountId, teamId});
            return update;
        }else{
            String sql="DELETE  FROM team_member WHERE account_id=? AND team_id=?";
            int update = this.getJdbcTemplate().update(sql, new Object[]{accountId, teamId});
            return update;
        }

    }


    public int updateAccount(Account account){
        JSONArray jsonArray=new JSONArray();
        jsonArray.add(account.getPortrait());
        String accountSql=" UPDATE account SET account_name=?,portrait=?,`password`=?,phone=? WHERE id=?";
        int update = this.getJdbcTemplate().update(accountSql, new Object[]{account.getAccountName(), account.getPortrait(),
                account.getPassword(),account.getPhone(),account.getId()});
        String sql="UPDATE volunteerapply SET `password`=?,volName=?,photo=?,phone=? WHERE creator=?";
        this.getJdbcTemplate().update(sql,new Object[]{account.getPassword(),account.getAccountName(),
                "".equals(account.getPortrait())?account.getPortrait():jsonArray.toString(), account.getPhone(),account.getId()});
        return update;
    }


    public int isFinish(Integer projectId,Integer status){
        String sql=" SELECT (CASE WHEN (SELECT COUNT(*) FROM online_research WHERE project=?)<=0 THEN 0\n" +
                "WHEN (SELECT COUNT(*) FROM site_investigation WHERE project=?)<=0 THEN 0\n" +
                "WHEN (SELECT COUNT(*) FROM research_report WHERE project=?)<=0 THEN 0\n" +
                "WHEN (SELECT COUNT(*) FROM rectification WHERE project=?)<=0 THEN 0\n" +
                "WHEN (SELECT COUNT(*) FROM record_action WHERE project=?)<=0 THEN 0 ELSE 1 \n" +
                "END) AS 'type' ";
        Integer integer = this.getJdbcTemplate().queryForObject(sql,new Object[]{projectId,projectId,projectId,projectId,projectId}, Integer.class);
        int i=0;
        if(integer==1){
            String sql2=" update project SET `STATUS`=? WHERE id=?";
            if(this.getJdbcTemplate().update(sql2,new Object[]{status,projectId})>0){
                i=1;
            }
        }
        return i;
    }


    // 提醒用户举报回访
    public List<Map<String,Object>> remind(Integer accountId,String project_name){
        String sql=" SELECT id,report_dept,`type`,photo,report_phone,(SELECT project_name FROM project p WHERE p" +
                ".id=record_action.project) AS 'project_name',creatorName,creator,DATE_FORMAT(dateCreated," +
                "'%Y-%m-%d') AS 'dateCreated',DATE_FORMAT(report_time,'%Y-%m-%d') AS 'report_time' FROM record_action" +
                " where DATE_SUB(CURDATE(), INTERVAL 7 DAY) >=dateUpdated AND creator=? ";
        List params=new ArrayList();
        params.add(accountId);
        if(this.vertify(project_name)){
            sql+=" AND (SELECT project_name FROM project p WHERE p.id=record_action.project) LIKE  ?  ";
            params.add("%"+project_name+"%");
        }
        List<Map<String, Object>> list = this.getJdbcTemplate().queryForList(sql,params.toArray());
        return list;
    }


    public Map<String,Object> statistics(Integer id,Integer projectId,Integer accountId){//查询已答题,未答题和得分
        String defineIdSql=" SELECT*FROM project_define WHERE id="+id;
        List<Map<String, Object>> define = this.getJdbcTemplate().queryForList(defineIdSql);
        String dataSql="SELECT*FROM "+define.get(0).get("tableName")+" WHERE creator=? ";
        List params=new ArrayList();
        params.add(accountId);
            //判断是队长或没有加入了团队
            if(this.isCaptain(accountId)){
                if(this.vertify(projectId)){
                    dataSql+=" AND  project=? ";
                    params.add(projectId);
                }
            }else{
                if(this.vertify(projectId)){
                    dataSql+=" AND  project=? ";
                    params.add(projectId);
                }else{
                    dataSql+=" AND FIND_IN_SET(project,(SELECT GROUP_CONCAT(id) FROM project WHERE creator=(SELECT " +
                            "creator FROM team WHERE id=(SELECT team_id FROM team_member WHERE account_id=?)))) ";
                    params.add(accountId);
                }
            }

        dataSql+=" ORDER BY dateUpdated DESC";//查询最新数据并拼接到define中每项value里面

        JSONObject finish=new JSONObject();
        JSONObject unfinished=new JSONObject();
        List<Map<String, Object>> data = this.getJdbcTemplate().queryForList(dataSql,params.toArray());
        JSONObject jsonObject= this.addOptions(Long.parseLong(id.toString()), accountId, null);
        JSONObject schema =new JSONObject();
        Double score=0.0;
        NumberFormat nf = NumberFormat.getNumberInstance();
        nf.setMaximumFractionDigits(2);//设置小数点最大位数
        Map mapScore=new LinkedHashMap();
        if(data.size()>0){
            schema=TablesUtil.addValue(data, jsonObject.getJSONObject("schema"),null);
//            System.out.println(schema);
            Iterator<String> it = schema.keys();
            boolean pollute=false;
            String title="";
            while (it.hasNext()) {
                String key = it.next();// 获得key
                JSONObject valueObject = schema.getJSONObject(key);//获取value
//                System.out.println(data.get(0).get(valueObject.get("col_data")));
                Object objectValue =data.get(0).get(valueObject.get("col_data"));
                String value="";
                if(objectValue!=null){
                    value=objectValue.toString();
                }
                if(!valueObject.get("col_data").equals("project")){//筛选出项目字段
                    if(this.vertify(value)) {
                        if (this.vertify(JSONObject.fromObject(value).getString(key))){//判断有没有选择答题
                            JSONObject values = JSONObject.fromObject(value).getJSONObject(key);
                            if ("A、上游20km纵深1公里内是否有污染风险源".equals(valueObject.get("title")) && "否".equals(values.get("option"))) {
                                pollute = true;
                                title = valueObject.get("label").toString().split(",")[1];
                            }
                            if (valueObject.get("label").toString().split(",").length == 2) {
                                mapScore.put(valueObject.get("label").toString().split(",")[1], values.get("score"));
                                score += Double.parseDouble(values.get("score").toString());
                            } else if (valueObject.get("label").toString().split(",").length == 3) {
                                if (mapScore.containsKey(valueObject.get("label").toString().split(",")[1])) {
                                    mapScore.put(valueObject.get("label").toString().split(",")[1], nf.format(Double.parseDouble(values.get("score").toString()) +
                                            Double.parseDouble(mapScore.get(valueObject.get("label").toString().split(",")[1]).toString())));
                                    nf.format(score += Double.parseDouble(values.get("score").toString()));
                                    if (!pollute && "上游污染风险".equals(valueObject.get("label").toString().split(",")[1])) {
                                        nf.format(score += Double.parseDouble(values.get("score").toString()));
                                    }

                                } else {
                                    mapScore.put(valueObject.get("label").toString().split(",")[1], values.get("score"));
                                    nf.format(score += Double.parseDouble(values.get("score").toString()));
                                }
                            }

                            if (pollute) {
                                mapScore.put(title, 4);
                            }
                        }else{
                            if (valueObject.get("label").toString().split(",").length == 2) {
                                mapScore.put(valueObject.get("label").toString().split(",")[1], 0);
                            } else if (valueObject.get("label").toString().split(",").length == 3) {
                                if (mapScore.containsKey(valueObject.get("label").toString().split(",")[1])) {
                                    mapScore.put(valueObject.get("label").toString().split(",")[1], 0 + Double.parseDouble(mapScore.get(valueObject.get("label").toString().split(",")[1]).toString()));
                                } else {
                                    mapScore.put(valueObject.get("label").toString().split(",")[1], 0);
                                }
                            }
                        }
                    }else{
                        if (valueObject.get("label").toString().split(",").length == 2) {
                            mapScore.put(valueObject.get("label").toString().split(",")[1], 0);
                        } else if (valueObject.get("label").toString().split(",").length == 3) {
                            if (mapScore.containsKey(valueObject.get("label").toString().split(",")[1])) {
                                mapScore.put(valueObject.get("label").toString().split(",")[1], 0 + Double.parseDouble(mapScore.get(valueObject.get("label").toString().split(",")[1]).toString()));
                            } else {
                                mapScore.put(valueObject.get("label").toString().split(",")[1], 0);
                            }

                        }
                    }
                }

//                if(valueObject.getJSONObject("value").size()>0){
//                    System.out.println(valueObject.getJSONObject("value"));
//                }
            }
        }else{
            schema=null;
        }

        Map<String, Object> map = new HashMap<>();

        map.put("score",mapScore.size()>0?JSONValue.toJSONString(mapScore):"");//得分
        map.put("total",nf.format(score));
        if(schema!=null) {
            Iterator<String> it = schema.keys();
            while (it.hasNext()) {
                String key = it.next();// 获得key
                JSONObject value = schema.getJSONObject(key);
                if (value.containsKey("value")&&this.vertify(value.get("value").toString())&&!key.equals("project")) {
                    if(value.getString("label").split(",").length>2){//判断三级label的title前面添加分类名称
                        value.put("title",
                                "["+value.getString("label").split(",")[value.getString("label").split(",").length-2]+"]    "+value.getString("title"));
                    }
                    finish.put(key, value);
                } else {
                    if(!key.equals("project")){
                        if(value.getString("label").split(",").length>2){
                        value.put("title",
                                "["+value.getString("label").split(",")[value.getString("label").split(",").length-2]+"]    "+value.getString("title"));
                        }
                       unfinished.put(key, value);
                    }
                }
            }
            JSONObject finishFrom = JSONObject.fromObject(define.get(0).get("define"));
            finishFrom.put("schema", finish);
            JSONObject unfinishedFrom = JSONObject.fromObject(define.get(0).get("define"));
            unfinishedFrom.put("schema", unfinished);

            map.put("finish", finishFrom.toString());
            map.put("unfinished",unfinishedFrom.getJSONObject("schema").size()==0?"":unfinishedFrom.toString());
            map.put("formDataId", data.size()>0?data.get(0).get("id"):0);
            map.put("projectId",this.vertify(projectId)?projectId: Integer.parseInt(data.get(0).get("project").toString()));
            map.put("finishSum", finishFrom.getJSONObject("schema").size());
            map.put("unfinishedSum", unfinishedFrom.getJSONObject("schema").size() );
            map.put("sum", jsonObject.getJSONObject("schema").size()-1);
            map.put("status", "update");
        }else{
            if( jsonObject.getJSONObject("schema").containsKey("project")){
                jsonObject.getJSONObject("schema").remove("project");
            }
            map.put("finish", "");
            map.put("unfinished",jsonObject.toString());
            map.put("projectId",projectId);
            map.put("formDataId", 0);
            map.put("finishSum", 0);
            map.put("unfinishedSum", jsonObject.getJSONObject("schema").size());
            map.put("sum",jsonObject.getJSONObject("schema").size());
            map.put("status", "create");
        }

        return map;
    }



    public List statisticsData(Integer projectId){
        String defineSql="SELECT define,tableName FROM project_define WHERE id=291 OR id=290";
        List<Map<String, Object>> defineList = this.getJdbcTemplate().queryForList(defineSql);//查询define拿到题目

        String sql="SELECT COUNT(*) AS number,DATE_FORMAT(dateCreated,'%Y') AS 'yean' FROM application_research WHERE" +
                " project=? AND `STATUS`=1 GROUP BY YEAR(dateCreated)";
        List<Map<String, Object>> list = this.getJdbcTemplate().queryForList(sql, new Object[]{projectId});//每年有多少人参加了项目

        List listObj=new ArrayList();
        if(list.size()>0){
            for (Map d:defineList){
                Map obj=null;
                List s=new ArrayList();
                for (Map map:list){
                    obj=new HashMap();
                    String dataSql="SELECT*FROM "+d.get("tableName")+" WHERE project=? AND DATE_FORMAT(dateCreated," +
                            "'%Y')=? ";//根据年分类查询数据
                    List<Map<String, Object>> list1 = this.getJdbcTemplate().queryForList(dataSql, new Object[]{projectId, map.get("yean")});
                    Double score=0.0;
                    for (Map m:list1){
                        Iterator<String> it = JSONObject.fromObject(d.get("define")).getJSONObject("schema").keys();
                        while (it.hasNext()) {
                            String key = it.next();// 获得key
                            String o = m.get(key).toString();//获取value
                            if(this.vertify(o)&&!key.equals("project")){
                                JSONObject jsonObject = JSONObject.fromObject(o);
                                if(this.vertify( jsonObject.getString(key))){//判断是否选择题目
                                    JSONObject  jsonObject1= jsonObject.getJSONObject(key);
                                    score+=Double.parseDouble(jsonObject1.get("score").toString());
                                }else{
                                    score+=0;
                                }

                            }
                        }
                    }
                    Map ss=new HashMap();
                    NumberFormat nf = NumberFormat.getNumberInstance();
                    nf.setMaximumFractionDigits(2);//设置小数点最大位数
                    ss.put("score",nf.format(score));
                    Double average=score/Integer.parseInt(map.get("number").toString());
                    ss.put("average",nf.format(average));
                    ss.put("number",map.get("number"));
                    ss.put("yean",map.get("yean"));
                 s.add(ss);
                    if("site_investigation".equals(d.get("tableName"))){
                        obj.put("title","现场调研");
                        obj.put("value",s);
                    }else{
                        obj.put("title","网络调研");
                        obj.put("value",s);
                    }
                }
                listObj.add(obj);
            }
        }
        return listObj;
    }


    public int kick(Integer teamId,Integer accountId){
        String sql="DELETE FROM team_member WHERE team_id=? AND account_id=?";
        int update = this.getJdbcTemplate().update(sql, new Object[]{teamId, accountId});
        return update;
    }


    //暂存
    public Map save(Integer defindId,Integer dataId,String columnName,String value,Integer projectId,String accountName,Integer accountId) throws SQLException {
        String tableNaemSql="SELECT tableName FROM project_define WHERE id="+defindId;
        String tableNaem= this.getJdbcTemplate().queryForObject(tableNaemSql,String.class);
        Map map=new HashMap();
        String saveSql="";
        int id;
        if(dataId>0){
            map.put("status","update");
            saveSql+="UPDATE "+tableNaem+" SET "+columnName+"=? WHERE id=? ";
            id= this.getJdbcTemplate().update(saveSql, new Object[]{value, dataId});
        }else{
            map.put("status","create");
            saveSql+="INSERT INTO "+tableNaem+" (project,"+columnName+",define_id,creator,creatorName,dateCreated," +
                    "dateUpdated,`STATUS`) VALUES(?,?,?,?,?,NOW(),NOW(),1)";
            id=this.insert(saveSql,new Object[]{projectId,value,defindId,accountId,accountName});
        }
        map.put("id",id);
        return map;
    }


    //我的调研报告 type是用来区别我的报告还是点评页面1=我的报告，2=点评页面
    public Map<String,Object> myReport(Integer accountId,Integer projectId,Integer type){
        NumberFormat nf = NumberFormat.getNumberInstance();
        nf.setMaximumFractionDigits(2);
//        nf.setRoundingMode(RoundingMode.DOWN);
        List params=new ArrayList();
        String sql="";
        if(type==1){
            sql+="SELECT id,supply_population,suggest,area,health_degree,image,project," +
                    "(SELECT project_name FROM project WHERE id=research_report.project) AS 'project_name' FROM research_report WHERE creator=? ";
            params.add(accountId);
            if (this.vertify(projectId)){
                sql+=" AND project=? ";
                params.add(projectId);
            }
            sql+=" ORDER BY dateUpdated DESC ";
        }else{
            sql+="SELECT p.number as 'supply_population',p.intro as 'area',creator\n" +
                    "FROM project p WHERE p.id=? ";
            params.add(projectId);
        }

        List<Map<String, Object>> list = this.getJdbcTemplate().queryForList(sql, params.toArray());
        if(list.size()>0){
            Map<String, Object> siteInvestigation=new HashMap<>();
            Map<String, Object> onlineResearch=new HashMap<>();
            if(type==2){
                String sql3="SELECT rp.suggest,rp.image FROM  research_report rp WHERE project=? AND creator=? ";
                List<Map<String, Object>> list1 = this.getJdbcTemplate().queryForList(sql3, new Object[]{projectId, list.get(0).get("creator")});
                if(list1.size()>0){
                    list.get(0).putAll(list1.get(0));
                }else{
                    list.get(0).put("suggest","");
                    list.get(0).put("image","[]");
                }
                String sql1="SELECT project,creator FROM site_investigation WHERE project="+projectId+" ORDER BY dateCreated";
                String sql2="SELECT project,creator FROM online_research WHERE project="+projectId+" ORDER BY dateCreated";
                List<Map<String, Object>> investigationInfo = this.getJdbcTemplate().queryForList(sql1);
                List<Map<String, Object>> researchInfo = this.getJdbcTemplate().queryForList(sql2);
                list.get(0).put("account_id",Integer.parseInt(list.get(0).get("creator").toString()));
                //现场调研分值
                siteInvestigation= this.statistics(290, projectId, Integer.parseInt(list.get(0).get("creator").toString()));
                //网络调研分值
                 onlineResearch = this.statistics(291,projectId, Integer.parseInt(list.get(0).get("creator").toString()));

                // 雷达图数据
                Map<String, Object> radar = this.radarData(projectId, Integer.parseInt(list.get(0).get("creator").toString()));
                list.get(0).put("radar",radar);

                // 查询项目列表
                String project="SELECT p.id as 'project' ,ws.waterSourceName FROM  project p INNER JOIN water_source ws ON p" +
                        ".water_source=ws.id WHERE	p.id="+projectId;
                List<Map<String, Object>> projectList= this.getJdbcTemplate().queryForList(project);
                // 添加项目列表
                list.get(0).put("project",projectList);
//                list.get(0).put("projectId",projectList);
                //添加项目下标
                list.get(0).put("index",0);

                //获取点赞或关注数
                if(accountId>0){
                    Map<String, Object> project1 = this.isDianzan(accountId,projectId);
                    list.get(0).put("dianzanNumber",project1.get("dianzanNumber"));
                    list.get(0).put("follownNumber",project1.get("follownNumber"));
                    list.get(0).put("isDianzan",project1.get("isDianzan"));
                    list.get(0).put("isFollown",project1.get("isFollown"));
                }else{
                    Map<String, Object> project1 = this.isDianzan(projectId);
                    list.get(0).put("dianzanNumber",project1.get("dianzanNumber"));
                    list.get(0).put("follownNumber",project1.get("follownNumber"));
                }

            }else{
                list.get(0).put("projectId",Integer.parseInt(list.get(0).get("project").toString()));
                //获取点赞或关注数
                Map<String, Object> project1 = this.isDianzan(accountId, this.vertify(projectId) ? projectId : Integer.parseInt(list.get(0).get("project").toString()));
                list.get(0).put("dianzanNumber",project1.get("dianzanNumber"));
                list.get(0).put("follownNumber",project1.get("follownNumber"));
                list.get(0).put("isDianzan",project1.get("isDianzan"));
                list.get(0).put("isFollown",project1.get("isFollown"));

                // 雷达图数据
                Map<String, Object> radar = this.radarData(Integer.parseInt(list.get(0).get("project").toString()), accountId);
                list.get(0).put("radar",radar);

                //现场调研分值
                siteInvestigation= this.statistics(290, Integer.parseInt(list.get(0).get("project").toString()), accountId);
                //网络调研分值
                onlineResearch = this.statistics(291,  Integer.parseInt(list.get(0).get("project").toString()), accountId);
                // 查询项目列表
                String project="SELECT rr.project,ws.waterSourceName FROM research_report rr INNER JOIN project p\n" +
                        "ON rr.project=p.id INNER JOIN water_source ws\n" +
                        "ON p.water_source=ws.id\n" +
                        "WHERE rr.creator="+accountId;
                List<Map<String, Object>> projectList= this.getJdbcTemplate().queryForList(project);
                // 添加项目列表
                list.get(0).put("project",projectList);
                //添加项目下标
                int index=0;
                for (Map<String,Object> map:projectList){
                    if(map.get("project").equals(list.get(0).get("projectId"))){
                        list.get(0).put("index",index);
                    }
                    index++;
                }
            }

            list.get(0).put("health_degree", nf.format(Double.parseDouble(siteInvestigation.get("total").toString())+Double.parseDouble(onlineResearch.get("total").toString())));

            // 图片转成数组
            list.get(0).put("image",list.get(0).get("image").toString()==""?new ArrayList<>(): JSONArray.fromObject(list.get(0).get("image")));
            //团队列表

//            // 雷达图数据
//            Map<String, Object> radar = this.radarData(Integer.parseInt(list.get(0).get("projectId").toString()), accountId);
//            list.get(0).put("radar",radar);

            return list.get(0);
        }else{
            return null;
        }
    }



    // 答题详情(健康程度详情)
    public List<Map<String,Object>> answerInfo(Integer accountId,Integer projectId){
        NumberFormat nf = NumberFormat.getNumberInstance();
        nf.setMaximumFractionDigits(2);
        nf.setRoundingMode(RoundingMode.DOWN);
        List<Map<String,Object>> list=new ArrayList<>();
        Map<String,Object> type=new HashMap<>();
        String evaluator=this.getJdbcTemplate().queryForObject("SELECT account_name FROM account WHERE id="+accountId,String.class);
        //现场调研答题情况
        Map<String, Object> siteInvestigation = this.statistics(290, projectId, accountId);
        //网络调研答题情况
        Map<String, Object> onlineResearch = this.statistics(291, projectId, accountId);

        //实地调研
        if(this.vertify(siteInvestigation.get("finish").toString())){
            List<Map<String,Object>> topic=new ArrayList<>();
            type.put("title","实地环境现状");
            type.put("score",siteInvestigation.get("total"));
            JSONObject jsonObject=JSONObject.fromObject(siteInvestigation.get("finish")).getJSONObject("schema");
            Iterator<String> it = jsonObject.keys();
            while(it.hasNext()) {
                Map<String,Object> map=new HashMap<>();
                String key = it.next();// 获得key
                JSONObject value = jsonObject.getJSONObject(key);//获取value
//                System.out.println(value);
                map.put("evaluator",evaluator);
                map.put("title",value.getString("title"));
                map.putAll(value.getJSONObject("value").getJSONObject(key));
                map.put("describe",value.getJSONObject("value").getString("describe"));
                map.put("picture",value.getJSONObject("value").getJSONArray("picture"));
                topic.add(map);
            }
        type.put("topic",topic);
            list.add(type);
        }

        //网络调研
        if(this.vertify(onlineResearch.get("finish").toString())){
            JSONObject jsonObject=JSONObject.fromObject(onlineResearch.get("finish")).getJSONObject("schema");
            List<Map<String,Object>> szxx=new ArrayList<>();
            List<Map<String,Object>> glxx=new ArrayList<>();
            List<Map<String,Object>> szdb=new ArrayList<>();
            List<Map<String,Object>> slmz=new ArrayList<>();
            Double szxxScore=0.0;
            Double glxxScore=0.0;
            Double szdbScore=0.0;
            Double slmzScore=0.0;
            Iterator<String> it = jsonObject.keys();
            while(it.hasNext()) {
                Map<String,Object> map=new HashMap<>();
                String key = it.next();// 获得key
                JSONObject value = jsonObject.getJSONObject(key);//获取value
                String[] label=value.getString("label").split(",");
                if(label[0].equals("水质信息公开")){
//                    type.put("title","水质信息公开");
//                    type.put("score",siteInvestigation.get("total"));
                    map.put("evaluator",evaluator);
                    map.put("title",value.getString("title"));
                    map.putAll(value.getJSONObject("value").getJSONObject(key));
                    map.put("describe",value.getJSONObject("value").getString("describe"));
                    map.put("picture",value.getJSONObject("value").getJSONArray("picture"));
                    //累加分数
                    if(this.vertify(value.getJSONObject("value").getString(key))){
                        szxxScore+=Double.parseDouble(value.getJSONObject("value").getJSONObject(key).getString("score"));
                    }
                    szxx.add(map);
                }else if(label[0].equals("管理信息公开")){
//                    type.put("title","管理信息公开");
                    map.put("evaluator",evaluator);
                    map.put("title",value.getString("title"));
                    map.putAll(value.getJSONObject("value").getJSONObject(key));
                    map.put("describe",value.getJSONObject("value").getString("describe"));
                    map.put("picture",value.getJSONObject("value").getJSONArray("picture"));
                    //累加分数
                    if(this.vertify(value.getJSONObject("value").getString(key))){
                        glxxScore+=Double.parseDouble(value.getJSONObject("value").getJSONObject(key).getString("score"));
                    }
                    glxx.add(map);
                }else  if(label[0].equals("水质水量状况")){
                    if(label[1].equals("水质达标")){
                        map.put("evaluator",evaluator);
                        map.put("title",value.getString("title"));
                        map.putAll(value.getJSONObject("value").getJSONObject(key));
                        map.put("describe",value.getJSONObject("value").getString("describe"));
                        map.put("picture",value.getJSONObject("value").getJSONArray("picture"));
                        if(this.vertify(value.getJSONObject("value").getString(key))){
                            szdbScore+=Double.parseDouble(value.getJSONObject("value").getJSONObject(key).getString("score"));
                        }
                        szdb.add(map);
                    }else if(label[1].equals("水量满足")){
                        map.put("evaluator",evaluator);
                        map.put("title",value.getString("title"));
                        map.putAll(value.getJSONObject("value").getJSONObject(key));
                        map.put("describe",value.getJSONObject("value").getString("describe"));
                        map.put("picture",value.getJSONObject("value").getJSONArray("picture"));
                        if(this.vertify(value.getJSONObject("value").getString(key))){
                            slmzScore+=Double.parseDouble(value.getJSONObject("value").getJSONObject(key).getString("score"));
                        }
                        slmz.add(map);
                    }
                }

            }
            if(szxx.size()>0){
                type=new HashMap<>();
                type.put("title","水质信息公开");
                type.put("score",nf.format(szxxScore));
                type.put("topic",szxx);
                list.add(type);
            }
            if(glxx.size()>0) {
                type = new HashMap<>();
                type.put("title", "管理信息公开");
                type.put("score",nf.format(glxxScore));
                type.put("topic", glxx);
                list.add(type);
            }
            if(szdb.size()>0) {
                type = new HashMap<>();
                type.put("title", "水质达标");
                type.put("score", nf.format(szdbScore));
                type.put("topic", szdb);
                list.add(type);
            }
            if(slmz.size()>0) {
                type = new HashMap<>();
                type.put("title", "水量满足");
                type.put("score",nf.format(slmzScore));
                type.put("topic", slmz);
                list.add(type);
            }
        }

return list;
    }


    // 点赞关注
    public Map<String,Object> dianzanFollow(Integer accountId,Integer projectId,Integer type) throws SQLException {
        Map<String,Object>  map=new HashMap<>();
        String sql="INSERT INTO dianzan_follow(account_id,project_id,type,create_time) VALUES(?,?,?,NOW())";
        int insert = this.insert(sql, new Object[]{accountId, projectId, type});
        String numberSql="SELECT COUNT(*)AS 'number' FROM dianzan_follow WHERE project_id=? AND type=?";
        Integer number = this.getJdbcTemplate().queryForObject(numberSql, new Object[]{projectId, type}, Integer.class);
        map.put("number",number);
        map.put("insert",insert);
        return map;
    }


    //  获取点赞，关注数量，同时获取是否已点赞
    public Map<String,Object> isDianzan(Integer accountId,Integer projectId){
        Map map=new HashMap();
        String dianzanSql="SELECT COUNT(type) AS 'number',type FROM dianzan_follow WHERE project_id=? GROUP BY type";
        String isDianzanSql="SELECT COUNT(*) as  'number',type FROM dianzan_follow WHERE project_id=? AND account_id=? " +
                " GROUP BY type";
        //获取点赞关注数量
        List<Map<String, Object>> list1 = this.getJdbcTemplate().queryForList(dianzanSql, new Object[]{projectId});
        if(list1.size()<=0){
            map.put("dianzanNumber",0);
            map.put("follownNumber",0);
        }else  if(list1.size()==1){
                if(Integer.parseInt(list1.get(0).get("type").toString())==1){
                    map.put("dianzanNumber",list1.get(0).get("number"));
                    map.put("follownNumber",0);
                }else{
                    map.put("follownNumber",list1.get(0).get("number"));
                    map.put("dianzanNumber",0);
                }
        }else{
            for(Map<String, Object> map1:list1){
                if(Integer.parseInt(map1.get("type").toString())==1){
                    map.put("dianzanNumber",map1.get("number"));
                }else{
                    map.put("follownNumber",map1.get("number"));
                }
            }
        }
        //判断用户是否点赞关注,
        List<Map<String, Object>> list = this.getJdbcTemplate().queryForList(isDianzanSql, new Object[]{projectId, accountId});
        if(list.size()<=0){
            map.put("isDianzan",0);
            map.put("isFollown",0);
        }else if (list.size()==1){
            if(Integer.parseInt(list.get(0).get("type").toString())==1){
                map.put("isDianzan",Integer.parseInt(list.get(0).get("number").toString())>0?1:0);
                map.put("isFollown",0);
            }else{
                map.put("isFollown",Integer.parseInt(list.get(0).get("number").toString())>0?1:0);
                map.put("isDianzan",0);
            }
        }else {
            for(Map<String, Object> map1:list){
                if(Integer.parseInt(map1.get("type").toString())==1){
                    map.put("isDianzan",Integer.parseInt(map1.get("number").toString())>0?1:0);
                }else{
                    map.put("isFollown",Integer.parseInt(map1.get("number").toString())>0?1:0);
                }
            }
        }

        return map;
    }

    //  获取点赞，关注数量，同时获取是否已点赞(点评页面)
    public Map<String,Object> isDianzan(Integer projectId){
        Map map=new HashMap();
        String dianzanSql="SELECT COUNT(type) AS 'number',type FROM dianzan_follow WHERE project_id=? GROUP BY type";
        //获取点赞关注数量
        List<Map<String, Object>> list1 = this.getJdbcTemplate().queryForList(dianzanSql, new Object[]{projectId});
        if(list1.size()<=0){
            map.put("dianzanNumber",0);
            map.put("follownNumber",0);
        }else  if(list1.size()==1){
            if(Integer.parseInt(list1.get(0).get("type").toString())==1){
                map.put("dianzanNumber",list1.get(0).get("number"));
                map.put("follownNumber",0);
            }else{
                map.put("follownNumber",list1.get(0).get("number"));
                map.put("dianzanNumber",0);
            }
        }else{
            for(Map<String, Object> map1:list1){
                if(Integer.parseInt(map1.get("type").toString())==1){
                    map.put("dianzanNumber",map1.get("number"));
                }else{
                    map.put("follownNumber",map1.get("number"));
                }
            }
        }

        return map;
    }

// 雷达图数据
    public Map<String,Object> radarData(Integer projectId,Integer accountId){
        //现场调研分值
        Map<String, Object> siteInvestigation = this.statistics(290, projectId, accountId);
        //网络调研分值
        Map<String, Object> onlineResearch = this.statistics(291,  projectId, accountId);
        NumberFormat nf = NumberFormat.getNumberInstance();
        nf.setMaximumFractionDigits(2);
        Map<String,Object> radar=new HashMap();
        List radarValue=new ArrayList();
        List<Map<String,Object>>  indicator=new ArrayList<>();
        Map<String,Object> map=new HashMap<>();
        map.put("name","实地环境现状");
        map.put("max",36);
        indicator.add(map);
        map=new HashMap<>();
        map.put("name","水质信息公开");
        map.put("max",20);
        indicator.add(map);
        map=new HashMap<>();
        map.put("name","管理信息公开");
        map.put("max",4);
        indicator.add(map);
        map=new HashMap<>();
        map.put("name","水质达标");
        map.put("max",28);
        indicator.add(map);
        map=new HashMap<>();
        map.put("name","水量满足");
        map.put("max",12);
        indicator.add(map);

        radar.put("indicator",indicator);
        //现场调研的得分hi
        if(this.vertify(siteInvestigation.get("finish").toString())){
            JSONObject schemaXCDY = JSONObject.fromObject(siteInvestigation.get("finish")).getJSONObject("schema");
            Iterator<String> it = schemaXCDY.keys();
            Double score=0.0;
            while(it.hasNext()) {
                String key = it.next();// 获得key
                JSONObject value = schemaXCDY.getJSONObject(key);//获取value
//                System.out.println(value.get("title").toString()+"==="+value.getJSONObject(
//                        "value").getJSONObject(key).get("score").toString());
                score+= Double.parseDouble(value.getJSONObject("value").getJSONObject(key).get("score").toString());
            }
            //添加现场调研分值
            radarValue.add(nf.format(score));
        }else{
            radarValue.add(0);
        }

        //网络调研
        if(this.vertify(onlineResearch.get("finish").toString())) {
            JSONObject schemaWLDY = JSONObject.fromObject(onlineResearch.get("finish")).getJSONObject("schema");
            Iterator<String> it2 = schemaWLDY.keys();
            Double szxx = 0.0;
            Double glxx = 0.0;
            Double szdb = 0.0;
            Double slmz = 0.0;
            while (it2.hasNext()) {
                String key = it2.next();// 获得key
                JSONObject value = schemaWLDY.getJSONObject(key);//获取value
                if (value.get("label").toString().split(",")[0].equals("水质信息公开")) {
                    szxx += Double.parseDouble(value.getJSONObject("value").getJSONObject(key).get("score").toString());
                } else if (value.get("label").toString().split(",")[0].equals("管理信息公开")) {
                    glxx += Double.parseDouble(value.getJSONObject("value").getJSONObject(key).get("score").toString());
                } else if (value.get("label").toString().split(",")[1].equals("水质达标")) {
                    szdb += Double.parseDouble(value.getJSONObject("value").getJSONObject(key).get("score").toString());
                } else if (value.get("label").toString().split(",")[1].equals("水量满足")) {
                    slmz += Double.parseDouble(value.getJSONObject("value").getJSONObject(key).get("score").toString());
                }
            }
            //添加网络调研分值
            radarValue.add(nf.format(szxx));
            radarValue.add(nf.format(glxx));
            radarValue.add(nf.format(szdb));
            radarValue.add(nf.format(slmz));
        }else{
            radarValue.add(0);
            radarValue.add(0);
            radarValue.add(0);
            radarValue.add(0);
        }
        radar.put("value",radarValue);

        return radar;
    }

//判断是否为队长或没有加入团队
    public boolean isCaptain(Integer accountId){
        if(this.getJdbcTemplate().queryForObject("SELECT COUNT(*) FROM team WHERE creator="+accountId,
                Integer.class)>0||this.getJdbcTemplate().queryForObject("SELECT COUNT(*) FROM team_member WHERE account_id="+accountId,Integer.class)<=0) {
            return true;
        }else {
            return false;
        }
    }




    //查询关联表数据拼接到define中
    public JSONObject addOptions(Long defineId,Integer accountId,String city){
        System.out.println("用户id："+accountId+"========当前城市："+city);
        // 查询define
        String sql = "SELECT id,id define_id,tableName, dateCreated,companyCode, creator, formTitle, define, formDescription, MODIFIER, dateUpdated, usableRange,sub, (CASE WHEN (SELECT COUNT(*) FROM project_define_data pdd WHERE pdd.define_id = pd.id) > 0 THEN 'true' WHEN (SELECT COUNT(*) FROM project_define_data pdd WHERE pdd.define_id=pd.id) = 0 THEN 'false' END)AS dataCounts FROM project_define pd where id = ?";
        List<Template> list =this.getJdbcTemplate().query(sql, new Object[]{defineId}, new BeanPropertyRowMapper<Template>(Template.class));
        // 查询关联表数据
        String sql2 = "SELECT target_table,value,`key` FROM project_table_relation WHERE this_table=(SELECT tableName FROM project_define WHERE id=" + defineId + ")";
        List<Map<String, Object>> mapList1 = this.getJdbcTemplate().queryForList(sql2);
        JSONObject jsonObject = JSONObject.fromObject(list.get(0).getDefine());
        //判断关联表是否有数据
        if (mapList1.size() > 0) {
            for (Map<String, Object> map : mapList1) {
                List<Map<String, Object>> mapList=null;
                if("application_research".equals(list.get(0).getTableName())){
//                    String address=" SELECT address FROM  "+map.get("target_table");
//                        JSONObject jsonObject1=JSONObject.fromObject(address);
                    String sql3= "SELECT  "+map.get("key").toString()+",(SELECT waterSourceName FROM " +
                                            "water_source ws WHERE "+map.get("value").toString()+"=ws.id) AS " +
                                            "'value'  FROM "+map.get("target_table")+" WHERE address LIKE  ? AND `status`!=? ";//查询当前市并且没有结项的项目

                    mapList= this.getJdbcTemplate().queryForList(sql3,new Object[]{"%"+city+"%",4});
                }else if("project".equals((list.get(0).getTableName()))){//创建项目查询关系表
                    String sql3="SELECT " +map.get("value")+" AS 'value'  FROM "+map.get("target_table") +" WHERE 1=1 ";
                    if(this.vertify(city)){ //根据地区筛选水源地
                        sql3+=" AND address LIKE "+"'%"+city+"%'";
                    }
                    mapList= this.getJdbcTemplate().queryForList(sql3);
//                }else if ("research_report".equals((list.get(0).getTableName()))){
//                    String sql3="SELECT " +map.get("value").toString().split(",")[0]+",(SELECT waterSourceName FROM water_source ws WHERE "+
//                            map.get("value").toString().split(",")[1]+"=ws.id)"+" AS 'value'  FROM "+map.get("target_table")+" WHERE  id IN " +
//                            "(SELECT project FROM application_research WHERE `STATUS`=1) AND `STATUS`!=? ";
//                            mapList= this.getJdbcTemplate().queryForList(sql3,new Object[]{4});
                }else{
                    if(!map.get("target_table").equals("project")){
                        String sql3="SELECT " +map.get("value")+" AS 'value'  FROM "+map.get("target_table");
                        mapList= this.getJdbcTemplate().queryForList(sql3);
                    }else{
                        String sql3="";
                        //判断用户是否为队长或没有加入过团队()
                        if(this.isCaptain(accountId)){
                            sql3+="SELECT " +map.get("value").toString().split(",")[0]+",(SELECT waterSourceName FROM " +
                                    "water_source ws WHERE  "+map.get("value").toString().split(",")[1]+"=ws.id)"+" AS " +
                                    "'value'  FROM "+map.get("target_table")+" WHERE creator=? AND `STATUS`!=?";
                        }else{
                            Integer captainId=this.getJdbcTemplate().queryForObject("SELECT creator FROM team WHERE id=(SELECT " +
                                    "team_id FROM team_member WHERE account_id="+accountId+")",Integer.class);
                            accountId=captainId;
                            sql3+="SELECT " +map.get("value").toString().split(",")[0]+",(SELECT waterSourceName FROM " +
                                    "  water_source ws WHERE  "+map.get("value").toString().split(",")[1]+"=ws.id) AS" +
                                    "'value'  FROM "+map.get("target_table")+" WHERE creator=? AND `STATUS`!=?";
                        }

//                    String sql3="SELECT " +map.get("value")+" AS 'value'  FROM "+map.get("target_table");
                        mapList= this.getJdbcTemplate().queryForList(sql3,new Object[]{accountId,4});
                    }

                }
                if(mapList.size()==0){
                    jsonObject.getJSONObject("schema").getJSONObject(map.get("target_table").toString()).put(
                            "placeholder", "暂无数据");
                }
                jsonObject.getJSONObject("schema").getJSONObject(map.get("target_table").toString()).put("options", mapList);
                jsonObject.getJSONObject("schema").getJSONObject(map.get("target_table").toString()).put("value", map.get("key"));
            }
        }

        return jsonObject;
    }


    public JSONObject addColumn(Integer defineId,Template template,List list) {
        String sql2 = "SELECT target_table,value,`key` FROM project_table_relation WHERE this_table=(SELECT tableName FROM project_define WHERE id=" + defineId + ")";
        List<Map<String, Object>> mapList1 = this.getJdbcTemplate().queryForList(sql2);
        JSONObject jsonObject = JSONObject.fromObject(template.getDefine());
        if (mapList1.size() > 0) {
            if(list.size()>0){
                jsonObject.put("value", list.get(0));
            }else{
                jsonObject.put("value", null);
            }

            if (template.getTableName().equals("online_research") || template.getTableName().equals("site_investigation")) {
                JSONObject map1 = new JSONObject();
                JSONObject tem = new JSONObject();
                tem.put("type", "SelectButton");
                tem.put("outHiden", false);
                tem.put("searchHiden", false);
                tem.put("orderHiden", false);
                tem.put("columnHiden", false);
                tem.put("isChildren", 1);
                tem.put("itemIndex", -1);
                tem.put("indexoption", -1);
                tem.put("jumpProblem", "[]");
                JSONObject schema = jsonObject.getJSONObject("schema");
                Iterator<String> it = schema.keys();
                while (it.hasNext()) {
                    String key = it.next();// 获得key
                    JSONObject value = schema.getJSONObject(key);//获取value
                    if (value.has("label")) {//判断是否有label 键值
                        String label = value.getString("label");
                        String[] labes = label.split(",");
                        tem.put("title", labes[0]);
                        tem.put("col_data", labes[0]);

                        List options = new ArrayList();
                        JSONObject schema1 = jsonObject.getJSONObject("schema");
                        Iterator<String> it1 = schema1.keys();
                        while (it1.hasNext()) {
                            JSONObject object = new JSONObject();
                            String key1 = it1.next();// 获得key
                            JSONObject value1 = schema1.getJSONObject(key1);//获取value
                            if (value1.has("label")) {//判断是否有label 键值
                                String label1 = value1.getString("label");
                                String[] labes1 = label1.split(",");
                                if (labes1[0].equals(labes[0])) {
                                    object.put("value", labes1[1]);
                                    JSONObject value2 = jsonObject.getJSONObject("value");
                                    if(value2.size()==0){
                                        object.put("color", "grey");
                                    }else{
//                                        System.out.println(labes1[1] + ">>>>>>>>>" + value1.getString("col_data"));
//                                        System.out.println(value2.getString(value1.getString("col_data")));
                                        if ("".equals(value2.getString(value1.getString("col_data"))) || value2.getString(value1.getString("col_data"))==null||value2.getString(value1.getString("col_data")).equals("null")) {
                                            object.put("color", "grey");
                                        } else {
                                            object.put("color", "green");
                                        }
                                    }
                                        options.add(object);
                                }
                            }
                        }
//                        Set optionsSet = new HashSet<>(options);//去重
//                        options = new ArrayList<>(optionsSet);
                        for (int i=0;i<options.size();i++){//删除HashSet没有去重的数据
                            String value1 = JSONObject.fromObject(options.get(i)).get("value").toString();
                            for (int j=i+1;j<options.size();j++){
                                if(JSONObject.fromObject(options.get(j)).get("value").toString().equals(value1)){
                                    if(JSONObject.fromObject(options.get(j)).get("color").toString().equals("grey")){
                                        options.remove(j);
                                    }else{
                                        options.remove(i);
                                    }
                                }
                            }
                        }

                        for (int i=0;i<options.size();i++){//删除HashSet没有去重的数据
                            String value1 = JSONObject.fromObject(options.get(i)).get("value").toString();
                            for (int j=i+1;j<options.size();j++){
                                if(JSONObject.fromObject(options.get(j)).get("value").toString().equals(value1)){
                                    if(JSONObject.fromObject(options.get(j)).get("color").toString().equals("grey")){
                                        options.remove(j);
                                    }else{
                                        options.remove(i);
                                    }
                                }
                            }
                        }
                        tem.put("options", options);
                        map1.put(labes[0], tem);
                    }
                }

                jsonObject.getJSONObject("schema").put("lableColumn","{}");//前端需要用的东西
                //循环把网络调研和实地调研分组拼到define中
                Iterator<String> mapit = map1.keys();
                while (mapit.hasNext()) {
                    String key = mapit.next();// 获得key
                    JSONObject value = map1.getJSONObject(key);//获取value
                    schema.put(key, value);
                }
                jsonObject.put("schema", schema);
//                System.out.println(schema);
            }
        }
        return jsonObject;
    }


//    public int setupComplete(Integer defineId,Integer id,Integer status){
//        String sql="SELECT tableName FROM project_define WHERE id="+defineId;
//        String tableName= this.getJdbcTemplate().queryForObject(sql, String.class);
//        String sql2="UPDATE site_investigation SET `STATUS`=?  WHERE id=?";
//        int update = this.getJdbcTemplate().update(sql2, new Object[]{status, id});
//            return update;
//    }


}
