package com;

import com.fasterxml.jackson.databind.ObjectMapper;
import okhttp3.OkHttpClient;
import okhttp3.Request;
import okhttp3.Response;

import java.io.IOException;
import java.util.Date;
import java.util.HashMap;
import java.util.List;
import java.util.Map;

/**
 * 高德搜索蒸汽机搜索
 */
public class AccessdataJsonParse {
    public static void main(String[] args) {
        //user_provided>table[1]>>tbody>tr[!0]
        OkHttpClient okHttpClient = new OkHttpClient();
        String url="https://www.amap.com/service/poiInfo?query_type=TQUERY&pagesize=20&pagenum=1&qii=true&cluster_state=5&need_utd=true&utd_sceneid=1000&div=PC1000&addr_poi_merge=true&is_classify=true&zoom=3&city=000000&geoobj=56.991187%7C-2.261973%7C141.366193%7C63.401642&keywords=vape";
        Map<String, Object> map = new HashMap<>(16);
        Request request =new Request.Builder().url(url).build();
        try{
            Response response = okHttpClient.newCall(request).execute();
            ObjectMapper mapper = new ObjectMapper();
            map = mapper.readValue(response.body().string(), map.getClass());
            Map<String, Object> data= (Map<String, Object>) map.get("data");
            Map<String, Object> suggestion= (Map<String, Object>)data.get("suggestion");
            List<Map<String, Object>> regions= (List<Map<String, Object>>) suggestion.get("regions");
            String queryCity="https://www.amap.com/service/poiInfo?query_type=TQUERY&pagesize=20&pagenum=1&qii=true&cluster_state=5&need_utd=true&utd_sceneid=1000&div=PC1000&addr_poi_merge=true&is_classify=true&zoom=3.8&city=@@&keywords=%E8%92%B8%E6%B1%BD%E7%83%9F";
            for(int i=0;i<regions.size();i++){
                Map<String, Object> reg=regions.get(i);
                String adcode=(String)reg.get("adcode");
                String infoUrl=queryCity.replace("@@",adcode);
                request =new Request.Builder().url(infoUrl).build();
                response = okHttpClient.newCall(request).execute();
                Map<String, Object> infoMap = mapper.readValue(response.body().string(), Map.class);
                //data.data.poi_list[{name,cityname,address,disp_name,id}]
                Map<String, Object> data01 = (Map<String, Object>) infoMap.get("data");
                Map<String, Object> data02 = (Map<String, Object>) data01.get("data");
                List<Map<String, Object>> listShop = (List<Map<String, Object>>) data01.get("poi_list");
                if(listShop!=null){
                    for(int k=0;k<listShop.size();k++){
                        Map<String, Object> shop = listShop.get(k);
                        String name=(String)shop.get("name");
                        String cityname=(String)shop.get("cityname");
                        String address=(String)shop.get("address");
                        String id=(String)shop.get("id");
                        String tel=(String)shop.get("tel");
                        System.out.println(id+","+name+","+cityname+","+address+","+tel);
                    }
                }


            }

        }catch(IOException e) {
            e.printStackTrace();
        }

    }
}
