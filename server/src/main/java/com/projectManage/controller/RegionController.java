package com.projectManage.controller;

import com.projectManage.entity.ExamQuestion;
import com.projectManage.entity.ProjectResource;
import com.projectManage.entity.Region;
import com.projectManage.service.RegionService;
import com.projectManage.service.ResourceService;
import com.utils.Handle;
import com.utils.Page;
import net.minidev.json.JSONValue;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.CrossOrigin;
import org.springframework.web.bind.annotation.ModelAttribute;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import java.sql.SQLException;

@RestController
@CrossOrigin
@RequestMapping("/region")
public class RegionController {
    @Autowired
    RegionService service;
    @RequestMapping(value = "/queryRegion")
    public String queryList(@ModelAttribute("data") Region e, String callback) {
        Page page = service.queryRegion(e);
        return callback + "(" + JSONValue.toJSONString(page) + ")";
    }

    @RequestMapping(value = "/updateRegion")
    public String updateRegion(@ModelAttribute("data") Region e, String callback) throws SQLException {

         if(e.getFlag()==1){
             //新增
             boolean flag=service.exitsId(e.getId());
             if(!flag){
                 int result= service.updateRegion(e);
                 return callback + "(" + JSONValue.toJSONString(new Handle(1, "success", result)) + ")";
             }else{
                 return callback + "(" + JSONValue.toJSONString(new Handle(0, "更新失败，ID已经在系统存在", null)) + ")";
             }

         }else{
             if(null!=e.getId()&&!e.getId().equals(e.getOldId())){
                 boolean flag=service.exitsId(e.getId());
                 if(!flag){
                     int result= service.updateRegion(e);
                     return callback + "(" + JSONValue.toJSONString(new Handle(1, "success", result)) + ")";
                 } else{
                     return callback + "(" + JSONValue.toJSONString(new Handle(0, "更新失败，ID已经在系统存在", null)) + ")";
                 }
             }else{
                 int result= service.updateRegion(e);
                 return callback + "(" + JSONValue.toJSONString(new Handle(1, "success", result)) + ")";
             }

         }

    }

    @RequestMapping(value = "/deleteRegion")
    public String deleteRegion(@ModelAttribute("data") Region e, String callback) {
        int result= service.deleteRegion(e);
        return callback + "(" + JSONValue.toJSONString(new Handle(1, "success", result)) + ")";
    }

}
