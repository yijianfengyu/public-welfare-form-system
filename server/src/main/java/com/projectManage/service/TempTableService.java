package com.projectManage.service;

import com.auth.entity.User;
import com.projectManage.dao.PMDao;
import com.projectManage.dao.TempTableDao;
import com.projectManage.entity.ExamQuestion;
import com.projectManage.entity.Project;
import com.projectManage.entity.Template;
import com.projectManage.entity.TemplateTableRow;
import com.utils.Handle;
import com.utils.Page;
import com.utils.TablesUtil;
import com.utils.TreeUtil;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.sql.SQLException;
import java.util.List;
import java.util.Map;

/**
 * Created by dragon_eight on 2018/7/27.
 */
@Service
public class TempTableService {
    @Autowired
    TempTableDao dao;

    @Autowired
    PMDao pmDao;

    @Transactional
    public int createTempTable(Template temJson,User user){
        return dao.createTempTable(temJson,user);
    }

    @Transactional
    public int updateTempTable(Template template,User user){
        return dao.updateTempTable(template,user);
    }

    @Transactional
    public int deleteTempTable(Long id,String companyCode){
        return dao.deleteTempTable(id,companyCode);
    }

    public Page queryTempTable(Template template,User user){
        return dao.queryTempTable(template,user);
    }

    public List queryAllTempTable(Template template,User user){
        return dao.queryAllTempTable(template,user);
    }

    public int queryCountTempTable(String companyCode){
        return dao.queryCountTempTable(companyCode);
    }

    public Template queryTempTableById(Long id){
        return dao.queryTempTableById(id);
    }

    @Transactional
    public int createTempData(TemplateTableRow templateTableRow, String columns, User user){
        return dao.createTempData(templateTableRow,columns,user);
    }

    @Transactional
    public int createTempData(List tempList, TemplateTableRow templateTableRow, String columns, User user) {
        return dao.createTempData(tempList, templateTableRow,columns,user);
    }

    @Transactional
    public int updateTempData(TemplateTableRow templateTableRow){
        return dao.updateTempData(templateTableRow);
    }

    @Transactional
    public Handle updateTempDataRemark(TemplateTableRow templateTableRow, User user){
        return dao.updateTempDataRemark(templateTableRow,user);
    }

    @Transactional
    public int deleteTempData(String defineId,String id){
        return dao.deleteTempData(defineId,id);
    }

    public Page queryAllTempDataByPage(Template template){
        return dao.queryAllTempDataByPage(template);
    }

    public Page queryAllTempData(Template template){
        return dao.queryAllTempData(template);
    }

    public Page queryAllTempDataByDefineId(String define_id,String projectId,String allOrPage){
        return dao.queryAllTempDataByDefineId(define_id,projectId,allOrPage);
    }

    public Page queryTempDataById(TemplateTableRow templateTableRow){
        return dao.queryTempDataById(templateTableRow);
    }

    public String querySumNumberCols(String col_data, TemplateTableRow templateTableRow){
        return dao.querySumNumberCols(col_data, templateTableRow);
    }

    public List queryTempDataFrom(TemplateTableRow templateTableRow){
        return dao.queryTempDataFrom(templateTableRow);
    }
    public int clearAllData(String id,String creator,User user){
        return dao.clearAllData(id,creator,user);
    }

    public Page queryTempDataGroupCount(TemplateTableRow templateTableRow){
        return dao.queryTempDataGroupCount(templateTableRow);
    }


    public  List<Template> queryFocusFrom(Integer currentPage,User user){
        return (List<Template>) dao.queryFocusFrom(currentPage,user);
    }

    public int addContactDefindData(int resultTempId, Map<String, String> contactMap, TemplateTableRow templateTableRow, Boolean infoType){
        return dao.addContactDefindData(resultTempId,contactMap, templateTableRow,infoType);
    }

    public int addContactDefindDataWithForm(List listTempData,Template tl){
        return dao.addContactDefindDataWithForm(listTempData, tl);
    }

    public Page querySubData(Long parentDefineId,Long parentId,Long define_id){
        return dao.querySubData(parentDefineId,parentId,define_id);
    }

    public void setModifyPw(Long define_id, String modifyPw) {
        dao.setModifyPw(define_id,modifyPw);
    }
    public boolean vertifyPw(Long define_id, String modifyPw) {
        return dao.vertifyPw(define_id,modifyPw);
    }

    public List<Map<String, Object>> querySubTables() {
        return dao.querySubTables();
    }

    public Page queryAllTempDataByFilter(TemplateTableRow templateTableRow) {
        net.sf.json.JSONObject jsonObject = net.sf.json.JSONObject.fromObject(templateTableRow.getDefine());
        String define_id=jsonObject.getString("define_id");
        Template temp = this.queryTempTableById(Long.valueOf(define_id));
        temp.setDefine(templateTableRow.getDefine());//设置为前端含有搜索条件值的define
        TablesUtil.firstAddDefine(temp);//生成jsonObject形式的列描述，包括静态列
        temp.setTemplateTable(templateTableRow);

        return this.queryAllTempData(temp);
    }

    public Page queryAllTempDataByPageFilter(TemplateTableRow templateTableRow) {
        net.sf.json.JSONObject jsonObject = net.sf.json.JSONObject.fromObject(templateTableRow.getDefine());
        String define_id=jsonObject.getString("define_id");
        Template temp = this.queryTempTableById(Long.valueOf(define_id));
        temp.setDefine(templateTableRow.getDefine());//设置为前端含有搜索条件值的define
        TablesUtil.firstAddDefine(temp);//生成jsonObject形式的列描述，包括静态列
        temp.setTemplateTable(templateTableRow);
        return this.queryAllTempDataByPage(temp);
    }

    public List<String> getTableColumns(String tableName) {
        return dao.getTableColumns(tableName);
    }

    public List<Map<String,Object>> queryProjectTreeForSelect( User user) {
        Project p=new Project();
        //TODO 改为从数据库配置参数获取
        p.setCompanyCode("b124953d-45d5-11ea-b413-00163e06e151");
        p.setGroupId("PMNO2112080218");
        return pmDao.queryProjectTreeForSelect(p,user);
    }

    public List<Map<String, Object>> getDropdownOptions(String columnName, String tableName) {
        return dao.getDropdownOptions(columnName,tableName);
    }

    public Page  queryExamQuestion(ExamQuestion e) {
        return dao.queryExamQuestion(e);
    }
    public int updateExamQuestion(ExamQuestion e) throws SQLException {
        return dao.updateExamQuestion(e);
    }
    public int insertExamQuestion(ExamQuestion e) throws SQLException {
        return dao.insertExamQuestion(e);
    }
}
