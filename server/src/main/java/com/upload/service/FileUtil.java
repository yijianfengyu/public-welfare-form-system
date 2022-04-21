package com.upload.service;

import cn.afterturn.easypoi.excel.ExcelImportUtil;
import cn.afterturn.easypoi.excel.entity.ImportParams;
import org.springframework.stereotype.Service;
import java.io.File;
import java.util.List;
import java.util.NoSuchElementException;
@Service
public class FileUtil {
public static <T> List<T> importExcelq(File filePath,Integer titleRows,Integer headerRows,Integer startSheetIndex, Class<T> pojoClass){
    if (filePath==null){
        return null;
    }
    ImportParams params = new ImportParams();
    params.setTitleRows(titleRows);
    params.setHeadRows(headerRows);
    params.setStartSheetIndex(startSheetIndex);
    List<T> list = null;
    try {
        list = ExcelImportUtil.importExcel(filePath,  pojoClass, params);
    }catch (NoSuchElementException e){
        System.out.println("模板不能为空");
    } catch (Exception e) {
        e.printStackTrace();
        System.out.println(e.getMessage());
    }
    return list;
}
    public static <T> List<T> importExcel(File filePath,Integer titleRows,Integer headerRows, Class<T> pojoClass){
        if (filePath==null){
            return null;
        }
        ImportParams params = new ImportParams();
        params.setTitleRows(titleRows);
        params.setHeadRows(headerRows);
        List<T> list = null;
        try {
            list = ExcelImportUtil.importExcel(filePath,  pojoClass, params);
        }catch (NoSuchElementException e){
            System.out.println("模板不能为空");
        } catch (Exception e) {
            e.printStackTrace();
            System.out.println(e.getMessage());
        }
        return list;
    }
}
