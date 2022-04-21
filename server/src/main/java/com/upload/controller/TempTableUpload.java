package com.upload.controller;


import com.utils.Handle;
import net.minidev.json.JSONValue;
import org.apache.commons.lang3.StringUtils;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.web.bind.annotation.CrossOrigin;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;
import org.springframework.web.multipart.MultipartFile;

import java.io.File;
import java.io.FileOutputStream;
import java.text.SimpleDateFormat;
import java.util.Date;

/**
 * Created by dragon_eight on 2018/7/31.
 */
@RestController
@CrossOrigin
@RequestMapping("/upload")
public class TempTableUpload {

    @Value("${web.upload-path}")
    String uploadpath;
    @Value("${web.img-path}")
    String uploadimgpath;
    @Value("${web.file-path}")
    String filePath;

    //文件上传
    @RequestMapping("/uploadTempFile")
    public String uploadTempTableFile(MultipartFile file, String callback){
        SimpleDateFormat df = new SimpleDateFormat("yyyyMMddHHmmssSSS");
        String fileName = file.getOriginalFilename();
        String intNumber = fileName.substring(0, fileName.indexOf("."));
        String extensionName = org.apache.commons.lang3.StringUtils.substringAfter(fileName, ".");
        String newFileName = intNumber + "_" + df.format(new Date()) + "." + extensionName;
        try {
            byte[] file2 = file.getBytes();
            File targetFile = new File(filePath);
            if (!targetFile.exists()) {
                targetFile.mkdirs();
            }
            FileOutputStream out = new FileOutputStream(filePath + newFileName);
            out.write(file2);
            out.flush();
            out.close();

        } catch (Exception e) {
            System.out.println("错误：" + e.getMessage());
        }
        System.out.println(newFileName);
        //返回json
        return JSONValue.toJSONString(newFileName);
    }

    //图片上传
    @RequestMapping("/uploadTempPictures")
    public String uploadTempPictures(MultipartFile file){
        SimpleDateFormat df = new SimpleDateFormat("yyyyMMddHHmmssSSS");
        String fileName = file.getOriginalFilename();
        String intNumber = fileName.substring(0, fileName.indexOf("."));
        String extensionName = org.apache.commons.lang3.StringUtils.substringAfter(fileName, ".");
        String newFileName = intNumber + "_" + df.format(new Date()) + "." + extensionName;
        try {
            byte[] file2 = file.getBytes();
            File targetFile = new File(filePath);
            if (!targetFile.exists()) {
                targetFile.mkdirs();
            }
            FileOutputStream out = new FileOutputStream(filePath + newFileName);
            out.write(file2);
            out.flush();
            out.close();

        } catch (Exception e) {
            System.out.println("错误：" + e.getMessage());
        }
        System.out.println(newFileName);
        //返回json
        return JSONValue.toJSONString(newFileName);
    }
}
