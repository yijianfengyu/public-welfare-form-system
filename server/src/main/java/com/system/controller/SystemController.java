package com.system.controller;

import com.auth.entity.User;
import com.projectManage.entity.Daily;
import com.system.service.SystemService;
import net.minidev.json.JSONValue;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.CrossOrigin;
import org.springframework.web.bind.annotation.ModelAttribute;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import javax.servlet.http.HttpServletRequest;
import javax.servlet.http.HttpSession;
import java.util.List;
import java.util.Map;

@RestController
@CrossOrigin
@RequestMapping("/sys")
public class SystemController {
    @Autowired
    SystemService service;
    @RequestMapping("/getSelectOptions")
    public String getSelectOptions( Integer id,String callback) {
        List<Map<String,Object>>  list = service.getSelectOptions(id);
        return callback + "(" + JSONValue.toJSONString(list) + ")";
    }

    @RequestMapping("/getRegionList")
    public String getRegionList( String address,String callback) {
        List<Map<String,Object>>  list = service.getRegionList(address);
        return callback + "(" + JSONValue.toJSONString(list) + ")";
    }
}
