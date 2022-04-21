package com.projectManage.dao;

import com.common.jdbc.JdbcBase;
import com.projectManage.entity.ShareUrl;
import com.utils.Handle;
import org.springframework.jdbc.core.BeanPropertyRowMapper;
import org.springframework.stereotype.Repository;

import java.util.ArrayList;
import java.util.List;
import java.util.UUID;

@Repository
public class ShareUrlDao extends JdbcBase {

    public Handle createShareUrl(ShareUrl su) {
        String sqlInsert = "INSERT INTO share_url (userName,userId,defineId,shareDate,srcUrl,shareTitle,startTime,endTime,isConditions,updateTime,uuid) VALUES (?,?,?,NOW(),?,?,?,?,?,NOW(),?)";
//        int id = this.getStockNextIndex("share_url");
        UUID uuid = UUID.randomUUID();
        List<String> params=new ArrayList<>();
        su.setUuid(uuid.toString());
        params.add(su.getUserName());
        params.add(su.getUserId());
        params.add(su.getDefineId());
        params.add(su.getSrcUrl());
        params.add(su.getShareTitle());
        params.add(su.getStartTime());
        params.add(su.getEndTime());
        params.add(su.getIsConditions());
        params.add(su.getUuid());
        int id=0;
        try {
             id= this.insert(sqlInsert,params);
        }catch (Exception e){
            System.out.println(e);
        }
        if (id > 0) {
            return new Handle(1, "操作成功", uuid.toString());
        } else {
            return new Handle(0, "操作失败，请稍后重试");
        }
    }

    public ShareUrl selectShareUrl(String uuid) {
        String sql = "SELECT s.*, p.*, IF(IFNULL(NOW(),NOW())>s.endTime OR IFNULL(NOW(),NOW())<s.startTime,'YES','NO') isIoseEfficacy FROM share_url s LEFT JOIN project_define p ON s.`defineId` = p.`id` WHERE 1 = 1 AND s.uuid = ?";
        List<ShareUrl> result = this.getJdbcTemplate().query(sql, new Object[]{uuid}, new BeanPropertyRowMapper<>(ShareUrl.class));
        if (result.size() > 0) {
            return result.get(0);
        } else {
            return new ShareUrl();
        }
    }

    public int updateShareUrl(ShareUrl su) {
        //是否显示搜索条件
        String sql = "UPDATE share_url SET  shareTitle=?,startTime=?,endTime=?,isConditions=?,updateTime=NOW()  WHERE id=?";
        return this.getJdbcTemplate().update(sql, new Object[]{su.getShareTitle(),su.getStartTime(),su.getEndTime(),su.getIsConditions(), su.getId()});
    }

}


