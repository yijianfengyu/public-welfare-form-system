package com.auth.controller;

import com.alibaba.fastjson.JSONObject;
import com.auth.entity.*;
import com.auth.service.WeChatService;
import com.projectManage.entity.Project;
import com.projectManage.entity.*;
import com.projectManage.service.PMService;
import com.utils.*;
import com.weChat.api.ThirdAPI;
import net.minidev.json.JSONValue;
import org.apache.commons.codec.digest.DigestUtils;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.web.bind.annotation.CrossOrigin;
import org.springframework.web.bind.annotation.ModelAttribute;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;
import org.springframework.web.multipart.MultipartFile;
import org.springframework.web.servlet.ModelAndView;


import javax.servlet.http.HttpServletRequest;
import javax.servlet.http.HttpSession;
import java.io.File;
import java.io.FileOutputStream;
import java.io.IOException;
import java.io.InputStream;
import java.sql.SQLException;
import java.text.SimpleDateFormat;
import java.util.*;

@RestController
@CrossOrigin
public class WeChatApiController {

    @Autowired
    WeChatService weChatService;

    @Autowired
    PMService pmService;

    @Value("${web.file-path}")
    String filePath;

    @RequestMapping(value = "/wechat/login")
    public String login(String encryptedData, String code, String iv, HttpServletRequest request) {
        //企业
        JSONObject jsonObject = ThirdAPI.httpsRequest("https://api.weixin.qq.com/sns/jscode2session?appid=wx08d03488557b6411&secret=a66e9ce552765f7f3fcb650f0fe6be41&js_code=" + code + "&grant_type=authorization_code", "GET", null);
        //个人
//        JSONObject jsonObject = ThirdAPI.httpsRequest("https://api.weixin.qq.com/sns/jscode2session?appid=wx9cd6e6e68042580a&secret=68fac5bb93c7ebe0951d078a88e38d3c&js_code=" + code + "&grant_type=authorization_code", "GET", null);
        String sessionKey = jsonObject.getString("session_key");
        JSONObject userInfo = WXUtils.getUserInfo(encryptedData, sessionKey, iv);
        if (userInfo.getString("unionId") != null) {
            User newUser = new User();
            newUser.setUnionId(userInfo.getString("unionId"));
            List list = weChatService.getAndVertifyUser(newUser);
            HttpSession session = request.getSession();
            if (list.size() == 0) {
                //未绑定
                newUser.setToken(session.getId());
                newUser.setAvatarUrl(userInfo.getString("avatarUrl"));
                newUser.setNickName(userInfo.getString("nickName"));
                return JSONObject.toJSONString(new Handle(2, "七巧数据未绑定此微信账号", newUser));
            } else {
                User dbUser = (User) list.get(0);
                dbUser.setToken(session.getId());
                dbUser.setAvatarUrl(userInfo.getString("avatarUrl"));
                dbUser.setNickName(userInfo.getString("nickName"));
                dbUser.setUnionId(userInfo.getString("unionId"));
                weChatService.updateUuid(dbUser);//更新微信用户信息
                session.setAttribute("wechatUser", dbUser);
                return JSONObject.toJSONString(new Handle(1, "登录成功", dbUser));
            }
        } else {
            return JSONObject.toJSONString(new Handle(0, "登录失败"));
        }
    }

    @RequestMapping(value = "/wechat/outLogin")
    public String outLogin(HttpSession session) {
        User user = (User) session.getAttribute("wechatUser");
        if (user != null) {
            user.setUnionId("");
            user.setNickName("");
            user.setAvatarUrl("");
            weChatService.updateUuid(user);//更新微信用户信息
            session.removeAttribute("wechatUser");
            return JSONObject.toJSONString(new Handle(1, "解绑成功"));
        } else {
            return JSONObject.toJSONString(new Handle(0, "解绑失败"));
        }
    }

    @RequestMapping(value = "/wechat/accessAccount")
    public String accessAccount(@ModelAttribute("data") User user, HttpServletRequest request) {
        List list = weChatService.getAndVertifyUser(user);
        if (list.size() == 0) {
            //未注册
            return JSONObject.toJSONString(new Handle(2, "当前用户未注册七巧数据", 0));
        } else {
            List<User> dbUser = this.accessAccountUser(list, user);
            if (dbUser.size() == 0) {
                //密码错误
                Object obj = list.size();
                return JSONObject.toJSONString(new Handle(2, "请输入正确的用户名和密码", obj));
            } else if (dbUser.size() == 1) {
                User userInfo = dbUser.get(0);
                String jsonStr = insertUuid(userInfo, request);
                return jsonStr;
            } else {
                return JSONObject.toJSONString(new Handle(1, "", dbUser));
            }
        }
    }

    //判断密码
    public List<User> accessAccountUser(List<User> list, User user) {
        List<User> userList = new ArrayList<>();
        String ipass = DigestUtils.sha1Hex(user.getPassword());
        for (User u : list) {
            if (u.getPassword().equals(ipass)) {
                u.setNickName(user.getNickName());
                u.setUnionId(user.getUnionId());
                u.setAvatarUrl(user.getAvatarUrl());
                userList.add(u);
            }
        }
        return userList;
    }

    @RequestMapping(value = "/wechat/selectAccount")
    public String selectAccount(@ModelAttribute("data") User user, HttpServletRequest request) {
        User userInfo = weChatService.selectAccount(user);
        userInfo.setNickName(user.getNickName());
        userInfo.setUnionId(user.getUnionId());
        userInfo.setAvatarUrl(user.getAvatarUrl());
        String jsonStr = insertUuid(userInfo, request);
        return jsonStr;
    }

    public String insertUuid(User user, HttpServletRequest request) {
        int count = weChatService.updateUuid(user);
        if (count > 0) {
            HttpSession session = request.getSession();
            session.setAttribute("wechatUser", user);
            user.setToken(session.getId());
            return JSONObject.toJSONString(new Handle(1, "绑定成功", user));
        } else {
            return JSONObject.toJSONString(new Handle(0, "绑定失败"));
        }
    }


    @RequestMapping(value = "/wechat/queryUserProject")
    public String queryUserProject(Integer currentPage, HttpServletRequest request) {
        HttpSession session = request.getSession();
        User user = (User) session.getAttribute("wechatUser");
        if (user == null) {
            Page list1 = new Page();
            return JSONValue.toJSONString(list1);
        } else {
            Page list = weChatService.queryUserProject(currentPage, user);
            return JSONValue.toJSONString(list);
        }
    }

    @RequestMapping("/wechat/createProjectDaily")
    public String createProjectDaily(@ModelAttribute("data") Daily daily, HttpServletRequest request) {
        HttpSession session = request.getSession();
        User user = (User) session.getAttribute("wechatUser");
        Handle handle = new Handle();
        daily.setCreateId(user.getId());
        daily.setCreateName(user.getUserName());
        handle = weChatService.createProjectDaily(daily, user.getCompanyCode());
        return JSONValue.toJSONString(handle);
    }

    @RequestMapping("/wechat/updateProjectDaily")
    public String updateProjectDaily(@ModelAttribute("data") Daily daily, HttpServletRequest request) {
        HttpSession session = request.getSession();
        User user = (User) session.getAttribute("wechatUser");
        Handle handle = new Handle();
        daily.setCreateId(user.getId());
        daily.setCreateName(user.getUserName());
        handle = weChatService.updateProjectDaily(daily, user.getCompanyCode());
        return JSONValue.toJSONString(handle);
    }

    @RequestMapping("/wechat/queryProjectDaily")
    public String queryProjectDaily(@ModelAttribute("data") Daily daily, Integer parentId, Integer currentPage) {
        Page list = weChatService.queryProjectDaily(daily, parentId, currentPage);
        return JSONValue.toJSONString(list);
    }

    //资源 (相关文档)查询
    @RequestMapping("/wechat/dashboardQueryProjectResources")
    public String dashboardQueryProjectResources(@ModelAttribute("data") ProjectResource pr, Integer currentPage) {
        Page list = weChatService.dashboardQueryProjectResources(currentPage, pr);
        return JSONValue.toJSONString(list);
    }

    //表单查询
    @RequestMapping(value = "/wechat/queryTempTable")
    public String queryTempTable(@ModelAttribute("data") Template template, Integer currentPage, HttpServletRequest request) {
        HttpSession session = request.getSession();
        User user = (User) session.getAttribute("wechatUser");
        if (user == null) {
            Page list1 = new Page();
            return JSONValue.toJSONString(list1);
        } else {
            Page list = weChatService.queryTempTable(template, currentPage, user);
            return JSONValue.toJSONString(list);
        }

    }

    @RequestMapping(value = "/wechat/queryAllTempDataByDefineId")
    public String queryAllTempDataByDefineId(String define_id, Integer pageSize, Integer currentPage, HttpServletRequest request) throws Exception {
        HttpSession session = request.getSession();
        User user = (User) session.getAttribute("wechatUser");
        Page page = weChatService.queryAllTempDataByDefineId(define_id, pageSize, currentPage);
        if (page.getResultList().size() > 0) {
            return JSONValue.toJSONString(new Handle(1, "success", page));
        } else {
            return JSONValue.toJSONString(new Handle(2, "暂无数据", page));
        }
    }

    @RequestMapping(value = "/wechat/insertProjectProgress")
    public String insertProjectProgress(@ModelAttribute("data") ProjectProgress projectProgress, HttpServletRequest request) throws Exception {
        HttpSession session = request.getSession();
        User user = (User) session.getAttribute("wechatUser");
        Handle handle = weChatService.insertProjectProgress(projectProgress, user);
        return JSONValue.toJSONString(handle);
    }

    //跟据id查询备注
    @RequestMapping(value = "/wechat/querysRemark")
    public String querysRemark(@ModelAttribute("data") ProjectProgress projectProgress) throws Exception {
        List<ProjectProgress> list = weChatService.querysProjectProgress(projectProgress);
        return JSONValue.toJSONString(list);
    }

    @RequestMapping("/wechat/queryFocusProject")
    public String queryFocusProject(Integer currentPage, HttpServletRequest request) {
        HttpSession session = request.getSession();
        User user = (User) session.getAttribute("wechatUser");
        if (user == null) {
            Page list1 = new Page();
            return JSONValue.toJSONString(list1);
        } else {
            Page list = weChatService.queryFocusProject(currentPage, user);
            return JSONValue.toJSONString(list);
        }

    }

    //首页我关注的表单
    @RequestMapping("/wechat/queryFocusFrom")
    public String queryFocusFrom(@ModelAttribute("data") Template template, Integer currentPage, HttpServletRequest request) {
        HttpSession session = request.getSession();
        User user = (User) session.getAttribute("wechatUser");
        if (user == null) {
            Page list1 = new Page();
            return JSONValue.toJSONString(list1);
        } else {
            Page list = weChatService.queryFocusFrom(template, currentPage, user);
            return JSONValue.toJSONString(list);
        }
    }


    //最新日志
    @RequestMapping("/wechat/queryNewDaliy")
    public String queryNewDaliy(Daily daily, HttpServletRequest request) {
        HttpSession session = request.getSession();
        User user = (User) session.getAttribute("wechatUser");
        if (user == null) {
            Page list1 = new Page();
            return JSONValue.toJSONString(list1);
        } else {
            Page list = weChatService.queryNewDaliy(daily, user);
            return JSONValue.toJSONString(list);
        }
    }

    //今日缺日志
    @RequestMapping("/wechat/querysLackOfLogCount")
    public String querysLackOfLogCount(HttpServletRequest request) {
        HttpSession session = request.getSession();
        User user = (User) session.getAttribute("wechatUser");
        if (user == null) {
            List<Project> list1 = new ArrayList<>();
            return JSONValue.toJSONString(list1);
        } else {
            List<Project> list = weChatService.querysLackOfLogCount(user);
            return JSONValue.toJSONString(list);
        }
    }

    @RequestMapping("/wechat/logProfile")
    public String logProfile(@ModelAttribute("data") Project p, HttpServletRequest request) {
        HttpSession session = request.getSession();
        User user = (User) session.getAttribute("wechatUser");
        if (user == null) {
            Map<Object, Object> map = new HashMap();
            return JSONValue.toJSONString(map);
        } else {
            Map<Object, Object> list = weChatService.logProfile(p, user);
            return JSONValue.toJSONString(list);
        }

    }

    @RequestMapping("/wechat/deleteProjectDaily")
    public String deleteProjectDaily(@ModelAttribute("data") Daily daily, HttpServletRequest request) {
        HttpSession session = request.getSession();
        User user = (User) session.getAttribute("wechatUser");
        if (user == null) {
            Handle map = new Handle();
            return JSONValue.toJSONString(map);
        } else {
            Handle list = weChatService.deleteProjectDaily(daily, user);
            return JSONValue.toJSONString(list);
        }
    }

    @RequestMapping("/wechat/projectDetails")
    public String projectDetails(@ModelAttribute("data") Project project) {
        Project p = weChatService.projectDetails(project);
        return JSONValue.toJSONString(p);
    }

    @RequestMapping("/wechat/projectLogValue")
    public String projectLogValue(@ModelAttribute("data") Daily daily) {
        Daily d = weChatService.projectLogValue(daily);
        return JSONValue.toJSONString(d);
    }

    @RequestMapping("/wechat/insertSchedule")
    public String insertSchedule(@ModelAttribute("data") Schedule schedule, HttpSession session) {
        User user = (User) session.getAttribute("wechatUser");
        if (user != null) {
            schedule.setCompanyCode(user.getCompanyCode());
            schedule.setUserId(Integer.parseInt(user.getId()));
            Handle handle = weChatService.insertSchedule(schedule);
            return JSONValue.toJSONString(handle);
        } else {
            return JSONValue.toJSONString(new Handle());
        }
    }

    @RequestMapping("/wechat/queryScheduleDaysByMonth")
    public String queryScheduleDaysByMonth(@ModelAttribute("data") Schedule schedule, HttpSession session) {
        User user = (User) session.getAttribute("wechatUser");
        if (user != null) {
            schedule.setCompanyCode(user.getCompanyCode());
            schedule.setUserId(Integer.parseInt(user.getId()));
            List<String> list = weChatService.queryScheduleDaysByMonth(schedule);
            return JSONValue.toJSONString(list);
        } else {
            return JSONValue.toJSONString(null);
        }
    }

    @RequestMapping("/wechat/queryScheduleById")
    public String queryScheduleById(@ModelAttribute("data") Schedule schedule) {
        Schedule Schedule = weChatService.queryScheduleById(schedule.getId());
        return JSONValue.toJSONString(Schedule);
    }

    @RequestMapping("/wechat/updateSchedule")
    public String updateSchedule(@ModelAttribute("data") Schedule schedule) {
        Handle handle = weChatService.updateSchedule(schedule);
        return JSONValue.toJSONString(handle);
    }

    @RequestMapping("/wechat/deleteScheduleById")
    public String deleteScheduleById(@ModelAttribute("data") Schedule schedule) {
        Handle handle = weChatService.deleteScheduleById(schedule.getId());
        return JSONValue.toJSONString(handle);
    }

    @RequestMapping("/wechat/queryScheduleList")
    public String queryScheduleList(@ModelAttribute("data") Schedule schedule, HttpSession session) {
        User user = (User) session.getAttribute("wechatUser");
        if (user != null) {
            schedule.setCompanyCode(user.getCompanyCode());
            schedule.setUserId(Integer.parseInt(user.getId()));
            Page page = weChatService.queryScheduleList(schedule);
            return JSONValue.toJSONString(page);
        } else {
            return JSONValue.toJSONString(new Page());
        }
    }

    //查询所有用户
    @RequestMapping(value = "/wechat/queryAllUsers")
    public String queryAllUsers(HttpServletRequest request) {
        HttpSession session = request.getSession();
        User user = (User) session.getAttribute("wechatUser");
        if (user == null) {
            List list = new ArrayList();
            return JSONValue.toJSONString(list);
        } else {
            List list = weChatService.queryAllUsers(user.getCompanyCode());
            return JSONValue.toJSONString(list);
        }
    }

    /**
     * 微信上传文件页面
     *
     * @param mo
     * @param pr
     * @return
     */
    @RequestMapping(value = "/wechat/uploadView")
    public ModelAndView shareFormPage(ModelAndView mo, @ModelAttribute("data") ProjectResource pr) {
        mo.addObject("resource", pr);
        mo.setViewName("uploadFile");
        return mo;
    }

    /**
     * 微信web-view上传
     *
     * @param file
     * @param request
     * @param resource
     * @return
     */
    @RequestMapping("/wechat/uploadFile")
    public String uploadImg(MultipartFile file, HttpServletRequest request, @ModelAttribute("data") ProjectResource resource) {
        SimpleDateFormat df = new SimpleDateFormat("yyyyMMddHHmmssSSS");
        String fileName = file.getOriginalFilename();
        String intNumber = fileName.substring(0, fileName.indexOf("."));
        String extensionName = org.apache.commons.lang3.StringUtils.substringAfter(fileName, ".");
        String newFileName = intNumber + "_" + df.format(new Date()) + "." + extensionName;
        try {
            byte[] file2 = file.getBytes();
            File targetFile = new File(filePath);
            if (!targetFile.exists()) {
                targetFile.mkdirs();
            }
            FileOutputStream out = new FileOutputStream(filePath + newFileName);
            out.write(file2);
            out.flush();
            out.close();
        } catch (Exception e) {
            System.out.println("错误：" + e.getMessage());
            return "文件上传失败！";
        }
        //上传完后写数据库
        resource.setResourcesName(intNumber);
        resource.setUrl(newFileName);
        resource.setFileName(newFileName);

        User user = new User();
        user.setId(resource.getCreateId());
        user.setUserName(resource.getCreateName());

        Handle handle = pmService.addProjectResourceModel(resource, user);
        //返回消息
        if (handle.getFlag() == 1) {
            return "文件上传成功！";
        } else {
            return "文件上传失败！";
        }
    }


    //查询日志评论
    @RequestMapping("/wechat/queryCommentList")
    public String queryCommentList(@ModelAttribute("data") DailyComment comment, HttpSession session) {
        User user = (User) session.getAttribute("wechatUser");
        if (user != null) {
            Page page = weChatService.queryCommentList(comment);
            return JSONValue.toJSONString(page);
        } else {
            return JSONValue.toJSONString(new Page());
        }
    }

    //新增日志评论
    @RequestMapping("/wechat/insertDailyComment")
    public String insertDailyComment(@ModelAttribute("data") DailyComment dailyComment, HttpSession session) {
        User user = (User) session.getAttribute("wechatUser");
        if (user != null) {
            Handle handle = weChatService.insertDailyComment(dailyComment);
            return JSONValue.toJSONString(handle);
        } else {
            return JSONValue.toJSONString(new Handle());
        }
    }


    /**
     * 在后台添加模板表数据 以及修改
     *
     * @param templateTableRow
     * @param
     * @return
     */
    @RequestMapping(value = "/wechat/createTempData")
    public String createTempData(String define_id, @ModelAttribute("data") TemplateTableRow templateTableRow, HttpServletRequest request, String columns, String account_name, Integer accountId) {
        try {
//            Page page = service.queryTempDataById(templateData);
            String mess = "";
            Object obj = null;
            int i = 0;
            Account account = new Account();
            account.setId(accountId);
            account.setAccount_name(account_name);
//            HttpSession session = request.getSession();
//            Account account=(Account) session.getAttribute("account");
            if (account != null) {
                templateTableRow.setCreator(String.valueOf(account.getId()));
                templateTableRow.setCreatorName(account.getAccountName());
            }
            if (templateTableRow.getMethod() == "create" || "create".equals(templateTableRow.getMethod())|| templateTableRow.getMethod() == "createData" || "createData".equals(templateTableRow.getMethod())) {
//                if (page != null && templateData.getData_uuid() != null && templateData.getProjectId() == "") {
                if (templateTableRow.getData_uuid() != null && templateTableRow.getProjectId() == "") {
                    mess += "已有数据";
                    i = 0;
                } else {
                    Map tempData = weChatService.createTempData(templateTableRow, columns, account);
                    if (Integer.parseInt(tempData.get("i").toString())>0) {
                        mess += "添加成功";
                        i = 1;
                        obj = tempData;
                    } else {
                        mess += "添加失败";
                        i = 0;
                    }
                }
            } else if (templateTableRow.getMethod() == "update" || "update".equals(templateTableRow.getMethod())|| templateTableRow.getMethod() == "UpdateData" || "UpdateData".equals(templateTableRow.getMethod())) {
//                if ("".equals(templateData.getStatus()) || "0".equals(templateData.getStatus())) {
                    Map map=weChatService.updateTempData(templateTableRow,account);
                    if (Integer.parseInt(map.get("i").toString())>0) {
                        mess += "修改成功";
                        obj=map;
                        i = 1;
                    } else {
                        mess += "修改失败";
                        i = 0;
                    }
//                } else if (templateData.getStatus() == "1" || "1".equals(templateData.getStatus())) {
//                    mess += "已审核";
//                    i = 0;
//                }

            } else if (templateTableRow.getMethod() == "audit" || "audit".equals(templateTableRow.getMethod())) {
                templateTableRow.setStatus("1"); //改为已审核
                Map map=weChatService.updateTempData(templateTableRow,account);
                if (map.get("i").equals("1")) {
                    mess += "审核成功";
                    i = 1;
                } else {
                    mess += "审核失败";
                    i = 0;
                }
            } else {
                mess += "网络错误";
                i = 0;
            }
            return JSONValue.toJSONString(new Handle(i, mess, obj));
        } catch (Exception e) {
            e.printStackTrace();
            LoggerUtil.errorOut("createTempData:" + e.getMessage());
            if(e instanceof SQLException){
                return JSONValue.toJSONString(new Handle(0, "SQL异常"));
            }else if(e instanceof NullPointerException){
                return JSONValue.toJSONString(new Handle(0, "空指针异常"));
            }else if(e instanceof ArithmeticException){
                return JSONValue.toJSONString(new Handle(0, "算术异常"));
            }else if(e instanceof ArrayIndexOutOfBoundsException){
                return JSONValue.toJSONString(new Handle(0, "数组越界异常"));
            }else{
                return JSONValue.toJSONString(new Handle(4, "其他异常"));
            }
        }
    }


    /**
     * 按分页查询数据
     *
     * @param
     */
    @RequestMapping(value = "/wechat/queryAllTempDataByPage")
    public String queryAllTempDataByPage(@ModelAttribute("data") TemplateTableRow templateTableRow) throws Exception {
        Page page = weChatService.queryAllTempDataByPage(templateTableRow);
        //List<String> cityList=service.queryCityList();
        //page.setOthers(cityList);
        if (page.getResultList().size() > 0) {
            return JSONValue.toJSONString(new Handle(1, "success", page));
        } else {
            return JSONValue.toJSONString(new Handle(0, "暂无数据", page));
        }
    }


    /**
     * 根据id查询指定模板表
     *
     * @param id
     * @return
     */
    @RequestMapping(value = "/wechat/queryTempTableById")
    public String queryTempTableById(String rowDataId, Long id, Integer accountId,String city,String province) {
        Template temp = null;
        if (accountId != null) {
            temp = weChatService.queryTempTableById(id, accountId,city,province);
        } else {
            temp = weChatService.queryTempTableById(id);
        }
        if (temp != null) {
            return JSONValue.toJSONString(new Handle(1, "success", temp));
        } else {
            return JSONValue.toJSONString(new Handle(0, "暂无数据", temp));
        }
    }


    /**
     * 查询某个模板的某条数据,用于修改数据前查询数据
     *
     * @param templateTableRow
     * @return
     * @throws Exception
     */
    @RequestMapping(value = "/wechat/queryTempDataById")
    public String queryTempDataById(@ModelAttribute("data") TemplateTableRow templateTableRow) throws Exception {
        if (null == templateTableRow.getDefine_id() || "".equals(templateTableRow.getDefine_id())) { //  || null == templateData.getData_uuid() || "".equals(templateData.getData_uuid()) null == templateData.getCompanyCode() || "".equals(templateData.getCompanyCode()) ||
            return JSONValue.toJSONString(new Handle(0, "暂无数据"));
        } else {
            Template temp = weChatService.queryTempTableById(Long.valueOf(templateTableRow.getDefine_id()));
            templateTableRow.setTableName(temp.getTableName());
            templateTableRow.setDefine(temp.getDefine());
            Page page = weChatService.queryTempDataById(templateTableRow);

            net.sf.json.JSONObject jsonObject = net.sf.json.JSONObject.fromObject(temp.getDefine());
            jsonObject.put("value", page.getResultList().get(0));
            temp.setDefine(JSONValue.toJSONString(jsonObject));
            if (page != null) {
//                page.setResultList(TablesUtil.getJsonList(page.getResultList(), temp));
                return JSONValue.toJSONString(new Handle(1, "success", temp));
            } else {
                return JSONValue.toJSONString(new Handle(0, "暂无数据", temp));
            }
        }
    }


    /**
     * 查询某个模板的某条数据,用于修改数据前查询数据不带提交按钮
     *
     * @param templateTableRow
     * @return
     * @throws Exception
     */
    @RequestMapping(value = "/wechat/queryTempDataByIdButton")
    public String queryTempDataByIdButton(@ModelAttribute("data") TemplateTableRow templateTableRow) throws Exception {
        if (null == templateTableRow.getDefine_id() || "".equals(templateTableRow.getDefine_id())) { //  || null == templateData.getData_uuid() || "".equals(templateData.getData_uuid()) null == templateData.getCompanyCode() || "".equals(templateData.getCompanyCode()) ||
            return JSONValue.toJSONString(new Handle(0, "暂无数据"));
        } else {
            Template temp = weChatService.queryTempTableByIdBottun(Long.valueOf(templateTableRow.getDefine_id()));
            templateTableRow.setTableName(temp.getTableName());
            templateTableRow.setDefine(temp.getDefine());
            Page page = weChatService.queryTempDataById(templateTableRow);

            net.sf.json.JSONObject jsonObject = net.sf.json.JSONObject.fromObject(temp.getDefine());
            jsonObject.put("value", page.getResultList().get(0));
            temp.setDefine(JSONValue.toJSONString(jsonObject));
            if (page != null) {
//                page.setResultList(TablesUtil.getJsonList(page.getResultList(), temp));
                return JSONValue.toJSONString(new Handle(1, "success", temp));
            } else {
                return JSONValue.toJSONString(new Handle(0, "暂无数据", temp));
            }
        }
    }

    /**
     * 表单数据审核
     *
     * @param
     * @return
     */
    @RequestMapping("/wechat/audit")
    public String audit(Integer defineId, Integer tableId, Integer status) {
        int i = this.weChatService.audit(defineId, tableId, status);
        if (i > 0) {
            return JSONValue.toJSONString(new Handle(1, "成功", i));
        } else {
            return JSONValue.toJSONString(new Handle(0, "失败", i));
        }
    }


    /**
     * 查询项目列表
     *
     * @param project
     * @return
     */
    @RequestMapping(value = "/wechat/queryProject")
    public String queryProject(@ModelAttribute("data") com.auth.entity.Project project, Integer accountId) {
        Page page = this.weChatService.queryProject(project, accountId);
        if (page == null) {
            return JSONValue.toJSONString(new Handle(0, "没有查询到数据", page));
        } else {
            return JSONValue.toJSONString(new Handle(1, "操作成功", page));
        }
    }


    /**
     * 查询志愿者申请
     *
     * @param volunteerApply
     * @return
     */
    @RequestMapping("/wechat/queryVolunteerapply")
    public String queryVolunteerapply(@ModelAttribute("data") VolunteerApply volunteerApply) {
        Page page = this.weChatService.queryVolunteerapply(volunteerApply);
        if (page.getResultList().size() == 0) {
            return JSONValue.toJSONString(new Handle(0, "没有查询到数据", page));
        } else {
            return JSONValue.toJSONString(new Handle(1, "操作成功", page));
        }
    }


    /**
     * 查询团队
     *
     * @param team
     * @return
     */
    @RequestMapping("/wechat/queryTeam")
    public String queryTeam(@ModelAttribute("data") Team team, int accountId) {
        Page page = this.weChatService.queryTeam(team, accountId);
        if (page.getResultList().size() == 0) {
            return JSONValue.toJSONString(new Handle(0, "没有查询到数据", page));
        } else {
            return JSONValue.toJSONString(new Handle(1, "操作成功", page));
        }
    }




    /**
     * 加入团队
     *
     * @param teamId
     * @param accountId
     * @return
     */
    @RequestMapping("/wechat/joinTeam")
    public String joinTeam(int teamId, int accountId) {
        int count = weChatService.countTeam(teamId);
        //团队限制人数 暂时50人
        if (count < 50) {
            int i = this.weChatService.joinTeam(teamId, accountId);
            if (i == 1) {
                return JSONValue.toJSONString(new Handle(1, "加入成功", 2));
            } else if (i == 2) {
                return JSONValue.toJSONString(new Handle(1, "没有身份认证不可加入团队，请前往身份认证", 0));
            } else if (i == 3) {
                return JSONValue.toJSONString(new Handle(1, "你已加入过团队，不可重复加入", 0));
            } else {
                return JSONValue.toJSONString(new Handle(0, "加入失败", 0));
            }
        } else {
            return JSONValue.toJSONString(new Handle(0, "加入失败，团队人数已满",0));
        }

    }


    /**
     * 统计数量
     *
     * @param accountId
     * @return
     */
    @RequestMapping("/wechat/count")
    public String count(Integer accountId) {
        Map<String, Object> count = this.weChatService.count(accountId);
        return JSONValue.toJSONString(new Handle(1, "操作成功", count));
    }


    //查询调研申请
    @RequestMapping(value = "/wechat/queryApplicationResearch")
    public String queryApplicationResearch(Integer accountId, Integer status,String project_name) throws Exception {

        Page page = weChatService.queryApplicationResearch(accountId, status,project_name);
        if (page != null) {
            return JSONValue.toJSONString(new Handle(1, "操作成功", page));
        } else {
            return JSONValue.toJSONString(new Handle(0, "暂无数据", page));
        }

    }

    //提交评论
    @RequestMapping(value = "/wechat/addComment")
    public String addComment(@ModelAttribute("data") Comment comment, String accountName, Integer project_id, Integer accountId) throws Exception {

        Comment i = weChatService.addComment(comment, accountName, project_id, accountId);
        if (i != null) {
            return JSONValue.toJSONString(new Handle(1, "添加成功", i));
        } else {
            return JSONValue.toJSONString(new Handle(0, "添加失败", i));
        }
    }

    //查询评论
    @RequestMapping(value = "/wechat/queryComment")
    public String queryComment(@ModelAttribute("data") Comment comment) throws Exception {
        Page page = weChatService.queryComment(comment);
        if (page != null) {
            return JSONValue.toJSONString(new Handle(1, "操作成功", page));
        } else {
            return JSONValue.toJSONString(new Handle(0, "暂无数据", page));
        }

    }

    //查询水源地
    @RequestMapping(value = "/wechat/queryWaterSource")
    public String queryWaterSource() {
        Page page = weChatService.queryWaterSource();
        if (page != null) {
            return JSONValue.toJSONString(new Handle(1, "操作成功", page));
        } else {
            return JSONValue.toJSONString(new Handle(0, "暂无数据", page));
        }
    }

    //查询项目内容详情
    @RequestMapping(value = "/wechat/queryProjectDetails")
    public String queryProjectDetails(Integer id) {
        List lists = new ArrayList();
        lists = weChatService.queryObjectTopOne(id);
        if (lists.size() > 0) {
            return JSONValue.toJSONString(new Handle(1, "操作成功", lists));
        } else {
            return JSONValue.toJSONString(new Handle(0, "暂无数据", null));
        }
    }


    /**
     * 用户信息
     *
     * @param accountId
     * @return
     */
    @RequestMapping("/wechat/AccountInfo")
    public String AccountInfo(Integer accountId) {
        List<Map<String, Object>> list = this.weChatService.AccountInfo(accountId);
        if (list.size() > 0) {
            return JSONValue.toJSONString(new Handle(1, "操作成功", list.get(0)));
        } else {
            return JSONValue.toJSONString(new Handle(1, "操作失败", null));
        }

    }


    /**
     * 判断项目是否有记录
     *
     * @param accountId
     * @param defineId
     * @param ProjectId
     * @return
     */
    @RequestMapping("/wechat/isCreate")
    public String isCreate(Integer accountId, Integer defineId, Integer ProjectId,String city) {
        Map<String, Object> create = this.weChatService.isCreate(accountId, defineId, ProjectId,city);
        return JSONValue.toJSONString(new Handle(1, "操作成功", create));
    }


    /**
     *  团队详情
     * @param teamId
     * @param accountId
     * @return
     */
    @RequestMapping("/wechat/teaminfo")
    public String teaminfo(Integer  teamId,Integer accountId){
        Map<String, Object> team= this.weChatService.teaminfo(teamId, accountId);
            return JSONValue.toJSONString(new Handle(1,"操作成功",team));
    }


    /**
     *  成员审核
     * @param teamId
     * @param accountId
     * @param status
     * @return
     */
    @RequestMapping("/wechat/updateStatus")
    public String updateStatus(Integer  teamId,Integer accountId,Integer status) {
        int i = this.weChatService.updateStatus(teamId, accountId,status);
        if(i>0){
            return JSONValue.toJSONString(new Handle(1,"审核成功",i));
        }else{
            return JSONValue.toJSONString(new Handle(1,"审核失败",i));
        }
    }


    /**
     *  队长题出队员
     * @param teamId
     * @param accountId
     * @return
     */
    @RequestMapping("/wechat/kick")
    public String kick(Integer teamId,Integer accountId){
        int kick = this.weChatService.kick(teamId, accountId);
        if(kick>0){
            return JSONValue.toJSONString(new Handle(1,"操作成功",kick));
        }else{
            return JSONValue.toJSONString(new Handle(0,"操作失败",kick));
        }
    }



    /**
     *  用户编辑个人 信息
     * @param account
     * @return
     */
    @RequestMapping("/wechat/updateAccount")
    public String updateAccount(Account account){
        int i = this.weChatService.updateAccount(account);
        if(i>0){
            return JSONValue.toJSONString(new Handle(1,"修改成功",i));
        }else{
            return JSONValue.toJSONString(new Handle(0,"修改失败",i));
        }
    }


    /**
     *     举报进展列表
     * @param accountId
     * @return
     */
    @RequestMapping("/wechat/remind")
    public String remind(Integer accountId,String project_name){
        List<Map<String, Object>> remind = this.weChatService.remind(accountId,project_name);
        if(remind.size()==0){
            return JSONValue.toJSONString(new Handle(0,"没有数据",remind));
        }else{
            return JSONValue.toJSONString(new Handle(1,"操作成功",remind));
        }
    }


    /**
     *  统计已达题未答题
     * @param id
     * @param projectId
     * @param accountId
     * @return
     */
    @RequestMapping("/wechat/statistics")
    public String statistics(Integer id,Integer projectId,Integer accountId){
        Map<String, Object> statistics = this.weChatService.statistics(id, projectId, accountId);
        return JSONValue.toJSONString(new Handle(1,"操作成功",statistics));
    }


    /**
     *  统计每年分数平均值人数
     * @param projectId
     * @return
     */
    @RequestMapping("/wechat/statisticsData")
    public String statisticsData(Integer projectId){
        List list = this.weChatService.statisticsData(projectId);
        if(list.size()==0){
            return  JSONValue.toJSONString(new Handle(0,"操作失败",list));
        }else{
            return  JSONValue.toJSONString(new Handle(1,"操作成功",list));
        }
    }




//    /**
//     *  设置项目完成
//     * @param defineId
//     * @param id
//     * @param status
//     * @return
//     */
//    @RequestMapping("/wechat/setupComplete")
//    public String setupComplete(Integer defineId,Integer id,Integer status){
//    int i = this.weChatService.setupComplete(defineId, id, status);
//    if(i>0){
//        return JSONValue.toJSONString(new Handle(1,"操作成功",i));
//    }else{
//        return JSONValue.toJSONString(new Handle(0,"操作失败",i));
//    }
//}


    /**
     *      答题暂存
     * @param defindId
     * @param dataId
     * @param columnName
     * @param value
     * @param projectId
     * @param accountName
     * @param accountId
     * @return
     */
    @RequestMapping("/wechat/save")
    public String save(Integer defindId,Integer dataId,String columnName,String value,Integer projectId,String accountName,Integer accountId){
        Map map=new HashMap();
        try {
            map = this.weChatService.save(defindId, dataId, columnName, value,projectId,accountName,accountId);
        } catch (SQLException e) {
            e.printStackTrace();
        }
        if(Integer.parseInt(map.get("id").toString())>0){
            return JSONObject.toJSONString(new Handle(1,"暂存成功",map));
        }else{
            return JSONObject.toJSONString(new Handle(0,"暂存失败",map));
        }
    }


    /**
     *  我的调研报告
     * @param accountId
     * @param projectId
     * @return
     */
    @RequestMapping("/wechat/myReport")
    public String myReport(Integer accountId,Integer projectId,Integer type){
        Map<String, Object> map = this.weChatService.myReport(accountId, projectId,type);
        if(map!=null){
            return JSONObject.toJSONString(new Handle(1,"操作成功",map));
        }else{
           return JSONObject.toJSONString(new Handle(0,"未查询到数据",map));
        }
    }

    /**
     *  答题详情（健康程度详情）
     * @param accountId
     * @param projectId
     * @return
     */
    @RequestMapping("/wehat/answerInfo")
    public String answerInfo(Integer accountId,Integer projectId){
        List<Map<String, Object>> list = this.weChatService.answerInfo(accountId, projectId);
        return JSONObject.toJSONString(new Handle(1,"操作成功",list));
    }


    /**
     *  点赞或关注
     * @param accountId
     * @param projectId
     * @param type
     * @return
     */
    @RequestMapping("/wehat/dianzanFollow")
    public String dianzanFollow(Integer accountId,Integer projectId,Integer type){
        try {
            Map<String, Object> map = this.weChatService.dianzanFollow(accountId, projectId, type);
            if(Integer.parseInt(map.get("insert").toString())>0){
                return JSONValue.toJSONString(new Handle(1,"点赞成功",map));
            }else{
                return JSONValue.toJSONString(new Handle(0,"点赞失败",map));
            }
        } catch (SQLException e) {
            e.printStackTrace();
            return JSONValue.toJSONString(new Handle(4, "SQL异常"));
        }
    }



    //图片上传
    @RequestMapping("/wechat/uploadTempPictures")
    public String uploadTempPictures(MultipartFile file){
        if (file.isEmpty()) {
            return JSONValue.toJSONString(new Handle(0,"failing"));
        }

        SimpleDateFormat df = new SimpleDateFormat("yyyyMMddHHmmssSSS");
        String fileName = file.getOriginalFilename();
        int random=(int)((Math.random()*9+1)*100000);//6位随机数
        String intNumber = fileName.substring(0, fileName.indexOf("."));
        String extensionName = org.apache.commons.lang.StringUtils.substringAfter(fileName, ".");
        String newFileName = random + "_" + df.format(new Date()) + "." + extensionName;
        File f = null;
        try {
            InputStream ins = file.getInputStream();
            f = new File(newFileName);
            OOSUtil.inputStreamToFile(ins, f);
        } catch (IOException e) {
            e.printStackTrace();
            return JSONValue.toJSONString(new Handle(2,"失败",""));
        }
        String rtName = "upload/"+new SimpleDateFormat("yyyyMMdd").format(new Date())+"/"+newFileName;
        rtName = OOSUtil.uploadImage(rtName, f);
        f.delete();
        //返回文件名
//        return "265573404041_20190927153109728.jpg";
//        return rtName;
        return JSONValue.toJSONString(new Handle(1,"成功",rtName));
    }

}
