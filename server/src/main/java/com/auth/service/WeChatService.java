package com.auth.service;

import com.auth.dao.AccountDao;
import com.auth.dao.WeChatApiDao;
import com.auth.entity.*;
import com.projectManage.entity.Project;
import com.projectManage.entity.*;
import com.utils.Handle;
import com.utils.Page;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.sql.SQLException;
import java.util.List;
import java.util.Map;

/**
 * Created by Administrator on 2019/1/8.
 */
@Service
public class WeChatService {
    @Autowired
    WeChatApiDao weChatApiDao;
    @Autowired
    AccountDao accountDao;

    public Page queryUserProject(Integer currentPage, User user) {
        return weChatApiDao.queryUserProject(currentPage, user);
    }

    public List getAndVertifyUser(User user) {
        return weChatApiDao.getAndVertifyStaff(user);
    }

    public Handle createProjectDaily(Daily daily, String companyCode) {
        return weChatApiDao.createProjectDaily(daily, companyCode);
    }

    public Handle updateProjectDaily(Daily daily, String companyCode) {
        return weChatApiDao.updateProjectDaily(daily, companyCode);
    }

    public Page queryProjectDaily(Daily daily, Integer parentId, Integer currentPage) {
        return weChatApiDao.queryProjectDaily(daily, parentId, currentPage);
    }

    //资源 (相关文档)查询
    public Page dashboardQueryProjectResources(Integer currentPage, ProjectResource pr) {
        return weChatApiDao.dashboardQueryProjectResources(currentPage, pr);
    }

    ;

    public Page queryTempTable(Template template, Integer currentPage, User user) {
        return weChatApiDao.queryTempTable(template, currentPage, user);
    }

    //绑定账号
    public int updateUuid(User user) {
        return weChatApiDao.updateUuid(user);
    }

    //表单详情
    public Page queryAllTempDataByDefineId(String define_id, Integer pageSize, Integer currentPage) {
        return weChatApiDao.queryAllTempDataByDefineId(define_id, pageSize, currentPage);
    }


    //修改进度
    public Handle insertProjectProgress(ProjectProgress projectProgress, User user) {
        return weChatApiDao.insertProjectProgress(projectProgress, user);
    }

    //跟据id查询备注
    public ProjectProgress querysRemark(ProjectProgress projectProgress) {
        return weChatApiDao.querysRemark(projectProgress);
    }

    public List<ProjectProgress> querysProjectProgress(ProjectProgress projectProgress) {
        return weChatApiDao.querysProjectProgress(projectProgress);
    }

    public Page queryFocusProject(Integer currentPage, User user) {
        return weChatApiDao.queryFocusProject(currentPage, user);
    }

    public Page queryFocusFrom(Template template, Integer currentPage, User user) {
        return weChatApiDao.queryFocusFrom(template, currentPage, user);
    }

    public Page queryNewDaliy(Daily daily, User user) {
        return weChatApiDao.queryNewDaliy(daily, user);
    }

    public List<Project> querysLackOfLogCount(User user) {
        return weChatApiDao.querysLackOfLogCount(user);
    }

    public Map<Object, Object> logProfile(Project p, User u) {
        return weChatApiDao.logProfile(p, u);
    }

    public Handle deleteProjectDaily(Daily daily, User user) {
        return weChatApiDao.deleteProjectDaily(daily, user);
    }

    public Project projectDetails(Project project) {
        return weChatApiDao.projectDetails(project);
    }

    public Daily projectLogValue(Daily project) {
        return weChatApiDao.projectLogValue(project);
    }

    public Handle insertSchedule(Schedule schedule) {
        return weChatApiDao.insertSchedule(schedule);
    }

    public List<String> queryScheduleDaysByMonth(Schedule schedule) {
        return weChatApiDao.queryScheduleDaysByMonth(schedule);
    }

    public Schedule queryScheduleById(Integer id) {
        return weChatApiDao.queryScheduleById(id);
    }

    public Handle updateSchedule(Schedule schedule) {
        return weChatApiDao.updateSchedule(schedule);
    }

    public Handle deleteScheduleById(Integer id) {
        return weChatApiDao.deleteScheduleById(id);
    }

    public Page queryScheduleList(Schedule schedule) {
        return weChatApiDao.queryScheduleList(schedule);
    }

    public List queryAllUsers(String companyCode) {
        return weChatApiDao.queryAllUsers(companyCode);
    }

    public Page queryCommentList(DailyComment comment) {
        return weChatApiDao.queryCommentList(comment);
    }

    public Handle insertDailyComment(DailyComment comment) {
        return weChatApiDao.insertDailyComment(comment);
    }

    public User selectAccount(User u) {
        return weChatApiDao.selectAccount(u);
    }

    @Transactional
    public Map createTempData(TemplateTableRow templateTableRow, String columns, Account account) {
        return weChatApiDao.createTempData(templateTableRow, columns, account);
    }

    @Transactional
    public Map updateTempData(TemplateTableRow templateTableRow, Account account) {
        return weChatApiDao.updateTempData(templateTableRow,account);
    }

    public Page queryAllTempDataByPage(TemplateTableRow templateTableRow) {
        return weChatApiDao.queryAllTempDataByPage(templateTableRow);
    }

    public Template queryTempTableById(Long id) {
//        List<Map<String, Object>> mapList = weChatApiDao.queryTeam();
        Template template = weChatApiDao.queryTempTableById(id);
//        Map<String,Object> map=new HashMap<>();
//        map.put("team",mapList);
//        map.put("template",template);
        return template;
    }


    public Template queryTempTableById(Long id,Integer accountId,String city,String province) {
        Template template = weChatApiDao.queryTempTableById(id,accountId,city,null,province);
        return template;
    }

    public Template queryTempTableByIdBottun(Long id) {
//        List<Map<String, Object>> mapList = weChatApiDao.queryTeam();
        Template template = weChatApiDao.queryTempTableByIdButton(id);
//        Map<String,Object> map=new HashMap<>();
//        map.put("team",mapList);
//        map.put("template",template);
        return template;
    }

    public Page queryTempDataById(TemplateTableRow templateTableRow) {
        return weChatApiDao.queryTempDataById(templateTableRow);
    }

    public Page queryProject(com.auth.entity.Project project,Integer accountId){
           return this.weChatApiDao.queryProject(project,accountId);
    }

    public Page queryVolunteerapply(VolunteerApply volunteerApply) {
        return this.weChatApiDao.queryVolunteerapply(volunteerApply);
    }

    public Page queryTeam(Team team, int accountId) {
        return this.weChatApiDao.queryTeam(team, accountId);
    }

    public int countTeam(Integer teamId) {
        return this.weChatApiDao.countTeam(teamId);
    }
    public int joinTeam(Integer teamId, Integer accountId) {
        return this.weChatApiDao.joinTeam(teamId, accountId);
    }

    @Transactional
    public int audit(Integer defineId,Integer tableId,Integer status) {
        return this.weChatApiDao.audit(defineId,tableId,status);
    }




    public Map<String, Object> count(Integer accountId) {
        return this.weChatApiDao.count(accountId);
    }

    public Page queryApplicationResearch(Integer accountId,Integer status,String project_name) {
        return weChatApiDao.queryApplicationResearch(accountId,status,project_name);
    }
    public Comment addComment(Comment comment,String accountName,Integer project_id,Integer accountId) throws SQLException {
        return weChatApiDao.addComment(comment, accountName, project_id,accountId);
    }
    public Page queryComment(Comment comment) {
        return weChatApiDao.queryComment(comment);
    }

    public List<Map<String, Object>> AccountInfo(Integer accountId){
      return  this.weChatApiDao.AccountInfo(accountId);
    }

    public Map<String,Object> isCreate(Integer accountId,Integer defineId,Integer ProjectId,String city) {
          return this.weChatApiDao.isCreate(accountId,defineId,ProjectId,city);
    }


    public Page queryWaterSource() {
        return weChatApiDao.queryWaterSource();
    }

    public List queryObjectTopOne(Integer id) {
        return weChatApiDao.queryObjectTopOne(id);
    }

    public Map<String,Object> teaminfo(Integer  teamId,Integer accountId){
       return this.weChatApiDao.teaminfo(teamId,accountId);
    }

    public int updateStatus(Integer  teamId,Integer accountId,Integer status) {
   return this.weChatApiDao.updateStatus(teamId,accountId,status);
    }

    public Map<String,Object> statistics(Integer id,Integer projectId,Integer accountId){
      return this.weChatApiDao.statistics(id,projectId,accountId);
    }

@Transactional
    public int updateAccount(Account account){
       return this.weChatApiDao.updateAccount(account);
    }


    public List<Map<String,Object>> remind(Integer accountId,String project_name){
      return this.weChatApiDao.remind(accountId,project_name);
    }

    public List statisticsData(Integer projectId){
        return this.weChatApiDao.statisticsData(projectId);
    }

    public int kick(Integer teamId,Integer accountId){
       return this.weChatApiDao.kick(teamId,accountId);
    }


    public Map save(Integer defindId,Integer dataId,String columnName,String value,Integer projectId,
String accountName,Integer accountId) throws SQLException {
       return this.weChatApiDao.save(defindId,dataId,columnName,value,projectId,accountName,accountId);
    }

    public Map<String, Object> myReport(Integer accountId, Integer projectId,Integer type){
    return this.weChatApiDao.myReport(accountId,projectId,type);
    }


    public  List<Map<String,Object>> answerInfo(Integer accountId,Integer projectId){
        return this.weChatApiDao.answerInfo(accountId,projectId);
    }

    public Map<String,Object> dianzanFollow(Integer accountId,Integer projectId,Integer type) throws SQLException {
      return   this.weChatApiDao.dianzanFollow(accountId,projectId,type);
    }

//    public int setupComplete(Integer defineId,Integer id,Integer status){
//      return this.weChatApiDao.setupComplete(defineId,id,status);
//    }




}
