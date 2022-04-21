package com.upload.dao;

import com.common.jdbc.JdbcBase;
import com.upload.entity.ContactUpload;
import org.apache.poi.hssf.usermodel.*;
import org.apache.poi.ss.usermodel.CellStyle;
import org.apache.poi.ss.usermodel.Font;
import org.apache.poi.ss.usermodel.IndexedColors;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.stereotype.Repository;

import java.io.FileNotFoundException;
import java.io.FileOutputStream;
import java.io.IOException;

/**
 * Created by dragon_eight on 2018/9/11.
 */
@Repository
public class ContactUploadDao extends JdbcBase {

    @Value("${web.upload-path}")
    String path;

    public int insertContactUpload(ContactUpload contact,String companyCode){

        String sql = "INSERT INTO contact (NAME, email, tel, birthdate, sex, identityCard, secondPhone, secondaryEmail, qq, wechat, description, address, province, department, fax, organizationNames, postcode, principal, serialNumber, unitPosition, workTelephone, createDate, updateDate, STATUS, companyCode)" +
                "VALUES(?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,NOW(),NOW(),?,?)  ";

        String status = "ACTIVE";

        int result = this.getJdbcTemplate().update(
                sql,
                new Object[]{contact.getName(),contact.getEmail(),contact.getTel(),contact.getBirthdate(),contact.getSex(),contact.getIdentityCard(),contact.getSecondPhone(),contact.getSecondaryEmail(),contact.getQq(),contact.getWechat(),contact.getDescription(),contact.getAddress(),contact.getProvince(),contact.getDepartment(),contact.getFax(),contact.getOrganizationNames(),contact.getPostcode(),contact.getPrincipalName(),contact.getSerialNumber(),contact.getUnitPosition(),contact.getWorkTelephone(),status,companyCode});

        return result;
    }

    public String onContactExcelModel() throws Exception {
        String destFileName = "ContactModel.xls";
        String url = path+"/"+destFileName;
        FileOutputStream out = null;
        try {
            // excel对象
            HSSFWorkbook wb = new HSSFWorkbook();
            // sheet对象
            HSSFSheet sheet = wb.createSheet("sheet1");

            //设置表头
            HSSFRow row=sheet.createRow(0);

            //设置下拉框选项
            String[] headStrings = {"姓名(必填)", "邮箱(必填)","手机号(必填)","机构名称","单位职务","负责人","单位电话","身份证","性别","地址","省份","出生日期","描述","邮编","QQ","微信","备用手机","备用邮箱","所在部门","编号","传真"};
//            HSSFDataValidation currency = ExcelFactory.setBoxs(settingDao.getOptionForExcel("currency").split(","),6,6);
//            HSSFDataValidation ownerCode = ExcelFactory.setBoxs(settingDao.getCompanyCodeForExcel().split(","),7,7);
//            HSSFDataValidation LEVEL = ExcelFactory.setBoxs( settingDao.getOptionForExcel("goodsLevel").split(","),10,10);

            for(int i=0;i<headStrings.length;i++){
                CellStyle style = wb.createCellStyle();
                // 给单元格设置背景颜色
                style.setFillForegroundColor(IndexedColors.YELLOW.getIndex());

                //设置单元格样式
                Font font = wb.createFont();
                font.setFontName("宋体");
                font.setBold(true);
                font.setFontHeightInPoints((short)12);
                style.setFont(font);
                sheet.setColumnWidth(i,headStrings[i].getBytes().length*256); //sheet.autoSizeColumn(i);//宽度自适应
                HSSFCell cell=row.createCell(i);
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

            System.out.println("在D盘成功生成了excel，请去查看:"+url);
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
