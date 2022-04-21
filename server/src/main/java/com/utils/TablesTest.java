package com.utils;

import java.util.regex.Matcher;
import java.util.regex.Pattern;

/**
 * Created by dragon_eight on 2018/10/17.
 */
public class TablesTest {
    public static void main(String[] args){
//        String define = "{\"schema\":{\"col_data1\":{\"title\":\"团队\",\"type\":\"Text\",\"options\":[],\"col_data\":\"col_data1\",\"placeholder\":\"\",\"visual\":\"false\"},\"col_data2\":{\"title\":\"有效捐数\",\"type\":\"Number\",\"options\":[],\"col_data\":\"col_data2\",\"placeholder\":\"\",\"value\":\"\",\"visual\":\"false\"},\"col_data3\":{\"title\":\"筹款额\",\"type\":\"Number\",\"placeholder\":\"\",\"options\":[],\"col_data\":\"col_data3\",\"value\":\"\",\"visual\":\"false\"},\"col_data1-count\":{\"title\":\"团队-计数\",\"type\":\"Number\",\"col_data\":\"col_data1-count\",\"value\":{\"min\":\"\",\"max\":\"\"},\"visual\":\"true\"},\"col_data2-count\":{\"title\":\"有效捐数-计数\",\"type\":\"Number\",\"col_data\":\"col_data2-count\",\"value\":{\"min\":\"\",\"max\":\"\"},\"visual\":\"true\"}},\"groupBy\":[\"col_data1\",\"col_data2\"]}";
//        String define = "{\"schema\":{\"col_data1\":{\"title\":\"团队\",\"type\":\"Text\",\"options\":[],\"col_data\":\"col_data1\",\"placeholder\":\"\",\"value\":\"\",\"visual\":\"false\"},\"col_data2\":{\"title\":\"有效捐数\",\"type\":\"Number\",\"options\":[],\"col_data\":\"col_data2\",\"placeholder\":\"\",\"value\":\"\",\"visual\":\"false\"},\"col_data3\":{\"title\":\"筹款额\",\"type\":\"Number\",\"placeholder\":\"\",\"options\":[],\"col_data\":\"col_data3\",\"value\":\"\",\"visual\":\"false\"}},\"tableName\":\"project_define_data\",\"groupBy\":[],\"define_id\":\"94\"}";


//        String sql = "select ";
//        Map queryMap = TablesUtil.parseQuerySql(sql,define);
//
//        System.out.println("sql---:"+queryMap.get("sql"));
//        System.out.println("listSqlWhere---:"+queryMap.get("listSqlWhere"));

//        Template template = new Template();
//        template.setDefine(define);
//        TablesUtil.firstAddDefine(template);
//        System.out.println("template.define---:" + template.getDefine());

//        TablesUtil.convertBean((TemplateData)list.get(i));
        String pattern1 = "\\w+@\\w+(\\.\\w{2,3})*\\.\\w{2,3}";
        System.out.println("template.define---:" + "zhangsan@xxx.com.cn".matches(pattern1));
        System.out.println("template.define---:" + checkEmail("zhangsan@xxx.com.cn"));


    }

    private static boolean checkEmail(String email)
    {
        try{
            String pattern1 = "^([a-z0-9A-Z]+[-|_|\\.]?)+[a-z0-9A-Z]@([a-z0-9A-Z]+(-[a-z0-9A-Z]+)?\\.)+[a-zA-Z]{2,}$";

            Pattern pattern = Pattern.compile(pattern1);
            Matcher mat = pattern.matcher(email);
            return mat.matches();
        }
        catch(Exception e){
            e.printStackTrace();
        }
        return false;
    }


}
