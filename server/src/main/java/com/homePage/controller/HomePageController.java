package com.homePage.controller;

import com.auth.entity.CityGeo;
import com.auth.entity.User;
import com.auth.service.UserService;
import com.fasterxml.jackson.core.JsonProcessingException;
import com.homePage.entity.ClickCount;
import com.homePage.service.HomePageService;
import com.projectManage.entity.ShareUrl;
import com.projectManage.service.PMService;
import com.projectManage.service.TempTableService;
import com.utils.Handle;
import net.minidev.json.JSONValue;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.ModelAttribute;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;
import org.springframework.web.servlet.ModelAndView;
import org.springframework.web.servlet.view.RedirectView;

import javax.servlet.http.HttpServletRequest;
import javax.servlet.http.HttpSession;
import java.util.ArrayList;
import java.util.HashMap;
import java.util.List;
import java.util.Map;

/**
 * 首页显示的图表的数据查询的方法
 */

@RestController
@RequestMapping("/homePage")
public class HomePageController {

    @Autowired
    HomePageService hService;

    @Autowired
    UserService userService;

    @Autowired
    PMService pmService;

    @Autowired
    TempTableService tempTableService;

//    //保存图表、快捷入口等的点击率
//    @RequestMapping("/saveClickCount")
//    public String saveClickCount(@ModelAttribute("data")ClickCount cc, String callback) {
//        Handle handle = hService.saveClickCount(cc);
//        return callback + "(" + JSONValue.toJSONString(handle) + ")";
//    }
//
//    //保存头部查询框的点击率
//    @RequestMapping("/saveFilterClickCount")
//    public String saveFilterClickCount(@ModelAttribute("data")ClickCount cc, String callback) {
//        Handle handle = hService.saveFilterClickCount(cc);
//        return callback + "(" + JSONValue.toJSONString(handle) + ")";
//    }
//
//    @RequestMapping("/compareGP")
//    public String compareGP(String userName,String fromDate,String toDate,String callback) {
//        List list = hService.compareGP(userName,fromDate,toDate);
//        return callback + "(" + JSONValue.toJSONString(list) + ")";
//    }


    //首页各项查询
    @RequestMapping("/queryHomeCounts")
    public String queryHomeCounts(String companyCode, String callback) throws JsonProcessingException {
        int contactResult = userService.queryCountContact(companyCode);
        int userResult = userService.queryCountUser(companyCode);
        int pmResult = pmService.queryCountProject(companyCode);
        int tempTableResult = tempTableService.queryCountTempTable(companyCode);

        String concatMapData = userService.queryConcatMapData(companyCode);
        Map map = new HashMap();
        map.put("contactCount",contactResult);
        map.put("userCount",userResult);
        map.put("pmCount",pmResult);
        map.put("tempTableCount",tempTableResult);
        map.put("concatMapData",concatMapData);
        return callback + "(" + JSONValue.toJSONString(map) + ")";
    }

    //查询联系人分布数据
    @RequestMapping("/queryBaiduMapData")
    public String queryHotMapData(String companyCode, HttpServletRequest request, String callback) throws JsonProcessingException {
        HttpSession session = request.getSession();
        User user= (User) session.getAttribute("user");
        companyCode=user.getCompanyCode();
        String concatMapData = userService.queryConcatMapData(companyCode);

        return callback + "(" + JSONValue.toJSONString(new Handle(1, "成功", concatMapData)) + ")";
    }

    @RequestMapping(value = "/jsloadamapjs")
    public ModelAndView dataShare(String id, String url, String img, ModelAndView mo, HttpServletRequest request) {
        HttpSession session = request.getSession();
        User user= (User) session.getAttribute("user");
        if(user==null) {
            mo.setViewName("amapjsno");
        }else{
            mo.setViewName("amapjs");
        }
        return mo;
    }
    @RequestMapping(value = "/amapjs01")
    public RedirectView amapjs01(String id, String url, String img, HttpServletRequest request) {
        //<!--script type="text/javascript" src="https://webapi.amap.com/maps?v=1.4.12&key=cf629ec22ff4167bb4aa47f3a9c8908e"></script-->
        //<!--script-- src="https://webapi.amap.com/maps?v=1.4.12&key=cf629ec22ff4167bb4aa47f3a9c8908e&plugin=AMap.MouseTool,AMap.PolyEditor"></script-->
        //<!--script-- type="text/javascript" src="https://api.map.baidu.com/api?v=3.0&ak=XM2kwob3lF6BAFWWqhSko4WsZ3peM9ia"></script-->
        RedirectView redirectTarget = new RedirectView();
        HttpSession session = request.getSession();
        User user= (User) session.getAttribute("user");
        if(user!=null){
            redirectTarget.setUrl("https://webapi.amap.com/maps?v=1.4.12&key=cf629ec22ff4167bb4aa47f3a9c8908e");
        }else{
            //redirectTarget.setContextRelative(true);
            redirectTarget.setUrl("pmapi/homePage/jsloadamapjs");
        }


        return redirectTarget;
    }
    @RequestMapping(value = "/amapjs02")
    public RedirectView amapjs02(String id, String url, String img, HttpServletRequest request) {

        RedirectView redirectTarget = new RedirectView();
        HttpSession session = request.getSession();
        User user= (User) session.getAttribute("user");
        if(user!=null){
            redirectTarget.setUrl("https://webapi.amap.com/maps?v=1.4.12&key=cf629ec22ff4167bb4aa47f3a9c8908e&plugin=AMap.MouseTool,AMap.PolyEditor");
        }else{
            redirectTarget.setContextRelative(true);
            redirectTarget.setUrl("jsloadamapjs");
        }
        return redirectTarget;
    }

    @RequestMapping(value = "/amapjs03")
    public RedirectView amapjs03(String id, String url, String img, HttpServletRequest request) {

        RedirectView redirectTarget = new RedirectView();
        HttpSession session = request.getSession();
        User user= (User) session.getAttribute("user");
        if(user!=null){
            redirectTarget.setUrl("https://api.map.baidu.com/api?v=3.0&ak=XM2kwob3lF6BAFWWqhSko4WsZ3peM9ia");
        }else{
            redirectTarget.setContextRelative(true);
            redirectTarget.setUrl("jsloadamapjs");
        }
        return redirectTarget;
    }


}
