package com.homePage.dao;


import com.common.jdbc.JdbcBase;
import com.homePage.entity.ClickCount;
import com.utils.Handle;
import org.springframework.jdbc.core.BeanPropertyRowMapper;
import org.springframework.stereotype.Repository;

import java.util.ArrayList;
import java.util.List;
import java.util.Map;

@Repository
public class HomePageDao extends JdbcBase {

//    public List queryCompanySumChart(String fromDate, String toDate, String month) {
//        List list = new ArrayList();
//        List<String> params = new ArrayList<String>();
//        String sql1 = "SELECT DATE_FORMAT(p.createDate,'%Y%m') ym FROM product_po p WHERE 1=1";
//        String sql2 = "SELECT SUM(p.totalAmountRMB) totalSalesRMB FROM product_po p WHERE p.status IN('CLOSE','CONFIRM')";
//        String sql3 = "SELECT SUM(p.up*p.qty) totalPurchaserRMB FROM product_vp_item p LEFT JOIN product_vp v ON p.vpId=v.id WHERE v.status != 'cancel'";
//        String sql4 = "SELECT s.month MONTH,SUM((s.salary+ IFNULL(s.gpBonusResult,0) + IFNULL(s.allowance,0)+IFNULL(s.performance,0)+ " +
//                "IFNULL(s.personTax,0) + IFNULL(s.margin,0)+ IFNULL(i.up,0) + IFNULL(i.down,0))) subtotal " +
//                "FROM salary s LEFT JOIN (SELECT salaryId,SUM(CASE WHEN money<0 THEN money ELSE 0 END ) AS down,SUM(CASE WHEN money>0 " +
//                "THEN money ELSE 0 END )  AS up FROM salary_item GROUP BY salaryId) i ON i.salaryId=s.id WHERE 1=1 ";
//
//        if(null!=fromDate&&!"".equals(fromDate)){
//            sql1+=" AND p.createDate>=? ";
//            sql2+=" AND p.createDate>=? ";
//            sql3+=" AND p.createDate>=? ";
//            params.add(fromDate);
//        }
//        if(null!=toDate&&!"".equals(toDate)){
//            sql1+=" AND p.createDate<=? ";
//            sql2+=" AND p.createDate<=? ";
//            sql3+=" AND p.createDate<=? ";
//            params.add(toDate);
//        }
//        if(null!=month&&!"".equals(month)){
//            sql4 +="AND s.month >= " + month;
//        }
//        sql1+=" GROUP BY DATE_FORMAT(p.createDate,'%Y%m')";
//        sql2+=" GROUP BY DATE_FORMAT(p.createDate,'%Y%m')";
//        sql3+=" GROUP BY DATE_FORMAT(p.createDate,'%Y%m')";
//        sql4+=" AND s.status IS NULL GROUP BY s.month";
//
//        list.add(this.getJdbcTemplate().queryForList(sql1, params.toArray(new Object[params.size()])));
//        list.add(this.getJdbcTemplate().queryForList(sql2, params.toArray(new Object[params.size()])));
//        list.add(this.getJdbcTemplate().queryForList(sql3, params.toArray(new Object[params.size()])));
//        list.add(this.getJdbcTemplate().queryForList(sql4));
//
//        return list;
//    }

//
//    //保存图表、快捷入口等的点击率
//    public Handle saveClickCount(ClickCount cc){
//        List<String> params = new ArrayList<String>();
//        String sql = "UPDATE clickcount SET count=count+1,validCount=validCount+1 WHERE 1=1";
//        if(null!=cc.getId()&&!"".equals(cc.getId())){
//            sql+=" AND id=? ";
//            params.add(cc.getId());
//        }
//        if(null!=cc.getType1()&&!"".equals(cc.getType1())){
//            sql+=" AND Type1=? ";
//            params.add(cc.getType1());
//        }
//        if(null!=cc.getType2()&&!"".equals(cc.getType2())){
//            sql+=" AND Type2=? ";
//            params.add(cc.getType2());
//        }
//        if(null!=cc.getName()&&!"".equals(cc.getName())){
//            sql+=" AND `name`=? ";
//            params.add(cc.getName());
//        }
//        this.getJdbcTemplate().update(sql,params.toArray(new Object[params.size()]));
//        return new Handle(1,"成功");
//    }
//    //保存头部查询框的点击率
//    public Handle saveFilterClickCount(ClickCount cc){
//        //保存点击率
//        String sql = "update clickcount SET count=count+1 WHERE Type1=? AND Type2=?";
//        this.getJdbcTemplate().update(sql,new Object[]{cc.getType1(),cc.getType2()});
//
//        //保存有效点击率
//        if(null!=cc.getValidType2() && cc.getValidType2().length>0){
//            String[] validType2 = cc.getValidType2();
//            String sql2 = "update clickcount SET validCount=validCount+1 WHERE Type1=? AND Type2=? AND(";
//            for(int i =0;i<validType2.length;i++){
//                if(i == validType2.length-1){
//                    sql2 += "name = '" + validType2[i] + "')";
//                }else{
//                    sql2 += "name = '" + validType2[i] + "' OR ";
//                }
//            }
//            this.getJdbcTemplate().update(sql2,new Object[]{cc.getType1(),cc.getType2()});
//        }
//        return new Handle(1,"成功");
//    }

}


