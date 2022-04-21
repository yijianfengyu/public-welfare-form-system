package com;

import com.projectManage.dao.RegionDao;
import net.sf.json.JSONArray;
import net.sf.json.JSONObject;
import org.apache.commons.lang.StringUtils;
import org.junit.Test;
import org.junit.runner.RunWith;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.context.SpringBootTest;
import org.springframework.context.annotation.ComponentScan;
import org.springframework.test.context.junit4.SpringRunner;

import java.text.DecimalFormat;
import java.util.ArrayList;
import java.util.List;
import java.util.Map;
import java.util.UUID;

/**
 * 答案解析匹配
 */
@RunWith(SpringRunner.class)
@SpringBootTest(classes = ToihkApplication.class)
@ComponentScan(basePackages = "com.*")
public class AnswerValueParse {

    @Autowired
    RegionDao dao;
    @Test
    public void getAllTest() throws InterruptedException {

     /*   String select = "SELECT q.`sys_id` muid ,REPLACE(UUID(),'-','') `uuid` ,`name` title,`answer_type`\n" +
                "FROM `esawseq`.`question` q WHERE `answer_type` IN('option','text','switch','double','measurement','datetime','file')";
        List<Map<String, Object>> list = dao.getJdbcTemplate().queryForList(select);*/


           // if ("area".equals(answer_type)) {
                //FormRegion
        List<Map<String, Object>> list=dao.getAnswerArea();
        List<Object[]> sqllListArea=new ArrayList<>();
        for(int i=0;i<list.size();i++){
            Map<String, Object> item = list.get(i);
            JSONObject json = new JSONObject();
            String[] values= item.get("option_name").toString().split("\\^");
            //{"province":"","city":"","county":"","town":"","village":"","others":""}
            if(values.length>0){
                json.put("province",values[0]);
            }else{
                json.put("province","");
            }
            if(values.length>1){
                json.put("city",values[1]);
            }else{
                json.put("city","");
            }
            if(values.length>2){
                json.put("county",values[2]);
            }else{
                json.put("county","");
            }
            if(values.length>3){
                json.put("town",values[3]);
            }else{
                json.put("town","");
            }
            if(values.length>4){
                json.put("village",values[4]);
            }else{
                json.put("village","");
            }
            json.put("others","");
            String answerUserUUID= item.get("answerUserUUID").toString();
            String defineId= item.get("defineId").toString();
            String questionId= item.get("questionId").toString();
            String authUserId= item.get("authUserId").toString();
            String value=json.toString();
            Object[] objs= new Object[]{value,answerUserUUID,defineId,questionId,authUserId};
            sqllListArea.add(objs);

            if(i==list.size()-1){
                dao.updateAnswerQuestion(sqllListArea);
                sqllListArea.clear();
            }else if(i%1000==0){
                dao.updateAnswerQuestion(sqllListArea);
                sqllListArea.clear();
            }

        }


    }
    @Test
    public void getAllLocation() {
        List<Map<String, Object>> list=dao.getAnswerLocation();
        List<Object[]> sqllListArea=new ArrayList<>();
        for(int i=0;i<list.size();i++){
            Map<String, Object> item = list.get(i);
            JSONArray json = new JSONArray();
            String[] values= item.get("option_name").toString().split("\\^");
            //{"province":"","city":"","county":"","town":"","village":"","others":""}
            if(values.length>0){
                json.add(values[0]);
            }
            if(values.length>1){
                json.add(values[1]);
            }
            String answerUserUUID= item.get("answerUserUUID").toString();
            String defineId= item.get("defineId").toString();
            String questionId= item.get("questionId").toString();
            String authUserId= item.get("authUserId").toString();
            String value=json.toString();
            Object[] objs= new Object[]{value,answerUserUUID,defineId,questionId,authUserId};
            sqllListArea.add(objs);

            if(i==list.size()-1){
                dao.updateAnswerQuestion(sqllListArea);
                sqllListArea.clear();
            }else if(i%1000==0){
                dao.updateAnswerQuestion(sqllListArea);
                sqllListArea.clear();
            }
        }
    }
    @Test
    public void getAllMeasurement() {
        List<Map<String, Object>> list=dao.getAnswerMeasurement();
        List<Object[]> sqllListArea=new ArrayList<>();
        DecimalFormat df = new DecimalFormat("0.000000");
        for(int i=0;i<list.size();i++){
            Map<String, Object> item = list.get(i);
            JSONObject json = new JSONObject();
            Float dilution= item.get("measurement_dilution_rate")==null
                    ||"".equals(item.get("measurement_dilution_rate"))
                    || !StringUtils.isNumeric(item.get("measurement_dilution_rate").toString())
                    ?
                    1:Float.parseFloat(item.get("measurement_dilution_rate").toString());
            String readings= item.get("measurement_original")==null?"":item.get("measurement_original").toString();
            String actuals= item.get("measurement_value")==null
                    ||"".equals(item.get("measurement_value"))
                    ||!StringUtils.isNumeric(item.get("measurement_dilution_rate").toString())?"0":item.get("measurement_value").toString();
            if("".equals(readings)&&Float.parseFloat(actuals)!=0&&dilution!=0){
                readings=df.format(Float.parseFloat(actuals)/dilution);
            }
            //{"province":"","city":"","county":"","town":"","village":"","others":""}
            json.put("readings",readings);
            json.put("dilution",dilution);
            json.put("actuals",actuals);
            String answerUserUUID= item.get("answerUserUUID").toString();
            String defineId= item.get("defineId").toString();
            String questionId= item.get("questionId").toString();
            String authUserId= item.get("authUserId").toString();
            String value=json.toString();
            Object[] objs= new Object[]{value,answerUserUUID,defineId,questionId,authUserId};
            sqllListArea.add(objs);
            if(i==list.size()-1){
                dao.updateAnswerQuestion(sqllListArea);
                sqllListArea.clear();
            }else if(i%1000==0){
                dao.updateAnswerQuestion(sqllListArea);
                sqllListArea.clear();
            }

        }
    }
    @Test
    public void getAllOption() {
        /***
         * 没有使用，用sql更新了
         */
        List<Map<String, Object>> list=dao.getAnswerOption();
        List<Object[]> sqllListArea=new ArrayList<>();

        for(int i=0;i<list.size();i++){
            Map<String, Object> item = list.get(i);

            String answerUserUUID= item.get("answerUserUUID").toString();
            String defineId= item.get("defineId").toString();
            String questionId= item.get("questionId").toString();
            String authUserId= item.get("authUserId").toString();
            String option_id= item.get("option_id").toString();

            Object[] objs= new Object[]{answerUserUUID,defineId,questionId,authUserId,option_id};
            sqllListArea.add(objs);
            if(i==list.size()-1){
                dao.updateAnswerOption(sqllListArea);
                sqllListArea.clear();
            }else if(i%1000==0){
                dao.updateAnswerOption(sqllListArea);
                sqllListArea.clear();
            }
        }
    }
    @Test
    public void updatePaperUuid() {
        List<Map<String, Object>> list=dao.selectAllUuid();
        List<Object[]> sqllListArea=new ArrayList<>();
        for(int i=0;i<list.size();i++){
            Map<String, Object> item = list.get(i);
            String uuid=UUID.randomUUID().toString().replace("-","");
            String define_id= item.get("define_id").toString();
            String mu_question_id= item.get("mu_question_id").toString();
            sqllListArea.add(new Object[]{uuid,define_id,mu_question_id});
            if(i==list.size()-1){
                dao.updatePaperUuid(sqllListArea);
                sqllListArea.clear();
            }else if(i%1000==0){
                dao.updatePaperUuid(sqllListArea);
                sqllListArea.clear();
            }

        }
    }

    /**
     * 个更新paper的uuid和anwseruuid对应关系
     */
    @Test
    public void updatePaperAnswer() {
        List<Map<String, Object>> list=dao.selectAllUuid();
        for(int i=0;i<list.size();i++){
            Map<String, Object> item = list.get(i);
            String define_id= item.get("define_id").toString();
            String mu_question_id= item.get("mu_question_id").toString();
                dao.updateAnswerUuid(define_id,mu_question_id);
            System.out.println("-----------"+i);
        }
    }

    /**
     * 个更新paper的uuid和anwseruuid对应关系
     */
    @Test
    public void updateAnswerTeamId() {
        List<Map<String, Object>> list=dao.selectAllUuid();
        for(int i=0;i<list.size();i++){
            Map<String, Object> item = list.get(i);
            String define_id= item.get("define_id").toString();
            String mu_question_id= item.get("mu_question_id").toString();
            dao.updateAnswerUuid(define_id,mu_question_id);
            System.out.println("-----------"+i);
        }
    }
    /**
     * 个更新answer的ProjectId对应关系
     */
    @Test
    public void updateAnswerProjectId() {
        List<Map<String, Object>> list=dao.getProjectId();
        for(int i=0;i<list.size();i++){
            Map<String, Object> item = list.get(i);
            String projectId= item.get("projectId").toString();
            String uuid= item.get("uuid").toString();
            dao.updateAnswerProjectId(projectId,uuid);
            System.out.println("-----------"+i);
        }
    }

    public void getAllRegion() {
        List<Map<String, Object>> list=dao.getAnswerRegion();
        List<Object[]> sqllListArea=new ArrayList<>();
        List<Object[]> sqllListRegion=new ArrayList<>();
        for(int i=0;i<list.size();i++){
            Map<String, Object> item = list.get(i);

            String answerUserUUID= item.get("answerUserUUID").toString();
            String defineId= item.get("defineId").toString();
            String questionId= item.get("questionId").toString();
            String authUserId= item.get("authUserId").toString();
            String[] location_ids= item.get("location_id").toString().split("\\^");
            String location_id= location_ids[location_ids.length-1];
            String location_longitude= item.get("location_longitude")==null?"":item.get("location_longitude").toString();
            String location_latitude=  item.get("location_latitude")==null?"":item.get("location_latitude").toString();
            String mername=dao.getRegionAddress(location_id);
            if(!"".equals(mername)){
                JSONObject json = new JSONObject();
                String[] values=mername.split(",");
                if(values.length>0){
                    json.put("province",values[0]);
                }else{
                    json.put("province","");
                }
                if(values.length>1){
                    json.put("city",values[1]);
                }else{
                    json.put("city","");
                }
                if(values.length>2){
                    json.put("county",values[2]);
                }else{
                    json.put("county","");
                }
                if(values.length>3){
                    json.put("town",values[3]);
                }else{
                    json.put("town","");
                }
                if(values.length>4){
                    json.put("village",values[4]);
                }else{
                    json.put("village","");
                }
                json.put("others","");
                Object[] objs= new Object[]{json.toString(),answerUserUUID,defineId,questionId,authUserId};

                sqllListArea.add(objs);
                if(location_longitude!=null&&location_latitude!=null
                        &&!"".equals(location_longitude)
                &&!"".equals(location_latitude)){
                    Object[] objs2=new Object[]{location_longitude,location_latitude,location_id};
                    sqllListRegion.add(objs2);

                }

            }


           if(i==list.size()-1){
               dao.updateAnswerRegion(sqllListArea);
               dao.updateRegionGps(sqllListRegion);
                sqllListArea.clear();
               sqllListRegion.clear();
            }else if(i%1000==0){
               dao.updateAnswerRegion(sqllListArea);
               dao.updateRegionGps(sqllListRegion);
                sqllListArea.clear();
               sqllListRegion.clear();
            }
        }
        //UPDATE `my_water_pro`.`region` SET lng=?,lat=? WHERE id=?

    }
}
