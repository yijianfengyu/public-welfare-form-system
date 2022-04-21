package com.projectManage.dao;


import com.auth.dao.UserDao;
import com.auth.entity.User;
import com.common.jdbc.JdbcBase;
import com.projectManage.entity.Daily;
import com.projectManage.entity.Project;
import com.projectManage.entity.ProjectReport;
import com.utils.CommonUtils;
import com.utils.Handle;
import com.utils.Page;
import com.utils.TreeUtil;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.jdbc.core.BeanPropertyRowMapper;
import org.springframework.stereotype.Repository;

import java.sql.SQLException;
import java.util.*;

@Repository
public class PMDao extends JdbcBase {
    @Autowired
    UserDao userDao;

    public Page queryProject(Project p, String currentPage, User user) {

        int current = 1;
        if (null != currentPage && !"".equals(currentPage)) {
            current = Integer.parseInt(currentPage);
        }
        List<String> params = new ArrayList<String>();
        String sql = "SELECT DISTINCT pd.*, IF(IFNULL(pd.actualEndTime,NOW())>pd.expectedEndTime,'YES','NO') isOverdue FROM project_data pd WHERE pd.parentId=0 ";
        //不是admin时，只查项目为自己负责或者可视人里面有自己的项目
        /** **/
        if (!"admin".equals(user.getRoleType())) {
            sql += " AND (pd.id IN(SELECT id FROM project_data WHERE executor=?) or viewPeople like ? or viewPeople='All' ) ";
            params.add(user.getId());
            params.add("%".concat(user.getId()).concat("%"));
        }

        if (null != p.getProjectName() && !"".equals(p.getProjectName())) {
            params.add("%".concat(p.getProjectName()).concat("%"));
            sql += " AND pd.projectName like ? ";
        }
        if (null != p.getExecutor() && !"".equals(p.getExecutor())) {
            params.add(p.getExecutor());
            sql += " AND pd.executor = ? ";
        }
        if (null != p.getGroupId() && !"".equals(p.getGroupId())) {
            params.add(p.getGroupId());
            sql += " AND pd.groupId = ? ";
        }
        if (null != p.getId() && !"".equals(p.getId())) {
            params.add(p.getId());
            sql += " AND pd.id = ? ";
        }
        params.add(user.getCompanyCode());
        sql += " AND pd.companyCode = ?";

        sql += " GROUP BY pd.id ORDER BY pd.updateDate DESC";

        Page page = this.queryForPage(sql, params, current, 10, Project.class);

        return page;
    }

    public List<Project> queryProject(Project p, User user) {
        String isCollapsed = "";
        if (!this.vertify(p.getGroupId())) {
            isCollapsed = ",IF(pd.parentId=0,'true','false') isCollapsed";
        }
        String sql = "SELECT DISTINCT pd.*,pd.projectName name," +
                "IF(IFNULL(pd.actualEndTime,NOW())>pd.expectedEndTime,'YES','NO') isOverdue," +
                "(SELECT username FROM system_user WHERE id = pd.creater) createrName " +
                "" + isCollapsed + "  from project_data pd " +
                "where 1=1 AND pd.companyCode = ? ";
        List<String> params = new ArrayList<String>();
        params.add(user.getCompanyCode());

        //不是admin时，只查项目为自己负责或者可视人里面有自己的项目
        /** **/
        if (!"admin".equals(user.getRoleType())) {
            sql += " AND (pd.id IN(SELECT id FROM project_data WHERE executor=?) or viewPeople like ? or viewPeople='All' ) ";
            params.add(user.getId());
            params.add("%".concat(user.getId()).concat("%"));
        }
        if (this.vertify(p.getGroupId())) {
            sql += " and pd.groupId =?";
            params.add(p.getGroupId());
        }
        if (this.vertify(p.getStatus())) {
            sql += " and pd.status <>'Cancel'";
        }

        sql += " ORDER BY sequence ASC";

        List<Project> list = this.getJdbcTemplate().query(sql, params.toArray(), new BeanPropertyRowMapper<Project>(Project.class));

        //过滤其他项目，只筛选自己负责的项目
        if (this.vertify(p.getExecutor())) {
            list = TreeUtil.filterTreeExecutor(list, p.getExecutor());
        }
        return list;
    }

    public String queryProjectTree(Project p, User user) {
        return TreeUtil.toTreeJson(queryProject(p, user));
    }

    /**
     * 为下拉框生成树结构
     *
     * @param p
     * @param user
     * @return
     */
    public List<Map<String, Object>> queryProjectTreeForSelect(Project p, User user) {
        return TreeUtil.toTreeJsonForSelect(queryProject(p, user));
    }

    public Handle updateProject(Project p) {
        if (p.getRegionId() != null && !"".equals(p.getRegionId())&&!"0".equals(p.getRegionId())) {
            p.setRegionAddress(this.getJdbcTemplate().queryForObject(
                    "SELECT case when count(1)=1 then mername else null end FROM region WHERE id=?",
                    new Object[]{p.getRegionId()}, String.class));
        }
        String sql = "UPDATE project_data SET " +
                "projectName=?,executor=?,executorName=?,startDate=?," +
                "expectedEndTime=?,actualEndTime=?,projectProgress=?,priority=?," +
                "level=?,viewPeople=?,remark=?,status=?,updateDate=NOW()," +
                "projectType=?,process=?,regionId=?,regionAddress=?," +
                "subject=?,solveWay=?,enjoyNum=? " +
                "WHERE id =? AND companyCode = ? ";
        int i = this.getJdbcTemplate().update(sql, new Object[]{
                p.getProjectName(), p.getExecutor(), p.getExecutorName(), p.getStartDate(),
                p.getExpectedEndTime(), "".equals(p.getActualEndTime()) ? null : p.getActualEndTime(), p.getProjectProgress(), p.getPriority(),
                p.getLevel(), p.getViewPeople(), p.getRemark(), p.getStatus(),
                p.getProjectType(), p.getProcess(), p.getRegionId(), p.getRegionAddress(),
                p.getSubject(),p.getSolveWay(),p.getEnjoyNum(),
                p.getId(), p.getCompanyCode()});
        if (i > 0) {
            return new Handle(1, "修改成功");
        } else {
            return new Handle(0, "修改失败");
        }
    }

    public Handle createProject(Project p, User user) {
        String pmno;
        if (null == p.getGroupId() || "".equals(p.getGroupId()) || "0".equals(p.getGroupId())) {
            pmno = this.nextvalDay("PMNO");
        } else {
            pmno = p.getGroupId();
        }

        int count = this.getJdbcTemplate().queryForObject("select count(1) from project_data where parentId = ? and companyCode = ?", new Object[]{p.getParentId(), user.getCompanyCode()}, Integer.class);

        String sql = "INSERT INTO project_data (parentId,groupId,projectName,createDate,updateDate,startDate,expectedEndTime,status," +
                "creater,createrName,executor,executorName,remark,level,priority,viewPeople,projectProgress,companyCode,sequence)VALUES (?,?,?,NOW(),NOW(),?,?,'Active', ?,?,?,?,?,?,?,?,?,?,?)";

//        int id = this.getStockNextIndex("project_data");

//        int i = this.getJdbcTemplate().update(sql,new Object[]{p.getParentId(),pmno,p.getProjectName(),p.getStartDate(),p.getExpectedEndTime(),
//                p.getCreater(),p.getCreaterName(),p.getExecutor(),p.getExecutorName(),p.getRemark(),p.getLevel(),p.getPriority(),p.getViewPeople(),p.getProjectProgress(),p.getCompanyCode(),count+1});
        List<String> params = new ArrayList<>();
        params.add(p.getParentId());
        params.add(pmno);
        params.add(p.getProjectName());
        params.add(p.getStartDate());
        params.add(p.getExpectedEndTime());
        params.add(user.getId());
        params.add(user.getUserName());
        params.add(p.getExecutor());
        params.add(p.getExecutorName());
        params.add(p.getRemark());
        params.add(p.getLevel());
        params.add(p.getPriority());
        params.add(p.getViewPeople());
        params.add(p.getProjectProgress());
        params.add(user.getCompanyCode());
        params.add(String.valueOf(count + 1));
        int id = 0;
        try {
            id = this.insert(sql, params);
        } catch (Exception e) {
            System.out.println(e);
        }
        if (id > 0) {
            //新建完项目之后为所有用户添加关注
            this.createProjectFocusList(user, String.valueOf(id));
            //新建子项目后在父项目下新建日志
            if (p.getParentId() != "0" && !"0".equals(p.getParentId())) {
                this.createProjectDaily(p, user);
            }

            return new Handle(1, "新增成功", id);
        } else {
            return new Handle(0, "新增失败");
        }
    }

    //新建完项目之后为所有用户添加关注
    public void createProjectFocusList(User user, String projectId) {
        List<User> userList = userDao.queryAllActiveUser(user.getCompanyCode());
        for (int j = 0; j < userList.size(); j++) {
            String sqlFocus = "INSERT INTO project_focus (userId, projectId,type, createDate, updateDate) VALUES (?,?,'project',NOW(),NOW())";
            this.getJdbcTemplate().update(sqlFocus, new Object[]{userList.get(j).getId(), projectId});
        }
    }

    //新建子项目后在父项目下addProjectResourceModel新建日志
    public void createProjectDaily(Project pr, User user) {
        String sql = "INSERT INTO project_daily (projectId, content,createId,createName,createDate,updateDate,projectPath,groupId,dailyType)VALUES(?,?,?,?,NOW(),NOW(),?,?,?)";
        //某某人某时间上传了某文件
        String content = user.getUserName() + "添加了《 " + pr.getProjectName() + " 》子项目";
        this.getJdbcTemplate().update(sql, new Object[]{pr.getParentId(), content, user.getId(), user.getUserName(), null, pr.getGroupId(), "child"});
    }

    //更新修改项目时间
    public int updateProjectUpdateDate(String projectId, String companyCode) {
        String sql = "UPDATE project_data SET updateDate=NOW() WHERE id =? AND companyCode = ? ";
        return this.getJdbcTemplate().update(sql, new Object[]{projectId, companyCode});
    }

    public List<Daily> queryProjectDaily(Daily daily, Integer parentId, Integer currentPage, String companyCode) {
        String sql = "SELECT y.*,a.projectName,c.key processName FROM project_daily Y  " +
                "LEFT JOIN project_data a ON y.projectId=a.id " +
                "LEFT JOIN sales_system_config c ON y.projectProcess=c.value AND c.groupName='项目阶段' where 1=1 ";
        List<String> params = new ArrayList<String>();
        if (null != daily.getDataId() && !"".equals(daily.getDataId()) && null != parentId && 0 != parentId) {
            sql += " AND y.projectId = '" + daily.getDataId() + "'";
        }
        /**if(null!=daily.getProjectName() && !"".equals(daily.getProjectName())){
         sql += " AND a.projectName = '"+daily.getProjectName()+"'";
         }**/
        sql += " AND y.groupId =  '" + daily.getGroupId() + "'";
        sql += " AND a.companyCode = '" + companyCode + "'";

        /**if(null!=daily.getCreateDate() && !"".equals(daily.getCreateDate())){
         //sql += " AND DATE_FORMAT(y.createDate,'%Y-%m-%d') = DATE_FORMAT('"+daily.getCreateDate()+"','%Y-%m-%d') ";
         }**/
        sql += " order by y.updateDate desc";

        sql += " LIMIT " + (currentPage - 1) * 5 + ", " + 5;
        return this.getJdbcTemplate().query(sql, new Object[]{}, new BeanPropertyRowMapper(Daily.class));
    }

    public Page queryProjectDailyByPage(Daily daily) {
        String sql = "SELECT  a.*," +
                "(SELECT GROUP_CONCAT(projectName) FROM project_data WHERE FIND_IN_SET(id,a.projectPath)  )  projectName\n" +
                "FROM project_daily a LEFT JOIN project_data d " +
                "ON a.projectId=d.id where 1=1 ";
        List<String> params = new ArrayList<String>();
        if (null != daily.getCreateName() && !"".equals(daily.getCreateName())) {
            sql += " AND a.createName = '" + daily.getCreateName() + "'";
        }
        if (null != daily.getGroupId() && !"".equals(daily.getGroupId())) {
            sql += " AND a.groupId = '" + daily.getGroupId() + "'";
        }
        if (null != daily.getProjectName() && !"".equals(daily.getProjectName())) {
            sql += " AND a.projectName like '%" + daily.getProjectName() + "%'";
        }
        if (null != daily.getStartTime() && !"".equals(daily.getStartTime())) {
            sql += " AND a.createDate >= '" + daily.getStartTime() + "'";
        }
        if (null != daily.getEndTime() && !"".equals(daily.getEndTime())) {
            sql += " AND a.createDate <= '" + daily.getEndTime() + "'";
        }
        sql += " ORDER BY a.updateDate DESC";
        int current = daily.getCurrentPage();
        return this.queryForPage(sql, params, current, 10, Daily.class);
    }

    public Handle createProjectDaily(Daily daily, String companyCode) {
        String projectProcess = this.getJdbcTemplate().queryForObject(
                "SELECT `process` FROM project_data WHERE id=?",
                new Object[]{daily.getProjectId()},
                String.class);
        String sql = "INSERT INTO project_daily (projectId, content,createId,createName," +
                "createDate,updateDate,projectPath,groupId," +
                "`uuid`,projectProcess)VALUES(?,?,?,?," +
                "NOW(),NOW(),?,?," +
                "?,?)";
        List<String> params = new ArrayList<>();
        params.add(daily.getProjectId());
        params.add(daily.getContent());
        params.add(daily.getCreateId());
        params.add(daily.getCreateName());
        params.add(daily.getProjectPath());
        params.add(daily.getGroupId());
        String uuid = null;
        if (this.vertify(daily.getUuid())) {
            uuid = daily.getUuid();
        } else {
            uuid = UUID.randomUUID().toString();
        }
        params.add(uuid);
        params.add(projectProcess);
        int id = 0;
        try {
            id = this.insert(sql, params);
        } catch (Exception e) {
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

    public Handle updateProjectDaily(Daily daily, User user) {
        String sql = "UPDATE project_daily SET content=?, updateDate=NOW() WHERE id=? ";
        int flag = this.getJdbcTemplate().update(sql, new Object[]{daily.getContent(), daily.getId()});
        if (flag > 0) {
            //更新修改项目时间
            this.updateProjectUpdateDate(daily.getProjectId(), user.getCompanyCode());
        }
        return CommonUtils.getHandle(flag);
    }

    public Handle deleteProjectDaily(Daily daily, User user) {
        String sql = "DELETE FROM project_daily WHERE id=? ";
        int flag = this.getJdbcTemplate().update(sql, new Object[]{daily.getId()});
        if (flag > 0) {
            //更新修改项目时间
            this.updateProjectUpdateDate(daily.getProjectId(), user.getCompanyCode());
        }
        return CommonUtils.getHandle(flag);
    }

    public Handle copyProject(Project p, User user) {
        //通过判断看传进来的p是否完整  不完整意味着第一次执行，需通过id查询拿到整个项目,后面的不需要查询
        if ("".equals(p.getProjectName()) || null == p.getProjectName()) {
            String creater = p.getCreater();
            String selectSql = "SELECT * FROM project_data WHERE id=? AND companyCode = ?";
            p = this.getJdbcTemplate().queryForObject(selectSql, new Object[]{p.getId(), user.getCompanyCode()}, new BeanPropertyRowMapper<Project>(Project.class));
            p.setCreater(creater);
            p.setProjectName(p.getProjectName() + "-复制体");
        }
        //通过parentId判断是不是根节点
        String groupId;
        String parentId;
        if ("0".equals(p.getParentId()) || "".equals(p.getParentId())) {
            parentId = "0";
            groupId = this.nextvalDay("PMNO");
        } else {
            parentId = p.getParentId();
            groupId = p.getGroupId();
        }
        //保存新的数据
        String insertSql = "INSERT INTO project_data(parentId,groupId,projectName,createDate,updateDate,`status`,creater,createrName,executor,executorName,remark,priority," +
                "viewPeople,projectProgress,companyCode)VALUES (?,?,?,NOW(),NOW(),  ?,?,?,?,?,  ?,?,?,0,?)";
        this.getJdbcTemplate().update(insertSql, new Object[]{parentId, groupId, p.getProjectName(), p.getStatus(),
                p.getCreater(), p.getCreaterName(), p.getExecutor(), p.getExecutorName(), p.getRemark(), p.getPriority(), p.getViewPeople(), user.getCompanyCode()});
        //拿到保存的新数据的ID
        String newId = this.getJdbcTemplate().queryForObject("SELECT id FROM project_data WHERE projectName=? AND companyCode=? ORDER BY id DESC LIMIT 1",
                new Object[]{p.getProjectName(), user.getCompanyCode()}, String.class);
        //保存数据对应的文件资源
        String copyResources = "INSERT INTO project_resources (projectId,resourcesName,isEssential,`status`,`type`)" +
                "(SELECT " + newId + " projectId,resourcesName,isEssential,'未上传' `status`,`type` FROM project_resources " +
                "WHERE projectId=" + p.getId() + " AND `type`='文件')";
        this.getJdbcTemplate().update(copyResources);

        //新建完项目之后为所有用户添加关注
        this.createProjectFocusList(user, newId);

        //通过id拿到下一级的项目
        String nextSql = "SELECT * FROM project_data WHERE parentId=? AND companyCode=? ";
        List<Project> list = this.getJdbcTemplate().query(nextSql, new Object[]{p.getId(), user.getCompanyCode()}, new BeanPropertyRowMapper(Project.class));
        //判断有没有子项目，然后往下复制
        if (list.size() > 0) {
            for (int i = 0; i < list.size(); i++) {
                Project pro = list.get(i);
                pro.setParentId(newId);
                pro.setCreater(p.getCreater());
                pro.setGroupId(groupId);
                copyProject(pro, user);
            }
        }
        return new Handle(1, "success");
    }

    public Handle deleteProject(String id, User user) {
        //通过id拿到项目
        String selectSql = "SELECT * FROM project_data WHERE id=? AND companyCode=? ";
        Project p = this.getJdbcTemplate().queryForObject(selectSql, new Object[]{id, user.getCompanyCode()}, new BeanPropertyRowMapper<Project>(Project.class));
        //添加到记录表
        String insertSql = "INSERT INTO project_data_his(id,parentId,groupId,projectName,createDate,updateDate,startDate,expectedEndTime,actualEndTime," +
                "status,creater,createrName,executor,executorName,remark,level,priority,viewPeople,projectProgress,deletePeople,companyCode)VALUES " +
                "(?,?,?,?,?,  ?,?,?,?,  ?,?,?,?,?,?,  ?,?,?,?,  ?,?)";
        this.getJdbcTemplate().update(insertSql, new Object[]{p.getId(), p.getParentId(), p.getGroupId(), p.getProjectName(), p.getCreateDate(), p.getUpdateDate(), p.getStartDate(),
                p.getExpectedEndTime(), p.getActualEndTime(), p.getStatus(), p.getCreater(), p.getCreaterName(), p.getExecutor(), p.getExecutorName(), p.getRemark(), p.getLevel(),
                p.getPriority(), p.getViewPeople(), p.getProjectProgress(), user.getUserName(), user.getCompanyCode()});
        //删除数据
        this.getJdbcTemplate().update("DELETE FROM project_data WHERE id=? AND companyCode=? ", new Object[]{id, user.getCompanyCode()});
        //通过id拿到下一级子项目
        String nextSql = "SELECT * FROM project_data WHERE parentId=? AND companyCode=? ";
        List<Project> list = this.getJdbcTemplate().query(nextSql, new Object[]{id, user.getCompanyCode()}, new BeanPropertyRowMapper(Project.class));
        //判断有没有子项目，然后往下删除
        if (list.size() > 0) {
            for (int i = 0; i < list.size(); i++) {
                deleteProject(list.get(i).getId(), user);
            }
        }
        return new Handle(1, "");
    }

    public List<Map<String, Object>> queryProjectName(String parentId, String companyCode) {
        String sql = " SELECT id,projectName,groupId FROM project_data WHERE parentId= ? AND companyCode=? ";
        List<Map<String, Object>> list = this.getJdbcTemplate().query(sql, new Object[]{parentId, companyCode}, new BeanPropertyRowMapper(Project.class));
        return list;
    }

    public Handle updateDaily(Daily d) {
        String sql = "UPDATE project_daily SET content=?, updateDate=NOW() WHERE id=?";
        this.getJdbcTemplate().update(sql, new Object[]{d.getContent(), d.getId()});
        return new Handle();
    }

    public Page queryProjectAll(Project p, String currentPage) {
        int current = 1;
        if (null != currentPage && !"".equals(currentPage)) {
            current = Integer.parseInt(currentPage);
        }
        List<String> params = new ArrayList<String>();
        String sql = "SELECT id,groupId,projectName,executor,remark,`status` FROM project_data WHERE parentId=0 AND companyCode=?";

        params.add(p.getCompanyCode());

        if (null != p.getProjectName() && !"".equals(p.getProjectName())) {
            params.add("%".concat(p.getProjectName()).concat("%"));
            sql += " AND projectName like ? ";
        }
        if (null != p.getGroupId() && !"".equals(p.getGroupId())) {
            params.add(p.getGroupId());
            sql += " AND groupId = ? ";
        }
        if (null != p.getId() && !"".equals(p.getId())) {
            params.add(p.getId());
            sql += " AND id = ? ";
        }

        sql += " ORDER BY updateDate DESC";

        Page page = this.queryForPage(sql, params, current, 10, Project.class);
        return page;
    }

    public int queryCountProject(String companyCode) {
        String sql = "SELECT count(*) FROM project_data WHERE parentId = 0 AND companyCode = ?";
        int result = this.getJdbcTemplate().queryForObject(sql, new Object[]{companyCode}, Integer.class);
        return result;
    }

    public Handle createProjectReport(ProjectReport p) {
        String sql = "INSERT INTO project_report (content, projectId, resourcesUuid, createDate, updateDate) VALUES (?,?,?,NOW(),NOW())";

        int result = this.getJdbcTemplate().update(sql, new Object[]{p.getContent(), p.getProjectId(), p.getResourcesUuid()});
        return CommonUtils.getHandle(result);
    }

    public Handle updateProjectReport(ProjectReport p) {
        String sqlSelect = "SELECT count(*) FROM project_report WHERE resourcesUuid=? ";
        int count = this.getJdbcTemplate().queryForObject(sqlSelect, new Object[]{p.getResourcesUuid()}, Integer.class);
        if (count > 0) {
            String sqlUpdate = "UPDATE project_report SET content= ? ,updateDate = NOW() WHERE resourcesUuid = ? ";
            int result = this.getJdbcTemplate().update(sqlUpdate, new Object[]{p.getContent(), p.getResourcesUuid()});
            return CommonUtils.getHandle(result);
        } else {
            String sqlInsert = "INSERT INTO project_report (content, projectId, resourcesUuid, createDate, updateDate) VALUES (?,?,?,NOW(),NOW())";
            int result = this.getJdbcTemplate().update(sqlInsert, new Object[]{p.getContent(), p.getProjectId(), p.getResourcesUuid()});
            String sqlPr = "  UPDATE project_resources SET  createDate = NOW() , `STATUS` = '已上传' WHERE uuid = ?  ";
            this.getJdbcTemplate().update(sqlPr, p.getResourcesUuid());
            return CommonUtils.getHandle(result);
        }
    }

    public Handle deleteProjectReport(ProjectReport p) {
        String sql = "DELETE FROM project_report WHERE resourcesUuid = ? ";
        int result = this.getJdbcTemplate().update(sql, new Object[]{p.getResourcesUuid()});
        return CommonUtils.getHandle(result);
    }

    public List queryProjectReport(ProjectReport p) {
        String sql = "SELECT pr.*,pres.resourcesName FROM project_report pr RIGHT JOIN project_resources pres ON pr.resourcesUuid=pres.uuid WHERE pres.type='图文' AND pres.uuid = ? ";
        List<ProjectReport> list = this.getJdbcTemplate().query(sql, new Object[]{p.getResourcesUuid()}, new BeanPropertyRowMapper(ProjectReport.class));
        return list;
    }

    public Handle deleteResource(String id) {
        String updateDailySql = "UPDATE project_daily SET STATUS=? WHERE resourcesId=?";
        int resultupdate = this.getJdbcTemplate().update(updateDailySql, new Object[]{"Cancel", id});
        System.out.println("修改日志状态：" + resultupdate);
        String sql = "DELETE FROM project_resources WHERE id = ? ";
        int result = this.getJdbcTemplate().update(sql, new Object[]{id});
        if (result > 0) {
            //更新修改项目时间
//            this.updateProjectUpdateDate(daily.getProjectId(),user.getCompanyCode());
        }
        return CommonUtils.getHandle(result);
    }

    public boolean isAuth(String userId, String projectId) {

        if (this.getJdbcTemplate().queryForList("SELECT 1 FROM project_data  WHERE (creater=? OR executor=?) AND id=?", new Object[]{userId, userId, projectId}).size() > 0) {
            return true;
        }
        return false;
    }

    public boolean isAdmin(User user) {
        if (this.getJdbcTemplate().queryForList("SELECT 1 FROM `system_user` WHERE id=? AND roleId=1  AND `status`='active'", new Object[]{user.getId()}).size() > 0) {
            return true;
        }
        return false;
    }

    public boolean isAdmin(int userId) {
        if (this.getJdbcTemplate().queryForList("SELECT 1 FROM `system_user` WHERE id=? AND roleId=1  AND `status`='active'", new Object[]{userId}).size() > 0) {
            return true;
        }
        return false;
    }

    public Handle updateProjectSequence(Project p, Integer dropPosition, Long dragId) {
        //根据企业code和父级id查询子节点
        List<Long> list = this.getJdbcTemplate().queryForList("select id from project_data where parentId = ? and companyCode = ? order by sequence asc", new Object[]{p.getParentId(), p.getCompanyCode()}, Long.class);
        //重组排序
        LinkedHashSet<Long> obj = new LinkedHashSet<Long>();
        for (Long id : list) {
            obj.add(id);
            if (id == Long.parseLong(p.getId())) {
                if (dropPosition > 0) {//判断是否在移动节点下面 >0在下面,<0在上面
                    obj.remove(dragId);
                    obj.add(dragId);
                } else {
                    obj.remove(id);
                    obj.remove(dragId);
                    obj.add(dragId);
                    obj.add(id);
                }
            }
        }
        //新的排序更新到数据
        int sequence = 1;
        for (Long id : obj) {
            this.getJdbcTemplate().update("UPDATE project_data SET sequence = ? ,parentId = ? ,updateDate=NOW() WHERE id = ?", new Object[]{sequence, p.getParentId(), id});
            sequence++;
        }
        return new Handle(1, null);
    }

    public List<?> queryUserProject(Integer currentPage, User user) {
        //List<String> params=new ArrayList<String>();
        //params.add(String.valueOf(user.getId()));
        //String sql="SELECT projectName,id 'key' FROM project_data WHERE parentId<>0 AND `status`<>'Completed' AND executor=?";
        //sql += " LIMIT " + (currentPage - 1) * 10 + ", " + 10;
        //return this.getJdbcTemplate().queryForList(sql, new Object[]{user.getId()});
        List<String> params = new ArrayList<String>();
        params.add(String.valueOf(user.getId()));
        String sql = "SELECT p.*,IF((SELECT MAX(createDate) FROM project_daily d WHERE d.projectId=p.id)\n" +
                ">=IFNULL((SELECT currenTime FROM project_daily_his n WHERE n.projectId=p.`id` AND n.uid=" + user.getId() + "),'0000-00-00'),'YES','NO') renewal\n" +
                "FROM project_data p WHERE `status`<>'Completed' AND executor=? ORDER BY updateDate DESC ";
        return this.queryForPage(sql, params, currentPage, 10, Project.class).getResultList();
    }

    public List<?> queryFocusProject(Integer currentPage, User user) {
        List<String> params = new ArrayList<String>();
        String sql = "SELECT DISTINCT p.*,f.id AS focusId,\n" +
                "IF((SELECT MAX(createDate) FROM project_daily d WHERE d.projectId=p.id)\n" +
                ">=IFNULL((SELECT currenTime FROM project_daily_his n WHERE n.projectId=p.`id` AND n.uid=" + user.getId() + "),'0000-00-00'),'YES','NO') renewal \n" +
                "FROM project_focus f,project_data p \n" +
                "WHERE f.projectId=p.id AND f.type='project' \n" +
                "AND p.`status`<>'Completed' AND p.`status`<>'Cancel' ";
        sql += " AND p.companyCode=?";
        params.add(String.valueOf(user.getCompanyCode()));
        sql += " AND f.userId=?";
        params.add(String.valueOf(user.getId()));
        sql += " ORDER BY p.updateDate DESC ";
        return this.queryForPage(sql, params, currentPage, 10, Project.class).getResultList();
    }

    public Handle insertFocusProject(String projectId, User user, String type) {
//        int id = this.getStockNextIndex("project_focus");
        String sql = "INSERT INTO project_focus (userId,userName,type,projectId, createDate, updateDate) VALUES (?,?,?,?,NOW(),NOW())";

        List<String> params = new ArrayList<>();
        params.add(user.getId());
        params.add(user.getUserName());
        params.add(type);
        params.add(projectId);
        int id = 0;
        try {
            id = this.insert(sql, params);
        } catch (Exception e) {
            System.out.println(e);
        }
        if (id > 0) {
            return new Handle(1, "操作成功", id);
        } else {
            return new Handle(0, "操作失败，请稍后重试");
        }
    }

    public Handle deleteFocusProject(String projectId, User user, String type) {
        String sql = "DELETE FROM project_focus WHERE projectId = ? AND userId = ?  AND type=?";
        int result = this.getJdbcTemplate().update(sql, new Object[]{projectId, user.getId(), type});
        return CommonUtils.getHandle(result);
    }

    public User queryUserHandle(String companyCode, String repliedBy) {
        String sql = " SELECT * FROM system_user WHERE companyCode=? AND (tel=? OR email=?)";
        List params = new ArrayList();
        params.add(companyCode);
        params.add(repliedBy);
        params.add(repliedBy);
        List<User> total = this.getJdbcTemplate().query(sql, params.toArray(new Object[params.size()]), new BeanPropertyRowMapper(User.class));
        User user = total.size() > 0 ? (User) total.get(0) : new User();
        return user;
    }

    public Project shareQueryProjectHandle(String id) {
        String sql = " SELECT * FROM project_data WHERE id=?";
        List params = new ArrayList();
        params.add(id);
        List<Project> total = this.getJdbcTemplate().query(sql, params.toArray(new Object[params.size()]), new BeanPropertyRowMapper(Project.class));
        Project project = total.size() > 0 ? (Project) total.get(0) : new Project();
        return project;
    }

    public String queryFocusProjectId(User user) {
        String sqlFocus = "SELECT GROUP_CONCAT(DISTINCT(projectId)) AS projectId FROM project_focus WHERE userId=? AND type=? ";
        String projectIds = this.getJdbcTemplate().queryForObject(sqlFocus, new Object[]{user.getId(), "project"}, String.class);
        return projectIds;
    }

    /**
     * 修改或添加查看日志时间
     *
     * @param projectId
     * @param user
     * @return
     */
    public Handle updateNewDaily(String projectId, User user) {
        String sql = "SELECT COUNT(*) FROM project_daily_his WHERE projectId=? AND uid=?";
        int result = this.getJdbcTemplate().queryForObject(sql, new Object[]{projectId, user.getId()}, Integer.class);
        if (result > 0) {
            String sqlUpdate = "UPDATE project_daily_his SET  currenTime=NOW(),updateDate=NOW()  WHERE projectId=? AND uid=?";
            int resultUpdate = this.getJdbcTemplate().update(sqlUpdate, new Object[]{projectId, user.getId()});
            return CommonUtils.getHandle(resultUpdate);
        } else {
            String sqlInsert = "INSERT INTO project_daily_his (projectId,uid,currenTime,createDate,updateDate)  VALUES (?,?,NOW(),NOW(),NOW())";
            int resultInsert = this.getJdbcTemplate().update(sqlInsert, new Object[]{projectId, user.getId()});
            return CommonUtils.getHandle(resultInsert);
        }
    }

    /**
     * 查询团队列表
     *
     * @param name
     * @return
     */
    public List<Map<String, Object>> getTeamList(String name) {
        String sql = "SELECT id,team_no,JSON_UNQUOTE(JSON_EXTRACT(institution,'$.label')) institution_name,`name` " +
                " FROM sales_team WHERE `state`='激活' " +
                " AND (`name` LIKE CONCAT('%',?,'%') or team_no LIKE CONCAT('%',?,'%'));";
        return this.getJdbcTemplate().queryForList(sql, new Object[]{name,name});
    }

    /**
     * 查询项目关联的团队列表
     *
     * @param projectId
     * @return
     */
    public List<Map<String, Object>> getProjectTeamList(Integer projectId) {
        String sql = "select t.id,t.team_no,JSON_UNQUOTE(JSON_EXTRACT(t.institution,'$.label')) institution_name,t.name " +
                " from sales_team t,project_data_r_sales_team r where t.id=r.sales_team_id " +
                " and r.project_data_id=? ";
        return this.getJdbcTemplate().queryForList(sql, new Object[]{projectId});
    }

    /**
     * 查询资方(合作方)列表
     *
     * @param name
     * @return
     */
    public List<Map<String, Object>> getPartnerList(String name) {
        String sql = "SELECT id,`type`,`name`,concat_name,concat_phone,logo FROM sales_partner " +
                " WHERE `state`='激活' AND `name` LIKE CONCAT('%',?,'%');";
        return this.getJdbcTemplate().queryForList(sql, new Object[]{name});
    }

    /**
     * 查询项目关联团队和资方(合作方)列表
     *
     * @param projectId
     * @return
     */
    public List<Map<String, Object>> getTeamPartnerList(Integer projectId) {
        String sql = "SELECT r.partner_cost,t.name team_name,r.id,p.type,p.name,p.concat_name,p.concat_name,p.concat_phone,p.logo " +
                " FROM sales_partner p,sales_team t,project_data_r_sales_partner r " +
                " WHERE p.id=r.sales_partner_id AND t.id=r.sales_team_id AND r.project_data_id=?;";
        return this.getJdbcTemplate().queryForList(sql, new Object[]{projectId});
    }

    /**
     * 查询在地组织列表
     *
     * @param name
     * @return
     */
    public List<Map<String, Object>> getLocalOrganizationList(String name) {
        String sql = "SELECT id,system_no,`name`,location,concat_name,concat_phone,concat_email \n" +
                " FROM sales_local_organization WHERE `state`='激活' AND `name` LIKE CONCAT('%',?,'%');";
        return this.getJdbcTemplate().queryForList(sql, new Object[]{name});
    }

    /**
     * 查询项目关联地组织列表
     *
     * @param projectId
     * @return
     */
    public List<Map<String, Object>> getProjectLocalOrganizationList(Integer projectId) {
        String sql = "SELECT l.id,l.system_no,l.`name`,l.location,l.concat_name,l.concat_phone,l.concat_email " +
                "FROM sales_local_organization l,project_data_r_sales_local_organization r " +
                "WHERE l.id=r.sales_local_organization_id AND r.project_data_id=? ";
        return this.getJdbcTemplate().queryForList(sql, new Object[]{projectId});
    }

    /**
     * 查询项目的对接数据管理列表
     *
     * @param projectId
     * @return
     */
    public List<Map<String, Object>> getConnectList(Integer projectId) {
        String sql = "SELECT id,s.address,s.solution,s.apply_for,s.purpose,s.concat_name,s.concat_phone,s.state \n" +
                " FROM sales_connect s WHERE projectId=?";
        return this.getJdbcTemplate().queryForList(sql, new Object[]{projectId});
    }

    public List<Map<String, Object>> updateTeamList(List<String> projectTeamListSelect, String projectId) {
        String insertSql = "INSERT INTO project_data_r_sales_team (project_data_id,sales_team_id) VALUE(?,?);";
        String existSql = "SELECT COUNT(1) num FROM project_data_r_sales_team WHERE project_data_id=? AND sales_team_id=?";
        for (int i = 0; i < projectTeamListSelect.size(); i++) {
            String teamId = projectTeamListSelect.get(i);
            if (this.getJdbcTemplate().queryForObject(existSql, new Object[]{projectId, teamId}, Integer.class) < 1) {
                this.getJdbcTemplate().update(insertSql, new Object[]{projectId, teamId});
            }
        }
        return getProjectTeamList(Integer.parseInt(projectId));
    }

    public List<Map<String, Object>> addProjectTeamPartner(List<String> projectTeamListSelect, String connectId) throws SQLException {
        String insertPartnerSql = "INSERT INTO sales_partner(`name`,concat_name,concat_phone,concat_email,address,`state`) " +
                "SELECT apply_for,concat_name,concat_phone,concat_email,address,'激活' FROM sales_connect WHERE id=?";

        int partnerId=this.insert(insertPartnerSql,new Object[]{connectId});
        String projectId=this.getJdbcTemplate().queryForObject(
                "SELECT projectId FROM sales_connect WHERE id=?",
                new Object[]{connectId},String.class);
        //如果此团队没有项目则关联
        updateTeamList(projectTeamListSelect,projectId);
        //团队，项目，合作方关联
        String insertSql = "INSERT INTO project_data_r_sales_partner (project_data_id,sales_team_id,sales_partner_id) VALUE(?,?,?);";
        String existSql="SELECT COUNT(1) num FROM project_data_r_sales_partner WHERE project_data_id=? AND sales_team_id=? AND sales_partner_id=?";
        for(int i=0;i<projectTeamListSelect.size();i++){
            if(this.getJdbcTemplate().queryForObject(existSql,new Object[]{
                    projectId, projectTeamListSelect.get(i), partnerId
            },Integer.class)<1){
                this.getJdbcTemplate().update(insertSql, new Object[]{projectId, projectTeamListSelect.get(i), partnerId});
            }

        }
        this.getJdbcTemplate().update("update sales_connect set state='ok' WHERE id=?",new Object[]{connectId});
        return getProjectTeamList(Integer.parseInt(projectId));
    }

    public List<Map<String, Object>> updatePartnerList(
            List<String> selectTeamList,
            List<String> partnerListSelect, String projectId, String teamId) {
        if (selectTeamList != null && selectTeamList.size() > 0) {
            for (int k = 0; k < selectTeamList.size(); k++) {
                String tid = selectTeamList.get(k);
                insertProjectTeamPartner(partnerListSelect, projectId, tid);
            }
        } else {
            insertProjectTeamPartner(partnerListSelect, projectId, teamId);
        }

        return getTeamPartnerList(Integer.parseInt(projectId));
    }

    private void insertProjectTeamPartner(List<String> partnerListSelect, String projectId, String teamId) {
        String insertSql = "INSERT INTO project_data_r_sales_partner (project_data_id,sales_team_id,sales_partner_id) VALUE(?,?,?);";
        String existSql = "SELECT COUNT(1) num FROM project_data_r_sales_partner WHERE project_data_id=? AND sales_team_id=? and sales_partner_id=? ";
        for (int i = 0; i < partnerListSelect.size(); i++) {
            String partnerId = partnerListSelect.get(i);
            if (this.getJdbcTemplate().queryForObject(existSql, new Object[]{projectId, teamId, partnerId}, Integer.class) < 1) {
                this.getJdbcTemplate().update(insertSql, new Object[]{projectId, teamId, partnerId});
            }
        }
    }

    public List<Map<String, Object>> updateLocalOrganizationList(List<String> localOrganizationListSelect, String projectId) {
        String insertSql = "INSERT INTO project_data_r_sales_local_organization (project_data_id,sales_local_organization_id) VALUE(?,?);";
        String existSql = "SELECT COUNT(1) num FROM project_data_r_sales_local_organization WHERE project_data_id=? AND sales_local_organization_id=?";
        for (int i = 0; i < localOrganizationListSelect.size(); i++) {
            String localOrganizationId = localOrganizationListSelect.get(i);
            if (this.getJdbcTemplate().queryForObject(existSql, new Object[]{projectId, localOrganizationId}, Integer.class) < 1) {
                this.getJdbcTemplate().update(insertSql, new Object[]{projectId, localOrganizationId});
            }
        }
        return getProjectLocalOrganizationList(Integer.parseInt(projectId));
    }

    public List<Map<String, Object>> updateConnectList(String connectId, String projectId) {
        String updateSql = "UPDATE sales_connect SET state=IF(state='ok','no','ok') WHERE id=? ";
        this.getJdbcTemplate().update(updateSql, new Object[]{connectId});
        return getConnectList(Integer.parseInt(projectId));
    }

    public void deleteProjectTeam(String teamId, String projectId) {
        String delSql = "DELETE FROM project_data_r_sales_team WHERE project_data_id=? AND sales_team_id=?";
        String delSql2 = "DELETE FROM project_data_r_sales_partner WHERE project_data_id=? AND sales_team_id=?";
        //删除团队
        this.getJdbcTemplate().update(delSql, new Object[]{projectId, teamId});
        //删除团队对应的资助方
        this.getJdbcTemplate().update(delSql2, new Object[]{projectId, teamId});
    }

    public void deleteProjectPartner(String relateId) {
        this.getJdbcTemplate().update("DELETE FROM project_data_r_sales_partner WHERE id=?", new Object[]{relateId});
    }

    public void addProjectPartnerCost(String id, String partnerCost) {
        this.getJdbcTemplate().update(
                "UPDATE project_data_r_sales_partner SET partner_cost=? WHERE id=?",
                new Object[]{partnerCost, id});
    }
}
