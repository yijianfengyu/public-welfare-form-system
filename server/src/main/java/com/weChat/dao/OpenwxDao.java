package com.weChat.dao;

import com.auth.entity.User;
import com.common.jdbc.JdbcBase;
import com.utils.Handle;
import com.weChat.entity.WxInfo;
import org.springframework.jdbc.core.BeanPropertyRowMapper;
import org.springframework.stereotype.Repository;

import java.util.List;

/**
 * Created by Administrator on 2018/10/15.
 */
@Repository
public class OpenwxDao extends JdbcBase {

    public Handle insertWxInfo(WxInfo wi){
        int flag = 0;
        if(this.getJdbcTemplate().queryForObject("select count(1) from wx_info where companyCode=? and authorizerAppid=?",new Object[]{wi.getCompanyCode(),wi.getAuthorizerAppid()},Integer.class)<1){
            String sql = "insert into wx_info (" +
                    "companyCode, authorizerAppid, authorizerAccessToken, authorizerRefreshToken, " +
                    "nickName, headImg, userName, authorizationCode," +
                    "principalName, serviceTypeInfo, verifyTypeInfo,authorizationDate) values(" +
                    "?,?,?,?," +
                    "?,?,?,?," +
                    "?,?,?,NOW()) ";
            flag = this.getJdbcTemplate().update(sql,new Object[]{
                    wi.getCompanyCode(),wi.getAuthorizerAppid(),wi.getAuthorizerAccessToken(),wi.getAuthorizerRefreshToken(),
                    wi.getNickName(),wi.getHeadImg(),wi.getUserName(),wi.getAuthorizationCode(),
                    wi.getPrincipalName(),wi.getServiceTypeInfo(),wi.getVerifyTypeInfo()
            });
        }else{
            String sql = "update wx_info set " +
                    "authorizerAccessToken=?, authorizerRefreshToken=?,nickName=?, headImg=?, " +
                    "userName=?, principalName=?, serviceTypeInfo=?, verifyTypeInfo=?, " +
                    "authorizationCode=? where companyCode=? and authorizerAppid=? ";
            flag = this.getJdbcTemplate().update(sql,new Object[]{
                    wi.getAuthorizerAccessToken(),wi.getAuthorizerRefreshToken(),wi.getNickName(),wi.getHeadImg(),
                    wi.getUserName(),wi.getPrincipalName(),wi.getServiceTypeInfo(),wi.getVerifyTypeInfo(),
                    wi.getAuthorizationCode(),wi.getCompanyCode(),wi.getAuthorizerAppid()
            });
        }
        return new Handle(flag,flag==0?"失败":"成功");
    }

    public List<WxInfo> queryWxInfoList(WxInfo wi) {
        String sql = "select * from wx_info where companyCode=?";
        return this.getJdbcTemplate().query(sql,new Object[]{wi.getCompanyCode()},new BeanPropertyRowMapper(WxInfo.class));
    }

    public List<WxInfo> queryWxInAll() {
        String sql = "select * from wx_info";
        return this.getJdbcTemplate().query(sql,new Object[]{},new BeanPropertyRowMapper(WxInfo.class));
    }

    public WxInfo queryWxInByAppid(String appid){
        String sql = "select * from wx_info where authorizerAppid=?";
        List<WxInfo> list =  this.getJdbcTemplate().query(sql,new Object[]{appid},new BeanPropertyRowMapper(WxInfo.class));
        if(list.size()>0){
            return list.get(0);
        }else{
            return null;
        }
    }

    public Handle updateWxInfoToken(WxInfo wi){
        String sql = "update wx_info set authorizerAccessToken=?,authorizerRefreshToken=? where authorizerAppid=?";
        int flag = this.getJdbcTemplate().update(sql, new Object[]{wi.getAuthorizerAccessToken(), wi.getAuthorizerRefreshToken(), wi.getAuthorizerAppid()});
        if(flag>0){
            return new Handle(1,"token更新成功");
        }else{
            return new Handle(0,"token更新失败");
        }
    }

    public Handle updateUserUnionId(User user){
        String sql = "update `system_user` set nickName=?,unionId=? where id=?";
        int flag = this.getJdbcTemplate().update(sql, new Object[]{user.getNickName(),user.getUnionId(),user.getId()});
        if(flag>0){
            return new Handle(1,"微信绑定成功");
        }else{
            return new Handle(0,"微信绑定失败");
        }
    }
}
