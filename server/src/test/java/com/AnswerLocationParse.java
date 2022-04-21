package com;

import com.fasterxml.jackson.databind.ObjectMapper;
import com.projectManage.dao.HistoryDao;
import com.projectManage.dao.RegionDao;
import com.projectManage.dao.ShareUrlDao;
import com.projectManage.entity.Region;
import com.projectManage.service.RegionService;
import com.projectManage.service.ShareUrlService;
import com.utils.Page;
import okhttp3.OkHttpClient;
import okhttp3.Request;
import okhttp3.Response;
import org.junit.Test;
import org.junit.runner.RunWith;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.context.SpringBootTest;
import org.springframework.stereotype.Service;
import org.springframework.test.context.junit4.SpringRunner;

import java.io.IOException;
import java.util.HashMap;
import java.util.List;
import java.util.Map;
import java.util.UUID;

/**
 * 经纬度解析1
 */
@RunWith(SpringRunner.class)
@SpringBootTest(classes = ToihkApplication.class)
public class AnswerLocationParse {

    @Autowired
    RegionService service;
    @Test
    public void changeArea() throws InterruptedException {
        //String sql="SELECT response_id,answer_type,text_value,option_name,option_id FROM `esawseq`.`answer` WHERE answer_type ='area' ORDER BY response_id;";
        List<Map<String, Object>> list =  service.getAll();
        for (int i = 0; i < list.size(); i++) {
            Map<String, Object> item = list.get(i);
            String response_id=item.get("response_id").toString();
            //53^530700000000^530724000000^530724202000^530724202201
            String[] a=(item.get("option_id").toString()).split("\\^");
            if(a.length>0){
                String regionId=a[a.length-1];

                //27.758982^100.66224^云南省丽江市宁蒗彝族自治县永宁镇街面粮管所正北方向190米
/*            String text_value= dao.getJdbcTemplate().queryForObject(
                    "SELECT CASE WHEN COUNT(1)=0 THEN '' ELSE text_value END gg FROM `esawseq`.`answer` WHERE answer_type ='location' AND response_id=?;",
                    new Object[]{response_id},String.class);*/
                String text_value=service.text_value(response_id);
                if(!"".equals(text_value)){
                    String[] arr=text_value.split("\\^");
                    String lng=arr.length>2?arr[1]:null;//经度
                    String lat=arr.length>1?arr[0]:null;//维度
                    int num=service.num(lng,lat,regionId);
                    System.out.println("--------------:"+text_value);
                }
            }


        }
    }


}
