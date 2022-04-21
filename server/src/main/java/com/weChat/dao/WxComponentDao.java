package com.weChat.dao;

import com.common.jdbc.JdbcBase;
import com.weChat.api.WxConstants;
import com.weChat.entity.WxComponent;
import com.weChat.entity.WxInfo;
import org.springframework.jdbc.core.BeanPropertyRowMapper;
import org.springframework.stereotype.Repository;
import org.springframework.stereotype.Service;

import java.util.List;

/**
 * Created by Administrator on 2018/10/12.
 */
@Repository
public class WxComponentDao extends JdbcBase {


    public void updateWxComponentTicket(WxComponent wxc){
        String sql = "update wx_component set componentVerifyTicket=? where componentAppid=?";
        this.getJdbcTemplate().update(sql,new Object[]{wxc.getComponentVerifyTicket(), WxConstants.COMPONENT_APPID});
    }

    public void updateWxComponentToken(WxComponent wxc){
        String sql = "update wx_component set componentAccessToken=? where componentAppid=?";
        this.getJdbcTemplate().update(sql, new Object[]{wxc.getComponentAccessToken(), WxConstants.COMPONENT_APPID});
    }

    public WxComponent getWxComponent(){
        String sql = "select * from wx_component where componentAppid=?";
        List<WxComponent> list =  this.getJdbcTemplate().query(sql,new Object[]{WxConstants.COMPONENT_APPID},new BeanPropertyRowMapper(WxComponent.class));
        if(list.size()>0){
            return list.get(0);
        }else{
            return new WxComponent();
        }
    }
}
