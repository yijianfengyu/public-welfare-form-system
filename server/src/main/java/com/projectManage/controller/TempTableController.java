package com.projectManage.controller;


import com.auth.entity.User;
import com.projectManage.entity.ExamQuestion;
import com.projectManage.entity.Template;
import com.projectManage.entity.TemplateTableRow;
import com.projectManage.service.TempTableService;
import com.utils.Handle;
import com.utils.TablesUtil;
import com.utils.LoggerUtil;
import com.utils.Page;
import net.minidev.json.JSONValue;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.ModelAttribute;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;
import org.springframework.web.servlet.ModelAndView;

import javax.servlet.http.HttpServletRequest;
import javax.servlet.http.HttpSession;
import java.io.UnsupportedEncodingException;
import java.sql.SQLException;
import java.util.*;


/**
 * Created by dragon_eight on 2018/7/27.
 */
@RestController
@RequestMapping("/temp")
public class TempTableController {
    @Autowired
    TempTableService service;
    @Autowired
    HttpSession session;
    /**
     * 添加表单模板
     *
     * @param template
     * @return
     */
    @RequestMapping(value = "/createTempTable")
    public String createTempTable(@ModelAttribute("data") Template template,HttpServletRequest request, String callback) {
        HttpSession session = request.getSession();
        User user= (User) session.getAttribute("user");
        if (service.createTempTable(template,user) > 0) {
            return callback + "(" + JSONValue.toJSONString(new Handle(1, "添加成功")) + ")";
        } else {
            return callback + "(" + JSONValue.toJSONString(new Handle(0, "添加失败")) + ")";
        }
    }

    @RequestMapping(value = "/updateTempTable")
    public String updateTempTable(@ModelAttribute("data") Template template,HttpServletRequest request, String callback) throws UnsupportedEncodingException {
        HttpSession session = request.getSession();
        //template.setDefine(java.net.URLDecoder.decode(template.getDefine(),"UTF-8"));
        User user= (User) session.getAttribute("user");
        if (service.updateTempTable(template,user) > 0) {
            return callback + "(" + JSONValue.toJSONString(new Handle(1, "修改成功")) + ")";
        } else {
            return callback + "(" + JSONValue.toJSONString(new Handle(0, "修改失败")) + ")";
        }
    }


    /**
     * 删除表单模板
     *
     * @param id
     */
    @RequestMapping(value = "/deleteTempTable")
    public String deleteTempTable(Long id, String callback,HttpServletRequest request) {
        HttpSession session = request.getSession();
        User user= (User) session.getAttribute("user");
        if (service.deleteTempTable(id,user.getCompanyCode()) > 0) {
            return callback + "(" + JSONValue.toJSONString(new Handle(1, "删除成功")) + ")";
        } else {
            return callback + "(" + JSONValue.toJSONString(new Handle(0, "删除失败")) + ")";
        }
    }

    /**
     * 查询所有表单模板
     *
     * @param template
     * @return
     */
    @RequestMapping(value = "/queryTempTable")
    public String queryTempTable(@ModelAttribute("data") Template template,HttpServletRequest request, String callback) {
        //HttpSession session = request.getSession();
        String sessionId=session.getId();
        User user= (User) session.getAttribute("user");
        Page page = service.queryTempTable(template,user);
        return callback + "(" + JSONValue.toJSONString(new Handle(1, "success", page)) + ")";
    }

    /**
     * 根据id查询指定模板表
     *
     * @param id
     * @return
     */
    @RequestMapping(value = "/queryTempTableById")
    public String queryTempTableById(String rowDataId,Long id, String callback) {
        Template temp = service.queryTempTableById(id);
        if (temp != null) {
            return callback + "(" + JSONValue.toJSONString(new Handle(1, "success", temp)) + ")";
        } else {
            return callback + "(" + JSONValue.toJSONString(new Handle(0, "暂无数据", temp)) + ")";
        }
    }

    /**
     * 搜索题库
     *
     * @param e
     * @return
     */
    @RequestMapping(value = "/queryExamQuestion")
    public String queryExamQuestion(@ModelAttribute("data") ExamQuestion e, String callback) {
        Page page = service.queryExamQuestion(e);
        return callback + "(" + JSONValue.toJSONString(page) + ")";
    }

    /**
     * 新增题目
     *
     * @param e
     * @return
     */
    @RequestMapping(value = "/updateExamQuestion")
    public String updateExamQuestion(@ModelAttribute("data") ExamQuestion e, String callback) throws SQLException {
        int result= service.updateExamQuestion(e);
        return callback + "(" + JSONValue.toJSONString(new Handle(1, "success", result)) + ")";
    }

    /**
     * 在后台添加模板表数据 以及修改
     *
     * @param templateTableRow
     * @param callback
     * @return
     */
    @RequestMapping(value = "/createTempData")
    public String createTempData(String define_id, @ModelAttribute("data") TemplateTableRow templateTableRow, HttpServletRequest request, String columns, String callback) {
        try {
//            Page page = service.queryTempDataById(templateData);
            String mess = "";
            int i = 0;
            HttpSession session = request.getSession();
            User user= (User) session.getAttribute("user");
            if (user!=null){
                templateTableRow.setCreator(user.getId());
                templateTableRow.setCreatorName(user.getUserName());
            }
            if (templateTableRow.getMethod() == "create" || "create".equals(templateTableRow.getMethod())) {
                //if (page != null && templateData.getData_uuid() != null && templateData.getProjectId() == "") {
                if (templateTableRow.getData_uuid() != null && templateTableRow.getProjectId() == "") {
                    mess += "已有数据";
                    i = 0;
                } else {
                    if ((service.createTempData(templateTableRow, columns, user)) > 0) {
                        mess += "添加成功";
                        i = 1;
                    } else {
                        mess += "添加失败";
                        i = 0;
                    }
                }
            } else if (templateTableRow.getMethod() == "update" || "update".equals(templateTableRow.getMethod())) {
                if ("".equals(templateTableRow.getStatus()) || "0".equals(templateTableRow.getStatus())|| "2".equals(templateTableRow.getStatus())) {
                    if ((service.updateTempData(templateTableRow)) > 0) {
                        mess += "修改成功";
                        i = 1;
                    } else {
                        mess += "修改失败";
                        i = 0;
                    }
                } else if (templateTableRow.getStatus() == "1" || "1".equals(templateTableRow.getStatus())) {
                    mess += "已审核";
                    i = 0;
                }

            } else if (templateTableRow.getMethod() == "audit" || "audit".equals(templateTableRow.getMethod())) {
                templateTableRow.setStatus("1"); //改为已审核
                if ((service.updateTempData(templateTableRow)) > 0) {
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
            return callback + "(" + JSONValue.toJSONString(new Handle(i, mess)) + ")";
        } catch (Exception e) {
            e.printStackTrace();
            LoggerUtil.errorOut("createTempData:" + e.getMessage());
            return callback + "(" + JSONValue.toJSONString(new Handle(0, "网络错误")) + ")";
        }
    }

    /**
     * 修改模板表数据
     *
     * @param
     * @param
     * @return
     */
    @RequestMapping(value = "/updateTempData")
    public String updateTempData(@ModelAttribute("data") TemplateTableRow templateTableRow, String callback) {
        int i = service.updateTempData(templateTableRow);
        if (i > 0) {
            return callback + "(" + JSONValue.toJSONString(new Handle(1, "修改成功")) + ")";
        } else {
            return callback + "(" + JSONValue.toJSONString(new Handle(0, "修改失败")) + ")";
        }
    }

    @RequestMapping(value = "/updateTempDataRemark")
    public String updateTempDataRemark(@ModelAttribute("data") TemplateTableRow templateTableRow, HttpServletRequest request, String callback){
        HttpSession session = request.getSession();
        User user= (User) session.getAttribute("user");
        Handle handle = service.updateTempDataRemark(templateTableRow,user);
        return callback + "(" + JSONValue.toJSONString(handle) + ")";
    }

    /**
     * 删除模板表数据
     *
     * @param
     */
    @RequestMapping(value = "/deleteTempData")
    public String deleteTempData(String id, String define_id,String callback) {
        int i = service.deleteTempData(define_id,id);
        if (i > 0) {
            return callback + "(" + JSONValue.toJSONString(new Handle(1, "删除成功")) + ")";
        } else {
            return callback + "(" + JSONValue.toJSONString(new Handle(0, "删除失败")) + ")";
        }
    }

    /**
     * 按分页查询数据
     *
     * @param
     */
    @RequestMapping(value = "/queryAllTempDataByPage")
    public String queryAllTempDataByPage(@ModelAttribute("data") TemplateTableRow templateTableRow, String callback) throws Exception {
        Page page = service.queryAllTempDataByPageFilter(templateTableRow);
        //List<String> cityList=service.queryCityList();
        //page.setOthers(cityList);
        if (page.getResultList().size() > 0) {
            return callback + "(" + JSONValue.toJSONString(new Handle(1, "success", page)) + ")";
        } else {
            return callback + "(" + JSONValue.toJSONString(new Handle(0, "暂无数据", page)) + ")";
        }
    }

    /**
     * 查询图表数据
     * @param templateTableRow
     * @param callback
     * @return
     * @throws Exception
     */
    @RequestMapping(value = "/queryAllTempData")
    public String queryAllTempData(@ModelAttribute("data") TemplateTableRow templateTableRow, String callback) throws Exception {

        Page page = service.queryAllTempDataByFilter(templateTableRow);

        if (page.getResultList().size() > 0) {
            return callback + "(" + JSONValue.toJSONString(new Handle(1, "success", page)) + ")";
        } else {
            return callback + "(" + JSONValue.toJSONString(new Handle(0, "暂无数据", page)) + ")";
        }
    }

    @RequestMapping(value = "/queryAllTempDataByDefineId")
    public String queryAllTempDataByDefineId(String define_id,String projectId, String callback) throws Exception {

        Page page = service.queryAllTempDataByDefineId(define_id,projectId,"page");

        //List<String> cityList=service.queryCityList();
        //page.setOthers(cityList);
        if (page.getResultList().size() > 0) {
            return callback + "(" + JSONValue.toJSONString(new Handle(1, "success", page)) + ")";
        } else {
            return callback + "(" + JSONValue.toJSONString(new Handle(0, "暂无数据", page)) + ")";
        }
    }


    /**
     * 查询某个模板的某条数据,用于修改数据前查询数据
     *
     * @param templateTableRow
     * @param callback
     * @return
     * @throws Exception
     */
    @RequestMapping(value = "/queryTempDataById")
    public String queryTempDataById(@ModelAttribute("data") TemplateTableRow templateTableRow, String callback) throws Exception {
        if (null == templateTableRow.getDefine_id() || "".equals(templateTableRow.getDefine_id())) { //  || null == templateData.getData_uuid() || "".equals(templateData.getData_uuid()) null == templateData.getCompanyCode() || "".equals(templateData.getCompanyCode()) ||
            return callback + "(" + JSONValue.toJSONString(new Handle(0, "暂无数据")) + ")";
        } else {
            Template temp = service.queryTempTableById(Long.valueOf(templateTableRow.getDefine_id()));
            templateTableRow.setTableName(temp.getTableName());
            Page page = service.queryTempDataById(templateTableRow);
            if (page != null) {
                page.setResultList(TablesUtil.getJsonList(page.getResultList(), temp));
                return callback + "(" + JSONValue.toJSONString(new Handle(1, "success", page)) + ")";
            } else {
                return callback + "(" + JSONValue.toJSONString(new Handle(0, "暂无数据", page)) + ")";
            }
        }
    }


    //统计某个模板的数据来源
    @RequestMapping(value = "/queryTempDataFrom")
    public String queryTempDataFrom(@ModelAttribute("data") TemplateTableRow templateTableRow, String callback) {
        List list = service.queryTempDataFrom(templateTableRow);

        return callback + "(" + JSONValue.toJSONString(list) + ")";
    }

    /**
     * 查询能作为子表的表
     * @param callback
     * @return
     */
    @RequestMapping(value = "/querySubTables")
    public String querySubTables(String callback) {
        List<Map<String, Object>> list = service.querySubTables();

        return callback + "(" + JSONValue.toJSONString(list) + ")";
    }

    @RequestMapping(value = "/formDataShare")
    public ModelAndView shareFormPage(String url, String title,String img, ModelAndView mo) {
        mo.setViewName("formDataShare");
        mo.addObject("title", title);
        mo.addObject("url", url);
        mo.addObject("img", img);
        return mo;
    }

    //查询模板表分组统计
    @RequestMapping(value = "/queryTempDataGroupCount")
    public String queryTempDataGroupCount(@ModelAttribute("data") TemplateTableRow templateTableRow, String callback){
        Page page = service.queryTempDataGroupCount(templateTableRow);
        return callback + "(" + JSONValue.toJSONString(page) + ")";
    }
    //清空所有数据
    @RequestMapping(value = "/clearAllData")
    public String clearAllData(String  id,String creator, String callback,HttpServletRequest request){
        HttpSession session = request.getSession();
        User user= (User) session.getAttribute("user");
        if(!"1".equals(user.getRoleId()) && !creator.equals(user.getId())){
            return callback + "(" + JSONValue.toJSONString(new Handle(0, "您不是创建该表单的人，不能清空表单数据")) + ")";
        }else{
        int  count = service.clearAllData(id,creator,user);
            Map map = new HashMap();
            map.put("count",count);
            return callback + "(" + JSONValue.toJSONString(new Handle(1,"",map)) + ")";
        }
    }
    //首页我关注的表单
    @RequestMapping("/queryFocusFrom")
    public String queryFocusFrom(String callback,Integer currentPage,HttpServletRequest request){
        HttpSession session = request.getSession();
        User user= (User) session.getAttribute("user");
        List<Template> list = service.queryFocusFrom(currentPage,user);
        return callback + "(" + JSONValue.toJSONString(list) + ")";
    }

    /**
     * 分享填写数据的表单
     * @param templateTableRow
     * @param id
     * @param projectId
     * @param dailyStatus
     * @param url
     * @param img
     * @param mo
     * @param request
     * @param rowDataId 对应project_define_data表的id
     * @return
     */
    @RequestMapping(value = "/dataShare")
    public ModelAndView dataShare(String rowDataId, @ModelAttribute("data") TemplateTableRow templateTableRow, Long id, String projectId, String dailyStatus, String url, String img, ModelAndView mo, HttpServletRequest request) {

        Template temp = service.queryTempTableById(id);
        String shareUrl="";
        dailyStatus=dailyStatus==null?"":dailyStatus;
        if(temp==null||dailyStatus.equals("Cancel")){
            shareUrl=url+"/link_error?rowDataId="+rowDataId;
        }else{
            shareUrl=url+"/visit/selectForms?id="+temp.getId()+ "&code=" +temp.getCompanyCode();
            if(templateTableRow.getMethod()!=null) {
                shareUrl = url + "/visit/selectForms?id=" + temp.getId() + "&UUID=" + templateTableRow.getData_uuid() + "&method=" + templateTableRow.getMethod() + "&code=" + templateTableRow.getCompanyCode();
            }else  if(projectId!=null){
                shareUrl = url + "/visit/selectForms?id=" + temp.getId()+"&projectId=" +projectId+ "&UUID=" + templateTableRow.getData_uuid() + "&code=" + templateTableRow.getCompanyCode();
            }
            shareUrl+="".equals(rowDataId) || "null".equals(rowDataId)||null==rowDataId? "":"&rowDataId="+rowDataId;
        }
        String imgUrl= request.getScheme()+"://"+request.getServerName()+":"+request.getServerPort()+request.getContextPath()+"/"+img;
        mo.setViewName("dataFrom");
        mo.addObject("url", shareUrl);
        mo.addObject("title", temp==null?"error":temp.getFormTitle());
        mo.addObject("img",imgUrl);
        return mo;
    }

    //联系人-表单数据绑定
    @RequestMapping("/addContactDefindData")
    public String addContactDefindData(String callback,Template template,HttpServletRequest request){
        HttpSession session = request.getSession();
        User user= (User) session.getAttribute("user");
        List<Template> listTemp = (List<Template>) service.queryAllTempTable(new Template(),user);
        int resultInt = 0;
        for(Template tl : listTemp){
            Page pageTempData = service.queryAllTempDataByDefineId(String.valueOf(tl.getId()),"","all");
            List listTempData =  pageTempData.getResultList();
            resultInt = service.addContactDefindDataWithForm(listTempData,tl);
        }
        Map map = new HashMap();
        map.put("count",resultInt);
        return callback + "(" + JSONValue.toJSONString(map) + ")";
    }

    @RequestMapping("/querySubData")
    public String querySubData(String callback,HttpServletRequest request,Long define_id,Long parentDefineId,Long parentId){
        Page page = service.querySubData(parentDefineId,parentId,define_id);
        return callback + "(" + JSONValue.toJSONString(new Handle(1, "success", page)) + ")";
    }

    @RequestMapping("/modifyPw")
    public String modifyPw(String callback,Long define_id,String modifyPw,HttpServletRequest request){
        HttpSession session = request.getSession();
        User user= (User) session.getAttribute("user");
        if(user==null){
            return callback + "(" + JSONValue.toJSONString(new Handle(0, "暂无数据", null)) + ")";
        }
        service.setModifyPw(define_id,modifyPw);
        return callback + "(" + JSONValue.toJSONString(new Handle(1, "设置成功", null)) + ")";
    }

    @RequestMapping(value = "/openEditDataModal")
    public String openEditDataModal(String vertify_modify_pw, @ModelAttribute("data") TemplateTableRow templateTableRow, HttpServletRequest request, String callback) throws Exception {
        HttpSession session = request.getSession();
        Object out_vertify_modify_pw=session.getAttribute("out_vertify_modify_pw");
        if (out_vertify_modify_pw==null) {
            return callback + "(" + JSONValue.toJSONString(new Handle(0, "校验失败1", null)) + ")";
        } else {
            if(out_vertify_modify_pw.equals(vertify_modify_pw)){
                Template temp = service.queryTempTableById(Long.valueOf(templateTableRow.getDefine_id()));
                templateTableRow.setTableName(temp.getTableName());
                Page page = service.queryTempDataById(templateTableRow);

                page.setResultList(TablesUtil.getJsonList(page.getResultList(), temp));
                return callback + "(" + JSONValue.toJSONString(new Handle(1, "success", page.getResultList().get(0))) + ")";
            }else{
                return callback + "(" + JSONValue.toJSONString(new Handle(0, "校验失败2", null)) + ")";
            }


        }
    }

    @RequestMapping("/vertifyPw")
    public String vertifyPw(String callback,Long define_id,String modifyPw,HttpServletRequest request){
        HttpSession session = request.getSession();
        /**if(session.getAttribute("out_vertify_modify_pw")!=null){
            return callback + "(" + JSONValue.toJSONString(new Handle(1, "校验成功1", null)) + ")";
        }**/
        boolean vertify=service.vertifyPw(define_id,modifyPw);
        if(vertify){
            String uuid=UUID.randomUUID().toString().replace("-","");
            session.setAttribute("out_vertify_modify_pw",uuid);
            Map<String,String> map=new HashMap<String,String>();
            map.put("vertify_modify_pw",uuid);
            return callback + "(" + JSONValue.toJSONString(new Handle(1, "success",map)) + ")";
        }else {
            return callback + "(" + JSONValue.toJSONString(new Handle(0, "校验失败3", null)) + ")";
        }
    }

    @RequestMapping("/modifyFormDataByPw")
    public String modifyFormDataByPw(HttpServletRequest request, String vertify_modify_pw, @ModelAttribute("data") TemplateTableRow templateTableRow, String callback) {
        HttpSession session = request.getSession();
        String out_vertify_modify_pw = session.getAttribute("out_vertify_modify_pw") == null ? null : (String) session.getAttribute("out_vertify_modify_pw");
        if (out_vertify_modify_pw != null && out_vertify_modify_pw.equals(vertify_modify_pw)) {
            int i = service.updateTempData(templateTableRow);
            if (i > 0) {
                return callback + "(" + JSONValue.toJSONString(new Handle(1, "修改成功")) + ")";
            } else {
                return callback + "(" + JSONValue.toJSONString(new Handle(0, "修改失败5")) + ")";
            }
        } else {
            return callback + "(" + JSONValue.toJSONString(new Handle(0, "没有找到权限信息4")) + ")";
        }
    }
    @RequestMapping("/getTableColumns")
    public String getTableColumns(String dropdownTableName, String callback) {
        List<String> list=service.getTableColumns(dropdownTableName);
        return callback + "(" + JSONValue.toJSONString(new Handle(1, "success",list)) + ")";

    }

    /**
     * 查询题目分组
     * @param callback
     * @return
     */
    @RequestMapping("/getLabelForSelect")
    public String queryProjectTreeForSelect(String callback) {
        User user= (User) session.getAttribute("user");
        if(user==null){
            return callback + "(" + JSONValue.toJSONString(new Handle(0, "暂无数据", null)) + ")";
        }
        List<Map<String,Object>> tree=service.queryProjectTreeForSelect(user);
        return callback + "(" + JSONValue.toJSONString(new Handle(1, "success",tree)) + ")";

    }
}
