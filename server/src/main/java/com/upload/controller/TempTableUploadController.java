package com.upload.controller;

import com.auth.entity.User;
import com.projectManage.entity.Template;
import com.projectManage.entity.TemplateTableRow;
import com.projectManage.service.TempTableService;
import com.upload.service.TempTableUploadService;
import com.utils.*;
import net.minidev.json.JSONValue;
import org.apache.commons.lang3.StringUtils;
import org.apache.poi.hssf.usermodel.*;
import org.apache.poi.ss.usermodel.Row;
import org.apache.poi.ss.util.CellRangeAddress;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.multipart.MultipartFile;

import javax.servlet.http.HttpServletRequest;
import javax.servlet.http.HttpServletResponse;
import javax.servlet.http.HttpSession;
import java.io.*;
import java.text.SimpleDateFormat;
import java.util.*;

/**
 * Created by dragon_eight on 2018/9/20.
 */
@RestController
@CrossOrigin
@RequestMapping("/temp")
public class TempTableUploadController {

    @Autowired
    private TempTableService tts;

    @Autowired
    TempTableUploadService ttus;

    @Value("${web.excel-path}")
    String excelpath;

    @RequestMapping("/importExcelTempTable")
    @ResponseBody
    public String importExcelTempTable(MultipartFile file, @ModelAttribute("data") TemplateTableRow td, String columns, HttpServletResponse response, HttpServletRequest request) {
//        response.setHeader("Access-Control-Allow-Origin", "*");
        if (file.isEmpty()) {
            return JSONValue.toJSONString(new Handle(0, "导入失败，请检查重试"));
        }
        String fileName = file.getOriginalFilename();
        SimpleDateFormat df = new SimpleDateFormat("yyyyMMddHHmmssSSS");
        String intNumber = fileName.substring(0, fileName.indexOf("."));
        String extensionName = StringUtils.substringAfter(fileName, ".");
        String newFileName = intNumber + "_" + df.format(new Date()) + "." + extensionName;
        File dest = new File(excelpath + newFileName);
        if (!dest.getParentFile().exists()) { //判断文件父目录是否存在
            dest.getParentFile().mkdir();
        }

        HttpSession session = request.getSession();
        User user = (User) session.getAttribute("user");
        try {
            file.transferTo(dest); //保存文件
            Handle handle = importExcel(dest, td, columns, user);
            return JSONValue.toJSONString(handle);
        } catch (IllegalStateException e) {
            e.printStackTrace();
            return JSONValue.toJSONString(new Handle(0, "导入失败，请检查重试"));
        } catch (IOException e) {
            e.printStackTrace();
            return JSONValue.toJSONString(new Handle(0, "导入失败，请检查重试"));
        }
    }

    @RequestMapping("/importExcelTempWithData")
    @ResponseBody
    public String importExcelTempWithData(MultipartFile file, @ModelAttribute("data") TemplateTableRow td, String columns, HttpServletResponse response, HttpServletRequest request) {
//        response.setHeader("Access-Control-Allow-Origin", "*");
        if (file.isEmpty()) {
            return JSONValue.toJSONString(new Handle(0, "导入失败，请检查重试"));
        }
        String fileName = file.getOriginalFilename();
        SimpleDateFormat df = new SimpleDateFormat("yyyyMMddHHmmssSSS");
        String intNumber = fileName.substring(0, fileName.indexOf("."));
        String extensionName = StringUtils.substringAfter(fileName, ".");
        String newFileName = intNumber + "_" + df.format(new Date()) + "." + extensionName;
        File dest = new File(excelpath + newFileName);
        if (!dest.getParentFile().exists()) { //判断文件父目录是否存在
            dest.getParentFile().mkdir();
        }

        HttpSession session = request.getSession();
        User user= (User) session.getAttribute("user");
        TemplateTableRow templateTableRow = new TemplateTableRow();
        Template template = new Template();
        template.setFormTitle(intNumber);
        template.setCompanyCode(user.getCompanyCode());
        template.setUsableRange("1");
        template.setViewPeople("All");
        template.setFormDescription("<p></p>");
        int tempId = 0;
        try {
            file.transferTo(dest); //保存文件
            String define = TablesUtil.setTempDefine(dest);
            if (define == null){
                return JSONValue.toJSONString(new Handle(0, "导入失败，请检查重试"));
            }
            template.setDefine(define);
            tempId=tts.createTempTable(template,user);
            if ("0".equals(tempId) || tempId == 0){
                return JSONValue.toJSONString(new Handle(0, "导入失败，请检查重试"));
            }
            td.setDefine_id(String.valueOf(tempId));

            Handle handle = importExcel(dest, td, columns, user);
            return JSONValue.toJSONString(handle);
        } catch (IllegalStateException e) {
            e.printStackTrace();
            return JSONValue.toJSONString(new Handle(0, "导入失败，请检查重试"));
        } catch (IOException e) {
            e.printStackTrace();
            return JSONValue.toJSONString(new Handle(0, "导入失败，请检查重试"));
        }
    }

    public Handle importExcel(File file, TemplateTableRow td, String columns, User user) {

        List listMap = new ArrayList();
        try {
            HSSFWorkbook book = new HSSFWorkbook(new FileInputStream(file));
            HSSFSheet sheet = book.getSheetAt(0);
            //columnIndex所属的列隐藏
            int rowNum = sheet.getPhysicalNumberOfRows();
            Row row1 = null;
            int sum = 1;
            //查找所有隐藏的行
            for (int i = 0; i < rowNum; i++) {
                row1 = sheet.getRow(i);
                //最关键的一句判断行隐藏row.getZeroHeight(),返回的是boolean类型
                if (row1.getZeroHeight() == true) {
                    sum = i + 1;
                }
            }

            int nums = 0;
            int tempNums = sheet.getRow(0).getLastCellNum()>25?25:sheet.getRow(0).getLastCellNum();//col_data字段最多25列
            String col = "col_data";
            if (sheet.getLastRowNum() > 5000) {
                nums = 5000 + sum;
            } else {
                nums = sheet.getLastRowNum();
            }
            List<CellRangeAddress> cellRangeAddressList = FileUtil.getCombineCell(sheet);

            for (int i = sum; i <= nums; i++) {
                HSSFRow row = sheet.getRow(i);
                if (null != row) {
                    Map<String, Object> tempMap = new HashMap<String, Object>();
                    for (int k = 0; k < tempNums; k++) {
                        HSSFCell cell = row.getCell(k);
                        if (null != cell) {
                            String comCell = FileUtil.isCombineCell(cellRangeAddressList,cell,sheet);
                            if ("".equals(comCell) || comCell == null){
                                tempMap.put(col + (k + 1), CommonUtils.filterOffUtf8Mb4(FileUtil.getCellValue(cell)));
                            }else{
                                tempMap.put(col + (k + 1), CommonUtils.filterOffUtf8Mb4(comCell));
                            }
                        } else {
                            tempMap.put(col + (k + 1), "");
                        }
                    }
                    if (tempMap.size() > 0) {
                        listMap.add(tempMap);
                    }
                }
            }
        } catch (Exception e) {
            LoggerUtil.errorOut(e.getMessage());
        }

        int counts = tts.createTempData(listMap, td, columns, user);
        if (counts > 0) {
            if (listMap.size() > 5000) {
                return new Handle(1, "Excel中数据超过了5000条，仅导入前5000条数据");
            } else {
                return new Handle(1, "导入成功");
            }
        } else {
            return new Handle(0, "导入失败，请检查重试");
        }
    }


    //下载表单模板文件
    @RequestMapping("/onTempTableExcelModel")
    public String onTempTableExcelModel(String columns, String callback) {
        String url = "";
        try {
            url = ttus.onTempTableExcelModel(columns);
            System.out.println("columns" + columns);
        } catch (Exception e) {
            e.printStackTrace();
        }
        List list = new ArrayList<String>();
        list.add(url);
        return callback + "(" + JSONValue.toJSONString(list) + ")";
    }

    //下载表单数据
    @RequestMapping("/downFromDataExcel")
    public String downFromDataExcel(String columns,String define , String callback) {
        String url = "";
        try {
//            System.out.println("columns" + columns);
            url=ttus.downFromDataExcel(columns,define);
        } catch (Exception e) {
            e.printStackTrace();
        }
        List list = new ArrayList<String>();
        list.add(url);
        return callback + "(" + JSONValue.toJSONString(list) + ")";
    }
}
