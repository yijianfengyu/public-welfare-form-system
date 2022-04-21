package com.projectManage.controller;

import com.auth.entity.User;
import com.projectManage.entity.ProjectResource;
import com.projectManage.service.ResourceService;
import com.utils.Handle;
import com.utils.Page;
import net.minidev.json.JSONValue;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.CrossOrigin;
import org.springframework.web.bind.annotation.ModelAttribute;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import javax.servlet.http.HttpServletRequest;
import javax.servlet.http.HttpSession;

@RestController
@CrossOrigin
@RequestMapping("/resource")
public class ResourceController {
    @Autowired
    ResourceService service;
    @RequestMapping(value = "/queryHistoryResources")
    public String queryProjectHistoryResources(@ModelAttribute("data") ProjectResource e, String callback) {
        Page page = service.queryHistoryResources(e);
        return callback + "(" + JSONValue.toJSONString(page) + ")";
    }

    @RequestMapping("/uploadResource")
    public String addResource(@ModelAttribute("data") ProjectResource resource, HttpServletRequest request, String callback) {
        HttpSession session = request.getSession();
        User user = (User) session.getAttribute("user");
        Handle handle = service.uploadResource(resource, user);
        return callback + "(" + JSONValue.toJSONString(handle) + ")";
    }

    @RequestMapping("/updateResource")
    public String updateResource(@ModelAttribute("data") ProjectResource resource, HttpServletRequest request, String callback) {
        HttpSession session = request.getSession();
        User user = (User) session.getAttribute("user");
        Handle handle = service.updateResource(resource, user);
        return callback + "(" + JSONValue.toJSONString(handle) + ")";
    }

    @RequestMapping("/deleteResource")
    public String deleteResource(@ModelAttribute("data") ProjectResource resource, HttpServletRequest request, String callback) {
        service.deleteResource(resource);
        return callback + "(" + JSONValue.toJSONString("") + ")";
    }
}
