package com.projectManage.entity;

import com.utils.DaoHelp;

import java.util.List;

/**
 * Created by dragon_eight on 2018/8/1.
 */
public class TemplateTableRow extends Model {

    //    public String id;
    private String define_id;
    private String tableName;
    private String companyCode;

    private String projectId;

    private String data_uuid;
    private String col_data1;
    private String col_data2;
    private String col_data3;
    private String col_data4;
    private String col_data5;
    private String col_data6;
    private String col_data7;
    private String col_data8;
    private String col_data9;
    private String col_data10;
    private String col_data11;
    private String col_data12;
    private String col_data13;
    private String col_data14;
    private String col_data15;
    private String col_data16;
    private String col_data17;
    private String col_data18;
    private String col_data19;
    private String col_data20;
    private String col_data21;
    private String col_data22;
    private String col_data23;
    private String col_data24;
    private String col_data25;
    private String creator;
    private String creatorName;
    private String dateCreated;
    private String dateUpdated;
    private String define;
    private String status="1"; //状态(0未审核,1已审核)
    private String sub; //是否可以作为子表
    private String usableRange; //范围(0内部,1外部)
    private String formTitle;
    private String formDescription;
    private String remark;  //备注
    private String rowDataId;  //记录这条数据是哪调数据点击过的，就是父数据的id

    private String systemEnvironment;//系统环境
    private String channel;//渠道

    private String windows;
    private String ios;
    private String android;
    private String weibo;
    private String weixin;
    private String defaultFrom;
    private String qq;

    private String method;
    private String dateFrom;
    private String dateTo = "";

    private String selectGroupColDatas;  //要分组的列
    private String selectCountColDatas;  //要统计的列

//    public String getId() {
//        return id;
//    }
//
//    public void setId(String id) {
//        this.id = id;
//    }


    public String getTableName() {
        return tableName;
    }

    public void setTableName(String tableName) {
        this.tableName = tableName;
    }

    public String getDefine_id() {
        return define_id;
    }

    public void setDefine_id(String define_id) {
        this.define_id = define_id;
    }

    public String getCompanyCode() {
        return companyCode;
    }

    public void setCompanyCode(String companyCode) {
        this.companyCode = companyCode;
    }

    public String getProjectId() {
        return projectId;
    }

    public void setProjectId(String projectId) {
        this.projectId = projectId;
    }

    public String getData_uuid() {
        return data_uuid;
    }

    public void setData_uuid(String data_uuid) {
        this.data_uuid = data_uuid;
    }

    public String getCol_data1() {
        return col_data1;
    }

    public void setCol_data1(String col_data1) {
        this.col_data1 = col_data1;
    }

    public String getCol_data2() {
        return col_data2;
    }

    public void setCol_data2(String col_data2) {
        this.col_data2 = col_data2;
    }

    public String getCol_data3() {
        return col_data3;
    }

    public void setCol_data3(String col_data3) {
        this.col_data3 = col_data3;
    }

    public String getCol_data4() {
        return col_data4;
    }

    public void setCol_data4(String col_data4) {
        this.col_data4 = col_data4;
    }

    public String getCol_data5() {
        return col_data5;
    }

    public void setCol_data5(String col_data5) {
        this.col_data5 = col_data5;
    }

    public String getCol_data6() {
        return col_data6;
    }

    public void setCol_data6(String col_data6) {
        this.col_data6 = col_data6;
    }

    public String getCol_data7() {
        return col_data7;
    }

    public void setCol_data7(String col_data7) {
        this.col_data7 = col_data7;
    }

    public String getCol_data8() {
        return col_data8;
    }

    public void setCol_data8(String col_data8) {
        this.col_data8 = col_data8;
    }

    public String getCol_data9() {
        return col_data9;
    }

    public void setCol_data9(String col_data9) {
        this.col_data9 = col_data9;
    }

    public String getCol_data10() {
        return col_data10;
    }

    public void setCol_data10(String col_data10) {
        this.col_data10 = col_data10;
    }

    public String getCol_data11() {
        return col_data11;
    }

    public void setCol_data11(String col_data11) {
        this.col_data11 = col_data11;
    }

    public String getCol_data12() {
        return col_data12;
    }

    public void setCol_data12(String col_data12) {
        this.col_data12 = col_data12;
    }

    public String getCol_data13() {
        return col_data13;
    }

    public void setCol_data13(String col_data13) {
        this.col_data13 = col_data13;
    }

    public String getCol_data14() {
        return col_data14;
    }

    public void setCol_data14(String col_data14) {
        this.col_data14 = col_data14;
    }

    public String getCol_data15() {
        return col_data15;
    }

    public void setCol_data15(String col_data15) {
        this.col_data15 = col_data15;
    }

    public String getCol_data16() {
        return col_data16;
    }

    public void setCol_data16(String col_data16) {
        this.col_data16 = col_data16;
    }

    public String getCol_data17() {
        return col_data17;
    }

    public void setCol_data17(String col_data17) {
        this.col_data17 = col_data17;
    }

    public String getCol_data18() {
        return col_data18;
    }

    public void setCol_data18(String col_data18) {
        this.col_data18 = col_data18;
    }

    public String getCol_data19() {
        return col_data19;
    }

    public void setCol_data19(String col_data19) {
        this.col_data19 = col_data19;
    }

    public String getCol_data20() {
        return col_data20;
    }

    public void setCol_data20(String col_data20) {
        this.col_data20 = col_data20;
    }

    public String getCol_data21() {
        return col_data21;
    }

    public void setCol_data21(String col_data21) {
        this.col_data21 = col_data21;
    }

    public String getCol_data22() {
        return col_data22;
    }

    public void setCol_data22(String col_data22) {
        this.col_data22 = col_data22;
    }

    public String getCol_data23() {
        return col_data23;
    }

    public void setCol_data23(String col_data23) {
        this.col_data23 = col_data23;
    }

    public String getCol_data24() {
        return col_data24;
    }

    public void setCol_data24(String col_data24) {
        this.col_data24 = col_data24;
    }

    public String getCol_data25() {
        return col_data25;
    }

    public void setCol_data25(String col_data25) {
        this.col_data25 = col_data25;
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

    public String getDefine() {
        return define;
    }

    public void setDefine(String define) {
        this.define = define;
    }

    public String getStatus() {
        return status;
    }

    public void setStatus(String status) {
        this.status = status;
    }

    public String getUsableRange() {
        return usableRange;
    }

    public void setUsableRange(String usableRange) {
        this.usableRange = usableRange;
    }

    public String getFormTitle() {
        return formTitle;
    }

    public void setFormTitle(String formTitle) {
        this.formTitle = formTitle;
    }

    public String getFormDescription() {
        return formDescription;
    }

    public void setFormDescription(String formDescription) {
        this.formDescription = formDescription;
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
        return dateTo == "" ? null : DaoHelp.simpleDateFormat(dateTo, "yyyy-MM-dd").substring(0, 10) + " 23:59:59";
    }

    public void setDateTo(String dateTo) {
        this.dateTo = dateTo;
    }


    public String getSystemEnvironment() {
        return systemEnvironment;
    }

    public void setSystemEnvironment(String systemEnvironment) {
        this.systemEnvironment = systemEnvironment;
    }

    public String getChannel() {
        return channel;
    }

    public void setChannel(String channel) {
        this.channel = channel;
    }

    public String getWindows() {
        return windows;
    }

    public void setWindows(String windows) {
        this.windows = windows;
    }

    public String getIos() {
        return ios;
    }

    public void setIos(String ios) {
        this.ios = ios;
    }

    public String getAndroid() {
        return android;
    }

    public void setAndroid(String android) {
        this.android = android;
    }

    public String getWeibo() {
        return weibo;
    }

    public void setWeibo(String weibo) {
        this.weibo = weibo;
    }

    public String getWeixin() {
        return weixin;
    }

    public void setWeixin(String weixin) {
        this.weixin = weixin;
    }

    public String getDefaultFrom() {
        return defaultFrom;
    }

    public void setDefaultFrom(String defaultFrom) {
        this.defaultFrom = defaultFrom;
    }

    public String getQq() {
        return qq;
    }

    public void setQq(String qq) {
        this.qq = qq;
    }

    public String getSelectGroupColDatas() {
        return selectGroupColDatas;
    }

    public void setSelectGroupColDatas(String selectGroupColDatas) {
        this.selectGroupColDatas = selectGroupColDatas;
    }

    public String getSelectCountColDatas() {
        return selectCountColDatas;
    }

    public void setSelectCountColDatas(String selectCountColDatas) {
        this.selectCountColDatas = selectCountColDatas;
    }

    public String getRemark() {
        return remark;
    }

    public void setRemark(String remark) {
        this.remark = remark;
    }

    public String getCreatorName() {
        return creatorName;
    }

    public void setCreatorName(String creatorName) {
        this.creatorName = creatorName;
    }

    public String getRowDataId() {
        return rowDataId;
    }

    public void setRowDataId(String rowDataId) {
        this.rowDataId = rowDataId;
    }

    public String getSub() {
        return sub;
    }

    public void setSub(String sub) {
        this.sub = sub;
    }
}
