package com.auth.dao;

import com.auth.entity.*;
import com.auth.entity.User;
import com.common.jdbc.JdbcBase;
import com.projectManage.entity.Project;
import com.utils.*;
import net.sf.json.JSONObject;
import org.apache.commons.codec.digest.DigestUtils;
import org.apache.poi.hssf.usermodel.HSSFCell;
import org.apache.poi.hssf.usermodel.HSSFRow;
import org.apache.poi.hssf.usermodel.HSSFSheet;
import org.apache.poi.hssf.usermodel.HSSFWorkbook;
import org.apache.poi.ss.usermodel.*;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.jdbc.core.BeanPropertyRowMapper;
import org.springframework.stereotype.Repository;

import java.io.FileNotFoundException;
import java.io.FileOutputStream;
import java.io.IOException;
import java.sql.SQLException;
import java.util.*;

/**
 * Created by dragon_eight on 2018/9/3.
 */
@Repository
public class UserDao extends JdbcBase {

    @Value("${web.upload-path}")
    String path;
    private int pageSize = 10;

    //查询下一个建值
    public Integer getStockNextIndex(String table) {

        List<Map<String, Object>> ls = this.getJdbcTemplate().queryForList(
                " SHOW TABLE STATUS WHERE NAME= ? ", new Object[]{table});
        int index = 0;
        if (ls.size() == 1) {
            Map m = ls.get(0);
            index = Integer.parseInt(m.get("Auto_increment").toString());
        }
        return index;
    }

    public Handle registerUser(Organization organization) {
        String s = " SELECT tel,CASE \n" +
                "WHEN tel=? THEN 'tel' \n" +
                "WHEN email=? THEN 'email'\n" +
                "ELSE 'ok' END `type`\n" +
                "FROM system_user WHERE (tel = ?  OR email = ? ) AND companyCreator = 'YES' ";
        if (!this.vertifyCode(organization.getTel(), organization.getCode())) {//判断验证码
            return new Handle(0, "验证码错误！");
        }

        List<Map<String, Object>> list = this.getJdbcTemplate().queryForList(s, new Object[]{organization.getTel(), organization.getEmail(), organization.getTel(), organization.getEmail()});
        Boolean flag = true;
        if (list.size() > 0) {
            flag = false;
        }
        if (flag) {

            String sqlOrganization = "INSERT INTO system_organization " +
                    " ( logo," +
                    " companyName,  " +
                    " companyCode, " +
                    "website, " +
                    "userName, " +
                    " tel,  " +
                    " email,  " +
                    " weibo,  " +
                    " weixin,  " +
                    " address,  " +
                    " zipcode,  " +
                    " createDate, " +
                    " updateDate " +
                    " )"
                    + " VALUES ( " +
                    "?,?,UUID(),?,?,?,?,?,?,?,?,NOW(),NOW()" +
                    ")";

            List<String> paramsOrganization = new ArrayList<>();
            paramsOrganization.add(organization.getLogo());
            paramsOrganization.add(organization.getCompanyName());
            paramsOrganization.add(organization.getWebsite());
            paramsOrganization.add(organization.getUserName());
            paramsOrganization.add(organization.getTel());
            paramsOrganization.add(organization.getEmail());
            paramsOrganization.add(organization.getWeibo());
            paramsOrganization.add(organization.getWeixin());
            paramsOrganization.add(organization.getAddress());
            paramsOrganization.add(organization.getZipcode());
            int organizationId = 0;
            try {
                organizationId = this.insert(sqlOrganization, paramsOrganization);
            } catch (Exception e) {
                System.out.println(e);
            }
            String sqlCode = this.getJdbcTemplate().queryForObject("SELECT companyCode FROM system_organization WHERE id = ?", new Object[]{organizationId}, String.class);
            String sqlUser = "INSERT INTO system_user " +
                    " (userName, " +
                    " PASSWORD,  " +
                    " tel,  " +
                    " email,  " +
                    " companyName,  " +
                    " companyCode, " +
                    " createDate, " +
                    " updateDate, " +
                    " roleId, " +
                    " companyCreator" +
                    " )"
                    + " VALUES ( " +
                    "?,?,?,?,?,?,NOW(),NOW(),'1','YES'" +
                    ")";
            organization.setPassword(DigestUtils.sha1Hex(organization.getPassword()));
            int i = this.getJdbcTemplate().update(
                    sqlUser,
                    new Object[]{organization.getUserName(), organization.getPassword(), organization.getTel(), organization.getEmail(), organization.getCompanyName(), sqlCode});

            if (organizationId > 0 && i > 0) {

                return new Handle(1, "注册成功");
            } else {
                return new Handle(0, "操作失败，请稍后重试");
            }
        } else {
            if (list.size() == 1) {
                if ("tel".equals(list.get(0).get("type"))) {
                    return new Handle(0, "此手机号已注册");
                } else {
                    return new Handle(0, "此邮箱已存在");
                }
            } else {
                return new Handle(0, "此手机号已注册");
            }
        }
    }

    public boolean vertifyCode(String phone, String code) {
        int userNum = this.getJdbcTemplate().queryForObject("select count(1) num from verify_code where verifyPhone=? and verifyCode=?", new Object[]{phone, code}, Integer.class);
        if (userNum > 0) {
            return true;
        } else {
            return false;
        }
    }

    //验证并且获得员工相关信息
    public List getAndVertifyStaff(User user) {
        List resultList = new ArrayList();
        Boolean flag = user.getTel().indexOf("@") >= 0 ? true : false;
        String s = "SELECT u.id,u.userName,u.password,u.tel," +
                " u.email,u.createDate,u.updateDate,u.roleId,u.status," +
                " u.companyCreator,r.roleName,r.roleType,orz.logo," +
                " orz.companyName,orz.companyCode " +
                " FROM system_user u INNER JOIN system_role r " +
                " ON u.roleID = r.id INNER JOIN system_organization orz " +
                " ON u.companyCode=orz.companyCode WHERE 1=1 ";
        if (flag) {
            //邮箱登录
            s += " AND u.email='" + user.getTel() + "'";
        } else {
            //手机登陆
            s += " AND u.tel='" + user.getTel() + "'";
        }
//        s += " AND u.password ='"+user.getPassword()+"'";
        List list = this.getJdbcTemplate().query(s, new BeanPropertyRowMapper(User.class));
        return list;
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

    //验证手机号是否已用
    public boolean vertifyUserRegister(String tel) {
        int userNum = this.getJdbcTemplate().queryForObject("SELECT COUNT(*) num FROM system_user WHERE tel=?", new Object[]{tel}, Integer.class);
        if (userNum > 0) {
            return true;
        } else {
            return false;
        }
    }

    //验证码
    public String insertCodeToSms(String tel) {
        String code = CommonUtils.verificationCode();//随机生成验证码
        String msg = SmsVerify.sendCode(code, tel);//发送信息
        if ("".equals(msg)) {
            this.getJdbcTemplate().update("INSERT INTO verify_code(verifyPhone,verifyCode,createDate,updateDate)VALUES(?,?,NOW(),NOW())", new Object[]{tel, code});
        }
        return msg;
    }


    //查询所有员工信息
    public Page getPersonalCenter(User user) {
        List params = new ArrayList();

        String sql = " SELECT u.*,r.roleName,r.roleType FROM system_user u INNER JOIN system_role r ON u.roleID = r.id WHERE 1=1 AND u.companyCode = ? AND u.id = ? AND r.roleType = ? ";
        params.add(user.getCompanyCode());
        params.add(user.getId());
        params.add(user.getRoleType());
        return this.queryForPage(sql, params, user.getCurrentPage(), user.getPageSize(), User.class);
    }


    //查询所有员工信息
    public Page getAllUser(User user) {
        List params = new ArrayList();

        String sql = " SELECT u.*,r.roleName,r.roleType FROM system_user u INNER JOIN system_role r ON u.roleID = r.id WHERE 1=1 AND u.companyCode = ? ";
        //区分公司
        params.add(user.getCompanyCode());

        //有查询条件时
        if (user.getUserName() != null && !"".equals(user.getUserName())) {
            sql += " AND u.userName LIKE ? ";
            params.add("%" + user.getUserName() + "%");
        }
        if (user.getStatus() != null && !"".equals(user.getStatus())) {
            sql += " AND u.status=? ";
            params.add(user.getStatus());
        }
        if (user.getEmail() != null && !"".equals(user.getEmail())) {
            sql += " AND u.email LIKE ? ";
            params.add("%" + user.getEmail() + "%");
        }
        if (user.getTel() != null && !"".equals(user.getTel())) {
            sql += " AND u.tel LIKE ? ";
            params.add("%" + user.getTel() + "%");
        }

        //普通用户只查自己的信息
        if (user.getRoleType() != null && !"".equals(user.getRoleType())) {
            if (user.getRoleType() == "normal" || "normal".equals(user.getRoleType())) {
                sql += " AND u.id = ? ";
                params.add(user.getId());
            }
        }

        sql += " order by u.updateDate DESC";

        return this.queryForPage(sql, params, user.getCurrentPage(), user.getPageSize(), User.class);
    }

    //添加员工
    public Handle insertUser(User user) {
        //email是已否存在
        String strEmail = " SELECT COUNT(1) FROM system_user WHERE email=? AND companyCode=? ";
        int result2 = this.getJdbcTemplate().queryForObject(strEmail, new Object[]{user.getEmail(), user.getCompanyCode()}, Integer.class);
        if (result2 > 0) {
            return new Handle(0, "此邮箱已存在");
        }
        //tel是已否存在
        String strTel = " SELECT COUNT(1) FROM system_user WHERE tel=? AND companyCode=? ";
        int result3 = this.getJdbcTemplate().queryForObject(strTel, new Object[]{user.getTel(), user.getCompanyCode()}, Integer.class);
        if (result3 > 0) {
            return new Handle(0, "此手机号已存在");
        }

        String sql = "INSERT INTO system_user " +
                " (userName, " +
                " PASSWORD,  " +
                " tel,  " +
                " email,  " +
                " companyName,  " +
                " companyCode, " +
                " createDate, " +
                " updateDate, " +
                " roleId " +
                " )"
                + " VALUES ( " +
                "?,?,?,?,?,?,NOW(),NOW(),?" +
                ")";


        user.setPassword(DigestUtils.sha1Hex(user.getPassword()));
//        int newId = this.getStockNextIndex("user");
//        int result = this.getJdbcTemplate().update(
//                sql,
//                new Object[]{user.getUserName(), user.getPassword(), user.getTel(), user.getEmail(), user.getCompanyName(), user.getCompanyCode(), user.getRoleId()});
        List<String> params = new ArrayList<>();
        params.add(user.getUserName());
        params.add(user.getPassword());
        params.add(user.getTel());
        params.add(user.getEmail());
        params.add(user.getCompanyName());
        params.add(user.getCompanyCode());
        params.add(user.getRoleId());
        int id = 0;
        try {
            id = this.insert(sql, params);
        } catch (Exception e) {
            System.out.println(e);
        }
        if (id > 0) {
            String sqlProject = "SELECT DISTINCT * FROM project_data WHERE companyCode=? ";
            List<Project> projectList = this.getJdbcTemplate().query(sqlProject, new Object[]{user.getCompanyCode()}, new BeanPropertyRowMapper(Project.class));
            for (int j = 0; j < projectList.size(); j++) {
                String sqlFocus = "INSERT INTO project_focus (userId, projectId, createDate, updateDate) VALUES (?,?,NOW(),NOW())";
                this.getJdbcTemplate().update(sqlFocus, new Object[]{id, projectList.get(j).getId()});
            }
        }

        return CommonUtils.getHandle(id);

    }

    //修改员工
    public Handle updateUser(User user, String oldEmail, String oldTel) {
        if ("admin".equals(user.getRoleType())) {
            if (!oldEmail.equals(user.getEmail())) {
                //email是已否存在
                String strEmail = " SELECT COUNT(1) FROM system_user WHERE email=? ";
                int result1 = this.getJdbcTemplate().queryForObject(strEmail, new Object[]{user.getEmail()}, Integer.class);
                if (result1 > 0) {
                    return new Handle(0, "此邮箱已存在");
                }
            }
            if (!oldTel.equals(user.getTel())) {
                //tel是已否存在
                String strTel = " SELECT COUNT(1) FROM system_user WHERE tel=? ";
                int result2 = this.getJdbcTemplate().queryForObject(strTel, new Object[]{user.getTel()}, Integer.class);
                if (result2 > 0) {
                    return new Handle(0, "此手机号已存在");
                }
            }
        }

        User oldUser = (User) this.getJdbcTemplate().query("select * from system_user where id=?", new Object[]{user.getId()}, new BeanPropertyRowMapper<User>(User.class)).get(0);
        if (user.getPassword() == oldUser.getPassword() || oldUser.getPassword().equals(user.getPassword())) {
            user.setPassword(oldUser.getPassword());
        } else {
            user.setPassword(DigestUtils.sha1Hex(user.getPassword()));
        }

        String sql = "UPDATE system_user " +
                " SET " +
                " userName = ? ," +
                " PASSWORD = ? ," +
                " tel = ? ," +
                " email = ? ," +
                " roleId = ? ," +
                " updateDate = NOW() " +
//                " STATUS = ? " +
                " WHERE " +
                " id = ? " +
                " AND companyCode = ? ";
        int result = this.getJdbcTemplate().update(sql, new Object[]{user.getUserName(), user.getPassword(), user.getTel(), user.getEmail(), user.getRoleId(), user.getId(), user.getCompanyCode()});

        return CommonUtils.getHandle(result);
    }

    //删除员工
    public Handle deleteUser(User user) {
        String sql = "DELETE FROM system_user WHERE id = ? AND companyCode = ? ";
        int result = this.getJdbcTemplate().update(sql, new Object[]{user.getId(), user.getCompanyCode()});

        return CommonUtils.getHandle(result);
    }

    //获取所有用户名
    public List<User> queryAllActiveUser(String companyCode) {
        String sql = " SELECT  id,userName FROM system_user WHERE status='ACTIVE' AND companyCode = ? ";

        List<User> result = this.getJdbcTemplate().query(sql, new Object[]{companyCode}, new BeanPropertyRowMapper<User>(User.class));
        return result;
    }

    //查询用户数
    public int queryCountUser(String companyCode) {
        String sql = "SELECT count(*) FROM system_user WHERE companyCode = ?";
        int result = this.getJdbcTemplate().queryForObject(sql, new Object[]{companyCode}, Integer.class);
        return result;
    }

    //查询联系人数
    public int queryCountContact(String companyCode) {
        String sql = "SELECT count(*) FROM contact WHERE companyCode = ?";
        int result = this.getJdbcTemplate().queryForObject(sql, new Object[]{companyCode}, Integer.class);
        return result;
    }

    //查询所有联系人
    public Page getAllContact(Contact contact, String companyCode) {
        List params = new ArrayList();

        String sql = " SELECT c.* FROM contact c WHERE 1=1 AND c.companyCode = ? ";
        //区分公司
        params.add(companyCode);

        //有查询条件时
        if (contact.getName() != null && !"".equals(contact.getName())) {
            sql += " AND c.name LIKE ? ";
            params.add("%" + contact.getName() + "%");
        }
        if (contact.getEmail() != null && !"".equals(contact.getEmail())) {
            sql += " AND c.email LIKE ? ";
            params.add("%" + contact.getEmail() + "%");
        }
        if (contact.getTel() != null && !"".equals(contact.getTel())) {
            sql += " AND c.tel LIKE ? ";
            params.add("%" + contact.getTel() + "%");
        }
        if (contact.getOrganizationNames() != null && !"".equals(contact.getOrganizationNames())) {
            sql += " AND c.organizationNames LIKE ? ";
            params.add("%" + contact.getOrganizationNames() + "%");
        }
        if (contact.getUnitPosition() != null && !"".equals(contact.getUnitPosition())) {
            sql += " AND c.unitPosition LIKE ? ";
            params.add("%" + contact.getUnitPosition() + "%");
        }
        if (contact.getPrincipal() != null && !"".equals(contact.getPrincipal())) {
            sql += " AND c.principal = ? ";
            params.add(contact.getPrincipal());
        }
        if (contact.getStatus() != null && !"".equals(contact.getStatus())) {
            sql += " AND c.status=? ";
            params.add(contact.getStatus());
        }

        sql += " order by c.updateDate DESC";
        return this.queryForPage(sql, params, contact.getCurrentPage(), contact.getPageSize(), Contact.class);
    }

    //添加联系人
    public Handle insertContact(Contact contact) {
        String sql = "INSERT INTO contact (`name`, email, tel, birthdate, sex, identityCard, secondPhone, secondaryEmail, qq, wechat,constellation, description, address, province, department, fax, organizationNames, postcode, principal, principalName, serialNumber, unitPosition, workTelephone,`area`,`addDate`,lastActiveDate, createDate, updateDate, `status`, companyCode,other1,other2,other3,other4,other5)" +
                "VALUES(?,?,?,?,?, ?,?,?,?,?, ?,?,?,?,?, ?,?,?,?,?, ?,?,?,?,?, ?,NOW(),NOW(),?,?, ?,?,?,?,?)  ";

        contact.setStatus("ACTIVE");
        if (!this.vertify(contact.getAddDate())) {
            contact.setAddDate(CommonUtils.getDateFormat());
        }

        int result = this.getJdbcTemplate().update(
                sql,
                new Object[]{contact.getName(), contact.getEmail(), contact.getTel(), contact.getBirthdate(), contact.getSex(), contact.getIdentityCard(), contact.getSecondPhone(), contact.getSecondaryEmail(), contact.getQq(), contact.getWechat(), contact.getConstellation(), contact.getDescription(), contact.getAddress(), contact.getProvince(), contact.getDepartment(), contact.getFax(), contact.getOrganizationNames(), contact.getPostcode(), contact.getPrincipal(), contact.getPrincipalName(), contact.getSerialNumber(), contact.getUnitPosition(), contact.getWorkTelephone(), contact.getArea(), contact.getAddDate(), contact.getLastActiveDate(), contact.getStatus(), contact.getCompanyCode(), contact.getOther1(), contact.getOther2(), contact.getOther3(), contact.getOther4(), contact.getOther5()});

        return CommonUtils.getHandle(result);
    }

    public Handle updateContact(Contact contact) {
        String sql = "UPDATE contact SET `name` = ? , email = ? , tel = ? , birthdate = ? , sex = ? , identityCard = ? , secondPhone = ? , secondaryEmail = ? , qq = ? , wechat = ?, constellation = ? , description = ? , address = ? , province = ? , department = ? , fax = ? , organizationNames = ? , postcode = ? , principal = ? , principalName = ? , serialNumber = ? , unitPosition = ? , workTelephone = ? , `area` = ? , `addDate` = ? , lastActiveDate= ? , updateDate = NOW() ,other1 = ? ,other2 = ? ,other3 = ? ,other4 = ? ,other5 = ? " +
                "WHERE id = ? AND companyCode = ? ";

        int result = this.getJdbcTemplate().update(
                sql,
                new Object[]{contact.getName(), contact.getEmail(), contact.getTel(), contact.getBirthdate(), contact.getSex(), contact.getIdentityCard(), contact.getSecondPhone(), contact.getSecondaryEmail(), contact.getQq(), contact.getWechat(), contact.getConstellation(), contact.getDescription(), contact.getAddress(), contact.getProvince(), contact.getDepartment(), contact.getFax(), contact.getOrganizationNames(), contact.getPostcode(), contact.getPrincipal(), contact.getPrincipalName(), contact.getSerialNumber(), contact.getUnitPosition(), contact.getWorkTelephone(), contact.getArea(), contact.getAddDate(), contact.getLastActiveDate(), contact.getOther1(), contact.getOther2(), contact.getOther3(), contact.getOther4(), contact.getOther5(), contact.getId(), contact.getCompanyCode()});

        return CommonUtils.getHandle(result);
    }

    public Handle deleteContact(Contact contact) {
        String sql = "DELETE FROM contact WHERE id = ? AND companyCode = ? ";
        int result = this.getJdbcTemplate().update(sql, new Object[]{contact.getId(), contact.getCompanyCode()});

        return CommonUtils.getHandle(result);
    }

    public List queryOrganization(String companyCode) {
        String sql = "SELECT * FROM system_organization WHERE companyCode = ? ORDER BY updateDate DESC ";
        List result = this.getJdbcTemplate().queryForList(sql, new Object[]{companyCode});

        return result;
    }

    public Handle updateOrganization(Organization organization) {
        String sqlOrganization = "UPDATE system_organization SET " +
                "  logo=? ," +
                " companyName=? , " +
                "website=? ," +
                "userName=? ," +
                " tel=? , " +
                " email=? , " +
                " weibo=? , " +
                " weixin=? , " +
                " address=? , " +
                " zipcode=? , " +
                " description=? , " +
                " updateDate=NOW() " +
                " WHERE companyCode = ? ";

        int result = this.getJdbcTemplate().update(
                sqlOrganization,
                new Object[]{organization.getLogo(), organization.getCompanyName(), organization.getWebsite(), organization.getUserName(), organization.getTel(),
                        organization.getEmail(), organization.getWeibo(), organization.getWeixin(), organization.getAddress(), organization.getZipcode(), organization.getDescription(), organization.getCompanyCode()});

        return CommonUtils.getHandle(result);
    }

    public List queryContactRepeatList(Contact contact, User user) {
        String sql = "SELECT * FROM contact_repeat WHERE companyCode=? AND contactId=? ORDER BY updateDate DESC ";
        List result = this.getJdbcTemplate().query(sql, new Object[]{user.getCompanyCode(), contact.getId()}, new BeanPropertyRowMapper<ContactRepeat>(ContactRepeat.class));

        return result;
    }

    public Page queryContactTempDataList(Contact contact, User user) {
        String sql = "SELECT cdd.*,pd.formTitle FROM project_define pd LEFT JOIN contact_define_data cdd ON pd.id=cdd.defineId WHERE cdd.contactId=? ";

        List params = new ArrayList();
        params.add(contact.getId());
        Page page = this.queryForPage(sql, params, contact.getCurrentPage(), contact.getPageSize(), ContactDefineData.class);

        return page;
    }

    public List<Map<String, Object>> queryConcatMapData(String companyCode) {
        String sql = "SELECT city   `name`, COUNT(1) `value`,cityGeo geo " +
                "FROM contact WHERE city <> 'null' " +
                "AND city IS NOT NULL AND companyCode = ? " +
                "GROUP BY city ORDER BY COUNT(1) DESC";
        return this.getJdbcTemplate().queryForList(sql
                , new Object[]{companyCode}
        );
    }


    public Page queryAllContactData(Contact contact, String companyCode) {
        List params = new ArrayList();

        String sql = " SELECT c.* FROM contact c WHERE 1=1 AND c.companyCode = ? ";
        //区分公司
        params.add(companyCode);

        //有查询条件时
        if (contact.getName() != null && !"".equals(contact.getName())) {
            sql += " AND c.name LIKE ? ";
            params.add("%" + contact.getName() + "%");
        }
        if (contact.getEmail() != null && !"".equals(contact.getEmail())) {
            sql += " AND c.email LIKE ? ";
            params.add("%" + contact.getEmail() + "%");
        }
        if (contact.getTel() != null && !"".equals(contact.getTel())) {
            sql += " AND c.tel LIKE ? ";
            params.add("%" + contact.getTel() + "%");
        }
        if (contact.getOrganizationNames() != null && !"".equals(contact.getOrganizationNames())) {
            sql += " AND c.organizationNames LIKE ? ";
            params.add("%" + contact.getOrganizationNames() + "%");
        }
        if (contact.getUnitPosition() != null && !"".equals(contact.getUnitPosition())) {
            sql += " AND c.unitPosition LIKE ? ";
            params.add("%" + contact.getUnitPosition() + "%");
        }
        if (contact.getPrincipal() != null && !"".equals(contact.getPrincipal())) {
            sql += " AND c.principal = ? ";
            params.add(contact.getPrincipal());
        }
        if (contact.getStatus() != null && !"".equals(contact.getStatus())) {
            sql += " AND c.status=? ";
            params.add(contact.getStatus());
        }

        sql += " order by c.updateDate DESC";
        Page page = new Page();
        page.setResultList(this.getJdbcTemplate().queryForList(sql, params.toArray(new Object[params.size()])));
        return page;
    }


    public String downloadContactData(Contact contact, User user) throws Exception {
        String getFileName = CommonUtils.getFileName();
        String destFileName = "ContactData_" + getFileName + ".xls";
        String url = path + "/" + destFileName;
        FileOutputStream out = null;
        Page page = this.queryAllContactData(contact, user.getCompanyCode());
        try {
            // excel对象
            HSSFWorkbook wb = new HSSFWorkbook();
            // sheet对象
            HSSFSheet sheet = wb.createSheet("sheet1");
            //设置表头
            HSSFRow row = sheet.createRow(0);
            String[] headStrings = {"姓名", "邮箱", "手机", "生日", "性别", "身份证号", "备用手机", "备用邮箱", "QQ", "微信",
                    "星座", "描述", "地址", "地区", "省份", "所在部门", "传真", "机构名称", "邮编", "负责人",
                    "编号", "单位职务", "单位名称", "标签一", "标签二", "标签三", "标签四", "标签五", "加入时间", "最后活跃时间", "创建时间", "修改时间"};

            String[] headKeys = {"name", "email", "tel", "birthdate", "sex", "identityCard", "secondPhone", "secondaryEmail", "qq", "wechat",
                    "constellation", "description", "address", "area", "province", "department", "fax", "organizationNames", "postcode", "principalName",
                    "serialNumber", "unitPosition", "workTelephone", "other1", "other2", "other3", "other4", "other5", "addDate", "lastActiveDate", "createDate", "updateDate"};


            for (int i = 0; i < headStrings.length; i++) {
                CellStyle style = wb.createCellStyle();
                // 给单元格设置背景颜色
                style.setFillForegroundColor(IndexedColors.YELLOW.getIndex());

                //设置单元格样式
                Font font = wb.createFont();
                font.setFontName("宋体");
                font.setBold(true);
                font.setFontHeightInPoints((short) 12);
                style.setFont(font);
                if (headStrings[i] != null) {
                    sheet.setColumnWidth(i, (headStrings[i].getBytes().length + 4) * 256);
                }
                HSSFCell cell = row.createCell(i);
                cell.setCellValue(headStrings[i]);
                cell.setCellStyle(style);
            }
            //添加数据
            Row row1 = null;
            List<Map<String, Object>> listDatas = (ArrayList<Map<String, Object>>) page.getResultList();
            for (int j = 0; j < listDatas.size(); j++) {
                Map<String, Object> maps = listDatas.get(j);
                row1 = sheet.createRow(j + 1);
                for (int h = 0; h < headKeys.length; h++) {
                    Cell cells = row1.createCell(h);
                    if (maps.get(headKeys[h]) != null && !"".equals(maps.get(headKeys[h]))) {
                        if (headKeys[h].equals("area")) {
                            JSONObject jasonObject = JSONObject.fromObject(maps.get(headKeys[h]));
                            String province = "";
                            String city = "";
                            String county = "";
                            String others = "";
                            for (Object k : jasonObject.keySet()) {
                                if (k == "province" || "province".equals(k)) {
                                    province = jasonObject.getString("province") == "null" ? "" : jasonObject.getString("province");
                                } else if (k == "city" || "city".equals(k)) {
                                    city = jasonObject.getString("city") == "null" ? "" : jasonObject.getString("city");
                                } else if (k == "county" || "county".equals(k)) {
                                    county = jasonObject.getString("county") == "null" ? "" : jasonObject.getString("county");
                                } else if (k == "others" || "others".equals(k)) {
                                    others = jasonObject.getString("others") == "null" ? "" : jasonObject.getString("others");
                                }
                            }
                            String area = province + " " + city + " " + county + " " + others;
                            cells.setCellValue(area);
                        } else {
                            cells.setCellValue(String.valueOf(maps.get(headKeys[h])));
                        }
                    }
                }
            }
            // 输出excel
            // 输出excel对象
            out = new FileOutputStream(url);
            wb.write(out);
            out.close();
        } catch (FileNotFoundException e) {
            e.printStackTrace();
        } catch (IOException e) {
            e.printStackTrace();
        } finally {
            if (out != null) {
                try {
                    out.close();
                } catch (IOException e) {
                    e.printStackTrace();
                }
            }
        }
        return url;
    }

    public Page queryContactDefineDataList(Contact contact) {
        String sql = "SELECT pd.`id`,pd.formTitle,pd.`define`,pdd.* ,(SELECT COUNT(*) FROM project_define_data pdds WHERE pdds.id =cdd.`defineDataId`)AS dataCounts FROM project_define pd  \n" +
                "LEFT JOIN contact_define_data cdd ON pd.`id`=cdd.`defineId` \n" +
                "LEFT JOIN project_define_data pdd ON cdd.`defineDataId`=pdd.`id`\n" +
                "WHERE cdd.`contactId`=?\n" +
                "ORDER BY pdd.`dateCreated` DESC ";
        Page page = new Page();
        List params = new ArrayList();
        params.add(contact.getId());
        page.setResultList(this.getJdbcTemplate().queryForList(sql, params.toArray(new Object[params.size()])));
        return page;
    }

    //获取用户当前角色的菜单
    public List<Map<String, Object>> getRootMenu(User su) {
        String sql = "SELECT sm.* FROM system_menu sm, system_role_menu srm,system_user su WHERE sm.id=srm.menu_id AND srm.role_id=su.roleId " +
                "AND sm.status=1 AND su.id=? ORDER BY sm.sort ASC";
        List<Map<String, Object>> list = this.getJdbcTemplate().queryForList(sql, new Object[]{su.getId()});
        return list;
    }

    public void insertMenu(Menu su) throws SQLException {
        String sql="INSERT INTO system_menu (pid, title, icon, path, `status`, sort) VALUE(?,?,?,?,?,?)";
        int id=this.insert(sql,new Object[]{
                '0',su.getTitle(),su.getIcon(),su.getPath(),su.getStatus(),su.getSort()
        });
        String insertRoleMenu="INSERT INTO system_role_menu (role_id, menu_id) VALUES(1, ?)";
        this.getJdbcTemplate().update(insertRoleMenu,new Object[]{id});
    }
    
}
