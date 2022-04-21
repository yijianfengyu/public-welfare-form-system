package com.projectManage.dao;

import com.auth.entity.User;
import com.common.jdbc.JdbcBase;
import com.projectManage.entity.ProjectResource;
import com.utils.CommonUtils;
import com.utils.Handle;
import com.utils.Page;
import org.springframework.stereotype.Repository;

import java.sql.SQLException;
import java.util.ArrayList;
import java.util.List;
import java.util.UUID;

@Repository
public class ResourceDao  extends JdbcBase {
    public Page queryHistoryResources(ProjectResource pr) {
        List params = new ArrayList();
        String sql = " SELECT pr.* FROM resources pr WHERE 1=1 and `type` IN ('文件','图文') ";
        if (null != pr.getResourcesName() && !"".equals(pr.getResourcesName())) {
            sql += " AND pr.resourcesName like concat('%',?,'%') ";
            params.add(pr.getResourcesName());
        }
        sql += " GROUP BY pr.id ORDER BY pr.updateDate DESC ";
        Page page = this.queryForPage(sql, params,pr.getCurrentPage(), 10, ProjectResource.class);
        return page;
    }

    //上传资源
    public Handle updateProjectResource(ProjectResource pr, User user) {
        String sql = "  UPDATE resources SET   fileName = ? ,createDate = NOW() ,updateDate = NOW() , " +
                " url = ? , remark = ?,`status` = '已上传', uploadId = ?, uploader = ? " +
                " WHERE id = ?  ";

        int result = this.getJdbcTemplate().update(sql, pr.getFileName(), pr.getUrl(), pr.getRemark(), pr.getUploadId(), pr.getUploader(), pr.getId());

        return CommonUtils.getHandle(result);
    }

    public void deleteResource(ProjectResource pr){
        this.getJdbcTemplate().update("DELETE FROM resources WHERE id=?",new Object[]{pr.getId()});

    }
    public void insertResource(ProjectResource pr, User user,String uuid,String status){
        String sql = "INSERT INTO resources ( fileName,url,resourcesName,projectId,isEssential, remark,createId,createName,`type`,`subType`,`uuid`,`status`,templateName,templateUrl,createDate,updateDate)" +
                "VALUES ( ?,?,?,?,?,?,?,?,?,?,?,?,?,?,NOW(),NOW()) ";
        int result = this.getJdbcTemplate().update(sql, pr.getFileName(), pr.getUrl(), pr.getResourcesName(), pr.getProjectId(), pr.getIsEssential(),
                pr.getRemark(), user.getId(), user.getUserName(), pr.getType(), uuid, status, pr.getTemplateName(), pr.getTemplateUrl());
    }

    public void insertResource(List<String> list) throws SQLException {
        String sql = "INSERT INTO resources ( fileName,url,resourcesName,projectId,isEssential, remark,createId,createName,`type`,`subType`,`uuid`,`status`,templateName,templateUrl,createDate,updateDate)" +
                "VALUES ( ?,?,?,?,?,?,?,?,?,?,?,?,?,?,NOW(),NOW()) ";
        this.insert(sql, list);
    }

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
        String sql = "INSERT INTO resources ( fileName,url,resourcesName,projectId,isEssential, remark,createId,createName,`type`,`subType`,`uuid`,`status`,templateName,templateUrl,createDate,updateDate)" +
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
                    } catch (SQLException e) {
                        e.printStackTrace();
                    }
                    pr.setUuid(uuid);
                    pr.setId(Long.valueOf(result));
                }
            }
        }
        if (this.vertify(pr.getTemplateUrl()) && !"undefined".equals(pr.getTemplateUrl())) {
            String[] templateUrlArr = pr.getTemplateUrl().split(",");
            if (templateUrlArr.length > 0 && !"".equals(templateUrlArr[0])) {
                for (int i = 0; i < templateUrlArr.length; i++) {
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
                    } catch (SQLException e) {
                        e.printStackTrace();
                    }
                    pr.setId(Long.valueOf(result));
                    pr.setUuid(uuid);
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
        }
        return CommonUtils.getHandle(result);
    }

    //上传资源
    public Handle uploadResource(ProjectResource pr, User user) {
        String sql = "  UPDATE resources SET   fileName = ? ,createDate = NOW() ,updateDate = NOW() ,resourcesName = ?, " +
                " url = ? , remark = ?,`status` = '已上传', uploadId = ?, uploader = ? " +
                " WHERE id = ?  ";

        int result = this.getJdbcTemplate().update(sql, pr.getFileName(), pr.getResourcesName(),
                pr.getUrl(), pr.getRemark(), pr.getUploadId(), pr.getUploader(), pr.getId());
        return CommonUtils.getHandle(result);
    }

}
