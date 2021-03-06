package com.upload.controller;

import com.auth.entity.User;
import com.upload.entity.ContactUpload;
import com.upload.service.ContactUploadService;
import com.upload.service.FileUtil;
import com.utils.Handle;
import net.minidev.json.JSONValue;
import org.apache.commons.lang3.StringUtils;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.web.bind.annotation.CrossOrigin;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.ResponseBody;
import org.springframework.web.bind.annotation.RestController;
import org.springframework.web.multipart.MultipartFile;

import javax.servlet.http.HttpServletRequest;
import javax.servlet.http.HttpServletResponse;
import javax.servlet.http.HttpSession;
import java.io.File;
import java.io.IOException;
import java.text.SimpleDateFormat;
import java.util.ArrayList;
import java.util.Date;
import java.util.List;

/**
 * Created by dragon_eight on 2018/9/11.
 */
@RestController
@CrossOrigin
@RequestMapping("/ContactUpload")
public class ContactUploadController {
    @Autowired
    private FileUtil fileUtil;

    @Autowired
    private ContactUploadService cus;

    @Value("${web.excel-path}")
    String excelpath;

    @RequestMapping("/importExcelContact")
    @ResponseBody
    public String importExcelContact(MultipartFile file, HttpServletResponse response, HttpServletRequest request) {
//        response.setHeader("Access-Control-Allow-Origin", "*");
//        response.setHeader("Access-Control-Allow-Methods", "POST, GET, OPTIONS, DELETE");
//        response.setHeader("Access-Control-Allow-Headers", "x-requested-with");
//        response.setHeader("Access-Control-Allow-Credentials","true");
//        System.out.println("method:"+request.getMethod());
        HttpSession session = request.getSession();
        User user= (User) session.getAttribute("user");
        if (file.isEmpty()) {
            return "false";
        }
        String fileName = file.getOriginalFilename();
        SimpleDateFormat df = new SimpleDateFormat("yyyyMMddHHmmssSSS");
        String intNumber = fileName.substring(0, fileName.indexOf("."));
        String extensionName = StringUtils.substringAfter(fileName, ".");
        String newFileName = intNumber + "_" + df.format(new Date()) + "." + extensionName;
        File dest = new File(excelpath + newFileName);
        if (!dest.getParentFile().exists()) { //?????????????????????????????????
            dest.getParentFile().mkdir();
        }
        try {
            file.transferTo(dest); //????????????
            Handle handle = importExcel(dest, user.getCompanyCode());
            return JSONValue.toJSONString(handle);
        } catch (IllegalStateException e) {
            e.printStackTrace();
            return "false";
        } catch (IOException e) {
            e.printStackTrace();
            return "false";
        }
    }

    public Handle importExcel(File file, String companyCode) {
        //??????excel
        List<ContactUpload> personList = fileUtil.importExcel(file, 0, 1, ContactUpload.class);
//        ??????????????????????????????
        String repeatNames = "";
        //excel??????????????????
        int sum = 0;
        List<ContactUpload> list = new ArrayList<>();
        if (personList.size() > 5000) {
            sum = 5000;
        } else {
            sum = personList.size();
        }

        if (personList.size() > 0) {
            for (int i = 0; i <= personList.size() - 1; i++) {
                ContactUpload contactUpload = personList.get(i);
                if (contactUpload.getName() != "" && contactUpload.getEmail() != "" && contactUpload.getTel() != "") {
                    int upload = cus.insertContactUpload(contactUpload, companyCode);
                    if (upload == 0) {
                        repeatNames += contactUpload.getName() + ",";
                    }
                }
            }
            System.out.println(repeatNames);
            if (!"".equals(repeatNames)) {
                return new Handle(1, "Excel???????????????" + sum + "???????????????" + (sum - (repeatNames.split(",").length)) + "????????????" + repeatNames + "??????????????????????????????");
            } else {
                if (list.size() > 5000) {
                    return new Handle(1, "Excel??????????????????5000??????????????????5000?????????");
                } else {
                    return new Handle(1, "Excel???????????????" + sum + "???????????????" + sum + "?????????");
                }
            }
        } else {
            return new Handle(0, "?????????????????????");
        }
    }

    //???????????????????????????
    @RequestMapping("/onContactExcelModel")
    public String onContactExcelModel(String callback) {
        String url = "";
        try {
            url = cus.onContactExcelModel();
        } catch (Exception e) {
            e.printStackTrace();
        }
        List list = new ArrayList<String>();
        list.add(url);
        return callback + "(" + JSONValue.toJSONString(list) + ")";
    }



}
