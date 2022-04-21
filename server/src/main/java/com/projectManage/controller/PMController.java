package com.projectManage.controller;

import com.auth.entity.User;
import com.auth.service.UserService;
import com.projectManage.entity.Daily;
import com.projectManage.entity.Project;
import com.projectManage.entity.ProjectReport;
import com.projectManage.entity.ProjectResource;
import com.projectManage.service.PMService;
import com.utils.Handle;
import com.utils.OOSUtil;
import com.utils.Page;
import net.minidev.json.JSONValue;
import org.apache.commons.lang.StringUtils;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.web.bind.annotation.*;
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
import java.util.Date;
import java.util.HashMap;
import java.util.List;
import java.util.Map;

@RestController
@CrossOrigin
@RequestMapping("/pm")
public class PMController {

    @Autowired
    PMService pmService;

    @Autowired
    UserService userService;

    @Value("${web.file-path}")
    String filePath;

    @RequestMapping("/queryProject")
    public String queryProject(@ModelAttribute("data") Project p, String currentPage, String callback, HttpServletRequest request) {
        HttpSession session = request.getSession();
        User user = (User) session.getAttribute("user");
        Page page = pmService.queryProject(p, currentPage, user);
        return callback + "(" + JSONValue.toJSONString(page) + ")";
    }

    @RequestMapping("/queryProject/tree")
    public String queryProjectTree(@ModelAttribute("data") Project p, HttpSession session) {
        User user = (User) session.getAttribute("user");
        String json = pmService.queryProjectTree(p, user);
        return json;
    }

    @RequestMapping("/updateProject")
    public String updateProject(@ModelAttribute("data") Project p, HttpServletRequest request, String callback) {
        HttpSession session = request.getSession();
        User user = (User) session.getAttribute("user");
        p.setCompanyCode(user.getCompanyCode());
        p.setCreater(user.getId());
        Handle handle = pmService.updateProject(p);
        return callback + "(" + JSONValue.toJSONString(handle) + ")";
    }

    @RequestMapping("/createProject")
    public String createProject(@ModelAttribute("data") Project p, HttpServletRequest request, String callback) {
        HttpSession session = request.getSession();
        User user = (User) session.getAttribute("user");
        Handle handle = pmService.createProject(p, user);
        return callback + "(" + JSONValue.toJSONString(handle) + ")";
    }

    /**
     * 查询日志
     *
     * @param daily    dataId 任务id
     * @param callback
     * @return
     */
    @RequestMapping("/queryProjectDaily")
    public String queryProjectDaily(@ModelAttribute("data") Daily daily, Integer parentId, Integer currentPage, String callback, HttpServletRequest request) {
        HttpSession session = request.getSession();
        User user = (User) session.getAttribute("user");
        List<Daily> list = pmService.queryProjectDaily(daily, parentId, currentPage, user.getCompanyCode());
        return callback + "(" + JSONValue.toJSONString(list) + ")";
    }

    @RequestMapping("/queryProjectDailyByPage")
    public String queryProjectDailyByPage(@ModelAttribute("data") Daily daily, String callback) {
        Page page = pmService.queryProjectDailyByPage(daily);
        return callback + "(" + JSONValue.toJSONString(page) + ")";
    }

    /**
     * 创建日志
     *
     * @param daily
     * @param callback
     * @return
     */
    @RequestMapping("/createProjectDaily")
    public String createProjectDaily(@ModelAttribute("data") Daily daily, HttpServletRequest request, String callback) {
        HttpSession session = request.getSession();
        User user = (User) session.getAttribute("user");
        Handle handle = new Handle();
        daily.setCreateId(user.getId());
        daily.setCreateName(user.getUserName());
        handle = pmService.createProjectDaily(daily, user.getCompanyCode());
        return callback + "(" + JSONValue.toJSONString(handle) + ")";
    }

    //修改日志
    @RequestMapping("/updateProjectDaily")
    public String updateProjectDaily(@ModelAttribute("data") Daily daily, HttpServletRequest request, String callback) {
        HttpSession session = request.getSession();
        User user = (User) session.getAttribute("user");
        Handle handle = pmService.updateProjectDaily(daily, user);
        return callback + "(" + JSONValue.toJSONString(handle) + ")";
    }

    //删除日志
    @RequestMapping("/deleteProjectDaily")
    public String deleteProjectDaily(@ModelAttribute("data") Daily daily, HttpServletRequest request, String callback) {
        HttpSession session = request.getSession();
        User user = (User) session.getAttribute("user");
        Handle handle = pmService.deleteProjectDaily(daily, user);
        return callback + "(" + JSONValue.toJSONString(handle) + ")";
    }

    //查询所有用户名
    @RequestMapping("/queryAllActiveUser")
    public String queryAllActiveUser(String callback, HttpServletRequest request) {
        HttpSession session = request.getSession();
        User user = (User) session.getAttribute("user");
        List<User> list = userService.queryAllActiveUser(user.getCompanyCode());
        return callback + "(" + JSONValue.toJSONString(list) + ")";
    }

    //上传项目资源
    @RequestMapping("/projectResourceUpload")
    public String uploadImg(String objectName, MultipartFile file) {
        SimpleDateFormat df = new SimpleDateFormat("yyyyMMddHHmmssSSS");
        String fileName = file.getOriginalFilename();
        String intNumber = fileName.substring(0, fileName.indexOf("."));
        String extensionName = StringUtils.substringAfter(fileName, ".");
        String newFileName = intNumber + "_" + df.format(new Date()) + "." + extensionName;

        File f = null;
        try {
            InputStream ins = file.getInputStream();
            f = new File(newFileName);
            OOSUtil.inputStreamToFile(ins, f);
        } catch (IOException e) {
            e.printStackTrace();
        }

        OOSUtil.putObject(newFileName, f);
        f.delete();
        //返回json
        return newFileName;

    }

    //上传
    @RequestMapping("/fileUpload")
    public String uploadImg(MultipartFile file, HttpServletRequest request) {
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
        }
        System.out.println(newFileName);
        //返回json
        return JSONValue.toJSONString(newFileName);

    }

    //上传
    @RequestMapping("/fileUploadHuyuan")
    public String fileUploadHuyuan(MultipartFile file, HttpServletRequest request) {
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
        }
        System.out.println(newFileName);
        //返回json
        return JSONValue.toJSONString(newFileName);

    }

    @RequestMapping("/addProjectResource")
    public String addProjectResource(@ModelAttribute("data") ProjectResource resource, HttpServletRequest request, String callback) {
        HttpSession session = request.getSession();
        User user = (User) session.getAttribute("user");
        Handle handle = pmService.addProjectResource(resource, user);
        return callback + "(" + JSONValue.toJSONString(handle) + ")";
    }

    @RequestMapping("/addProjectResourceModel")
    public String addProjectResourceModel(@ModelAttribute("data") ProjectResource resource, HttpServletRequest request, String callback) {
        HttpSession session = request.getSession();
        User user = (User) session.getAttribute("user");
        Handle handle = pmService.addProjectResourceModel(resource, user);
        return callback + "(" + JSONValue.toJSONString(handle) + ")";
    }
    @RequestMapping("/addProjectResourceFromStore")
    public String addProjectResourceFromStore(@ModelAttribute("data") ProjectResource resource, HttpServletRequest request, String callback) {

        Handle handle = pmService.addProjectResourceFromStore(resource);
        return callback + "(" + JSONValue.toJSONString(handle) + ")";
    }

    @RequestMapping("/queryProjectResources")
    public String queryProjectResources(@ModelAttribute("data") ProjectResource resource, String callback) {
        List<ProjectResource> list = pmService.queryProjectResources(resource);
        return callback + "(" + JSONValue.toJSONString(list) + ")";
    }

    @RequestMapping("/auditProjectResource")
    public String auditProjectResource(@ModelAttribute("data") ProjectResource resource, HttpServletRequest request, String callback) {
        HttpSession session = request.getSession();
        User user = (User) session.getAttribute("user");
        Handle handle = pmService.auditProjectResource(resource, user);
        return callback + "(" + JSONValue.toJSONString(handle) + ")";
    }

    @RequestMapping("/copyProject")
    public String copyProject(@ModelAttribute("data") Project p, HttpServletRequest request, String callback) {
        HttpSession session = request.getSession();
        User user = (User) session.getAttribute("user");
        Handle handle = pmService.copyProject(p, user);
        return callback + "(" + JSONValue.toJSONString(handle) + ")";
    }

    @RequestMapping("/deleteProject")
    public String deleteProject(String id, HttpServletRequest request, String callback) {
        HttpSession session = request.getSession();
        User user = (User) session.getAttribute("user");
        Handle handle = pmService.deleteProject(id, user);
        return callback + "(" + JSONValue.toJSONString(handle) + ")";
    }

    @RequestMapping("/queryProjectName")
    public String queryProjectName(String parentId, HttpServletRequest request, String callback) {
        HttpSession session = request.getSession();
        User user = (User) session.getAttribute("user");
        List<Map<String, Object>> list = pmService.queryProjectName(parentId, user.getCompanyCode());
        return callback + "(" + JSONValue.toJSONString(list) + ")";
    }

    @RequestMapping("/updateDaily")
    public String updateDaily(@ModelAttribute("data") Daily d, String callback) {
        Handle handle = pmService.updateDaily(d);
        return callback + "(" + JSONValue.toJSONString(handle) + ")";
    }

    @RequestMapping("/queryProjectAll")
    public String queryProjectAll(@ModelAttribute("data") Project p, String currentPage, String callback) {
        Page page = pmService.queryProjectAll(p, currentPage);
        return callback + "(" + JSONValue.toJSONString(page) + ")";
    }


    //新建图文报告
    @RequestMapping("/createProjectReport")
    public String createProjectReport(@ModelAttribute("data") ProjectReport p, String callback) {
        Handle handle = pmService.createProjectReport(p);
        return callback + "(" + JSONValue.toJSONString(handle) + ")";
    }

    //修改图文报告
    @RequestMapping("/updateProjectReport")
    public String updateProjectReport(@ModelAttribute("data") ProjectReport p, String callback) {
        Handle handle = pmService.updateProjectReport(p);
        return callback + "(" + JSONValue.toJSONString(handle) + ")";
    }

    //删除图文报告
    @RequestMapping("/deleteProjectReport")
    public String deleteProjectReport(@ModelAttribute("data") ProjectReport p, String callback) {
        Handle handle = pmService.deleteProjectReport(p);
        return callback + "(" + JSONValue.toJSONString(handle) + ")";
    }

    @RequestMapping("/queryProjectReport")
    public String queryProjectReport(@ModelAttribute("data") ProjectReport p, String callback) {
        List<ProjectReport> list = pmService.queryProjectReport(p);
        return callback + "(" + JSONValue.toJSONString(list) + ")";
    }

    //删除项目的资源
    @RequestMapping("/deleteResource")
    public String deleteResource(@ModelAttribute("data") ProjectResource pr, String callback, HttpServletRequest request) {
        HttpSession session = request.getSession();
        User user = (User) session.getAttribute("user");
        Handle handle = pmService.deleteResource(String.valueOf(pr.getId()), user, pr.getProjectId());
        return callback + "(" + JSONValue.toJSONString(handle) + ")";
    }

    //改变树节点顺序
    @RequestMapping("/updateProjectSequence")
    public String updateProjectSequence(@ModelAttribute("data") Project p, Integer dropPosition, Long dragId) {
        Handle handle = pmService.updateProjectSequence(p, dropPosition, dragId);
        return JSONValue.toJSONString(handle);
    }

    @RequestMapping("/queryUserProject")
    public String queryUserProject(Integer currentPage, String callback, HttpServletRequest request) {
        HttpSession session = request.getSession();
        User user = (User) session.getAttribute("user");
        List<Project> list = pmService.queryUserProject(currentPage, user);
        return callback + "(" + JSONValue.toJSONString(list) + ")";
    }

    @RequestMapping("/queryFocusProject")
    public String queryFocusProject(String callback, Integer currentPage, HttpServletRequest request) {
        HttpSession session = request.getSession();
        User user = (User) session.getAttribute("user");
        List<Project> list = pmService.queryFocusProject(currentPage, user);
        return callback + "(" + JSONValue.toJSONString(list) + ")";
    }

    @RequestMapping("/insertFocusProject")
    public String insertFocusProject(String callback, String projectId, String type, HttpServletRequest request) {
        HttpSession session = request.getSession();
        User user = (User) session.getAttribute("user");
        Handle handle = pmService.insertFocusProject(projectId, user, type);
        return callback + "(" + JSONValue.toJSONString(handle) + ")";
    }

    @RequestMapping("/deleteFocusProject")
    public String deleteFocusProject(String callback, String projectId, String type, HttpServletRequest request) {
        HttpSession session = request.getSession();
        User user = (User) session.getAttribute("user");
        Handle handle = pmService.deleteFocusProject(projectId, user, type);
        return callback + "(" + JSONValue.toJSONString(handle) + ")";
    }

    @RequestMapping("/updateNewDaily")
    public String updateNewDaily(String callback, String projectId, HttpServletRequest request) {
        HttpSession session = request.getSession();
        User user = (User) session.getAttribute("user");
        Handle handle = pmService.updateNewDaily(projectId, user);
        return callback + "(" + JSONValue.toJSONString(handle) + ")";
    }

    //首页资源 模糊 查询
    @RequestMapping("/queryHomeProjectResources")
    public String queryHomeProjectResources(String callback, Integer currentPage, String resourcesName, HttpServletRequest request) {
        HttpSession session = request.getSession();
        User user = (User) session.getAttribute("user");
        List list = pmService.queryHomeProjectResources(currentPage, user, resourcesName);
        return callback + "(" + JSONValue.toJSONString(list) + ")";
    }

    //查询已关注的项目
    @RequestMapping("/queryFocusProjectId")
    public String queryFocusProjectId(String callback, HttpServletRequest request) {
        HttpSession session = request.getSession();
        User user = (User) session.getAttribute("user");
        Map map = new HashMap();
        map.put("projectId", pmService.queryFocusProjectId(user));
        return callback + "(" + JSONValue.toJSONString(map) + ")";
    }

    //首页资源 (相关文档)查询
    @RequestMapping("/dashboardQueryProjectResources")
    public String dashboardQueryProjectResources(@ModelAttribute("data") ProjectResource pr, String callback, Integer currentPage) {
        List list = pmService.dashboardQueryProjectResources(currentPage, pr);
        return callback + "(" + JSONValue.toJSONString(list) + ")";
    }

    @RequestMapping(value = "/teletextShare")
    public ModelAndView teletextShare(@ModelAttribute("data") ProjectReport p, String dailyStatus, String url, String img, ModelAndView mo, HttpServletRequest request) {
        List<ProjectReport> list = pmService.queryProjectReport(p);
        String shareUrl = "";
        dailyStatus = dailyStatus == null ? "" : dailyStatus;
        if (dailyStatus.equals("Cancel")) {
            shareUrl = url + "/link_error";
        } else {
            shareUrl = url + "/visit/teletext?projectId=" + p.getProjectId() + "&UUID=" + p.getResourcesUuid();
        }
        String imgUrl = request.getScheme() + "://" + request.getServerName() + ":" + request.getServerPort() + request.getContextPath() + "/" + img;
        System.out.println(shareUrl);
        mo.setViewName("teletextShare");
        mo.addObject("url", shareUrl);
        mo.addObject("title", list.size() == 0 ? "error" : list.get(0).getResourcesName());
        mo.addObject("img", imgUrl);
        return mo;
    }

    @RequestMapping(value = "/shareInsertDaily")
    public ModelAndView shareInsertDaily(String id, String url, String img, ModelAndView mo, HttpServletRequest request) {
        HttpSession session = request.getSession();
        Project project = pmService.shareQueryProjectHandle(id);
        String shareUrl = "/shareInsertDaily?projectId=" + project.getId() + "&groupId=" + project.getGroupId() + "&projectName=" + project.getProjectName() + "&companyCode=" + project.getCompanyCode();
        String imgUrl = request.getScheme() + "://" + request.getServerName() + ":" + request.getServerPort() + request.getContextPath() + "/" + img;
        String loginUrl = url + shareUrl;
        User user = (User) session.getAttribute("user");
        if (user == null) {
            loginUrl = url + "/login";
            session.setAttribute("last_visit_url", shareUrl);
        }
        mo.setViewName("dataShare");
        mo.addObject("url", loginUrl);
        mo.addObject("title", project.getProjectName());
        mo.addObject("img", imgUrl);
        return mo;
    }

    @RequestMapping("/getTeamList")
    public String getTeamList(String name, String callback) {
        List<Map<String, Object>> list = pmService.getTeamList(name);
        return callback + "(" + JSONValue.toJSONString(list) + ")";
    }

    @RequestMapping("/getPartnerList")
    public String getPartnerList(String name, String callback) {
        List<Map<String, Object>> list = pmService.getPartnerList(name);
        return callback + "(" + JSONValue.toJSONString(list) + ")";
    }

    @RequestMapping("/getLocalOrganizationList")
    public String getLocalOrganizationList(String name, String callback) {
        List<Map<String, Object>> list = pmService.getLocalOrganizationList(name);
        return callback + "(" + JSONValue.toJSONString(list) + ")";
    }

    @RequestMapping("/getConnectList")
    public String getConnectList(Integer projectId, String callback) {
        List<Map<String, Object>> list = pmService.getConnectList(projectId);
        return callback + "(" + JSONValue.toJSONString(list) + ")";
    }

    @RequestMapping("/getProjectTeamList")
    public String getProjectTeamList(Integer projectId, String callback) {
        List<Map<String, Object>> list = pmService.getProjectTeamList(projectId);
        return callback + "(" + JSONValue.toJSONString(list) + ")";
    }

    @RequestMapping("/getTeamPartnerList")
    public String getTeamPartnerList(Integer projectId, String callback) {
        List<Map<String, Object>> list = pmService.getTeamPartnerList(projectId);
        return callback + "(" + JSONValue.toJSONString(list) + ")";
    }

    @RequestMapping("/getProjectLocalOrganizationList")
    public String getProjectLocalOrganizationList(Integer projectId, String callback) {
        List<Map<String, Object>> list = pmService.getProjectLocalOrganizationList(projectId);
        return callback + "(" + JSONValue.toJSONString(list) + ")";
    }

    /**
     * 更新并返回最新项目关联的队伍列表
     *
     * @param projectTeamListSelect
     * @param callback
     * @return
     */
    @RequestMapping("/updateTeamList")
    public String updateTeamList(
            @RequestParam("projectTeamListSelect") List<String> projectTeamListSelect,
            String projectId, String callback) {
        List<Map<String, Object>> list = pmService.updateTeamList(projectTeamListSelect, projectId);
        return callback + "(" + JSONValue.toJSONString(list) + ")";
    }
    /**
     * 将对接人存储为合作机构（资方）并绑定到团队
     *
     * @param projectTeamListSelect
     * @param callback
     * @return
     */
    @RequestMapping("/addProjectTeamPartner")
    public String addProjectTeamPartner(
            @RequestParam("projectTeamListSelect") List<String> projectTeamListSelect,
            String connectId, String callback) throws SQLException {
        List<Map<String, Object>> list = pmService.addProjectTeamPartner(projectTeamListSelect, connectId);
        return callback + "(" + JSONValue.toJSONString(list) + ")";
    }

    /**
     * 删除项目关联的队伍列表，同时删除队伍关联的合作方(自助方)
     *
     * @param teamId
     * @param projectId
     * @param callback
     * @return
     */
    @RequestMapping("/deleteProjectTeam")
    public String deleteProjectTeam(
            String teamId,
            String projectId, String callback) {
        pmService.deleteProjectTeam(teamId, projectId);
        return callback + "(" + JSONValue.toJSONString("更新成功") + ")";
    }

    /**
     * 删除项目关联的队伍列表，同时删除队伍关联的合作方(自助方)
     *
     * @param relateId 项目、团队、资助方关联表的id
     * @param callback
     * @return
     */
    @RequestMapping("/deleteProjectPartner")
    public String deleteProjectPartner(
            String relateId, String callback) {
        pmService.deleteProjectPartner(relateId);
        return callback + "(" + JSONValue.toJSONString("更新成功") + ")";
    }


    /**
     * 更新并返回最新项目关联的资方(合作机构)列表
     *
     * @param selectTeamList
     * @param partnerListSelect
     * @param callback
     * @return
     */
    @RequestMapping("/updatePartnerList")
    public String updatePartnerList(
            @RequestParam( "proTeamAddPartnerSelect") List<String> selectTeamList,
            @RequestParam("projectPartnerListSelect") List<String> partnerListSelect,
            String projectId, String teamId, String callback) {
        List<Map<String, Object>> list = pmService.updatePartnerList(selectTeamList,partnerListSelect, projectId, teamId);
        return callback + "(" + JSONValue.toJSONString(list) + ")";
    }

    /**
     * 更新或者修改项目关联的资方(合作机构)资助金额
     *
     * @param id          关系表的id
     * @param partnerCost 资助金额
     * @param callback
     * @return
     */
    @RequestMapping("/addProjectPartnerCost")
    public String addProjectPartnerCost(
            String id, String partnerCost, String callback) {
        pmService.addProjectPartnerCost(id, partnerCost);
        return callback + "(" + JSONValue.toJSONString("更新成功") + ")";
    }

    /**
     * 更新并返回最新项目关联的在地组织列表
     *
     * @param localOrganizationListSelect
     * @param callback
     * @return
     */
    @RequestMapping("/updateLocalOrganizationList")
    public String updateLocalOrganizationList(
            @RequestParam("projectLocalOrganizationListSelect") List<String> localOrganizationListSelect,
            String projectId, String callback) {
        List<Map<String, Object>> list = pmService.updateLocalOrganizationList(localOrganizationListSelect, projectId);
        return callback + "(" + JSONValue.toJSONString(list) + ")";
    }

    /**
     * 更新并返回最新项目关联的队伍列表
     *
     * @param connectId
     * @param projectId
     * @param callback
     * @return
     */
    @RequestMapping("/updateConnectList")
    public String updateConnectList(
            String connectId,
            String projectId, String callback) {
        List<Map<String, Object>> list = pmService.updateConnectList(connectId, projectId);
        return callback + "(" + JSONValue.toJSONString(list) + ")";
    }

}
