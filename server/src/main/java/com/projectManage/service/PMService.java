package com.projectManage.service;

import com.auth.entity.User;
import com.projectManage.dao.PMDao;
import com.projectManage.dao.PMResourceDao;
import com.projectManage.entity.Daily;
import com.projectManage.entity.Project;
import com.projectManage.entity.ProjectReport;
import com.projectManage.entity.ProjectResource;
import com.utils.Handle;
import com.utils.Page;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.sql.SQLException;
import java.util.List;
import java.util.Map;

@Service
public class PMService {

    @Autowired
    PMDao dao;

    @Autowired
    PMResourceDao resourceDao;

    public Page queryProject(Project p,String currentPage,User user) {
        return dao.queryProject(p, currentPage, user);
    }

    public String queryProjectTree(Project p,User user){
        return dao.queryProjectTree(p, user);
    }
    public List<Map<String,Object>> queryProjectTreeForSelect(Project p,User user){
        return dao.queryProjectTreeForSelect(p, user);
    }

    public Handle updateProject(Project p) {
        return dao.updateProject(p);
    }

    public Handle createProject(Project p,User user) {
        return dao.createProject(p, user);
    }

    public List<Daily> queryProjectDaily(Daily daily,Integer parentId,Integer currentPage,String companyCode){
        return dao.queryProjectDaily(daily,parentId,currentPage,companyCode);
    }

    public Handle createProjectDaily(Daily daily,String companyCode){
        return dao.createProjectDaily(daily,companyCode);
    }

    public Handle updateProjectDaily(Daily daily,User user){
        return dao.updateProjectDaily(daily,user);
    }

    public Handle deleteProjectDaily(Daily daily,User user){
        return dao.deleteProjectDaily(daily,user);
    }

    public Handle addProjectResource(ProjectResource pr,User user){
        return resourceDao.updateProjectResource(pr,user);
    }

    public Handle addProjectResourceModel(ProjectResource pr ,User user){
        return resourceDao.addProjectResourceModel(pr ,user);
    }
    public Handle addProjectResourceFromStore(ProjectResource pr){
        return resourceDao.addProjectResourceFromStore(pr);
    }

    public List<ProjectResource>  queryProjectResources(ProjectResource pr){
        return resourceDao.queryProjectResources(pr);
    }

    public Handle auditProjectResource(ProjectResource pr, User user){
        return resourceDao.auditProjectResource(pr, user);
    }

    public Handle copyProject(Project p,User user){
        return dao.copyProject(p,user);
    }

    public Handle deleteProject(String id,User user){
        return dao.deleteProject(id, user);
    }

    public List<Map<String, Object>> queryProjectName(String parentId,String companyCode){
        return dao.queryProjectName(parentId, companyCode);
    }

    public Page queryProjectDailyByPage(Daily daily){
        return dao.queryProjectDailyByPage(daily);
    }

    public Handle updateDaily(Daily d){
        return dao.updateDaily(d);
    }

    public Page queryProjectAll(Project p,String currentPage){
        return dao.queryProjectAll(p, currentPage);
    }

    public int queryCountProject(String companyCode){
        return dao.queryCountProject(companyCode);
    }

    public Handle createProjectReport(ProjectReport p){
        return dao.createProjectReport(p);
    }

    public Handle updateProjectReport(ProjectReport p){
        return dao.updateProjectReport(p);
    }

    public Handle deleteProjectReport(ProjectReport p){
        return dao.deleteProjectReport(p);
    }

    public List queryProjectReport(ProjectReport p){
        return dao.queryProjectReport(p);
    }

    public Handle deleteResource(String id,User user,String projectId) {
        if(isAdmin(user)||isAuth(user.getId(),projectId)) {
            return dao.deleteResource(id);
        }else{
            return new Handle(0,"错误，没有权限删除此资源。");
        }
    }

    /**
     * 判断用户是都管理员
     * @param user
     * @return
     */
    private boolean isAdmin(User user) {
        return dao.isAdmin(user);
    }

    /**
     * 判断用户对于某项目是否有权限操作
     * @param userId
     * @param projectId
     */
    public boolean isAuth(String userId, String projectId) {
        return dao.isAuth(userId, projectId);
    }

    public Handle updateProjectSequence(Project p, Integer dropPosition, Long dragId){
        return dao.updateProjectSequence(p, dropPosition, dragId);
    }

    public List<Project> queryUserProject(Integer currentPage,User user) {
        return (List<Project>) dao.queryUserProject(currentPage,user);
    }
    public  List<Project> queryFocusProject(Integer currentPage,User user){
        return (List<Project>) dao.queryFocusProject(currentPage,user);
    }

    public Handle insertFocusProject(String projectId,User user,String type) {
        return dao.insertFocusProject(projectId,user,type);
    }

    public Handle deleteFocusProject(String projectId,User user,String type) {
        return dao.deleteFocusProject(projectId,user,type);
    }

    public User queryUserHandle(String companyCode, String repliedBy){
        return dao.queryUserHandle(companyCode,repliedBy);
    }

    public List  queryHomeProjectResources(Integer currentPage,User user,String resourcesName){
        return resourceDao.queryHomeProjectResources(currentPage,user,resourcesName);
    }

    public String queryFocusProjectId(User user){
        return dao.queryFocusProjectId(user);
    }
    //首页资源 (相关文档)查询
    public List dashboardQueryProjectResources(Integer currentPage, ProjectResource pr) {
       return resourceDao.dashboardQueryProjectResources(currentPage,pr);
    };
    public Handle updateNewDaily(String projectId,User user) {
        return  dao.updateNewDaily(projectId,user);
    }
    public Project shareQueryProjectHandle(String id) {
        return dao.shareQueryProjectHandle(id);
    }

    public List<Map<String, Object>> getTeamList(String name){
        return dao.getTeamList(name);
    }

    public List<Map<String, Object>> getPartnerList(String name){
        return dao.getPartnerList(name);
    }

    public List<Map<String, Object>> getLocalOrganizationList(String name){
        return dao.getLocalOrganizationList(name);
    }

    public List<Map<String, Object>> getConnectList(Integer projectId){
        return dao.getConnectList(projectId);
    }

    public List<Map<String, Object>> getProjectTeamList(Integer projectId){
        return dao.getProjectTeamList(projectId);
    }

    public List<Map<String, Object>> getTeamPartnerList(Integer projectId){
        return dao.getTeamPartnerList(projectId);
    }

    public List<Map<String, Object>> getProjectLocalOrganizationList(Integer projectId){
        return dao.getProjectLocalOrganizationList(projectId);
    }

    public List<Map<String, Object>> updateTeamList(List<String> projectTeamListSelect,String projectId) {
        return dao.updateTeamList(projectTeamListSelect,projectId);
    }
    @Transactional
    public List<Map<String, Object>> addProjectTeamPartner(List<String> projectTeamListSelect,String connectId) throws SQLException {
        return dao.addProjectTeamPartner(projectTeamListSelect,connectId);
    }

    public List<Map<String, Object>> updatePartnerList(List<String> selectTeamList,List<String> partnerListSelect, String projectId, String teamId) {
        return dao.updatePartnerList(selectTeamList,partnerListSelect,projectId,teamId);
    }

    public List<Map<String, Object>> updateLocalOrganizationList(List<String> localOrganizationListSelect, String projectId) {
        return dao.updateLocalOrganizationList(localOrganizationListSelect,projectId);
    }

    public List<Map<String, Object>> updateConnectList(String connectId, String projectId) {
        return dao.updateConnectList(connectId,projectId);
    }

    public void deleteProjectTeam(String teamId, String projectId) {
        dao.deleteProjectTeam(teamId,projectId);
    }

    public void deleteProjectPartner(String relateId) {
        dao.deleteProjectPartner(relateId);
    }

    public void addProjectPartnerCost( String id, String partnerCost) {
        dao.addProjectPartnerCost(id,partnerCost);
    }
}
