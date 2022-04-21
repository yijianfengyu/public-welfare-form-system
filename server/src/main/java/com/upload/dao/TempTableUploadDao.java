package com.upload.dao;

import com.common.jdbc.JdbcBase;
import com.projectManage.entity.Template;
import com.projectManage.entity.TemplateTableRow;
import com.utils.CommonUtils;
import com.utils.Page;
import com.utils.TablesUtil;
import net.sf.json.JSONArray;
import net.sf.json.JSONObject;
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
import java.util.*;

/**
 * Created by dragon_eight on 2018/9/20.
 */
@Repository
public class TempTableUploadDao extends JdbcBase {

    @Value("${web.upload-path}")
    String path;

    //下载表单数据
    public String downFromDataExcel(String columns, String define) throws Exception {
        String getFileName = CommonUtils.getFileName();
        String destFileName = "TempTableData_" + getFileName + ".xls";
        String url = path + "/" + destFileName;
        FileOutputStream out = null;
        TemplateTableRow templateTableRow = new TemplateTableRow();
        templateTableRow.setDefine(define);
        Page page = this.queryAllTempData(templateTableRow);
        try {
            // excel对象
            HSSFWorkbook wb = new HSSFWorkbook();
            // sheet对象
            HSSFSheet sheet = wb.createSheet("sheet1");
            //设置表头
            HSSFRow row = sheet.createRow(0);
            JSONObject jasonObject = JSONObject.fromObject(columns);
            Map<String, Object> map = jasonObject;
            Map<String, Object> mapData = jasonObject;
            JSONArray jsonArray = JSONArray.fromObject(map.get("columns"));
            String[] headStrings = new String[jsonArray.size()];
            String[] headKeys = new String[jsonArray.size()];
            for (int i = 0; i < jsonArray.size(); i++) {
                Object obj = jsonArray.get(i);
                if (obj instanceof JSONObject) {
                    JSONObject schemaArr = (JSONObject) obj;
                    if (schemaArr.getString("dataIndex").equals("Operation")) {
                        continue;
                    } else {
                        headStrings[i] = schemaArr.getString("title");
                        headKeys[i] = schemaArr.getString("dataIndex");
                    }
                }
            }
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
                if(headStrings[i]!=null){
                    sheet.setColumnWidth(i, (headStrings[i].getBytes().length+4) * 256);
                }
                HSSFCell cell = row.createCell(i);
                cell.setCellValue(headStrings[i]);
                cell.setCellStyle(style);

            }
            //设置数据
            Row row1 = null;

            List<Map<String, Object>> listDatas = (ArrayList<Map<String, Object>>) page.getResultList();
            for (int j = 0; j < listDatas.size(); j++) {
                Map<String, Object> maps = listDatas.get(j);
                row1 = sheet.createRow(j+1);
                for (int h = 0; h < headKeys.length; h++) {
                    Cell cells = row1.createCell(h);
                   if(maps.get(headKeys[h])!= null&&!"".equals(maps.get(headKeys[h]))){
                       String txtcontent = String.valueOf(maps.get(headKeys[h])).replaceAll("</?[^>]+>", ""); //剔出<html>的标签
                       txtcontent = txtcontent.replaceAll("<a>\\s*|\t|\r|\n</a>", "");
                       if(txtcontent.indexOf("{")!=-1&&txtcontent.indexOf("province")!=-1){
                           //{"province":"山西省","city":"大同市","county":"南郊区"}
                           System.out.println(txtcontent);
                           JSONObject pc = JSONObject.fromObject(txtcontent);
                           String province =pc.has("province")?pc.getString("province"):"";
                           String city =pc.has("city")?pc.getString("city"):"";
                           String county =pc.has("county")?pc.getString("county"):"";
                           String others =pc.has("others")?pc.getString("others"):"";
                           txtcontent=province+" "+city+" "+county+" "+others;
                       }
                       cells.setCellValue(txtcontent);
                    }
                }
            }
            // 输出excel
            // 输出excel对象
            out = new FileOutputStream(url);
            wb.write(out);
            out.close();

//            System.out.println("在D盘成功生成了excel，请去查看:" + url);
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

    public Page queryAllTempData(TemplateTableRow templateTableRow) {
        net.sf.json.JSONObject jsonObject = net.sf.json.JSONObject.fromObject(templateTableRow.getDefine());
        String define_id=TablesUtil.parseDefineId(jsonObject);
        Template temp = this.queryTempTableById(Long.valueOf(define_id));
        Map queryMap = TablesUtil.parseQuerySql(jsonObject,"query",temp.getTableName());
        String sql = queryMap.get("sql") + "";

        Page page = new Page();

        temp.setDefine(templateTableRow.getDefine());
        page.setTemp(temp);
        List paramsList = (List) queryMap.get("listSqlWhere");
        page.setResultList(this.getJdbcTemplate().queryForList(sql, paramsList.toArray(new Object[paramsList.size()])));
        return page;
    }

    public Template queryTempTableById(Long id) {
        String sql = "SELECT id, dateCreated,companyCode, creator, formTitle, define, formDescription, MODIFIER, dateUpdated, usableRange,sub, (CASE WHEN (SELECT COUNT(*) FROM project_define_data pdd WHERE pdd.define_id = pd.id) > 0 THEN 'true' WHEN (SELECT COUNT(*) FROM project_define_data pdd WHERE pdd.define_id=pd.id) = 0 THEN 'false' END)AS dataCounts FROM project_define pd where id = ?";
        List<Template> list = this.getJdbcTemplate().query(sql, new Object[]{id}, new BeanPropertyRowMapper<Template>(Template.class));
        if (list.size() > 0) {
            return list.get(0);
        } else {
            return null;
        }
    }

    public String onTempTableExcelModel(String columns) throws Exception {

        String getFileName = CommonUtils.getFileName();
        String destFileName = "TempTableModel_" + getFileName + ".xls";
        String url = path + "/" + destFileName;
        FileOutputStream out = null;
        try {
            // excel对象
            HSSFWorkbook wb = new HSSFWorkbook();
            // sheet对象
            HSSFSheet sheet = wb.createSheet("sheet1");

            //设置表头
            HSSFRow row = sheet.createRow(0);

            //设置下拉框选项
//            String[] headStrings = {"姓名(必填)", "邮箱(必填)","手机号(必填)","机构名称","单位职务","负责人","单位电话","身份证","性别","地址","省份","出生日期","描述","邮编","QQ","微信","备用手机","备用邮箱","所在部门","编号","传真"};
//            HSSFDataValidation currency = ExcelFactory.setBoxs(settingDao.getOptionForExcel("currency").split(","),6,6);
//            HSSFDataValidation ownerCode = ExcelFactory.setBoxs(settingDao.getCompanyCodeForExcel().split(","),7,7);
//            HSSFDataValidation LEVEL = ExcelFactory.setBoxs( settingDao.getOptionForExcel("goodsLevel").split(","),10,10);

//            {"columns":[
//            {"title":"签到人数","dataIndex":"col_data2","key":"col_data2","type":"Number","width":"150px"},
//            {"title":"报名人数","dataIndex":"col_data1","key":"col_data1","type":"Number","width":"150px"},
//            {"title":"手机号","dataIndex":"col_data3","key":"col_data3","type":"Text","width":"150px"}]}
            JSONObject jasonObject = JSONObject.fromObject(columns);
            Map<String, Object> map = jasonObject;
//            Map map1 = new HashMap();
            JSONArray jsonArray = JSONArray.fromObject(map.get("columns"));
            String[] headStrings = new String[jsonArray.size()];
            for (int i = 0; i < jsonArray.size(); i++) {
                Object obj = jsonArray.get(i);
                if (obj instanceof JSONObject) {
                    JSONObject schemaArr = (JSONObject) obj;
//                  map1.put(schemaArr.getString("key"),schemaArr.getString("title"));
                    headStrings[i] = schemaArr.getString("title");
                }
            }
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
                sheet.setColumnWidth(i, headStrings[i].getBytes().length * 256); //sheet.autoSizeColumn(i);//宽度自适应
                HSSFCell cell = row.createCell(i);
                cell.setCellValue(headStrings[i]);
                cell.setCellStyle(style);

            }

//            sheet.addValidationData(currency);
//            sheet.addValidationData(ownerCode);
//            sheet.addValidationData(LEVEL);

            // 输出excel
            // 输出excel对象
            out = new FileOutputStream(url);
            wb.write(out);
            out.close();

            System.out.println("在D盘成功生成了excel，请去查看:" + url);
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

}
