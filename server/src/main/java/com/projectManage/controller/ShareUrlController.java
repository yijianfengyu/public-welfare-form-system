package com.projectManage.controller;

import com.auth.entity.User;
import com.projectManage.entity.ShareUrl;
import com.projectManage.service.ShareUrlService;
import net.minidev.json.JSONValue;
import com.utils.Handle;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.CrossOrigin;
import org.springframework.web.bind.annotation.ModelAttribute;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;
import org.springframework.web.servlet.ModelAndView;

import javax.servlet.http.HttpServletRequest;
import javax.servlet.http.HttpSession;
import java.util.List;
import java.util.Map;

@RestController
@CrossOrigin
@RequestMapping("/shareUrl")
public class ShareUrlController {
    @Autowired
    ShareUrlService shareUrlService;

    /**
     * 添加分享链接表
     *
     * @param su
     * @param callback
     * @return
     */
    @RequestMapping(value = "/createShareUrl")
    public String createShareUrl(@ModelAttribute("data") ShareUrl su, String callback) {
        Handle handle = shareUrlService.createShareUrl(su);
        return callback + "(" + JSONValue.toJSONString(handle) + ")";
    }

    /**
     * 修改是否显示表头
     *
     * @param su
     * @param callback
     * @return
     */
    @RequestMapping(value = "/updateIsConditions")
    public String updateIsConditions(@ModelAttribute("data") ShareUrl su, String callback) {
        if (shareUrlService.updateShareUrl(su) > 0) {
            return callback + "(" + JSONValue.toJSONString(new Handle(1, "保存成功")) + ")";
        } else {
            return callback + "(" + JSONValue.toJSONString(new Handle(0, "保存失败")) + ")";
        }
    }

    @RequestMapping(value = "/dataShare")
    public ModelAndView dataShare(String id,String url,String img, ModelAndView mo,HttpServletRequest request) {
        ShareUrl shareUrl = shareUrlService.selectShareUrl(id);
        String setShareUrl="";
        //if(shareUrl.getSrcUrl()!=null){
         //   setShareUrl=url+"/visit/shareData?define="+shareUrl.getSrcUrl() + "&checked="+shareUrl.getIsConditions()+ "&shareTitle=" + shareUrl.getShareTitle() + "&isIoseEfficacy=" + shareUrl.getIsIoseEfficacy();
        //}else{
            setShareUrl=url+"/visit/shareData?define_id="+shareUrl.getDefineId() + "&checked="+shareUrl.getIsConditions()+ "&shareTitle=" + shareUrl.getShareTitle() + "&isIoseEfficacy=" + shareUrl.getIsIoseEfficacy();
        //}
        String imgUrl= request.getScheme()+"://"+request.getServerName()+":"+request.getServerPort()+request.getContextPath()+"/"+img;
        shareUrl.setSrcUrl(setShareUrl);
        String shareTitle;
        if(shareUrl.getShareTitle()!=null&&"".equals(shareUrl.getShareTitle())){
            shareTitle=shareUrl.getShareTitle();
        }else{
            shareTitle=shareUrl.getFormTitle();
        }
        mo.setViewName("dataShare");
        mo.addObject("url", shareUrl.getSrcUrl());
        mo.addObject("title", shareUrl.getShareTitle());
        mo.addObject("img",shareTitle);
        return mo;
    }

    /**
     * 得到formdropdown对应的关联表的下拉选项
     * @param columnName
     * @param tName
     * @param callback
     * @return
     */
    @RequestMapping(value = "/getDropdownOptions")
    public String getDropdownOptions(String columnName ,String tName, String callback) {
        List<Map<String,Object>> list=shareUrlService.getDropdownOptions(columnName,tName);
        return callback + "(" + JSONValue.toJSONString(new Handle(1, "查询成功",list)) + ")";

    }

}
