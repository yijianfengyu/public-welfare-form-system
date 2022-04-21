package com.projectManage.entity;


import com.utils.DaoHelp;
import net.sf.json.JSONObject;

/**
 * Created by dragon_eight on 2018/7/26.
 */
public class Template extends Model{
    private String formTitle;
    private String tableName="project_define_data";
    private String formDescription;
    private String define;
    private String label;
    private JSONObject defineJsonObject;
    private String creator;
    private String creatorName;
    private String modifier;
    private String modifierName;
    private String dateCreated;
    private String dateUpdated;
    private String companyCode;
    private String data_uuid;
    private String define_id;
    private String usableRange; //范围(0内部,1外部)
    private String dataCounts;  //数据(true有,false无)
    private String viewPeople;  //可视人

    private String method;
    private String dateFrom;
    private String dateTo="";
    private String userName;
    private String projectId;
    private String defineDataId;
    private String focusId;
    private String status;
    private String sub;//是否可以作为字表被其他表引用
    private Integer formDataId;
    TemplateTableRow templateTableRow;


    public String getLabel() {
        return label;
    }

    public void setLabel(String label) {
        this.label = label;
    }

    public Integer getFormDataId() {
        return formDataId;
    }

    public void setFormDataId(Integer formDataId) {
        this.formDataId = formDataId;
    }

    public String getStatus() {
        return status;
    }

    public void setStatus(String status) {
        this.status = status;
    }

    public String getTableName() {
        return tableName;
    }

    public void setTableName(String tableName) {
        this.tableName = tableName;
    }

    public String getFocusId() {
        return focusId;
    }

    public void setFocusId(String focusId) {
        this.focusId = focusId;
    }

    public String getFormTitle() {
        return formTitle;
    }

    public void setFormTitle(String formTitle) {
        this.formTitle = formTitle;
    }

    public String getDefine() {
        return define;
    }

    public void setDefine(String define) {
        //this.define = TablesUtil.replaceBlank(define);
        this.define =define;
    }

    public String getCreator() {
        return creator;
    }

    public void setCreator(String creator) {
        this.creator = creator;
    }

    public String getDateCreated() {
        return dateCreated;
    }

    public void setDateCreated(String dateCreated) {
        this.dateCreated = dateCreated;
    }

    public String getDateUpdated() {
        return dateUpdated;
    }

    public void setDateUpdated(String dateUpdated) {
        this.dateUpdated = dateUpdated;
    }

    public String getFormDescription() {
        return formDescription;
    }

    public void setFormDescription(String formDescription) {
        this.formDescription = formDescription;
    }

    public String getCompanyCode() {
        return companyCode;
    }

    public void setCompanyCode(String companyCode) {
        this.companyCode = companyCode;
    }

    public String getData_uuid() {
        return data_uuid;
    }

    public void setData_uuid(String data_uuid) {
        this.data_uuid = data_uuid;
    }

    public String getDefine_id() {
        return define_id;
    }

    public void setDefine_id(String define_id) {
        this.define_id = define_id;
    }

    public String getUsableRange() {
        return usableRange;
    }

    public void setUsableRange(String usableRange) {
        this.usableRange = usableRange;
    }

    public String getDataCounts() {
        return dataCounts;
    }

    public void setDataCounts(String dataCounts) {
        this.dataCounts = dataCounts;
    }

    public String getMethod() {
        return method;
    }

    public void setMethod(String method) {
        this.method = method;
    }

    public String getDateFrom() {
        return dateFrom;
    }

    public void setDateFrom(String dateFrom) {
        this.dateFrom = dateFrom;
    }

    public String getDateTo() {
        return dateTo == "" ? null : DaoHelp.simpleDateFormat(dateTo,"yyyy-MM-dd").substring(0, 10) + " 23:59:59";
    }

    public void setDateTo(String dateTo) {
        this.dateTo = dateTo;
    }

    public String getUserName() {
        return userName;
    }

    public void setUserName(String userName) {
        this.userName = userName;
    }

    public String getProjectId() {
        return projectId;
    }

    public void setProjectId(String projectId) {
        this.projectId = projectId;
    }

    public String getDefineDataId() {
        return defineDataId;
    }

    public void setDefineDataId(String defineDataId) {
        this.defineDataId = defineDataId;
    }

    public String getCreatorName() {
        return creatorName;
    }

    public void setCreatorName(String creatorName) {
        this.creatorName = creatorName;
    }

    public String getModifier() {
        return modifier;
    }

    public void setModifier(String modifier) {
        this.modifier = modifier;
    }

    public String getModifierName() {
        return modifierName;
    }

    public void setModifierName(String modifierName) {
        this.modifierName = modifierName;
    }

    public String getViewPeople() {
        return viewPeople;
    }

    public void setViewPeople(String viewPeople) {
        this.viewPeople = viewPeople;
    }

    public String getSub() {
        return sub;
    }

    public void setSub(String sub) {
        this.sub = sub;
    }

    public TemplateTableRow getTemplateTable() {
        return templateTableRow;
    }

    public void setTemplateTable(TemplateTableRow templateTableRow) {
        this.templateTableRow = templateTableRow;
    }

    public JSONObject getDefineJsonObject() {
        return defineJsonObject;
    }

    public void setDefineJsonObject(JSONObject defineJsonObject) {
        this.defineJsonObject = defineJsonObject;
    }
}
