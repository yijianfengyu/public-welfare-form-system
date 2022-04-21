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
public class DefineTableParse {

    @Autowired
    RegionDao dao;
    @Test
    public void getTableDefine() {
        String dd=dao.getTableDefine();//随便一个已经存表做模板
        JSONObject define = JSONObject.fromObject(dd);
        List<Map<String, Object>> listId=dao.selectAllDefineId();
        List<Object[]> sqllList=new ArrayList<>();
        for(int k=0;k<listId.size();k++){
            Map<String, Object> defineIdMap = listId.get(k);
            String define_id=defineIdMap.get("define_id").toString();

            String tableName ="";
            //新建
            //define.put("schema",new JSONObject());
            JSONObject schema=new JSONObject();
            //define.getJSONObject("fieldsets").put("fields",);
            JSONArray fields=new JSONArray();
            List<Map<String, Object>> list=dao.selectDefine(define_id);
            for(int i=0;i<list.size();i++){
                Map<String, Object> item = list.get(i);
                tableName = item.get("tableName").toString();
                String question = item.get("question").toString();
                String col_data = item.get("col_data").toString();
                //JSONObject schema = define.getJSONObject("schema");
                schema.put(col_data,question);
                //JSONArray fields = schema.getJSONObject("fieldsets").getJSONArray("fields");
                fields.add(col_data);
            }
            define.getJSONObject("fieldsets").put("fields",fields);
            define.put("schema",schema);
            sqllList.add(new Object[]{define.toString(),tableName,define_id});
        }

        //更新表的schema，fieldsets.fields
        dao.updateDefine(sqllList);

    }

}
