package com;

import com.projectManage.dao.RegionDao;
import com.projectManage.service.RegionService;
import net.sf.json.JSONArray;
import net.sf.json.JSONObject;
import org.junit.Test;
import org.junit.runner.RunWith;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.context.SpringBootTest;
import org.springframework.context.annotation.ComponentScan;
import org.springframework.test.context.junit4.SpringRunner;

import java.util.*;
import java.util.concurrent.atomic.AtomicInteger;

/**
 * 白卷的解析
 */
@RunWith(SpringRunner.class)
@SpringBootTest(classes = ToihkApplication.class)
@ComponentScan(basePackages = "com.*")
public class AnswerPaperParse {

    @Autowired
    RegionDao dao;
    @Test
    public void getAllTest() throws InterruptedException {
        List<String> sqlList=new ArrayList<String>();
        List<String> optionsList=new ArrayList<String>();
        List<Map<String, Object>> list=dao.getQuestion();
     /*   String select = "SELECT q.`sys_id` muid ,REPLACE(UUID(),'-','') `uuid` ,`name` title,`answer_type`\n" +
                "FROM `esawseq`.`question` q WHERE `answer_type` IN('option','text','switch','double','measurement','datetime','file')";
        List<Map<String, Object>> list = dao.getJdbcTemplate().queryForList(select);*/
        System.out.println("--------------总数--------------"+list.size());
        for (int i = 0; i < list.size(); i++) {
            Map<String, Object> item = list.get(i);
            String muid = item.get("muid").toString();
            String uuid = UUID.randomUUID().toString().replace("-","");
            String title = item.get("title").toString();
            String answer_type = item.get("answer_type").toString();

            //HashMap<String, String> map = new HashMap<String, String>();
            JSONObject map = new JSONObject();
            String type="";
            if ("area".equals(answer_type)) {
                //FormRegion
                type="FormRegion";
                map.put("type","FormRegion");

                map.put("outHiden",false);
                map.put("searchHiden",false);
                map.put("orderHiden",false);
                map.put("columnHiden",false);
                map.put("p_uuid","");
                map.put("p_option_uuid","");
                map.put("title",title);
                map.put("col_data","col_"+uuid);
                map.put("columnName","col_"+uuid);
                map.put("uuid",uuid);
                map.put("options","[]");


                //{
                //        "option": "激活",
                //        "score": "1",
                //        "uuid": 459810564556
                //      }

            } else if ("date".equals(answer_type)) {
                //FormDate
                type="FormDate";
                map.put("type","FormDate");

                map.put("outHiden",false);
                map.put("searchHiden",false);
                map.put("orderHiden",false);
                map.put("columnHiden",false);
                map.put("p_uuid","");
                map.put("p_option_uuid","");
                map.put("title",title);
                map.put("col_data","col_"+uuid);
                map.put("columnName","col_"+uuid);
                map.put("uuid",uuid);

                map.put("options","[]");
            } else if ("datetime".equals(answer_type)) {
                //FormDatetime
                type="FormDatetime";
                map.put("type","FormDatetime");

                map.put("outHiden",false);
                map.put("searchHiden",false);
                map.put("orderHiden",false);
                map.put("columnHiden",false);
                map.put("p_uuid","");
                map.put("p_option_uuid","");
                map.put("title",title);
                map.put("col_data","col_"+uuid);
                map.put("columnName","col_"+uuid);
                map.put("uuid",uuid);

                map.put("options","[]");
            } else if ("double".equals(answer_type)) {
                //FormNumber
                type="FormNumber";
                map.put("type","FormNumber");

                map.put("outHiden",false);
                map.put("searchHiden",false);
                map.put("orderHiden",false);
                map.put("columnHiden",false);
                map.put("p_uuid","");
                map.put("p_option_uuid","");
                map.put("title",title);
                map.put("col_data","col_"+uuid);
                map.put("columnName","col_"+uuid);
                map.put("uuid",uuid);
                map.put("max",1000);
                map.put("min",0);

                map.put("options","[]");
            } else if ("file".equals(answer_type)) {
                //Uploads
                type="Uploads";
                map.put("type","Uploads");

                map.put("outHiden",false);
                map.put("searchHiden",false);
                map.put("orderHiden",false);
                map.put("columnHiden",false);
                map.put("p_uuid","");
                map.put("p_option_uuid","");
                map.put("title",title);
                map.put("col_data","col_"+uuid);
                map.put("columnName","col_"+uuid);
                map.put("uuid",uuid);

                map.put("options","[]");

            } else if ("int".equals(answer_type)) {
                //FormInt
                type="FormInt";
                map.put("type","FormInt");

                map.put("outHiden",false);
                map.put("searchHiden",false);
                map.put("orderHiden",false);
                map.put("columnHiden",false);
                map.put("p_uuid","");
                map.put("p_option_uuid","");
                map.put("title",title);
                map.put("col_data","col_"+uuid);
                map.put("columnName","col_"+uuid);
                map.put("uuid",uuid);
                map.put("max",1000);
                map.put("min",0);

                map.put("options","[]");
            } else if ("location".equals(answer_type)) {
                //FormGps
                type="FormGps";
                map.put("type","FormGps");

                map.put("outHiden",false);
                map.put("searchHiden",false);
                map.put("orderHiden",false);
                map.put("columnHiden",false);
                map.put("p_uuid","");
                map.put("p_option_uuid","");
                map.put("title",title);
                map.put("col_data","col_"+uuid);
                map.put("columnName","col_"+uuid);
                map.put("uuid",uuid);

                map.put("options","[]");

            } else if ("multi".equals(answer_type)) {
                //CheckboxGroup
                type="CheckboxGroup";
                map.put("type","CheckboxGroup");

                map.put("outHiden",false);
                map.put("searchHiden",false);
                map.put("orderHiden",false);
                map.put("columnHiden",false);
                map.put("p_uuid","");
                map.put("p_option_uuid","");
                map.put("title",title);
                map.put("col_data","col_"+uuid);
                map.put("columnName","col_"+uuid);
                map.put("uuid",uuid);

                List<Map<String, Object>> options=dao.getOption(muid);
                JSONArray arr=new JSONArray();

                for(int k=0;k<options.size();k++){
                    String  option=options.get(k).get("name").toString();
                    String  omuid=options.get(k).get("muid").toString();
                    String optionUuid=UUID.randomUUID().toString().replace("-","");
                    JSONObject m = new JSONObject();
                    m.put("option",option);
                    m.put("muid",omuid);
                    m.put("score",k+1);
                    m.put("uuid",optionUuid);
                    arr.add(m);
                    String optionSql="INSERT INTO `my_water_pro`.`option_uuid` (\n" +
                            "  `option_uuid`,`muid`,`uuid`,`col_data`,`type`,option_score)  \n" +
                            " VALUES('"+optionUuid+"', '"+omuid+"','"+uuid+"','"+("col_"+uuid)+"','CheckboxGroup','"+(k+1)+"') ;";
                    optionsList.add(optionSql);

                }
                map.put("options",arr.toString());


            } else if ("option".equals(answer_type)) {
                //FormRadioGroup
                type="FormRadioGroup";
                map.put("type","FormRadioGroup");

                map.put("outHiden",false);
                map.put("searchHiden",false);
                map.put("orderHiden",false);
                map.put("columnHiden",false);
                map.put("p_uuid","");
                map.put("p_option_uuid","");
                map.put("title",title);
                map.put("col_data","col_"+uuid);
                map.put("columnName","col_"+uuid);
                map.put("uuid",uuid);

                List<Map<String, Object>> options=dao.getOption(muid);
                JSONArray arr=new JSONArray();
                for(int k=0;k<options.size();k++){
                    String  option=options.get(k).get("name").toString();
                    String  omuid=options.get(k).get("muid").toString();
                    String optionUuid=UUID.randomUUID().toString().replace("-","");
                    JSONObject m = new JSONObject();
                    m.put("option",option);
                    m.put("muid",omuid);
                    m.put("score",k+1);
                    m.put("uuid",optionUuid);
                    arr.add(m);
                    String optionSql="INSERT INTO `my_water_pro`.`option_uuid` (\n" +
                            "  `option_uuid`,`muid`,`uuid`,`col_data`,`type`,option_score)  \n" +
                            " VALUES('"+optionUuid+"', '"+omuid+"','"+uuid+"','"+("col_"+uuid)+"','FormRadioGroup','"+(k+1)+"') ;";
                    optionsList.add(optionSql);
                }
                map.put("options",arr.toString());

            } else if ("text".equals(answer_type)) {
                //FormInput
                type="FormInput";
                map.put("type","FormInput");

                map.put("outHiden",false);
                map.put("searchHiden",false);
                map.put("orderHiden",false);
                map.put("columnHiden",false);
                map.put("p_uuid","");
                map.put("p_option_uuid","");
                map.put("title",title);
                map.put("col_data","col_"+uuid);
                map.put("columnName","col_"+uuid);
                map.put("uuid",uuid);
                map.put("max",60);
                map.put("min",0);

                map.put("options","[]");
            } else if ("textmulti".equals(answer_type)) {
                //FormText
                type="FormText";
                map.put("type","FormText");

                map.put("outHiden",false);
                map.put("searchHiden",false);
                map.put("orderHiden",false);
                map.put("columnHiden",false);
                map.put("p_uuid","");
                map.put("p_option_uuid","");
                map.put("title",title);
                map.put("col_data","col_"+uuid);
                map.put("columnName","col_"+uuid);
                map.put("uuid",uuid);
                map.put("max",150);
                map.put("min",0);

                map.put("options","[]");
            } else if ("measurement".equals(answer_type)) {
                //FormMeasurement
                type="FormMeasurement";
                map.put("type","FormMeasurement");

                map.put("outHiden",false);
                map.put("searchHiden",false);
                map.put("orderHiden",false);
                map.put("columnHiden",false);
                map.put("p_uuid","");
                map.put("p_option_uuid","");
                map.put("title",title);
                map.put("col_data","col_"+uuid);
                map.put("columnName","col_"+uuid);
                map.put("uuid",uuid);

                map.put("readingsMin",1);
                map.put("readingsMax",10);
                map.put("dilutionMin",1);
                map.put("dilutionMax",10);

                map.put("options","[]");
            }

            System.out.println("----------------------------");
            System.out.println(map);
            String sql = "INSERT INTO `my_water_pro`.`project_exam_question` (\n" +
                    "  `muid`,`uuid`,`question`,`title`,\n" +
                    "  `columnScore`,`label`,`labelId`,`create_time`,`type` \n" +
                    ") values('"+muid+"','"+uuid+"','"+map.toString()+"','"+title+"'," +
                    "'0','',0,NOW(),'"+type+"')";
            sqlList.add(sql);
        }
        dao.batchInsertQuestion(sqlList);
        dao.batchInsertQuestionOption(optionsList);

    }
}
