package com.projectManage.dao;

import com.alibaba.fastjson.JSON;
import com.alibaba.fastjson.JSONObject;
import com.auth.entity.Contact;
import com.auth.entity.ContactDefineData;
import com.auth.entity.User;
import com.projectManage.entity.ExamQuestion;
import com.projectManage.entity.Project;
import com.projectManage.entity.Template;
import com.projectManage.entity.TemplateTableRow;
import com.utils.*;
import com.common.jdbc.JdbcBase;
import org.apache.commons.lang3.ArrayUtils;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.jdbc.core.BeanPropertyRowMapper;
import org.springframework.stereotype.Repository;

import java.sql.SQLException;
import java.time.Duration;
import java.util.*;

/**
 * Created by dragon_eight on 2018/7/27.
 */
@Repository
public class TempTableDao extends JdbcBase {
    private static String user_id="1";//默认是第一个用户
    private static String team_id="1";//默认是第一个队伍，使用的目的是为让管理员可以在后台添加数据，并满足数据关系
    @Value("${dome.datasource.database}")
    private String domeDatasourceDatabase;
    public int createTempTable(Template temJson, User user) {

        String sql = "INSERT INTO project_define(tableName,companyCode,define,formTitle,formDescription,creator,creatorName,modifier,modifierName,usableRange,sub,dateCreated,dateUpdated,viewPeople) VALUES(?,?,?,?,?,?,?,?,?,?,?,NOW(),NOW(),?)";
        List<String> params = new ArrayList<String>();
        params.add(temJson.getTableName());
        params.add(user.getCompanyCode());
        params.add(temJson.getDefine());
        params.add(temJson.getFormTitle());
        params.add(temJson.getFormDescription());
        params.add(user.getId());
        params.add(user.getUserName());
        params.add(user.getId());
        params.add(user.getUserName());
        params.add(temJson.getUsableRange());
        params.add(temJson.getSub());
        params.add(temJson.getViewPeople());

        int id = 0;
        try {
            id = this.insert(sql, params);
            temJson.setId(Long.valueOf(id));
            if (!"project_define_data".equals(temJson.getTableName())) {
                //自动生成新的数据表单
                temJson = this.createItemTable(temJson);
            }
        } catch (Exception e) {
            e.printStackTrace();
        }

        return id;
    }

    private Template createItemTable(Template temJson) {
        Map<String, String> map = TablesUtil.parseMap(
                temJson.getId()!=null?temJson.getId().toString():null,
                temJson.getDefine(), temJson.getTableName(),this.getJdbcTemplate());
        this.getJdbcTemplate().update(map.get("tabSql"));
        if(map.containsKey("createRelationSql")){
            this.getJdbcTemplate().update(map.get("createRelationSql"));
        }
        if(null!=map.get("deleteExamPaperSql")&&!"".equals(map.get("deleteExamPaperSql"))) {
            this.getJdbcTemplate().update(map.get("deleteExamPaperSql"));
        }
        if(null!=map.get("insertExamPaperSql")&&!"".equals(map.get("insertExamPaperSql"))){
            this.getJdbcTemplate().update(map.get("insertExamPaperSql"));
        }
        if(null!=map.get("insertExamQuestionSql")&&!"".equals(map.get("insertExamQuestionSql"))){
            this.getJdbcTemplate().update(map.get("insertExamQuestionSql"));
        }


        temJson.setDefine(map.get("temp"));
        return temJson;
    }

    //修改数据表
    private Template updateItemTable(Template temJson) {
        //查询出数据表中所以字段名
        List<Map<String, Object>> list = this.getJdbcTemplate().queryForList("desc " + temJson.getTableName());
        List field=new ArrayList();
        for (Map maps:list){
            field.add(maps.get("Field"));
        }
        //生成修改表sql
        Map<String, String> map = TablesUtil.parseUpdateTableSql(temJson.getId().toString(),temJson.getDefine(), temJson.getTableName(),field,this.getJdbcTemplate());
        if(!"".equals(map.get("tabSql"))){ //判断sql是否为空字符串
            this.getJdbcTemplate().update(map.get("tabSql"));
        }
        if(map.containsKey("createRelationSql")){
            //先直接删除旧的关系数据
            this.getJdbcTemplate().update(TablesUtil.deleteTableRelation(temJson.getTableName()));
            //执行创建表关系
            this.getJdbcTemplate().batchUpdate(map.get("createRelationSql").split(";"));
        }
        if(map.get("deleteExamPaperSql")!=null&&!"".equals(map.get("deleteExamPaperSql"))){
            this.getJdbcTemplate().update(map.get("deleteExamPaperSql"));
        }

        if(!"".equals(map.get("insertExamPaperSql"))){
            this.getJdbcTemplate().update(map.get("insertExamPaperSql"));
        }
        if(!"".equals(map.get("insertExamQuestionSql"))){
            this.getJdbcTemplate().update(map.get("insertExamQuestionSql"));
        }
        temJson.setDefine(map.get("temp"));
        return temJson;
    }

    public int updateTempTable(Template template, User user) {
        if (!"project_define_data".equals(template.getTableName())) {
            //自动更新数据表单
            template=this.updateItemTable(template);
        }
        int i = 0;
        String sql = "UPDATE project_define SET define = ? , formTitle = ? , formDescription = ? , modifier = ? , " +
                "modifierName = ? , usableRange = ?, sub = ?,viewPeople = ?, " +
                "dateUpdated = NOW(),label=? WHERE id = ? AND companyCode=? ";
        i = this.getJdbcTemplate().update(sql,
                new Object[]{template.getDefine(), template.getFormTitle(), template.getFormDescription(), user.getId(),
                        user.getUserName(), template.getUsableRange(),template.getSub(), template.getViewPeople(),
                        template.getLabel(),template.getId(), user.getCompanyCode()});

        //更新表结构后执行 绑定联系人与数据

        if (i > 0) {
            Page pageTempData = this.queryAllTempDataByDefineId(String.valueOf(template.getId()), "", "all");
            List listTempData = pageTempData.getResultList();
            template.setCompanyCode(user.getCompanyCode());
            this.addContactDefindDataWithForm(listTempData, template);
        }

        return i;
    }


    /**
     *  根据表单id删除数据表
     * @param id
     * @return
     */
    public int delTable(Long id){
        String tableNameSql="SELECT tableName FROM `project_define` WHERE id="+id;
        String tableName = this.getJdbcTemplate().queryForObject(tableNameSql, String.class);
        int i=0;
        if(!"project_define_data".equals(tableName)){
            String delSql="drop table "+tableName;
           i=this.getJdbcTemplate().update(delSql);
        }
        return i;
    }

    public int deleteTempTable(Long id, String companyCode) {

        String sqldata = "DELETE FROM project_define_data WHERE define_id = ? AND companyCode=? "; //删除模板数据再删除模板
        this.getJdbcTemplate().update(sqldata, new Object[]{id, companyCode});
        this.clearContactTempData(id.toString());  //删除联系人关系表数据
        this.delTable(id);//删除表单关联的数据表
        String sql = "DELETE FROM project_define WHERE id = ? AND companyCode=? ";
        return this.getJdbcTemplate().update(sql, new Object[]{id, companyCode});
    }


    public Page queryTempTable(Template template, User user) {

        String sql = "SELECT pd.*,(SELECT id FROM project_focus f WHERE f.projectId=pd.id AND TYPE='form') focusId, (SELECT COUNT(*) FROM project_define_data pdd WHERE pdd.define_id = pd.id)AS dataCounts  FROM project_define pd WHERE 1=1 AND pd.companyCode=? ";
        List<String> params = new ArrayList<String>();
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
        Page page = this.queryForPage(sql, params, template.getCurrentPage(), template.getPageSize(), Template.class);
        List<?> templateList = page.getResultList();
        for (int i = 0; i < templateList.size(); i++) {
            //首次查表单时拼接固定参数
            TablesUtil.firstAddDefine((Template) templateList.get(i));
        }

        return page;
    }

    public List queryAllTempTable(Template template, User user) {

        String sql = "SELECT pd.*,(SELECT id FROM project_focus f WHERE f.projectId=pd.id AND TYPE='form') focusId, (SELECT COUNT(*) FROM project_define_data pdd WHERE pdd.define_id = pd.id)AS dataCounts  FROM project_define pd WHERE 1=1 AND pd.companyCode=? ";
        List<String> params = new ArrayList<String>();
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
        List<?> templateList = this.getJdbcTemplate().query(sql, params.toArray(new Object[params.size()]), new BeanPropertyRowMapper(Template.class));//this.getJdbcTemplate().queryForList(sql,  params.toArray(new Object[params.size()]));
//        Page page = this.queryForPage(sql, params, template.getCurrentPage(), template.getPageSize(), Template.class);
        for (int i = 0; i < templateList.size(); i++) {
            //首次查表单时拼接固定参数
            TablesUtil.firstAddDefine((Template) templateList.get(i));
        }

        return templateList;
    }

    public int queryCountTempTable(String companyCode) {
        String sql = "SELECT count(*) FROM project_define WHERE companyCode = ?";
        int result = this.getJdbcTemplate().queryForObject(sql, new Object[]{companyCode}, Integer.class);
        return result;
    }

    public Template queryTempTableById(Long id) {
        String sql = "SELECT id,id define_id,tableName, dateCreated,companyCode, creator, formTitle, define, formDescription, MODIFIER, dateUpdated, usableRange,sub, (CASE WHEN (SELECT COUNT(*) FROM project_define_data pdd WHERE pdd.define_id = pd.id) > 0 THEN 'true' WHEN (SELECT COUNT(*) FROM project_define_data pdd WHERE pdd.define_id=pd.id) = 0 THEN 'false' END)AS dataCounts FROM project_define pd where id = ?";
        List<Template> list = this.getJdbcTemplate().query(sql, new Object[]{id}, new BeanPropertyRowMapper<Template>(Template.class));
        if (list.size() > 0) {
            return list.get(0);
        } else {
            return null;
        }
    }

    public Template queryTempTableByProjectId(Long id, Long projectId) {
        String sql = "SELECT id, dateCreated,companyCode, creator, formTitle, define, formDescription, MODIFIER, dateUpdated, usableRange,sub, (CASE WHEN (SELECT COUNT(*) FROM project_define_data pdd WHERE pdd.define_id = pd.id) > 0 THEN 'true' WHEN (SELECT COUNT(*) FROM project_define_data pdd WHERE pdd.define_id=pd.id) = 0 THEN 'false' END)AS dataCounts FROM project_define pd where id = ?";
        List<Template> list = this.getJdbcTemplate().query(sql, new Object[]{id}, new BeanPropertyRowMapper<Template>(Template.class));
        if (list.size() > 0) {
            return list.get(0);
        } else {
            return null;
        }
    }

    public int createTempData(TemplateTableRow templateTableRow, String columns, User user) {
        String uuid=UUID.randomUUID().toString().replaceAll("-", "");//用户某次创建问卷的uuid
        String tableNameSql = "SELECT tableName FROM project_define WHERE id=?";
        String tableName = this.getJdbcTemplate().queryForObject(tableNameSql, new Object[]{templateTableRow.getDefine_id()}, String.class);
        String sqlTemp = "INSERT INTO " + tableName + " (define_id,data_uuid,dateCreated,dateUpdated,systemEnvironment,channel ";
        String valTemp = "values(?,?,NOW(),NOW(),?,?";
        List listTemp = new ArrayList();//将values 有序的存储
        listTemp.add(templateTableRow.getDefine_id());
        listTemp.add(uuid);
        listTemp.add(templateTableRow.getSystemEnvironment());
        listTemp.add(templateTableRow.getChannel());
        if (user != null) {
            if (this.vertify(user.getCompanyCode())) {
                sqlTemp += " ,companyCode";
                valTemp += ",?";
                listTemp.add(user.getCompanyCode());
            }
            if (this.vertify(user.getId())) {
                sqlTemp += " ,creator";
                valTemp += ",?";
                listTemp.add(user.getId());
            }
            if (this.vertify(user.getUserName())) {
                sqlTemp += " ,creatorName";
                valTemp += ",?";
                listTemp.add(user.getUserName());
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
        //解析获得字段以及对应值
        Map jsonMap = TablesUtil.parseMap(templateTableRow.getDefine());
        Set<Map.Entry<String, Object>> entrys = jsonMap.entrySet();
        String[] containArray=new String[]{"define_id","data_uuid","dateCreated","dateUpdated","systemEnvironment","channel"};
        for (Map.Entry<String, Object> entry : entrys) {
            if(!ArrayUtils.contains(containArray,entry.getKey())){
                //已经有的不添加
                sqlTemp += ",`" + entry.getKey()+"`";
                valTemp += ",?";
                listTemp.add(entry.getValue() == null || "null".equals(entry.getValue()) ? "" : entry.getValue());

                if (contactTypeMap.size() > 0) {
                    Set<Map.Entry<String, String>> entrysContactType = contactTypeMap.entrySet();
                    for (Map.Entry<String, String> ect : entrysContactType) {
                        if (entry.getKey().equals(ect.getKey())) {
                            contactMap.put(ect.getValue(), entry.getValue().toString());
                        }
                    }
                }
            }


        }
        sqlTemp += ") ";
        valTemp += ") ";
        sqlTemp += valTemp;
        int resultTempId = 0;
        try {
            resultTempId = this.insert(sqlTemp, listTemp);

            List<Map<String,Object>> listCols =(ArrayList<Map<String,Object>>)mapUtil.get("dropdownTypeMap");
            //生成插入关系表的sql
            List<String> listSql=TablesUtil.insertTableRelationValue(String.valueOf(mapUtil.get("tableName")),resultTempId,listCols,jsonObject.getJSONObject("values"));
            if(listSql.size()>0){
                this.getJdbcTemplate().batchUpdate(listSql.toArray(new String[listSql.size()]));
            }


        } catch (SQLException e) {
            e.printStackTrace();
        }

        //将表单数据与联系人存入关系表
        this.addContactDefindData(resultTempId, contactMap, templateTableRow, true);
        //将数据存入纵向表project_exam_answer
        String userName=this.getJdbcTemplate().queryForObject("SELECT `name` FROM t_auth_user WHERE id=1",new Object[]{},String.class);
        TablesUtil.parseAnswerSql(templateTableRow.getDefine_id(),templateTableRow.getDefine(),this.getJdbcTemplate(), userName, user_id, team_id,uuid);
        return resultTempId;
    }

    //导入Excel数据
    public int createTempData(List tempList, TemplateTableRow templateTableRow, String columns, User user) {
        int counts = 0;

        net.sf.json.JSONObject jsonObject = net.sf.json.JSONObject.fromObject(templateTableRow.getDefine());

        Template temp = this.queryTempTableById(Long.valueOf(templateTableRow.getDefine_id()));
        Map mapUtil = TablesUtil.parseQuerySql(jsonObject, "add", temp.getTableName());

        for (int j = 0; j < tempList.size(); j++) {

            String sqlTemp = "INSERT INTO project_define_data (define_id,companyCode,data_uuid,creator,creatorName,dateCreated,dateUpdated";
            String valTemp = "values(?,?,?,?,?,NOW(),NOW()";
            List list = new ArrayList();//将values 有序的存储
            list.add(templateTableRow.getDefine_id());
            list.add(user.getCompanyCode());
            list.add(templateTableRow.getData_uuid());
            list.add(user.getId());
            list.add(user.getUserName());
            //columns = "{\"columns\":[\"col_data1\":\"报名人数\",\"col_data2\":\"签到人数\",\"col_data3\":\"手机号\"]}";
            if (this.vertify(templateTableRow.getProjectId())) {
                sqlTemp += " ,projectId";
                valTemp += ",?";
                list.add(templateTableRow.getProjectId());
            }


            Map contactTypeMap = (Map<String, String>) mapUtil.get("contactTypeMap");
            Map<String, String> contactMap = new HashMap();

            Map jsonMap = (Map<String, Object>) tempList.get(j);
            Set<Map.Entry<String, Object>> entrys = jsonMap.entrySet();
            for (Map.Entry<String, Object> entry : entrys) {
                sqlTemp += "," + entry.getKey();
                valTemp += ",?";
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
            sqlTemp += ") ";
            valTemp += ") ";
            sqlTemp += valTemp;
            int resultTempId = 0;
            try {
                resultTempId = this.insert(sqlTemp, list);
            } catch (SQLException e) {
                e.printStackTrace();
            }
            counts += resultTempId;

            //将表单数据与联系人存入关系表
            templateTableRow.setCompanyCode(user.getCompanyCode());
            this.addContactDefindData(resultTempId, contactMap, templateTableRow, true);
        }

        return counts;
    }

    //将表单数据与联系人存入关系表
    public int addContactDefindData(int resultTempId, Map<String, String> contactMap, TemplateTableRow templateTableRow, Boolean infoType) {

        String sqlContact = "INSERT INTO contact (createDate,updateDate,STATUS ";
        String valContact = "values(NOW(),NOW(),'ACTIVE' ";
        List listContact = new ArrayList();
        int resultContact = 0;
        if (contactMap.size() > 0) {
            List<String> listContactRepeat = new ArrayList<String>();
            String oldTel = "";
            String oldEmail = "";
            String name = "";
            String email = "";
            String tel = "";
            for (Map.Entry<String, String> entry : contactMap.entrySet()) {

                if ((entry.getKey() == "name" || "name".equals(entry.getKey()))) {
                    name = entry.getValue();
                    listContactRepeat.add("姓名:" + entry.getValue());
                } else if ((entry.getKey() == "email" || "email".equals(entry.getKey()))) {
                    email = entry.getValue();
                    listContactRepeat.add("邮箱:" + entry.getValue());
                    oldEmail = entry.getKey() == "email" || "email".equals(entry.getKey()) ? entry.getValue() : oldEmail;
                } else if ((entry.getKey() == "identityCard" || "identityCard".equals(entry.getKey()))) {
                    listContactRepeat.add("身份证:" + entry.getValue());
                } else if ((entry.getKey() == "tel" || "tel".equals(entry.getKey()))) {
                    tel = entry.getValue();
                    listContactRepeat.add("手机:" + entry.getValue());
                    oldTel = entry.getKey() == "tel" || "tel".equals(entry.getKey()) ? entry.getValue() : oldTel;
                } else if ((entry.getKey() == "sex" || "sex".equals(entry.getKey()))) {
                    listContactRepeat.add("性别:" + entry.getValue());
                } else if ((entry.getKey() == "address" || "address".equals(entry.getKey()))) {
                    listContactRepeat.add("地址:" + entry.getValue());
                } else if ((entry.getKey() == "birthdate" || "birthdate".equals(entry.getKey()))) {
                    listContactRepeat.add("出生日期:" + entry.getValue());
                } else if ((entry.getKey() == "description" || "description".equals(entry.getKey()))) {
                    listContactRepeat.add("描述:" + entry.getValue());
                } else if ((entry.getKey() == "postcode" || "postcode".equals(entry.getKey()))) {
                    listContactRepeat.add("邮编:" + entry.getValue());
                } else if ((entry.getKey() == "principalName" || "principalName".equals(entry.getKey()))) {
                    listContactRepeat.add("负责人:" + entry.getValue());
                } else if ((entry.getKey() == "qq" || "qq".equals(entry.getKey()))) {
                    listContactRepeat.add("QQ:" + entry.getValue());
                } else if ((entry.getKey() == "wechat" || "wechat".equals(entry.getKey()))) {
                    listContactRepeat.add("微信:" + entry.getValue());
                } else if ((entry.getKey() == "secondPhone" || "secondPhone".equals(entry.getKey()))) {
                    listContactRepeat.add("备用手机:" + entry.getValue());
                } else if ((entry.getKey() == "secondaryEmail" || "secondaryEmail".equals(entry.getKey()))) {
                    listContactRepeat.add("备用邮箱:" + entry.getValue());
                } else if ((entry.getKey() == "organizationNames" || "organizationNames".equals(entry.getKey()))) {
                    listContactRepeat.add("机构名称:" + entry.getValue());
                } else if ((entry.getKey() == "department" || "department".equals(entry.getKey()))) {
                    listContactRepeat.add("所在部门:" + entry.getValue());
                } else if ((entry.getKey() == "serialNumber" || "serialNumber".equals(entry.getKey()))) {
                    listContactRepeat.add("编号:" + entry.getValue());
                } else if ((entry.getKey() == "fax" || "fax".equals(entry.getKey()))) {
                    listContactRepeat.add("传真:" + entry.getValue());
                } else if ((entry.getKey() == "unitPosition" || "unitPosition".equals(entry.getKey()))) {
                    listContactRepeat.add("单位职务:" + entry.getValue());
                } else if ((entry.getKey() == "workTelephone" || "workTelephone".equals(entry.getKey()))) {
                    listContactRepeat.add("单位电话:" + entry.getValue());
                }

                sqlContact += "," + entry.getKey();
                valContact += ",?";
                listContact.add(entry.getValue());
            }

            String oldContactId = "";
            //如果有数据id说明已存在,否则是新数据再去检查手机与邮箱是否存在

            ContactDefineData contactDefineData = this.queryContactDefineDataCounts(String.valueOf(templateTableRow.getId()));
            if (contactDefineData != null) {
                oldContactId = contactDefineData.getContactId();
                Contact oldC = this.queryContactOld(templateTableRow.getCompanyCode(), oldContactId);
                if (oldC != null && !this.vertify(oldC.getEmail()) && !this.vertify(oldC.getTel()) && (this.vertify(oldEmail)) || this.vertify(oldTel)) {
                    if (!"".equals(oldEmail) && oldEmail != null) {
                        oldContactId = this.queryContactOldEmail(templateTableRow.getCompanyCode(), oldEmail);
                        if (this.vertify(oldContactId)) {
                            String sqlUpdateCdd = "UPDATE contact_define_data SET contactId = ? WHERE defineDataId = ?";
                            this.getJdbcTemplate().update(sqlUpdateCdd, new Object[]{oldContactId, contactDefineData.getDefineDataId()});
                        } else {
                            oldContactId = contactDefineData.getContactId();
                        }
                    } else if (!"".equals(oldTel) && oldTel != null) {
                        oldContactId = this.queryContactOldTel(templateTableRow.getCompanyCode(), oldTel);
                        if (this.vertify(oldContactId)) {
                            String sqlUpdateCdd = "UPDATE contact_define_data SET contactId = ? WHERE defineDataId = ?";
                            this.getJdbcTemplate().update(sqlUpdateCdd, new Object[]{oldContactId, contactDefineData.getDefineDataId()});
                        } else {
                            oldContactId = contactDefineData.getContactId();
                        }

                    }
                }

            } else {
                if (!"".equals(oldEmail) && oldEmail != null) {
                    oldContactId = this.queryContactOldEmail(templateTableRow.getCompanyCode(), oldEmail);
                } else if (!"".equals(oldTel) && oldTel != null) {
                    oldContactId = this.queryContactOldTel(templateTableRow.getCompanyCode(), oldTel);
                } else {
                    oldContactId = "";
                }
            }
            //判断是否存在该联系人,存在判断数据是否更新   //(判断是否存在该联系人,存在便存入重复表)已放弃
            if (oldContactId != null && !"".equals(oldContactId)) {
                String sqlContactCounts = "SELECT * FROM contact WHERE 1=1 AND id=? ";
                List oldContactList = this.getJdbcTemplate().queryForList(sqlContactCounts, new Object[]{oldContactId});

                sqlContact = "UPDATE contact SET updateDate = NOW() ";
                listContact.clear();
                if (oldContactList.size() > 0) {
                    Map<String, String> oldContactMap = (Map<String, String>) oldContactList.get(0);

                    for (Map.Entry<String, String> newItem : contactMap.entrySet()) {
                        for (Map.Entry<String, String> entryItem : oldContactMap.entrySet()) {
                            if (newItem.getKey().equals(entryItem.getKey())) {
                                if (entryItem.getValue() == null || "".equals(entryItem.getValue())) {
                                    sqlContact += ", " + newItem.getKey() + " = ? ";
                                    listContact.add(newItem.getValue());
                                }
                            }
                        }
                    }

                    sqlContact += " WHERE id = ? ";
                    listContact.add(oldContactId);
                    resultContact += this.getJdbcTemplate().update(sqlContact, listContact.toArray());

                }

                //判断正常导入数据还是执行定时器(infoType=true表示正常,infoType=false表示定时器)，定时器不需要再次添加已存在的联系人
//                String sqlQueryCr = "SELECT * FROM contact_repeat WHERE 1=1 AND contactId=?";
//                List<ContactRepeat> listQueryCdd = this.getJdbcTemplate().query(sqlQueryCr, new Object[]{oldContactId}, new BeanPropertyRowMapper<ContactRepeat>(ContactRepeat.class));

//                if ((!infoType && listQueryCdd.size() <= 0) || infoType) {

//                if (infoType) {
//                    String repeatPart = "";
//                    for (int i = 0; i < listContactRepeat.size(); i++) {
//                        repeatPart += listContactRepeat.get(i) + ";";
//                    }
//                    String sqlContactRepeat = "INSERT INTO contact_repeat (contactId, companyCode, repeat_part, createDate, updateDate) VALUES (?, ?, ?, NOW(), NOW())";
//                    this.getJdbcTemplate().update(sqlContactRepeat, new Object[]{oldContactId, templateData.getCompanyCode(), repeatPart});
//                }

            } else {
                if (!"".equals(name) || !"".equals(email) || !"".equals(tel)) {
                    sqlContact += ",companyCode) ";
                    valContact += ",?) ";
                    listContact.add(templateTableRow.getCompanyCode());
                    sqlContact += valContact;
                    try {
                        oldContactId = String.valueOf(this.insert(sqlContact, listContact));
                        resultContact++;
                    } catch (SQLException e) {
                        e.printStackTrace();
                    }
                }
            }


            int resultContactDefindData = 0;
            if (resultTempId > 0) {
                //查询匹配的数据是否已存在
                String sqlQueryCdd = "SELECT * FROM contact_define_data WHERE 1=1 AND defineDataId=?";
                List<ContactDefineData> listQueryCdd = this.getJdbcTemplate().query(sqlQueryCdd, new Object[]{resultTempId}, new BeanPropertyRowMapper<ContactDefineData>(ContactDefineData.class));

                if (oldContactId != null && !"".equals(oldContactId) && listQueryCdd.size() <= 0) {
                    List listContactDeindeData = new ArrayList();
                    listContactDeindeData.add(oldContactId);
                    listContactDeindeData.add(String.valueOf(resultTempId));
                    listContactDeindeData.add(templateTableRow.getDefine_id());
                    String sqlCdd = "INSERT INTO contact_define_data (contactId,  defineDataId,  defineId,  submitDate,  createDate )  VALUES (?,?,?,NOW(),NOW())";

                    try {
                        resultContactDefindData = this.insert(sqlCdd, listContactDeindeData);
                    } catch (SQLException e) {
                        e.printStackTrace();
                    }
                }
            }
        }
        return resultContact;
    }

    //
    public int addContactDefindDataWithForm(List listTempData, Template tl) {
        int resultInt = 0;
        net.sf.json.JSONObject jsonObject = net.sf.json.JSONObject.fromObject(tl.getDefine());

        Map mapUtil = TablesUtil.parseQuerySql(jsonObject, "add", tl.getTableName());

        for (int i = 0; i < listTempData.size(); i++) {
            Map mapTempData = (Map) listTempData.get(i);

            Map contactTypeMap = (Map<String, String>) mapUtil.get("contactTypeMap");
            TemplateTableRow td = new TemplateTableRow();
            td.setId(Long.valueOf((mapTempData.get("id").toString())));
            td.setDefine_id(tl.getId().toString());
            td.setCompanyCode(tl.getCompanyCode());
            JSONObject jasonContact = JSONObject.parseObject(JSON.toJSONString(contactTypeMap));
            Map<String, String> contactMap = new HashMap();
            Set<Map.Entry<String, Object>> entrys = mapTempData.entrySet();
            for (Map.Entry<String, Object> entry : entrys) {
                if (jasonContact.size() > 0) {
                    for (int j = 0; j < jasonContact.size(); j++) {
                        Iterator<String> iteContact = jasonContact.keySet().iterator();
                        while (iteContact.hasNext()) {
                            String key = iteContact.next();
                            String value = jasonContact.getString(key);
                            if (entry.getKey().equals(key)) {
                                contactMap.put(value, entry.getValue().toString());
                            }
                        }
                    }
                }
            }
            resultInt += this.addContactDefindData((Integer) mapTempData.get("id"), contactMap, td, false);
        }
        return resultInt;
    }

    //查询是否存在该联系人
    public String queryContactOldTel(String companyCode, String tel) {
        String sqlContactCounts = "SELECT * FROM contact WHERE 1=1 AND companyCode=? AND tel=? ";
        List<Contact> listContact = this.getJdbcTemplate().query(sqlContactCounts, new Object[]{companyCode, tel}, new BeanPropertyRowMapper<Contact>(Contact.class));
        return listContact.size() > 0 ? String.valueOf(listContact.get(0).getId()) : null;
    }

    public String queryContactOldEmail(String companyCode, String email) {
        String sqlContactCounts = "SELECT * FROM contact WHERE 1=1 AND companyCode=? AND email=? ";
        List<Contact> listContact = this.getJdbcTemplate().query(sqlContactCounts, new Object[]{companyCode, email}, new BeanPropertyRowMapper<Contact>(Contact.class));
        return listContact.size() > 0 ? String.valueOf(listContact.get(0).getId()) : null;
    }

    public Contact queryContactOld(String companyCode, String id) {
        String sqlContactCounts = "SELECT * FROM contact WHERE 1=1 AND companyCode=? AND id=? ";
        List<Contact> listContact = this.getJdbcTemplate().query(sqlContactCounts, new Object[]{companyCode, id}, new BeanPropertyRowMapper<Contact>(Contact.class));
        return listContact.size() > 0 ? listContact.get(0) : null;
    }

    //查询是否存在该联系人数据
    public ContactDefineData queryContactDefineDataCounts(String defineDataId) {
        String sqlContactCounts = "SELECT * FROM contact_define_data WHERE 1=1 AND defineDataId=?  ";
        List<ContactDefineData> listCdd = this.getJdbcTemplate().query(sqlContactCounts, new Object[]{defineDataId}, new BeanPropertyRowMapper<ContactDefineData>(ContactDefineData.class));
        return listCdd.size() > 0 ? listCdd.get(0) : null;
    }


    public int updateTempData(TemplateTableRow templateTableRow) {
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
            sql += " `" + entry.getKey() + "`= ? ,";
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
        if (i > 0) {
            this.addContactDefindData(templateTableRow.getId().intValue(), contactMap, templateTableRow, false);

            //生成插入关系表的sql
            List<Map<String,Object>> listCols =(ArrayList<Map<String,Object>>)mapUtil.get("dropdownTypeMap");
            List<String> listSql=TablesUtil.insertTableRelationValue(
                    temp.getTableName(),
                    templateTableRow.getId().intValue(),
                    listCols,jsonObject.getJSONObject("values"));
            if(listSql.size()>0){
                this.getJdbcTemplate().batchUpdate(listSql.toArray(new String[listSql.size()]));
            }
        }
        String userName=this.getJdbcTemplate().queryForObject("SELECT `name` FROM t_auth_user WHERE id=1",new Object[]{},String.class);
        String answerUserUuid=this.getJdbcTemplate().queryForObject("select data_uuid from "+temp.getTableName() +" where id=? ",new Object[]{templateTableRow.getId()},String.class);
        TablesUtil.updateAnswer(templateTableRow.getDefine_id(),templateTableRow.getDefine(),this.getJdbcTemplate(), userName, user_id, team_id,answerUserUuid);
        return i;
    }

    public Handle updateTempDataRemark(TemplateTableRow templateTableRow, User user) {
        String sql = "UPDATE project_define_data SET remark=?, dateUpdated = NOW() WHERE id = ? ";
        int i = this.getJdbcTemplate().update(sql, new Object[]{templateTableRow.getRemark(), templateTableRow.getId()});
        return CommonUtils.getHandle(i);
    }

    public int deleteTempData(String defineId, String id) {
        String tableNameSql = "SELECT tableName FROM project_define WHERE id=?";
        String tableName = this.getJdbcTemplate().queryForObject(tableNameSql, new Object[]{defineId}, String.class);
        String sql = "DELETE FROM " + tableName + " WHERE id = ?";
        //@TODO这里后面联系人不能通过id关联，要通过uuid关联
        this.deleteContactTempData(id);

        return this.getJdbcTemplate().update(sql, new Object[]{id});
    }

    public int clearAllData(String id, String creator, User user) {
        String sql = "DELETE d FROM project_define_data d,project_define f INNER JOIN system_user u ON f.creator=u.id WHERE f.id=d.define_id AND d.define_id=? AND (f.creator=? or u.roleId=?)";
        this.clearContactTempData(id);
        return this.getJdbcTemplate().update(sql, new Object[]{id, creator, user.getRoleId()});
    }

    //删除单条联系人与表数据
    public void deleteContactTempData(String dataId) {
        String sqlContact = "DELETE FROM contact_define_data WHERE defineDataId = ? ";
        this.getJdbcTemplate().update(sqlContact, new Object[]{dataId});
    }

    //删除某个表的联系人与表数据
    public void clearContactTempData(String defineId) {
        String sqlContact = "DELETE FROM contact_define_data WHERE defineId = ? ";
        this.getJdbcTemplate().update(sqlContact, new Object[]{defineId});
    }

    public Page queryAllTempDataByPage(Template template) {
        //net.sf.json.JSONObject jsonObject = net.sf.json.JSONObject.fromObject(templateTable.getDefine());
        //String define_id = template.getDefine_id();
        //Template temp = this.queryTempTableById(Long.valueOf(define_id));

        /* 子表关联显示，不需要再这里查询出来
        net.sf.json.JSONObject schema = template.getDefineJsonObject().getJSONObject("schema");
        //获取关联关系表更改col_data,方便后面的sql语句查询关系表
         子表关联显示，不需要再这里查询出来
         Iterator<String> it=schema.keys();
        while (it.hasNext()){
            String key=it.next();
            net.sf.json.JSONObject value=schema.getJSONObject(key);
            if("FormDropdown".equals(value.get("type"))){
                String tableSql="SELECT target_table,`value` FROM project_table_relation WHERE this_table='"+template.getTableName()+"' AND target_table='"+value.get("value")+"'";
                List<Map<String, Object>> tableList = this.getJdbcTemplate().queryForList(tableSql);
                String[] valueList=tableList.get(0).get("value").toString().split(",");
                String deploySql="(SELECT "+valueList[valueList.length-1]+" FROM "+tableList.get(0).get("target_table")+" WHERE "+valueList[0]+"="+value.get("col_data")+") AS '"+value.get("col_data")+"' ";
                value.put("col_data",deploySql);
            }
        }*/

        //把前台传过来的tableName改为服务器获取，免得被窃取信息
        Map queryMap = TablesUtil.parseQuerySql(template.getDefineJsonObject(), "query", template.getTableName());

        String sql = queryMap.get("sql") + "";

        Page page = new Page();

        getPageList(page, sql, template.getTemplateTable(), (List) queryMap.get("listSqlWhere"));
//        temp.setDefine(this.addOptions(Integer.parseInt(define_id)).toString());
        template.setDefine(template.getDefineJsonObject().toString());
        template.setDefineJsonObject(null);//前端不需要显示
        page.setTemp(template);

        return page;
    }

    public Page getPageList(Page page, Template temp, TemplateTableRow templateTableRow) {
        Template tt = new Template();
        tt.setDefine(temp.getDefine());
        Map colsMap = TablesUtil.getNumberCols(tt);
        List listKey = new ArrayList();
        Iterator it = colsMap.keySet().iterator();
        while (it.hasNext()) {
            String key = it.next().toString();
            listKey.add(key);
        }
        for (int i = 0; i < colsMap.size(); i++) {
            colsMap.replace(listKey.get(i), this.querySumNumberCols(String.valueOf(listKey.get(i)), templateTableRow));
        }
        //如果列中有为number类型的 重新拼接列头
        if (colsMap.size() > 0) {
            TablesUtil.getNumberCols(tt, colsMap);
        }
        try {
            page.setResultList(TablesUtil.getJsonList(page.getResultList(), tt));
        } catch (Exception e) {
            LoggerUtil.errorOut("getPageList:" + e.getMessage());
        }
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

    public Page queryAllTempData(Template template) {
       // net.sf.json.JSONObject jsonObject = net.sf.json.JSONObject.fromObject(templateTable.getDefine());
        //String define_id = template.getDefine_id();
        //Template temp = this.queryTempTableById(Long.valueOf(define_id));
        Map queryMap = TablesUtil.parseQuerySql(template.getDefineJsonObject(), "query", template.getTableName());
        String sql = queryMap.get("sql") + "";

        Page page = new Page();
        //Template temp = this.queryTempTableById(Long.valueOf(String.valueOf(queryMap.get("define_id"))));
        template.setDefine(template.getDefineJsonObject().toString());
        template.setDefineJsonObject(null);//不需要返回到前端，清除
        page.setTemp(template);
        List paramsList = (List) queryMap.get("listSqlWhere");

        page.setResultList(TablesUtil.changeData(this.getJdbcTemplate().queryForList(sql, paramsList.toArray(new Object[paramsList.size()]))));

        return page;
    }

    public Page getPageList(Page page, String sql, List params) {
        List list = this.getJdbcTemplate().queryForList(sql, params.toArray(new Object[params.size()]));
        page.setResultList(list);
        return page;
    }

    public Page queryAllTempDataByDefineId(String define_id, String projectId, String allOrPage) {
        Template temp = this.queryTempTableById(Long.valueOf(define_id));
        temp.setProjectId(projectId);
        TablesUtil.firstAddDefine(temp);//生成jsonObject形式的列描述，包括静态列

        TemplateTableRow templateTableRow = new TemplateTableRow();
        templateTableRow.setDefine(temp.getDefine());

        temp.setTemplateTable(templateTableRow);
        //allOrPage 区分查所有或者分页
        Page result = null;
        if ("all".equals(allOrPage)) {
            result = this.queryAllTempData(temp);
        } else {
            result = this.queryAllTempDataByPage(temp);
        }
        TablesUtil.filterHidenData(temp.getDefine(), result);
        return result;
    }

    public Page queryTempDataById(TemplateTableRow templateTableRow) {
        List<String> params = new ArrayList<String>();
        String sql = "SELECT pdd.*,pd.define, " +
                " pd.formTitle, " +
                " pd.formDescription, " +
                " pd.usableRange,pd.sub " +
                " FROM " +
                " " + templateTableRow.getTableName() + " pdd INNER JOIN project_define pd ON pdd.define_id=pd.id WHERE 1=1 ";

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
        List<TemplateTableRow> list = this.getJdbcTemplate().query(sql, params.toArray(new Object[params.size()]), new BeanPropertyRowMapper<TemplateTableRow>(TemplateTableRow.class));
        Page page = new Page();
        if (list.size() > 0) {
            page.setResultList(list);
            return page;
        } else {
            return null;
        }
    }

    public String querySumNumberCols(String col_data, TemplateTableRow templateTableRow) {
        String sql = "SELECT ROUND(SUM(IFNULL(" + col_data + ",0)),2) FROM project_define_data WHERE 1=1 ";

        List<String> params = new ArrayList<String>();

        if (this.vertify(templateTableRow.getCol_data1())) {
            sql += " AND col_data1 LIKE ?";
            params.add("%" + templateTableRow.getCol_data1() + "%");
        }
        if (this.vertify(templateTableRow.getCol_data2())) {
            sql += " AND col_data2 LIKE ?";
            params.add("%" + templateTableRow.getCol_data2() + "%");
        }
        if (this.vertify(templateTableRow.getCol_data3())) {
            sql += " AND col_data3 LIKE ?";
            params.add("%" + templateTableRow.getCol_data3() + "%");
        }
        if (this.vertify(templateTableRow.getCol_data4())) {
            sql += " AND col_data4 LIKE ?";
            params.add("%" + templateTableRow.getCol_data4() + "%");
        }
        if (this.vertify(templateTableRow.getCol_data5())) {
            sql += " AND col_data5 LIKE ?";
            params.add("%" + templateTableRow.getCol_data5() + "%");
        }
        if (this.vertify(templateTableRow.getCol_data6())) {
            sql += " AND col_data6 LIKE ?";
            params.add("%" + templateTableRow.getCol_data6() + "%");
        }
        if (this.vertify(templateTableRow.getCol_data7())) {
            sql += " AND col_data7 LIKE ?";
            params.add("%" + templateTableRow.getCol_data7() + "%");
        }
        if (this.vertify(templateTableRow.getCol_data8())) {
            sql += " AND col_data8 LIKE ?";
            params.add("%" + templateTableRow.getCol_data8() + "%");
        }
        if (this.vertify(templateTableRow.getCol_data9())) {
            sql += " AND col_data9 LIKE ?";
            params.add("%" + templateTableRow.getCol_data9() + "%");
        }
        if (this.vertify(templateTableRow.getCol_data10())) {
            sql += " AND col_data10 LIKE ?";
            params.add("%" + templateTableRow.getCol_data10() + "%");
        }
        if (this.vertify(templateTableRow.getCol_data11())) {
            sql += " AND col_data11 LIKE ?";
            params.add("%" + templateTableRow.getCol_data11() + "%");
        }
        if (this.vertify(templateTableRow.getCol_data12())) {
            sql += " AND col_data12 LIKE ?";
            params.add("%" + templateTableRow.getCol_data12() + "%");
        }
        if (this.vertify(templateTableRow.getCol_data13())) {
            sql += " AND col_data13 LIKE ?";
            params.add("%" + templateTableRow.getCol_data13() + "%");
        }
        if (this.vertify(templateTableRow.getCol_data14())) {
            sql += " AND col_data14 LIKE ?";
            params.add("%" + templateTableRow.getCol_data14() + "%");
        }
        if (this.vertify(templateTableRow.getCol_data15())) {
            sql += " AND col_data15 LIKE ?";
            params.add("%" + templateTableRow.getCol_data15() + "%");
        }
        if (this.vertify(templateTableRow.getCol_data16())) {
            sql += " AND col_data16 LIKE ?";
            params.add("%" + templateTableRow.getCol_data16() + "%");
        }
        if (this.vertify(templateTableRow.getCol_data17())) {
            sql += " AND col_data17 LIKE ?";
            params.add("%" + templateTableRow.getCol_data17() + "%");
        }
        if (this.vertify(templateTableRow.getCol_data18())) {
            sql += " AND col_data18 LIKE ?";
            params.add("%" + templateTableRow.getCol_data18() + "%");
        }
        if (this.vertify(templateTableRow.getCol_data19())) {
            sql += " AND col_data19 LIKE ?";
            params.add("%" + templateTableRow.getCol_data19() + "%");
        }
        if (this.vertify(templateTableRow.getCol_data20())) {
            sql += " AND col_data20 LIKE ?";
            params.add("%" + templateTableRow.getCol_data20() + "%");
        }
        if (this.vertify(templateTableRow.getCol_data21())) {
            sql += " AND col_data21 LIKE ?";
            params.add("%" + templateTableRow.getCol_data21() + "%");
        }
        if (this.vertify(templateTableRow.getCol_data22())) {
            sql += " AND col_data22 LIKE ?";
            params.add("%" + templateTableRow.getCol_data22() + "%");
        }
        if (this.vertify(templateTableRow.getCol_data23())) {
            sql += " AND col_data23 LIKE ?";
            params.add("%" + templateTableRow.getCol_data23() + "%");
        }
        if (this.vertify(templateTableRow.getCol_data24())) {
            sql += " AND col_data24 LIKE ?";
            params.add("%" + templateTableRow.getCol_data24() + "%");
        }
        if (this.vertify(templateTableRow.getCol_data25())) {
            sql += " AND col_data25 LIKE ?";
            params.add("%" + templateTableRow.getCol_data25() + "%");
        }
        if (this.vertify(templateTableRow.getDefine_id())) {
            sql += " AND define_id = ? ";
            params.add(templateTableRow.getDefine_id());
        }
        if (this.vertify(templateTableRow.getData_uuid())) {
            sql += " AND data_uuid = ? ";
            params.add(templateTableRow.getData_uuid());
        }
        if (this.vertify(templateTableRow.getProjectId())) {
            sql += " AND projectId = ? ";
            params.add(templateTableRow.getProjectId());
        }
        if (this.vertify(templateTableRow.getCreator())) {
            sql += " AND creator LIKE ?";
            params.add("%" + templateTableRow.getCreator() + "%");
        }
        if (this.vertify(templateTableRow.getDateFrom())) {
            params.add(templateTableRow.getDateFrom());
            sql += " AND dateCreated >=?";
        }
        if (this.vertify(templateTableRow.getDateFrom())) {
            params.add(templateTableRow.getDateTo());
            sql += " AND dateCreated <=?";
        }

        sql += " ORDER BY dateCreated desc";
        String result = this.getJdbcTemplate().queryForObject(sql, params.toArray(), String.class);
        return result;
    }

    public List queryTempDataFrom(TemplateTableRow templateTableRow) {
        String sqlSystemEnvironment = "SELECT COUNT(IF(systemEnvironment = 'windows' ,systemEnvironment, NULL)) AS windows, COUNT(IF(systemEnvironment = 'android' ,systemEnvironment, NULL)) AS android , COUNT(IF(systemEnvironment = 'ios' ,systemEnvironment, NULL)) AS ios,COUNT(IF(channel = '其他渠道' ,channel, NULL)) AS defaultFrom, COUNT(IF(channel = '微信' ,channel, NULL)) AS weixin , COUNT(IF(channel = '微博' ,channel, NULL)) AS weibo, COUNT(IF(channel = 'QQ' ,channel, NULL)) AS QQ   FROM project_define_data WHERE companyCode = ? AND define_id=? ";
        List<String> params = new ArrayList<String>();
        params.add(templateTableRow.getCompanyCode());
        params.add(templateTableRow.getDefine_id());
        if (this.vertify(templateTableRow.getProjectId())) {
            sqlSystemEnvironment += " AND projectId = ? ";
            params.add(templateTableRow.getProjectId());
        }
        List<TemplateTableRow> listTempDataFrom = this.getJdbcTemplate().query(sqlSystemEnvironment, params.toArray(), new BeanPropertyRowMapper<TemplateTableRow>(TemplateTableRow.class));

        return listTempDataFrom;
    }

    public Page queryTempDataGroupCount(TemplateTableRow templateTableRow) {
        String[] selectGroupColDatas = templateTableRow.getSelectGroupColDatas().split(",");
        String[] selectCountColDatas = templateTableRow.getSelectCountColDatas().split(",");
        List<String> params = new ArrayList<String>();
        String sql = "SELECT ";
        if (selectCountColDatas.length > 0 && !"".equals(selectCountColDatas[0])) {
            for (int j = 0; j < selectCountColDatas.length; j++) {
                String[] splitColData = selectCountColDatas[j].split("-");
                sql += j > 0 ? ",ROUND(" + splitColData[1] + "(" + splitColData[0] + "),2) AS `" + selectCountColDatas[j] + "`" : "ROUND(" + splitColData[1] + "(" + splitColData[0] + "),2) AS `" + selectCountColDatas[j] + "`";
            }
        }
        sql += " FROM \n" + "\t project_define_data pdd INNER JOIN project_define pd ON pdd.define_id=pd.id WHERE 1=1 AND pd.companyCode=? ";

        params.add(templateTableRow.getCompanyCode());
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

        if (selectGroupColDatas.length > 0 && !"".equals(selectGroupColDatas[0])) {
            sql += " GROUP BY ";
            for (int i = 0; i < selectGroupColDatas.length; i++) {
                sql += i > 0 ? (" AND " + selectGroupColDatas[i]) : (selectGroupColDatas[i]);
            }
        }
        sql += " ORDER BY pdd.id ";

        Page page = new Page();
        String count = "SELECT COUNT(1) num FROM (" + sql + ") r";
        int total = this.getJdbcTemplate().queryForObject(count, params.toArray(new Object[params.size()]), Integer.class);
        page.setTotal(total);
        page.setTotalPages(((int) total / templateTableRow.getPageSize()) + 1);
        page.setCurrentPage(templateTableRow.getCurrentPage());
        page.setPageSize(templateTableRow.getPageSize());

        sql += " LIMIT " + (templateTableRow.getCurrentPage() - 1) * templateTableRow.getPageSize() + ", " + templateTableRow.getPageSize();
        List list = this.getJdbcTemplate().queryForList(sql, params.toArray(new Object[params.size()]));
        page.setResultList(list);

        return page;
    }

    public List<?> queryFocusFrom(Integer currentPage, User user) {
        List<String> params = new ArrayList<String>();
        String sql = "SELECT DISTINCT p.*,f.id AS focusId,(SELECT COUNT(*) FROM project_define_data pdd WHERE pdd.define_id = p.id)AS dataCounts FROM project_focus f,project_define p \n" +
                "WHERE f.projectId=p.id AND f.type='form'";
        sql += " AND p.companyCode=?";
        params.add(String.valueOf(user.getCompanyCode()));
        sql += " AND f.userId=?";
        params.add(String.valueOf(user.getId()));
        sql += " ORDER BY p.dateUpdated DESC ";
        return this.queryForPage(sql, params, currentPage, 5, Template.class).getResultList();
    }

    /**
     * 查询子数据
     *
     * @param parentDefineId
     * @param parentId
     * @param define_id
     * @return
     */
    public Page querySubData(Long parentDefineId, Long parentId, Long define_id) {
        Template template = this.queryTempTableById(define_id);
        String dataSql = "SELECT d.* FROM `project_define_data` d WHERE define_id=? and d.`rowDataId`=? and rowDefineId=? order by id desc";//子数据中的table define分类对应的数据
        Page page = new Page();
        page.setTemp(template);
        page.setResultList(this.getJdbcTemplate().queryForList(dataSql, new Object[]{define_id, parentId, parentDefineId}));
        return page;
    }

    public void setModifyPw(Long define_id, String modifyPw) {
        this.getJdbcTemplate().update("UPDATE `project_define` SET `modifyPw`=? WHERE `id`=?  ",
                new Object[]{modifyPw, define_id});
    }

    public boolean vertifyPw(Long define_id, String modifyPw) {
        int num = this.getJdbcTemplate().queryForObject("SELECT COUNT(1) num FROM  `project_define` WHERE `modifyPw`=? AND `id`=?  ",
                new Object[]{modifyPw, define_id}, Integer.class);
        return num > 0 ? true : false;
    }


    //查询关联表数据拼接到define中
    public net.sf.json.JSONObject addOptions(Integer defineId){
        // 查询define
        String sql = "SELECT id,id define_id,tableName, dateCreated,companyCode, creator, formTitle, define, formDescription, MODIFIER, dateUpdated," +
                " usableRange,sub, (CASE WHEN (SELECT COUNT(*) FROM project_define_data pdd WHERE pdd.define_id = pd.id) > 0" +
                " THEN 'true' WHEN (SELECT COUNT(*) FROM project_define_data pdd WHERE pdd.define_id=pd.id) = 0 THEN 'false' END)AS dataCounts " +
                "FROM project_define pd where id = ?";
        List<Template> list =this.getJdbcTemplate().query(sql, new Object[]{defineId}, new BeanPropertyRowMapper<Template>(Template.class));
        // 查询关联表数据
        String sql2 = "SELECT target_table,value,`key` FROM project_table_relation WHERE this_table=(SELECT tableName FROM project_define WHERE id=" + defineId + ")";
        List<Map<String, Object>> mapList1 = this.getJdbcTemplate().queryForList(sql2);
        net.sf.json.JSONObject jsonObject = net.sf.json.JSONObject.fromObject(list.get(0).getDefine());
        //判断关联表是否有数据
        if (mapList1.size() > 0) {
            for (Map<String, Object> map : mapList1) {
//                    String sql3="SELECT " +map.get("value")+" AS 'value'  FROM "+map.get("target_table")+" WHERE " +
//                            "id IN (SELECT project FROM application_research WHERE `STATUS`=1 AND creator=?) AND `STATUS`!=? ";
                    String sql3="SELECT " +map.get("value")+" AS 'value'  FROM "+map.get("target_table");
                List<Map<String, Object>>   mapList= this.getJdbcTemplate().queryForList(sql3);

                jsonObject.getJSONObject("schema").getJSONObject(map.get("target_table").toString()).put("options", mapList);
//                jsonObject.getJSONObject("schema").getJSONObject(map.get("target_table").toString()).put("value", map.get("key"));
            }
        }

        return jsonObject;
    }

    /**
     * 查询所有能做子表的表
     * @return
     */
    public List<Map<String, Object>> querySubTables() {
        String sql="SELECT formTitle `name`,tableName `value` FROM project_define WHERE sub=1";
        return this.getJdbcTemplate().queryForList(sql);
    }

    public List<String> getTableColumns(String tableName){
        String sql="SELECT COLUMN_NAME `columnName` FROM information_schema.COLUMNS " +
                "WHERE TABLE_SCHEMA = '"+domeDatasourceDatabase+"' AND TABLE_NAME = ? AND COLUMN_NAME<>'id';";
        return this.getJdbcTemplate().queryForList(sql,new Object[]{
                tableName
        },String.class);
    }

    public List<Map<String, Object>> getDropdownOptions(String columnName, String tableName) {
        String sql="SELECT  id `value`,"+columnName+" `label` FROM  "+tableName+";";
        return this.getJdbcTemplate().queryForList(sql);
    }

    public Page queryExamQuestion(ExamQuestion e) {
        String querySql="SELECT * FROM `project_exam_question` WHERE 1=1 ";
        List<String> params=new ArrayList<>();
        if(e.getTitle()!=null&&!"".equals(e.getTitle())){
            querySql+=" and title LIKE concat('%',?,'%')";
            params.add(e.getTitle());
        }
        if(e.getLabel()!=null&&!"".equals(e.getLabel())){
            querySql+=" and label LIKE concat('%',?,'%')";
            params.add(e.getLabel());
        }
        querySql+=" order by id desc";
        Page page = this.queryForPage(querySql, params, e.getCurrentPage(), 10, ExamQuestion.class);
        return page;
    }

    public int updateExamQuestion(ExamQuestion e) throws SQLException {
        int num=this.getJdbcTemplate().queryForObject("SELECT IFNULL(COUNT(1),0) num FROM project_exam_question WHERE `uuid`=?",
                new Object[]{e.getUuid()},Integer.class);
        if(num>0){
            String updateSql="UPDATE `project_exam_question` " +
                    "SET `question` = ?,`title` = ?,`columnScore` = ?,`label` = ? " +
                    "WHERE `uuid` = ? ;";

            return this.getJdbcTemplate().update(updateSql,new Object[]{
                    e.getQuestion(),e.getTitle(),e.getColumnScore(),e.getLabel(),e.getUuid()});
        }else{
            return this.insertExamQuestion(e);
        }

    }

    public int insertExamQuestion(ExamQuestion e) throws SQLException {
        String updateSql="INSERT INTO `project_exam_question` (" +
                "`uuid`,`question`,`title`,`columnScore`,`label`" +
                ") VALUES(?,?,?,?,?)";

        return this.insert(updateSql,new Object[]{
                e.getUuid(),e.getQuestion(),e.getTitle(),e.getColumnScore(),e.getLabel()});
    }


}
