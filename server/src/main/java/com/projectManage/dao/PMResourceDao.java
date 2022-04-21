package com.projectManage.dao;

import com.auth.entity.User;
import com.common.jdbc.JdbcBase;
import com.projectManage.entity.Daily;
import com.projectManage.entity.ExamQuestion;
import com.projectManage.entity.ProjectResource;
import com.utils.CommonUtils;
import com.utils.Handle;
import com.utils.Page;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.jdbc.core.BeanPropertyRowMapper;
import org.springframework.jdbc.core.RowMapper;
import org.springframework.stereotype.Repository;

import java.sql.SQLException;
import java.util.ArrayList;
import java.util.List;
import java.util.UUID;

/**
 * Created by hppc on 2018-08-02.
 */
@Repository
public class PMResourceDao extends JdbcBase {
    @Autowired
    ResourceDao resourceDao;
    public List<ProjectResource> queryProjectResources(ProjectResource pr) {
        List params = new ArrayList();
        String sql = " SELECT pr.* FROM project_resources pr WHERE 1=1";
        if (null != pr.getProjectId() && !"".equals(pr.getProjectId())) {
            sql += " AND pr.projectId=? ";
            params.add(pr.getProjectId());
        }
        sql += " GROUP BY pr.id ORDER BY pr.updateDate DESC ";
        return this.getJdbcTemplate().query(sql, params.toArray(new Object[params.size()]), new BeanPropertyRowMapper(ProjectResource.class));

    }

    public Page queryHistoryResources(ProjectResource pr) {
        List params = new ArrayList();
        String sql = " SELECT pr.* FROM project_resources pr WHERE 1=1 and `type` IN ('文件','图文') ";
        if (null != pr.getResourcesName() && !"".equals(pr.getResourcesName())) {
            sql += " AND pr.resourcesName concat('%',?,'%') ";
            params.add(pr.getResourcesName());
        }
        sql += " GROUP BY pr.id ORDER BY pr.updateDate DESC ";
        Page page = this.queryForPage(sql, params,pr.getCurrentPage(), 10, ProjectResource.class);
        return page;
    }

    public void deleteResource(ProjectResource pr){
        this.getJdbcTemplate().update("DELETE FROM project_resources WHERE id=?",new Object[]{pr.getId()});

    }

    //上传资源
    public Handle updateProjectResource(ProjectResource pr, User user) {
        String sql = "  UPDATE project_resources SET   fileName = ? ,createDate = NOW() ,updateDate = NOW() , " +
                " url = ? , remark = ?,`status` = '已上传', uploadId = ?, uploader = ? " +
                " WHERE id = ?  ";

        int result = this.getJdbcTemplate().update(sql, pr.getFileName(), pr.getUrl(), pr.getRemark(), pr.getUploadId(), pr.getUploader(), pr.getId());
        if (result > 0) {
            pr.setType("文件");
            this.createProjectResourcesDaily(pr, pr.getUrl(), "resources", user);
        }
        return CommonUtils.getHandle(result);
    }


    public Handle addProjectResourceFromStore(ProjectResource pr) {
        String exist="SELECT IFNULL(COUNT(1),0) num FROM `resources` WHERE `uuid`=?";
        if(this.getJdbcTemplate().queryForObject(
                exist,
                new Object[]{pr.getUuid()},Integer.class)>0){
            return CommonUtils.getHandle(CommonUtils.EXIST_CODE);
        }
        String sql="INSERT INTO `project_resources` (\n" +
                "  `fileName`,`templateName`,`createDate`,`updateDate`,\n" +
                "  `createId`,`createName`,`projectId`,`url`,\n" +
                "  `templateUrl`,`remark`,`status`,`auditorId`,\n" +
                "  `auditorName`,`auditDate`,`resourcesName`,`isEssential`,\n" +
                "  `uploadId`,`uploader`,`type`,`subType`,`uuid`\n" +
                ") SELECT \n" +
                "  `fileName`,`templateName`,`createDate`,`updateDate`,\n" +
                "  `createId`,`createName`,?,`url`,\n" +
                "  `templateUrl`,`remark`,`status`,`auditorId`,\n" +
                "  `auditorName`,`auditDate`,`resourcesName`,`isEssential`,\n" +
                "  `uploadId`,`uploader`,`type`,`subType`,`uuid`\n" +
                "FROM `resources` WHERE id=? ";
        int result=this.getJdbcTemplate().update(sql,new Object[]{pr.getProjectId(),pr.getId()});
        return CommonUtils.getHandle(result);
    }

    //设置资源文件类型
    public Handle addProjectResourceModel(ProjectResource pr, User user) {
        String status = "未上传";
        String dailyType = "work";
        if ("表单".equals(pr.getType())) {
            status = "未审核";
            dailyType = "form";
        }
        if ("图文".equals(pr.getType())) {
            status = "";
            dailyType = "image-text";
        }
        if ("附加表单".equals(pr.getType())) {
            status = "已上传";
            dailyType = "addForm";
        }
        if ("文件".equals(pr.getType())) {
            if (this.vertify(pr.getUrl()) || this.vertify(pr.getTemplateUrl())) {
                status = "已上传";
                dailyType = "resources";
            }
        }
       String sql = "INSERT INTO project_resources ( fileName,url,resourcesName,projectId,isEssential, remark,createId,createName,`type`,`subType`,`uuid`,`status`,templateName,templateUrl,createDate,updateDate)" +
                "VALUES ( ?,?,?,?,?,?,?,?,?,?,?,?,?,?,NOW(),NOW()) ";

        int result = 0;

        if (this.vertify(pr.getUrl()) && !"undefined".equals(pr.getUrl())) {
            String[] urlArr = pr.getUrl().split(",");
            if (urlArr.length > 0 && !"".equals(urlArr[0])) {
                for (int i = 0; i < urlArr.length; i++) {
                    String uuid = null;
                    if(this.vertify(pr.getUuid())){
                        uuid = pr.getUuid();
                    }else{
                        uuid = UUID.randomUUID().toString();
                    }

                    String spliceUrl = "image-text".equals(dailyType) ? urlArr[i].replace("@uuid@", uuid) : urlArr[i];
                 /*   int count = this.getJdbcTemplate().update(sql, spliceUrl, spliceUrl, pr.getResourcesName(), pr.getProjectId(), pr.getIsEssential(),
                            pr.getRemark(), user.getId(), user.getUserName(), pr.getType(), uuid, status, null, null);
                    result += count;
                    int resultTempId = 0;*/
                    List list = new ArrayList();//将values 有序的存储
                    list.add(spliceUrl);
                    list.add(spliceUrl);
                    list.add(pr.getResourcesName());
                    list.add(pr.getProjectId());
                    list.add(pr.getIsEssential());
                    list.add(pr.getRemark());
                    list.add(user.getId());
                    list.add(user.getUserName());
                    list.add(pr.getType());
                    list.add(pr.getSubType());
                    list.add(uuid);
                    list.add(status);
                    list.add(null);
                    list.add(null);
                    try {
                        result = this.insert(sql, list);
                        resourceDao.insertResource(list);
                    } catch (SQLException e) {
                        e.printStackTrace();
                    }
                    pr.setUuid(uuid);
                    pr.setId(Long.valueOf(result));
                    this.createProjectResourcesDaily(pr, spliceUrl, dailyType, user);
                }
            }
        }
        if (this.vertify(pr.getTemplateUrl()) && !"undefined".equals(pr.getTemplateUrl())) {
            String[] templateUrlArr = pr.getTemplateUrl().split(",");
            if (templateUrlArr.length > 0 && !"".equals(templateUrlArr[0])) {
                for (int i = 0; i < templateUrlArr.length; i++) {
//                    int count = this.getJdbcTemplate().update(sql, null, null, pr.getResourcesName(), pr.getProjectId(), pr.getIsEssential(),
//                            pr.getRemark(), user.getId(), user.getUserName(), pr.getType(), UUID.randomUUID().toString(), status, templateUrlArr[i], templateUrlArr[i]);
                    List list = new ArrayList();//将values 有序的存储
                    list.add(null);
                    list.add(null);
                    list.add(pr.getResourcesName());
                    list.add(pr.getProjectId());
                    list.add(pr.getIsEssential());
                    list.add(pr.getRemark());
                    list.add(user.getId());
                    list.add(user.getUserName());
                    list.add(pr.getType());
                    list.add(pr.getSubType());
                    String uuid = null;
                    if(this.vertify(pr.getUuid())){
                        uuid = pr.getUuid();
                    }else{
                        uuid = UUID.randomUUID().toString();
                    }
                    list.add(uuid);
                    list.add(status);
                    list.add(templateUrlArr[i]);
                    list.add(templateUrlArr[i]);
                    try {
                        result = this.insert(sql, list);
                        resourceDao.insertResource(list);
                    } catch (SQLException e) {
                        e.printStackTrace();
                    }
                    pr.setId(Long.valueOf(result));
                    pr.setUuid(uuid);
                    this.createProjectResourcesDaily(pr, templateUrlArr[i], dailyType, user);
                }
            }
        }
        //这里处理添加资源时未立即上传文件的情况
        if ((!this.vertify(pr.getUrl())) && !this.vertify(pr.getTemplateUrl())) {
            String uuid = null;
            if(this.vertify(pr.getUuid())){
                uuid = pr.getUuid();
            }else{
                uuid = UUID.randomUUID().toString();
            }
            result = this.getJdbcTemplate().update(sql, pr.getFileName(), pr.getUrl(), pr.getResourcesName(), pr.getProjectId(), pr.getIsEssential(),
                    pr.getRemark(), user.getId(), user.getUserName(), pr.getType(), uuid, status, pr.getTemplateName(), pr.getTemplateUrl());
            //插入到资源表
            resourceDao.insertResource( pr,  user, uuid, status);
            //更新修改项目时间
            int intUpdateDate = result > 0 ? updateProjectUpdateDate(pr.getProjectId(), user.getCompanyCode()) : 0;
        }
        return CommonUtils.getHandle(result);
    }

    //上传资源时添加对应日志
    public int createProjectResourcesDaily(ProjectResource pr, String file, String dailyType, User user) {
        String sql = "INSERT INTO project_daily (projectId, content,resourcesId,dailyUrl,createId,createName,createDate,updateDate,projectPath,groupId,dailyType,status,`uuid`)VALUES(?,?,?,?,?,?,NOW(),NOW(),?,?,?,?,?)";
        //某某人某时间上传了某文件 (用@+!Z?@拼接)
        String content = user.getUserName() + "添加了《 @+!Z?@" + pr.getResourcesName() + "@+!Z?@ 》"+ pr.getType();
        String dailyUrl="";
        if(dailyType.equals("form")){
            dailyUrl=file+"&data_uuid="+pr.getUuid()+"&method=create";
        }else if(dailyType.equals("addForm")){
            dailyUrl=file+"&data_uuid="+pr.getUuid();
        }else if(dailyType.equals("resources")){
            dailyUrl=file;
            String value=file.substring(0,file.lastIndexOf('_'));
            content = user.getUserName() + "添加了《 @+!Z?@" +value+ "@+!Z?@ 》"+ pr.getType();
        }else{
            dailyUrl=file;
        }

        //更新修改项目时间
        updateProjectUpdateDate(pr.getProjectId(), user.getCompanyCode());
        return this.getJdbcTemplate().update(sql, new Object[]{pr.getProjectId(), content,pr.getId(),dailyUrl, user.getId(), user.getUserName(), null, pr.getGroupId(), dailyType,"Active",pr.getUuid()});
    }

    //更新修改项目时间
    public int updateProjectUpdateDate(String projectId, String companyCode) {
        String sql = "UPDATE project_data SET updateDate=NOW() WHERE id =? AND companyCode = ? ";
        return this.getJdbcTemplate().update(sql, new Object[]{projectId, companyCode});
    }

    //审核资源
    public Handle auditProjectResource(ProjectResource pr, User user) {
        String sql = "  UPDATE project_resources SET   auditDate = NOW() , updateDate = NOW() , " +
                "`STATUS` = '已审核', auditorId = ?, auditorName = ? " +
                " WHERE id = ?  ";

        int result = this.getJdbcTemplate().update(sql, user.getId(), user.getUserName(), pr.getId());

        return CommonUtils.getHandle(result);
    }

    //首页资源 查询
    public List queryHomeProjectResources(Integer currentPage, User user, String resourcesName) {
        List params = new ArrayList();
        String sql = " SELECT DISTINCT pr.* FROM project_resources pr LEFT JOIN system_user u ON pr.createId=u.id WHERE 1=1 AND pr.TYPE='文件' AND u.companycode=? ";
        params.add(user.getCompanyCode());
        if (this.vertify(resourcesName)) {
            sql += " AND (pr.fileName LIKE ? OR pr.templateName LIKE ? )";
            params.add("%" + resourcesName + "%");
            params.add("%" + resourcesName + "%");
        }
        sql += " ORDER BY pr.updateDate DESC";
        return this.queryForPage(sql, params, currentPage, 5, ProjectResource.class).getResultList();
    }

    //首页资源 (相关文档)查询
    public List dashboardQueryProjectResources(Integer currentPage, ProjectResource pr) {
        List params = new ArrayList();
        String sql = " SELECT pr.* FROM project_resources pr WHERE 1=1";
        if (null != pr.getProjectId() && !"".equals(pr.getProjectId())) {
            sql += " AND pr.projectId=? ";
            params.add(pr.getProjectId());
        }
        sql += " GROUP BY pr.id ORDER BY pr.updateDate DESC ";
        return this.queryForPage(sql, params,currentPage,5,ProjectResource.class).getResultList();
    }

}
