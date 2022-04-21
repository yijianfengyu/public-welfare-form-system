package com.utils;

import com.common.jdbc.JdbcBase;
import com.google.common.collect.Lists;
import com.projectManage.entity.Template;
import net.minidev.json.JSONValue;
import net.sf.json.JSONArray;
import net.sf.json.JSONObject;
import org.apache.commons.lang.ArrayUtils;
import org.apache.poi.hssf.usermodel.HSSFCell;
import org.apache.poi.hssf.usermodel.HSSFRow;
import org.apache.poi.hssf.usermodel.HSSFSheet;
import org.apache.poi.hssf.usermodel.HSSFWorkbook;
import org.apache.poi.ss.usermodel.Row;
import org.springframework.jdbc.core.BeanPropertyRowMapper;
import org.springframework.jdbc.core.JdbcTemplate;

import java.beans.BeanInfo;
import java.beans.Introspector;
import java.beans.PropertyDescriptor;
import java.io.File;
import java.io.FileInputStream;
import java.lang.reflect.Method;
import java.util.*;
import java.util.concurrent.ThreadLocalRandom;
import java.util.concurrent.atomic.AtomicInteger;
import java.util.regex.Matcher;
import java.util.regex.Pattern;
import java.util.stream.Collectors;

public class TablesUtil {

    static private String default_column_length="200";

    /**
     * 取得json中列名和对应值
     * @param temp
     * @return
     */
    public static Map parseMap(String temp) {
        Map jsonMap = TablesUtil.parseJSON2Map(temp);
        Object schema = jsonMap.get("schema");
        Object values = jsonMap.get("values");
        JSONObject jsonSchema = (JSONObject) schema;
        JSONObject jsonValues = (JSONObject) values;
        List<Map> list = new ArrayList<Map>();
        Map mm = new HashMap();
        String sql = "";

//        Iterator<String> iteValues = jsonValues.keys();
//        while (iteValues.hasNext()) {
//            String key = iteValues.next();// 获得key
//            String value = jsonValues.getString(key);
//                        sql += " , " + value;
//                        mm.put(key,value);
//        }

        for (Object k : jsonSchema.keySet()) {
            //JSONObject 实际上相当与一个Map集合，所以我们可以通过Key值获取Value
            Object v = jsonSchema.get(k);
            if (v instanceof JSONObject) {
                JSONObject schemaArr = (JSONObject) v;
                Iterator<String> iteSchema = schemaArr.keys();
                Iterator<String> iteValues = jsonValues.keys();
                while (iteSchema.hasNext()) {
//                    // 获得key
                    String key = iteSchema.next();
                    String value = schemaArr.getString(key);
                    if ("col_data".equals(key)) {
                        while (iteValues.hasNext()) {
                            String v1 = iteValues.next();
                            String v2 = jsonValues.getString(v1);
                            if ((k).equals(v1)) {
                                sql += " , " + value;

                                if("Select".equals(schemaArr.get("type"))){
                                    mm.put(value, JSONObject.fromObject(v2).get("option").toString());
                                }else{
                                    mm.put(value, v2);
                                }

                            }
                        }
                    }
                }
            }
        }
        list.add(mm);
        return mm;
    }

    /**
     * JSON 类型的字符串转换成 Map 集合
     *
     * @param jsonStr
     * @return
     */
    public static Map parseJSON2Map(String jsonStr) {
        Map map = new HashMap();
        //字符串转换成JSON对象
        JSONObject json = JSONObject.fromObject(jsonStr);
//        Object schema = json.get("schema");
//        Object values = json.get("values");
        //最外层JSON解析
        for (Object k : json.keySet()) {
            //JSONObject 实际上相当与一个Map集合，所以我们可以通过Key值获取Value
            Object v = json.get(k);
            //如果内层还是数组的话，继续解析
            if (v instanceof JSONArray) {
                List<Map> list = new ArrayList<Map>();
                Iterator it = ((JSONArray) v).iterator();
                while (it.hasNext()) {
                    JSONObject json2 = (JSONObject) it.next();
                    //对获取到的对象进行解析
                    list.add(parseJSON2Map(json2.toString()));
                }

                map.put(k.toString(), list);
            } else {
                map.put(k.toString(), v);
            }
        }
        return map;
    }

    /**
     * 将template中的json值拼入list对象的具体属性
     *
     * @param list
     * @param template
     * @return
     * @throws Exception
     */
    public static List getJsonList(List list, Template template) throws Exception {
        List chageList = new ArrayList<>();//存储拼接后的values
        Map map = parseJSON2Map(template.getDefine());//获取要拼接的属性
        Map<String, Object> mapp = new HashMap();//存放新的list对象
        Object schema = map.get("schema");//模板定义好的schema直接取
        JSONObject jsonSchema = (JSONObject) schema;
        for (int i = 0; i < list.size(); i++) {
            mapp = convertBean(list.get(i));//转成map
            Set entrySet = mapp.entrySet();
            Iterator<Map.Entry<String, Object>> it = entrySet.iterator();
            while (it.hasNext()) {//循环拼入某一col_data的values值
                Map.Entry<String, Object> e = it.next();
                for (Object k : jsonSchema.keySet()) {
                    //JSONObject 实际上相当与一个Map集合，所以我们可以通过Key值获取Value
                    Object v = jsonSchema.get(k);
                    Map<String, Object> valMap = new HashMap();
                    if (v instanceof JSONObject) {
                        JSONObject schemaArr = (JSONObject) v;
                        Iterator<String> iteSchema = schemaArr.keys();
                        while (iteSchema.hasNext()) {
                            // 获得key
                            String key = iteSchema.next();
                            String value = schemaArr.getString(key);
                            valMap.put(key, value);
                        }
                        //判断list对象中的 '列'(col_data)与解析出的某一类型匹配，将数据拼入valMap中再一同存入mapp
                        if (e.getKey() == schemaArr.getString("col_data") || (schemaArr.getString("col_data")).equals(e.getKey())) {
                            valMap.put(e.getKey(), e.getValue());
                            mapp.replace(e.getKey(), valMap);
                        }
                    }
                }
            }
            chageList.add(mapp);
        }
        return chageList;
    }

    //取得col_data中有类型为number的列
    public static Map getNumberCols(Template template) {
        List chageList = new ArrayList<>();//存储拼接后的values
        Map map = parseJSON2Map(template.getDefine());//获取要拼接的属性
        Object schema = map.get("schema");//模板定义好的schema直接取
        JSONObject jsonSchema = (JSONObject) schema;
        Map<String, String> cols = new HashMap<>();
        for (Object k : jsonSchema.keySet()) {
            Object v = jsonSchema.get(k);
            Map<String, Object> valMap = new HashMap();
            if (v instanceof JSONObject) {
                JSONObject schemaArr = (JSONObject) v;
                Iterator<String> iteSchema = schemaArr.keys();
                while (iteSchema.hasNext()) {
                    // 获得key
                    String key = iteSchema.next();
                    String value = schemaArr.getString(key);
                    valMap.put(key, value);
                    if ("Number".equals(value) || "Number" == value) {
                        cols.put(k.toString(), k.toString());
                    }
                }
            }
        }
        return cols;
    }

    public static Template getNumberCols(Template template, Map cols) {
        Map map = parseJSON2Map(template.getDefine());//获取要拼接的属性
        Object schema = map.get("schema");//模板定义好的schema直接取
        JSONObject jsonSchema = (JSONObject) schema;
        List listKey = new ArrayList();
        Iterator it = cols.keySet().iterator();
        while (it.hasNext()) {
            String key = it.next().toString();
            listKey.add(key);
        }
        Map<String, Object> valMap = new HashMap();
        for (int i = 0; i < cols.size(); i++) {
            for (Object k : jsonSchema.keySet()) {
                Object v = jsonSchema.get(k);
                if (v instanceof JSONObject) {
                    JSONObject schemaArr = (JSONObject) v;
                    Iterator<String> iteSchema = schemaArr.keys();

                    while (iteSchema.hasNext()) {
                        // 获得key
                        String key = iteSchema.next();
                        String value = schemaArr.getString(key);
                        if (listKey.get(i).equals(value) || listKey.get(i) == value) {
                            schemaArr.replace("title", schemaArr.get("title") + "(" + cols.get(listKey.get(i)) + ")");
                        }
                    }
                    valMap.put(k.toString(), schemaArr);
                }
            }
        }
        JSONObject json = JSONObject.fromObject(valMap);
        map.replace("schema", json);
        template.setDefine(map.toString());
        return template;
    }

    /**
     * obj转map
     *
     * @param obj
     * @return
     * @throws Exception
     */
    public static Map convertBean(Object obj) throws Exception {
        Class type = obj.getClass();
        Map returnMap = new HashMap();
        BeanInfo beanInfo = Introspector.getBeanInfo(type);
        PropertyDescriptor[] descriptors = beanInfo.getPropertyDescriptors();
        for (PropertyDescriptor descriptor : descriptors) {
            String propertyName = descriptor.getName();
            if (!propertyName.equals("class")) {
                Method method = descriptor.getReadMethod();
                Object result = method.invoke(obj);
                if (result != null) { //存入不为null的属性
                    System.out.println("----------------");
                    System.out.println(propertyName);
                    System.out.println(result);
                    returnMap.put(propertyName, result);
                } else {
                    returnMap.put(propertyName, ""); //如果为null 存为空字符串""
                }
            }
        }
        return returnMap;
    }


    public static Map parseQuerySql(JSONObject jsonObject, String staticType, String tableName) {


        List listCounts = new ArrayList();
        List listWhere = new ArrayList();
        List listGroupBy = new ArrayList();
        List listOrderBy = new ArrayList();
        List allColumns = new ArrayList();
        List  formDropdownColumns= new ArrayList();//子表关系列
        Map resultMap = new HashMap();
        Map contactTypeMap = new HashMap();
        for (Object k : jsonObject.keySet()) {
            Object v = jsonObject.get(k);
            //解析列及虚拟列
            if (k == "schema" || "schema".equals(k)) {
                JSONObject schemaArr = (JSONObject) v;
                Iterator<String> iteSchema = schemaArr.keys();
                while (iteSchema.hasNext()) {
                    // 获得key
                    String key = iteSchema.next();
                    String value = schemaArr.getString(key);
                    JSONObject colValue = JSONObject.fromObject(value);
                    Iterator<String> iteColValue = colValue.keys();
                    Map mapCol = new HashMap();
                    while (iteColValue.hasNext()) {
                        String keyCol = iteColValue.next();
                        String valueCol = colValue.getString(keyCol);
                        mapCol.put(keyCol, valueCol);
                        //是否绑定联系人
                        if ("contactType".equals(keyCol)) {
//                            contactTypeMap.put(valueCol,colValue.getString("value"));
                            contactTypeMap.put(colValue.getString("col_data"), valueCol);
                        }
                    }
                    // visual为true表示虚拟列
                    if ("true".equals(mapCol.get("visual")) || "true" == mapCol.get("visual")) {
                        listCounts.add(mapCol);
                    } else {
                        listWhere.add(mapCol);
                    }
                    if( "FormDropdown".equals(mapCol.get("type"))){
                        formDropdownColumns.add(mapCol);
                    }
                    allColumns.add(mapCol);
                }
            }
            //解析要分组的项
            if (k == "groupBy" || "groupBy".equals(k)) {
                JSONArray jsonGroupBy = (null != v && !"".equals(v)) ? JSONArray.fromObject(v) : null;
                if (jsonGroupBy != null) {
                    Iterator it = jsonGroupBy.iterator();
                    while (it.hasNext()) {
                        listGroupBy.add(it.next());
                    }
                }
            }
            //得到tableName
            if (k == "tableName" || "tableName".equals(k)) {
                resultMap.put(k, tableName);
            }
            //得到define_id
            if (k == "define_id" || "define_id".equals(k)) {
                resultMap.put(k, v);
            }
            //得到orderBy
            if (k == "orderBy" || "orderBy".equals(k)) {
                JSONArray jsonOrderBy = (null != v && !"".equals(v)) ? JSONArray.fromObject(v) : null;
                if (jsonOrderBy != null) {
                    Iterator it = jsonOrderBy.iterator();
                    while (it.hasNext()) {
                        listOrderBy.add(it.next());
                    }
                }
            }
            //得到orderType
            if (k == "orderType" || "orderType".equals(k)) {
                resultMap.put(k, (v == null || "".equals(v)) ? " DESC " : v);

            }
            //得到projectId
            if (k == "projectId" || "projectId".equals(k)) {
                resultMap.put(k, v);
            }
        }

        resultMap.put("dropdownTypeMap", formDropdownColumns);//添加下拉表的
        resultMap.put("contactTypeMap", contactTypeMap);
        if (!"query".equals(staticType)) {
            return resultMap;
        } else {

            List listSqlWhere = new ArrayList();
            String sql = "SELECT ";
            //1.拼接普通和列虚拟统计列
            sql = TablesUtil.getVisualSql(sql, listCounts, listWhere, listGroupBy);

            //拼接表名
            sql += " from " + resultMap.get("tableName") + " where 1=1 ";

            //2.拼接where条件
            Map mapWhere = TablesUtil.getWhereSql(sql, listWhere);
            sql = mapWhere.get("sql") + "";
            listSqlWhere.addAll((List) mapWhere.get("listSqlWhere"));

            sql += " and define_id=? ";
            listSqlWhere.add(resultMap.get("define_id"));

            if (resultMap.get("projectId") != null && !"".equals(resultMap.get("projectId"))) {
                sql += " and projectId=? ";
                listSqlWhere.add(resultMap.get("projectId"));
            }

            //3.拼接分组条件
            sql = TablesUtil.getGroupBySql(sql, listGroupBy);

            //4.拼接having条件
            mapWhere = TablesUtil.getHavingSql(sql, listCounts, listGroupBy);
            sql = mapWhere.get("sql") + "";
            listSqlWhere.addAll((List) mapWhere.get("listSqlWhere"));

            //5.拼接orderby
            sql = TablesUtil.getOrderBySql(sql, allColumns, listOrderBy, resultMap.get("orderType") + "");

            resultMap.put("sql", sql);
            resultMap.put("listSqlWhere", listSqlWhere);

            return resultMap;
        }
    }

    //拼接显示列(区分普通普通列和虚拟统计列)
    public static String getVisualSql(String sql, List listCounts, List listWhere, List listGroupBy) {
        if (listCounts.size() > 0) {
            for (int k = 0; k < listGroupBy.size(); k++) {
                if (listGroupBy.get(k) == "dateCreated" || "dateCreated".equals(listGroupBy.get(k)) || listGroupBy.get(k) == "dateUpdated" || "dateUpdated".equals(listGroupBy.get(k))) {
                    sql += k > 0 ? ", DATE_FORMAT(" + listGroupBy.get(k) + ",'%Y-%m-%d %H:%i:%s') AS " + listGroupBy.get(k) : " DATE_FORMAT(" + listGroupBy.get(k) + ",'%Y-%m-%d %H:%i:%s') AS " + listGroupBy.get(k);
                } else {
                    sql += k > 0 ? " ," + listGroupBy.get(k) : " " + listGroupBy.get(k) + " ";
                }
            }
            for (int i = 0; i < listCounts.size(); i++) {
                Map col_Map = (Map) listCounts.get(i);
                // 这里判断分组和统计是否有值
                String col = col_Map.get("calMethod").toString() + "(" + col_Map.get("srcColData").toString() + ")";
                sql += (listGroupBy.size() + i) > 0 ? " ,ifnull(ROUND(" + col + ",2),0) AS `" + col_Map.get("col_data") + "`" : " ifnull(ROUND(" + col + ",2),0) AS `" + col_Map.get("col_data") + "`";
            }
        } else {
            sql += "id,define_id,`status`, ";
            for (int i = 0; i < listWhere.size(); i++) {
                Map col_Map = (Map) listWhere.get(i);
                if (col_Map.get("type") == "DataTime" || "DataTime".equals(col_Map.get("type"))) {
                    sql += ", DATE_FORMAT(" + col_Map.get("col_data") + ",'%Y-%m-%d %H:%i:%s') AS " + col_Map.get("col_data");
                } else {
                    sql += i > 0 ? ", `" + col_Map.get("col_data") + "` " : " `" + col_Map.get("col_data") + "` ";
                }
            }
        }
        return sql;
    }


    //拼接where条件
    public static Map getWhereSql(String sql, List listWhere) {
        List listSqlWhere = new ArrayList();
        for (int i = 0; i < listWhere.size(); i++) {
            Map col_Map = (Map) listWhere.get(i);
            if (col_Map.get("value") != null && !"".equals(col_Map.get("value"))) {
                if (col_Map.get("type") == "Number" || "Number".equals(col_Map.get("type"))) {
                    JSONObject countValue = JSONObject.fromObject(col_Map.get("value"));
                    String minVal = countValue.containsKey("min") ? countValue.getString("min") : "";
                    String maxVal = countValue.containsKey("max") ? countValue.getString("max") : "";
                    if (minVal != null && !"".equals(minVal)) {
                        sql += " and " + col_Map.get("col_data") + " >= CONVERT(?,SIGNED) ";
                        listSqlWhere.add(minVal);
                    }
                    if (maxVal != null && !"".equals(maxVal)) {
                        sql += " and " + col_Map.get("col_data") + " <= CONVERT(?,SIGNED) ";
                        listSqlWhere.add(maxVal);
                    }
                } else if (col_Map.get("type") == "DataTime" || "DataTime".equals(col_Map.get("type"))) {
                    JSONObject countValue = JSONObject.fromObject(col_Map.get("value"));
                    String minVal = countValue.containsKey("min") ? countValue.getString("min") : "";
                    String maxVal = countValue.containsKey("max") ? countValue.getString("max") : "";
                    if (minVal != null && !"".equals(minVal)) {
                        sql += " and " + col_Map.get("col_data") + " >= DATE_FORMAT(?,'%Y-%m-%d %H:%i:%s') ";
                        listSqlWhere.add(minVal);
                    }
                    if (maxVal != null && !"".equals(maxVal)) {
                        sql += " and " + col_Map.get("col_data") + " <= DATE_FORMAT(?,'%Y-%m-%d %H:%i:%s') ";
                        listSqlWhere.add(maxVal);
                    }
                } else {
                    sql += " and " + col_Map.get("col_data") + " like ? ";
                    listSqlWhere.add("%" + col_Map.get("value").toString().replace(" ", "%") + "%");
                }
            }
        }
        Map map = new HashMap();
        map.put("sql", sql);
        map.put("listSqlWhere", listSqlWhere);

        return map;
    }

    //拼接having条件
    public static Map getHavingSql(String sql, List listCounts, List listGroupBy) {
        List listSqlWhere = new ArrayList();
        String havingSql = "";
        for (int i = 0; i < listCounts.size(); i++) {
            Map col_Map = (Map) listCounts.get(i);
            if (col_Map.containsKey("visual") && "true".equals(col_Map.get("visual")) && col_Map.get("value") != null && !"".equals(col_Map.get("value")) && listGroupBy.size() > 0) {
                if (col_Map.get("type") == "Number" || "Number".equals(col_Map.get("type"))) {
                    JSONObject countValue = JSONObject.fromObject(col_Map.get("value"));
                    String minVal = countValue.containsKey("min") ? countValue.getString("min") : "";
                    String maxVal = countValue.containsKey("max") ? countValue.getString("max") : "";
                    if (minVal != null && !"".equals(minVal)) {
                        String col = col_Map.get("calMethod").toString() + "(" + col_Map.get("srcColData").toString() + ")";
                        havingSql += " and " + col + " >= CONVERT(?,SIGNED) ";
                        listSqlWhere.add(minVal);
                    }
                    if (maxVal != null && !"".equals(maxVal)) {
                        String col = col_Map.get("calMethod").toString() + "(" + col_Map.get("srcColData").toString() + ")";
                        havingSql += " and " + col + " <= CONVERT(?,SIGNED) ";
                        listSqlWhere.add(maxVal);
                    }
                }
            }
        }
        Map map = new HashMap();
        sql += "".equals(havingSql) ? "" : " having 1=1 " + havingSql;
        map.put("sql", sql);
        map.put("listSqlWhere", listSqlWhere);

        return map;
    }

    //拼接分组条件
    public static String getGroupBySql(String sql, List listGroupBy) {
        for (int i = 0; i < listGroupBy.size(); i++) {
            sql += i > 0 ? " ," + listGroupBy.get(i) : " group by " + listGroupBy.get(i) + " ";
        }
        return sql;
    }

    //拼接orderby
    public static String getOrderBySql(String sql, List listWhere, List listOrderBy, String orderbyType) {

        String orderSql = "";
        if (listOrderBy.size() > 0) {
            for (int i = 0; i < listOrderBy.size(); i++) {
                for (int j = 0; j < listWhere.size(); j++) {
                    Map col_Map = (Map) listWhere.get(j);
                    if (col_Map.get("col_data").equals(listOrderBy.get(i))
                            && ("Number".equals(col_Map.get("type")) || "FormPercentage".equals(col_Map.get("type")))
                    ) {

                        if (!col_Map.containsKey("visual") || col_Map.get("visual") != null
                                && !"true".equals(col_Map.get("visual"))) {
                            orderSql += " CONVERT(" + listOrderBy.get(i) + ",DECIMAL(16,8)) " + orderbyType + ",";
                        } else {
                            orderSql += " " + listOrderBy.get(i) + " " + orderbyType + ",";
                        }

                    } else if (col_Map.get("col_data").equals(listOrderBy.get(i))) {
                        orderSql += " " + listOrderBy.get(i) + " " + orderbyType + ",";
                    }
                }
            }
            orderSql = !"".equals(orderSql) ? " ORDER BY " + orderSql.substring(0, orderSql.length() - 1) : "";
        } else {
            orderSql = " ORDER BY dateUpdated " + orderbyType;
        }

        return sql + orderSql;
    }

    /**
     * 生成所有查询的列JosnObject形式，添加静态列
     * 首次查表单时为define.schema拼接固定参数(createor,dateCreated,dateUpdated,channel,systemEnvironment)
     */
    public static Template firstAddDefine(Template template) {
        String define = template.getDefine();
        JSONObject jsonObject = JSONObject.fromObject(define);
        for (Object k : jsonObject.keySet()) {
            Object v = jsonObject.get(k);
            if (k == "schema" || "schema".equals(k)) {
                JSONObject schemaArr = (JSONObject) v;
                String createor = "{\"title\":\"创建人\",\"type\":\"Text\",\"options\":[],\"col_data\":\"creatorName\",\"value\":\"\",\"visual\":\"static\"}";
                String dateCreated = "{\"title\":\"创建日期\",\"type\":\"DataTime\",\"options\":[],\"col_data\":\"dateCreated\",\"value\":\"\",\"visual\":\"static\"}";
                String dateUpdated = "{\"title\":\"修改日期\",\"type\":\"DataTime\",\"options\":[],\"col_data\":\"dateUpdated\",\"value\":\"\",\"visual\":\"static\"}";
                String channel = "{\"title\":\"渠道\",\"type\":\"Radio\",\"options\":[\"微信\",\"QQ\",\"微博\",\"其他\"],\"col_data\":\"channel\",\"value\":\"\",\"visual\":\"static\"}";
                String systemEnvironment = "{\"title\":\"途径\",\"type\":\"Radio\",\"options\":[\"windows\",\"android\",\"mac\",\"ios\"],\"col_data\":\"systemEnvironment\",\"value\":\"\",\"visual\":\"static\"}";
                String remark = "{\"title\":\"备注\",\"type\":\"TextArea\",\"options\":[],\"col_data\":\"remark\",\"placeholder\":\"\",\"value\":\"\",\"visual\":\"static\"}";
                schemaArr.element("createor", JSONObject.fromObject(createor));
                schemaArr.element("dateCreated", JSONObject.fromObject(dateCreated));
                schemaArr.element("dateUpdated", JSONObject.fromObject(dateUpdated));
                schemaArr.element("channel", JSONObject.fromObject(channel));
                schemaArr.element("systemEnvironment", JSONObject.fromObject(systemEnvironment));
                schemaArr.element("remark", JSONObject.fromObject(remark));
            }
        }
        if (template.getId() != null && !"".equals(template.getId())) {
            jsonObject.element("define_id", template.getId());
        }
        if (template.getProjectId() != null && !"".equals(template.getProjectId())) {
            jsonObject.element("projectId", template.getProjectId());
        }
        if (template.getDefineDataId() != null && !"".equals(template.getDefineDataId())) {
            jsonObject.element("defineDataId", template.getDefineDataId());
        }
        jsonObject.element("groupBy", JSONArray.fromObject("[]"));
        jsonObject.element("orderBy", JSONArray.fromObject("[]"));
        jsonObject.element("orderType", "");
        jsonObject.element("countBy", JSONArray.fromObject("[]"));
        jsonObject.element("tableName", template.getTableName() == null || "".equals(template.getTableName()) ? "project_define_data" : template.getTableName());
        jsonObject.element("companyCode", "");

        template.setDefineJsonObject(jsonObject);
        return template;
    }

    /**
     * 将数据设置为可展示的，如去除NUll值，当横坐标过量时，合并部分数据
     *
     * @param maps
     * @return
     */
    public static List<?> changeData(List<Map<String, Object>> maps) {
        for (int i = 0; i < maps.size(); i++) {
            Map<String, Object> keys = maps.get(i);
            for (String s : keys.keySet()) {
                if (keys.get(s) == null) {
                    keys.replace(s, "");
                }
            }

        }
        return maps;
    }

    //根据上传文件列生成表单define
    public static String setTempDefine(File file) {
        String define = null;
        try {
            HSSFWorkbook book = new HSSFWorkbook(new FileInputStream(file));
            HSSFSheet sheet = book.getSheetAt(0);
            //columnIndex所属的列隐藏
            int rowNum = sheet.getPhysicalNumberOfRows();
            Row row1 = null;
            int sum = 1;
            //查找所有隐藏的行
            for (int i = 0; i < rowNum; i++) {
                row1 = sheet.getRow(i);
                //最关键的一句判断行隐藏row.getZeroHeight(),返回的是boolean类型
                if (row1.getZeroHeight() == true) {
                    sum = i + 1;
                }
            }

            int nums = 0;
            if (sheet.getLastRowNum() > 5000) {
                nums = 5000 + sum;
            } else {
                nums = sheet.getLastRowNum();
            }

            define = "{\"schema\":{";
            //得到头用于生成define
            HSSFRow rowHeard = sheet.getRow(0);
            if (null != rowHeard) {
                int tempNums = rowHeard.getLastCellNum() > 25 ? 25 : rowHeard.getLastCellNum();

                int defineInt = 0;

                String fields = "[";
                for (int i = sum; i <= nums; i++) {
                    HSSFRow row = sheet.getRow(i);
                    if (null != row) {
                        for (int k = 0; k < tempNums; k++) {
                            if (defineInt <= 0) {
                                String colTitle = FileUtil.getCellValue(rowHeard.getCell(k));
                                String defineCol = "\"col_data" + (k + 1) + "\":{\"title\":\"" + colTitle + "\",\"type\":\"Text\",\"col_data\":\"" + "col_data" + (k + 1) + "\",\"placeholder\":\"请输入" + colTitle + "\"}";
                                define += k > 0 ? "," + defineCol : defineCol;
                                fields += k > 0 ? ",\"col_data" + (k + 1) + "\"" : "\"col_data" + (k + 1) + "\"";
                            }
                        }
                        defineInt++;
                    }
                }
                fields += "]";
                define += "},\"fieldsets\":{\"legend\":\" \",\"fields\":" + fields + ",\"buttons\":[{\"label\":\"提交\",\"action\":\"submit\",\"type\":\"button\",\"buttonClass\":\"btn btn-primary\"}]}}";
            } else {
                define = null;
            }

        } catch (Exception e) {
            LoggerUtil.errorOut(e.getMessage());
        }
        return define;
    }

    public static String replaceBlank(String str) {
        String dest = "";
        if (str != null) {
            Pattern p = Pattern.compile("\\s*|\t|\r|\n");
            Matcher m = p.matcher(str);
            dest = m.replaceAll("");
        }
        return dest;
    }


    public static String parseDefineId(JSONObject jsonObject) {
        if (jsonObject.has("define_id")) {
            return jsonObject.getString("define_id");
        } else {
            return jsonObject.getJSONObject("values").getString("define_id");
        }
    }

    /**
     * 更新替换需要被隐藏的值
     *
     * @param define
     * @param result
     */
    public static void filterHidenData(String define, Page result) {
        JSONObject jsonObject = JSONObject.fromObject(define);

        JSONObject schema = jsonObject.getJSONObject("schema");
        List<Map<String, Object>> list = (List<Map<String, Object>>) result.getResultList();
        Iterator iterator = schema.keys();
        List<String> hidenColumns = new ArrayList<>();
        while (iterator.hasNext()) {
            String key = (String) iterator.next();
            JSONObject col = schema.getJSONObject(key);
            if (col.get("columnHiden") != null && col.getBoolean("columnHiden")) {
                hidenColumns.add(col.getString("col_data"));

            }

        }

        for (int i = 0; i < list.size(); i++) {
            Map<String, Object> item = list.get(i);
            for (int k = 0; k < hidenColumns.size(); k++) {
                item.replace(hidenColumns.get(k), "*");
            }
        }
    }

    /**
     * 创建表单时根据temp定义生成新的table表单创建语句
     *
     * @param temp
     * @param tableName
     * @return
     */
    public static Map<String, String> parseMap(String defineId,String temp, String tableName, JdbcTemplate jdbc) {
        String tabSql = " CREATE TABLE `" + tableName + "` ( `id` int(11) NOT NULL AUTO_INCREMENT ";

        //JSONObject 实际上相当与一个Map集合，所以我们可以通过Key值获取Value
        JSONObject newObj = JSONObject.fromObject(temp);
        JSONObject jsonSchema = newObj.getJSONObject("schema");
        //JSONObject jsonSchema = JSONObject.fromObject(schema);
        JSONObject jsonSchemaNew = new JSONObject();
        List<String> fieldsNew = new ArrayList<String>();
        //数据表做下拉菜单生成table_relation关系的sql
        StringBuffer createRelationList = new StringBuffer("");

        for (Object k : jsonSchema.keySet()) {
            Object v = jsonSchema.get(k);
            if (v instanceof net.sf.json.JSONObject) {
                net.sf.json.JSONObject schemaColumn = (net.sf.json.JSONObject) v;
                Iterator iteSchema = schemaColumn.keys();
                JSONObject schemaArrNew= new JSONObject();
                while (iteSchema.hasNext()) {
                    // 获得key
                    String key = String.valueOf(iteSchema.next());
                    if ("col_data".equals(key)
                            &&schemaColumn.containsKey("columnName")
                            &&null!=schemaColumn.getString("columnName")
                            && !"".equals(schemaColumn.getString("columnName"))) {
                        //配置是新建表，但是某些列是默认的字段名，需要在此处--修改--，重新按规范格式化
                        schemaColumn.put(key, schemaColumn.getString("columnName"));
                        System.out.println("schemaArr---" + schemaColumn);
                        tabSql += " ,`" + schemaColumn.getString("columnName") + "` varchar("+default_column_length+") DEFAULT NULL COMMENT '" +
                                schemaColumn.getString("title") + "' ";

                    }else if("col_data".equals(key)){
                        //配置是新建表，但是某些列是默认的字段名，需要在此处新增，重新按规范格式化
                        schemaArrNew.put("oldColumnName",schemaColumn.getString("col_data"));
                        schemaArrNew.put("columnName",schemaColumn.getString("col_data"));
                        System.out.println("schemaArr---" + schemaColumn);
                        tabSql += " ,`" + schemaColumn.getString("col_data") + "` varchar("+default_column_length+") DEFAULT NULL COMMENT '" +
                                schemaColumn.getString("title") + "' ";
                    }
                    if("outHiden".equals(key)
                            ||"searchHiden".equals(key)
                            ||"orderHiden".equals(key)
                            ||"columnHiden".equals(key)
                    ){
                        schemaArrNew.put(key, schemaColumn.getBoolean(key));
                    }else{
                        schemaArrNew.put(key, schemaColumn.getString(key));
                    }
                    if("labelId".equals(key)&&schemaColumn.containsKey("labelId")&&""!=schemaColumn.getString("labelId")){
                        List<String> result=new ArrayList<String>();
                        TablesUtil.getLabelClassifyNames(result,schemaColumn.getString("labelId"),jdbc);
                        Collections.reverse(result);
                        result.remove(0);//删掉1两级
                        //result.remove(1);
                        String label=result.stream().collect(Collectors.joining(","));
                        schemaArrNew.put("label",label);
                    }
                }
                if(!jsonSchema.containsKey("uuid")||"".equals(jsonSchema.get("uuid"))){
                    schemaArrNew.put("uuid",randomId());//添加时间戳，补充之前的没有添加时间戳的列
                }
                if(schemaArrNew.containsKey("options")&&schemaArrNew.getJSONArray("options").size()>0){
                    JSONArray options = schemaArrNew.getJSONArray("options");
                    for(int i=0;i<options.size();i++) {
                        JSONObject option = options.getJSONObject(i);
                        if(!option.containsKey("uuid")||"".equals(option.getString("uuid"))){
                            option.put("uuid",randomId());
                        }
                    }
                }
                //将重新构造的有columnName的列对象放入集合
                jsonSchemaNew.put(schemaArrNew.getString("columnName"),schemaArrNew);
                fieldsNew.add(schemaArrNew.getString("columnName"));

                if("FormDropdown".equals(schemaColumn.getString("type"))){
                    //jsonSchemaNew.put("tName",schemaColumn.getString("value"));//表名存储，存在value会和其他地方冲突
                    //生成关系表
                    String createRelationTable=TablesUtil.createTableRelation(tableName,schemaColumn,jdbc);
                    //记录表关系
                    String insertRelation=TablesUtil.insertTableRelation(tableName,schemaColumn);
                    if(createRelationTable!=null){
                        createRelationList.append(createRelationTable);
                    }
                    if(insertRelation!=null) {
                        createRelationList.append(insertRelation);
                    }
                }
            }
        }
        tabSql += " ,`define_id` int(13) DEFAULT NULL ,\n" +
                "   `companyCode` varchar(300) DEFAULT NULL,\n" +
                "   `projectId` varchar(30) DEFAULT NULL,\n" +
                "   `data_uuid` varchar(300) DEFAULT NULL,\n" +
                "   `creator` varchar(30) DEFAULT NULL,\n" +
                "   `creatorName` varchar(30) DEFAULT NULL,\n" +
                "   `dateCreated` datetime DEFAULT NULL,\n" +
                "   `dateUpdated` datetime DEFAULT NULL,\n" +
                "   `STATUS` varchar(30) DEFAULT NULL,\n" +
                "   `systemEnvironment` varchar(300) DEFAULT NULL,\n" +
                "   `channel` varchar(300) DEFAULT NULL,\n" +
                "   `remark` varchar(300) DEFAULT NULL,\n" +
                "   `rowDataId` varchar(30) DEFAULT NULL,\n" +
                "   `rowDefineId` varchar(30) DEFAULT NULL " +
                ",PRIMARY KEY (`id`) ) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci; ";
        Map<String, String> map = new HashMap<String, String>();
        //循环jsonSchemaNewkeys生成存储表，方便用户填写值
        //删除旧试卷
        if(defineId!=null){
            String deleteExamPaperSql="DELETE FROM project_exam_paper WHERE define_id='"+defineId+"';";
            newObj.put("deleteExamPaperSql", deleteExamPaperSql);
        }

        //生成试卷,以及题目
        String[] insertExamPaperSql=TablesUtil.parseExamPaperInsertSql(defineId,jsonSchemaNew,jdbc);
        newObj.put("insertExamPaperSql", insertExamPaperSql[0]);
        newObj.put("sqlInsertQuestion", insertExamPaperSql[1]);

        newObj.put("schema", jsonSchemaNew);//存入重新格式化的列描述对象

        newObj.getJSONObject("fieldsets").put("fields",fieldsNew.toArray(new String[fieldsNew.size()]));
        //newObj.put("fieldsets",);//fields
        map.put("temp", String.valueOf(newObj));
        map.put("tabSql", tabSql);
        //生成创建FormDropdown下拉选项的table_relation表关联数据
        if(!"".equals(createRelationList.toString())){
            map.put("createRelationSql",createRelationList.toString());
        }

        return map;
    }

    /**
     * 生成试卷，并补充之前没有的uuid列
     * 列以及option选项都有uuid列
     * @param jsonSchemaNew
     */
    private static String[] parseExamPaperInsertSql(String define_id,JSONObject jsonSchemaNew, JdbcTemplate jdbc) {
        Iterator keys = jsonSchemaNew.keys();

        StringBuffer sql=new StringBuffer("");
        StringBuffer sqlInsertQuestion=new StringBuffer("");
        while(keys.hasNext()){
            String key=keys.next().toString();
            JSONObject column = jsonSchemaNew.getJSONObject(key);
            if(column.containsKey("options")&&column.getJSONArray("options").size()>0){
                JSONArray options = column.getJSONArray("options");
                for(int i=0;i<options.size();i++){
                    JSONObject option = options.getJSONObject(i);
                    sql.append("(");
                    sql.append("'" + define_id + "',");
                    sql.append("'"+column.toString()+"',");
                    sql.append("'" + column.getOrDefault("col_data", "") + "',");
                    sql.append("'" + column.getOrDefault("title", "") + "',");

                    sql.append("'" + column.getOrDefault("type", "") + "',");
                    sql.append("'" + column.getOrDefault("columnScore", 0) + "',");
                    sql.append("'" + column.getOrDefault("label", "") + "',");
                    sql.append("'" + column.getOrDefault("labelId", 0) + "',");
                    //TODO 测试
                    sql.append("'" +option.toString() + "',");
                    sql.append("'" + column.getOrDefault("dropdownValue", "") + "',");
                    sql.append("'" + column.getOrDefault("uuid", "") + "',");
                    sql.append("'" + option.getString("uuid") + "',");

                    sql.append("'" + option.getString("option") + "',");
                    sql.append("'" + option.getOrDefault("score",0) + "',");
                    //跳表相关
                    sql.append("'" + column.getOrDefault("p_uuid","") + "',");
                    String p_option_uuid="null".equals(column.getOrDefault("p_option_uuid","").toString())?"":column.getOrDefault("p_option_uuid","").toString();
                    sql.append("'" + p_option_uuid + "'");


                    sql.append("),");
                }
            }else {
                sql.append("(");
                sql.append("'" + define_id + "',");
                sql.append("'"+column.toString()+"',");
                sql.append("'" + column.getOrDefault("col_data", "") + "',");
                sql.append("'" + column.getOrDefault("title", "") + "',");

                sql.append("'" + column.getOrDefault("type", "") + "',");
                sql.append("'" + column.getOrDefault("columnScore", 0) + "',");
                sql.append("'" + column.getOrDefault("label", "") + "',");
                sql.append("'" + column.getOrDefault("labelId", 0) + "',");

                sql.append("'" + column.getOrDefault("value", "") + "',");
                sql.append("'" + column.getOrDefault("dropdownValue", "") + "',");
                sql.append("'" + column.getOrDefault("uuid", "") + "',");

                sql.append("'',");
                sql.append("'',");
                sql.append("'0',");

                //跳表相关
                sql.append("'" + column.getOrDefault("p_uuid","") + "',");
                String p_option_uuid="null".equals(column.getOrDefault("p_option_uuid","").toString())?"":column.getOrDefault("p_option_uuid","").toString();
                sql.append("'" + p_option_uuid + "'");


                sql.append("),");
            }
            //将题目插入到题目表 TODO 后续需要更新前端可以选题，新建的题目还是走这里
            if(column.containsKey("uuid")&&!"".equals(column.get("uuid"))){

                if(jdbc.queryForObject("SELECT COUNT(1) num FROM project_exam_question WHERE `uuid`=?",new Object[]{column.get("uuid").toString()},Integer.class)==0){
                    sqlInsertQuestion.append("(");
                    sqlInsertQuestion.append("'" + column.get("uuid") + "',");
                    sqlInsertQuestion.append("'" + column.toString() + "',");
                    sqlInsertQuestion.append("'" + column.getOrDefault("title", "") + "',");
                    sqlInsertQuestion.append("'" + column.getOrDefault("columnScore", 0) + "',");
                    sqlInsertQuestion.append("'" + column.getOrDefault("label", "") + "',");
                    sqlInsertQuestion.append("'" + column.getOrDefault("labelId", 0) + "'");
                    //跳表相关
                    //sqlInsertQuestion.append("'" + column.getOrDefault("p_uuid","") + "',");
                    //sqlInsertQuestion.append("'" + column.getOrDefault("p_option_uuid","") + "'");

                    sqlInsertQuestion.append("),");
                }

            }
        }
        if(sql.length()>0){
            sql.insert(0,"INSERT INTO project_exam_paper ( " +
                    "  define_id,`question`,col_data,title, " +
                    "  `type`,columnScore,label,labelId, " +
                    "  `value`,dropdownValue,`uuid`,option_uuid, " +
                    "  option_title,option_score,p_uuid,p_option_uuid" +
                    ") VALUES");
        }
        if(sqlInsertQuestion.length()>0){
            sqlInsertQuestion.insert(0,"INSERT INTO project_exam_question ( " +
                    "  `uuid`,question,title,columnScore, " +
                            "  label,labelId" +
                    //",p_uuid,p_option_uuid " +
                            ") VALUES");
        }
        return new String[]{sql.length()>0?sql.substring(0,sql.length()-1).concat(";"):"",
                sqlInsertQuestion.length()>0?sqlInsertQuestion.substring(0,sqlInsertQuestion.length()-1).concat(";"):""
        };//去掉最后的
    }

    private static void getLabelClassifyNames(List<String> result,String id, JdbcTemplate jdbc){
        String sql="SELECT projectName,parentId,id FROM project_data WHERE id=?";
        Map<String,Object> node=jdbc.queryForMap(sql,new Object[]{id});
        String projectName=node.get("projectName").toString();
        String parentId=node.get("parentId").toString();
        result.add(projectName);
        if(0!=Integer.parseInt(parentId)){
            getLabelClassifyNames(result,parentId,jdbc);
        }
    }

    private static JSONObject cloneJSONObject(JSONObject old){
        return JSONObject.fromObject(old.toString());
    }

    public static Map<String, String> parseUpdateTableSql(String defineId,String temp, String tableName,List fields, JdbcTemplate jdbc) {
        String tabSql ="alter table "+tableName;
        JSONObject define = JSONObject.fromObject(temp);
        JSONObject jsonSchema =define.getJSONObject("schema");
        JSONObject jsonSchemaNew =new JSONObject();
        StringBuffer createRelationList = new StringBuffer("");
        for (Object v : jsonSchema.keySet()) {
            String columnKey = (String) v;
            JSONObject schemaColumn = jsonSchema.getJSONObject(columnKey);
            if (schemaColumn.containsKey("labelId") && "" != schemaColumn.getString("labelId")) {
                List<String> result = new ArrayList<String>();
                TablesUtil.getLabelClassifyNames(result, schemaColumn.getString("labelId"), jdbc);
                Collections.reverse(result);
                result.remove(0);//删掉1两级
                //result.remove(1);
                String label = result.stream().collect(Collectors.joining(","));
                schemaColumn.put("label", label);
            }

            if (!schemaColumn.containsKey("uuid") || "".equals(schemaColumn.get("uuid"))) {
                //添加时间戳，前台没传的，后台补充之前的没有添加时间戳的列
                schemaColumn.put("uuid", randomId());
            }
            if (schemaColumn.containsKey("options") && schemaColumn.getJSONArray("options").size() > 0) {
                JSONArray options = schemaColumn.getJSONArray("options");
                for (int i = 0; i < options.size(); i++) {
                    JSONObject option = options.getJSONObject(i);
                    if (!option.containsKey("uuid") || "".equals(option.getString("uuid"))) {
                        option.put("uuid", randomId());
                    }
                }
            }

            if (fields.contains(columnKey)
                    && jsonSchema.containsKey(columnKey)
            ) {
                //数据库存在同时描述中存在
                if (schemaColumn.containsKey("columnName")) {
                    //有英文名字是已经存在的列，要么没变，要么是修改了名称
                    if (schemaColumn.getString("columnName").equals(schemaColumn.getString("col_data"))) {
                        //列没有变
                        jsonSchemaNew.put(columnKey, schemaColumn);
                    } else {
                        //列修改了名称
                        tabSql += " CHANGE " + schemaColumn.getString("col_data") + " " + schemaColumn.getString("columnName") + "  VARCHAR(" + default_column_length + ") DEFAULT Null COMMENT '" + schemaColumn.getString("title") + "', ";
                        //TODO 复制数据放入新的列
                        JSONObject schemaColumnUpdate = cloneJSONObject(schemaColumn);
                        String update_col_data = schemaColumnUpdate.getString("columnName");//换
                        schemaColumnUpdate.put("col_data", update_col_data);
                        jsonSchemaNew.put(update_col_data, schemaColumnUpdate);
                    }
                }

            } else if (fields.contains(columnKey)
                    && !jsonSchema.containsKey(columnKey)) {
                //数据库中有，但是描述中没有，删除的
                tabSql += " DROP " + columnKey + ", ";
                //jsonSchemaNew中就不需要处理了
            } else if (!fields.contains(columnKey)
                    && jsonSchema.containsKey(columnKey)) {
                //数据库不存在，但是描述中有，需要新增的
                tabSql += " add " + schemaColumn.getString("col_data") +
                        " varchar(" + default_column_length + ") DEFAULT Null COMMENT " + "'" + schemaColumn.getString("title") + "' AFTER id, ";
                //TODO 复制数据放入新的列
                JSONObject schemaColumnNew = cloneJSONObject(schemaColumn);
                String new_col_data = "";
                if (schemaColumnNew.containsKey("columnName")
                        && null != schemaColumnNew.getString("columnName")
                        && !"".equals(schemaColumnNew.getString("columnName"))) {
                    //填写了英文名字
                    new_col_data = schemaColumnNew.getString("columnName");//换
                    schemaColumnNew.put("col_data", new_col_data);
                    schemaColumnNew.put("oldColumnName", new_col_data);
                } else {
                    //没有填写英文名字
                    new_col_data = schemaColumnNew.getString("col_data");//换
                    schemaColumnNew.put("columnName", new_col_data);
                    schemaColumnNew.put("oldColumnName", new_col_data);
                }
                jsonSchemaNew.put(new_col_data, schemaColumnNew);


            }

            if ("FormDropdown".equals(schemaColumn.getString("type"))) {
                //jsonSchemaNew.put("tName", schemaColumn.getString("value"));//表名存储，存在value会和其他地方冲突
                //生成关系表
                String createRelationTable = TablesUtil.createTableRelation(tableName, schemaColumn, jdbc);
                //记录表关系
                String insertRelation = TablesUtil.insertTableRelation(tableName, schemaColumn);
                if (createRelationTable != null) {
                    createRelationList.append(createRelationTable);
                }
                if (insertRelation != null) {
                    createRelationList.append(insertRelation);
                }
            }

        }

        Map<String, String> map = new HashMap<String, String>();
        //删除旧答题卡
        String deleteExamPaperSql="DELETE FROM project_exam_paper WHERE define_id='"+defineId+"';";
        map.put("deleteExamPaperSql", deleteExamPaperSql);
        //生成答题卡
        String[] insertExamSql=TablesUtil.parseExamPaperInsertSql(defineId,jsonSchemaNew,jdbc);
        map.put("insertExamPaperSql", insertExamSql[0]);
        map.put("insertExamQuestionSql", insertExamSql[1]);
        define.put("schema", jsonSchemaNew);

        map.put("temp", String.valueOf(define));
        System.out.println(jsonSchemaNew);

        if(!tabSql.equals("alter table "+tableName)){//判断是否要添加字段
            tabSql=tabSql.substring(0,tabSql.length()-2)+";";//注意前面的tabSql最后需要一个加一个空格，否则截取字符会出错
        }else{
            tabSql="";
        }
        System.out.println(tabSql);
        map.put("tabSql", tabSql);
        if(!"".equals(createRelationList.toString())){
            map.put("createRelationSql",createRelationList.toString());
        }
        return map;
    }
    private static AtomicInteger atomicInteger = new AtomicInteger(0);

    // 由于JS最多识别16位长度，因此这里控制长度不超过16位，这里控制为16位
    private static int ID_LENGTH = 16;
    public static Number randomId() {
        //  生成最大4位随技术
        int i2 = ThreadLocalRandom.current().nextInt(9999);
        String timeStr = String.valueOf(System.currentTimeMillis());
        // 取出时间串前面相同的部分
        timeStr = timeStr.substring(5);
        // 递增生成最大9999的递增ID
        if (atomicInteger.get() == 9999) {
            atomicInteger.set(0);
        }
        int i1 = atomicInteger.getAndIncrement();
        String id = timeStr.concat(String.valueOf(i2)).concat(i1+"");
        // 严格控制ID长度，如果过长 从最前面截取
        if (id.length() > ID_LENGTH) {
            // 计算多了多少位
            int surplusLenth = id.length() - ID_LENGTH;
            id = id.substring(surplusLenth);
        }
        return Long.valueOf(id);
    }

    public static JSONObject addIndex(JSONObject schema){
        Iterator<String> it = schema.keys();
        int index=0;
        while(it.hasNext()) {
            String key = it.next();// 获得key
            JSONObject value = schema.getJSONObject(key);//获取value
            value.put("index",index);
            index++;
        }
        return schema;
    }

    /**
     *  把数据拼接到schema的每一项value中
     * @param dataValue  数据库查询出来的结果
     *  @param  site 前端传的当前位置
     * @param schema
     * @return
     */
    public static JSONObject addValue(List<Map<String,Object>> dataValue,JSONObject schema,Map<String,Object> site){
        Set<String> set2 = dataValue.get(0).keySet();
        for (String key : set2) {
            if( schema.has(key)){//判断key是否存在
                if("FormDropdown".equals(schema.getJSONObject(key).get("type"))){//判断是否为数据下拉菜单
                    int index=0;//临时下标变量
                    for(Object o:schema.getJSONObject(key).getJSONArray("options")){
                        JSONObject options= (JSONObject) o;
                        System.out.println(schema.getJSONObject(key).get("col_data")+">>"+options.get("id")+"========"+dataValue.get(0).get(key));
                        if(options.get("id").toString().equals(dataValue.get(0).get(key).toString())){//比较value，取下标
                            schema.getJSONObject(key).put("valuesTemp",index);
                        }
                        index++;
                    }
                }
                if("RadioAttach".equals(schema.getJSONObject(key).get("type"))){//判断是否为单选
                    if(!"".equals(dataValue.get(0).get(key))&&dataValue.get(0).get(key)!=null){//判断每道题目是否有提交过数据
                        JSONArray options = schema.getJSONObject(key).getJSONArray("options");//获取单选框中的options值
                        JSONObject  valueRadio= JSONObject.fromObject(dataValue.get(0).get(key));//获取数据库中用户提交的值对象
                        int index = options.indexOf(valueRadio.get(key));//根据col_data获取值对象中单选项，并找到options中的位置
                        schema.getJSONObject(key).put("valuesTemp",index);
                    }
                }
                if("CheckboxGroup".equals(schema.getJSONObject(key).get("type"))){//判断是否为多选框
                    JSONArray options = schema.getJSONObject(key).getJSONArray("options");
                    JSONArray optionIndex=new JSONArray();
                    for (Object o:JSONArray.fromObject(dataValue.get(0).get(key))){
                        int index = options.indexOf(o);
                        optionIndex.add(index);
                    }
                    schema.getJSONObject(key).put("valuesTemp",optionIndex);
                }
//                if("Text".equals(schema.getJSONObject(key).get("type"))||"TextArea".equals(schema.getJSONObject(key).get("type"))){//判断是否为文本框或文本域
//                    JSONArray options = schema.getJSONObject(key).getJSONArray("options");
//                    JSONArray optionIndex=new JSONArray();
//                    for (Object o:JSONArray.fromObject(dataValue.get(0).get(key))){
//                        int index = options.indexOf(o);
//                        optionIndex.add(index);
//                    }
//                    schema.getJSONObject(key).put("valuesTemp",optionIndex);
//                }
                if(key.equals("address")){//判断是否为地址
                    if(site.size()>0&&(site.get("TableName").equals("application_research")||site.get("TableName").equals("online_research")||
                            site.get("TableName").equals("site_investigation"))){//任务申请的addr使用前端传的用户当前位置
                        schema.getJSONObject(key).put("addr",site.get("province")+","+site.get("city"));
                    }else {
                        JSONObject address= JSONObject.fromObject(dataValue.get(0).get(key));
                        schema.getJSONObject(key).put("addr",address.get("addr"));
                    }
                }
                if(site!=null&&site.size()>0&&key.equals("address")&&(site.get("TableName").equals(
                        "application_research")||site.get("TableName").equals("site_investigation")||site.get("TableName").equals("online_research"))){
                    JSONObject value=new JSONObject();
                    value.put("first",site.get("province"));
                    value.put("sencond",site.get("city"));
                    value.put("addr",site.get("province")+","+site.get("city"));
                    schema.getJSONObject(key).put("value",value);
                }else{
                    schema.getJSONObject(key).put("value",dataValue.get(0).get(key));
                }

            }
        }
        return schema;
    }


    public static String createTableRelation(String thisTable,net.sf.json.JSONObject column, JdbcTemplate jdbc){
        String targetTable=column.getString("tName");
        String relationTableName=thisTable+"_r_"+targetTable;
        String existSql="select count(1) nunm from information_schema.tables where table_name =?";
        if(jdbc.queryForObject(existSql,new Object[]{relationTableName},Integer.class)>0){
            return null;
        }
        return "CREATE TABLE `"+relationTableName+"` (\n" +
                "  `id` INT(11) NOT NULL AUTO_INCREMENT,\n" +
                "  `"+targetTable+"_id` INT(11) DEFAULT NULL,\n" +
                "  `"+thisTable+"_id` INT(11) DEFAULT NULL,\n" +
                "  `create_time` DATETIME DEFAULT NULL COMMENT '创建时间',\n" +
                "  PRIMARY KEY (`id`) USING BTREE\n" +
                ") ENGINE=INNODB AUTO_INCREMENT=2 DEFAULT CHARSET=utf8 ROW_FORMAT=COMPACT;";
    }

    public static String insertTableRelation(String thisTable,net.sf.json.JSONObject column){
        String targetTable=column.getString("tName");
        //String dropdownKey=column.getString("dropdownKey");
        String dropdownValue=column.getString("dropdownValue");
        /* String existSql="SELECT COUNT(1) num FROM project_table_relation WHERE target_table=? AND this_table=?";
       if(jdbc.queryForObject(existSql,new Object[]{targetTable,thisTable},Integer.class)>0){
            return "UPDATE table_relation SET `value`='"+dropdownValue+"',relation_table='"+(thisTable+"_r_"+targetTable)+"' WHERE target_table='"+targetTable+"' AND this_table='"+thisTable+"';";
        }*/
        //直接删除，重建
        //String deleteSql="delete from table_relation WHERE this_table=?;";
        return "INSERT INTO project_table_relation (\n" +
                "  target_table,this_table,`key`,`value`,relation_table,create_time\n" +
                ") VALUES('"+targetTable+"','"+thisTable+"',id,'"+dropdownValue+"','"+(thisTable+"_r_"+targetTable)+"',NOW());";
    }
    public static String deleteTableRelation(String thisTable){
        return "delete from project_table_relation WHERE this_table='"+thisTable+"';";
    }


    public static List<String> insertTableRelationValue(String tableName,int resultTempId, List<Map<String, Object>> listCols, JSONObject values) {
        List<String> result=new ArrayList<String>();


        for(int i=0;i<listCols.size();i++){
            Map<String,Object> col=listCols.get(i);
            String tName= String.valueOf(col.get("tName"));
            String col_data=String.valueOf(col.get("col_data"));
            if(values.containsKey(col_data)&&values.get(col_data)!=null){
                net.sf.json.JSONObject value=net.sf.json.JSONObject.fromObject(values.get(col_data));
                if(value.containsKey("id")&&value.get("id")!=null) {
                    String id=String.valueOf(value.get("id"));
                    String delSql="DELETE FROM "+tableName+"_r_"+tName+" WHERE "+tableName+"_id="+resultTempId+";";
                    String sql="INSERT INTO "+tableName+"_r_"+tName+" ("
                            +tableName+"_id,"
                            +tName+"_id,create_time) VALUES("+resultTempId+","+id+",NOW()) ;";
                    result.add(delSql);
                    result.add(sql);
                }
            }
        }
        return result;
    }

    /**
     * 添加非答案选项的更新sql
     */
    public static void addUpdateAnswer(JSONArray optionsArray, String[] optionUuid,List<String> list ,String answerUserUuid){
        String options[]=new String[optionsArray.size()];
        for(int k=0;k<optionsArray.size();k++){
            JSONObject option=optionsArray.getJSONObject(k);
            if(option!=null){
                String optionUuidMid=option.getString("uuid");
                options[k]=optionUuidMid;
            }
        }
        for(int n=0;n<options.length;n++){
            if(!ArrayUtils.contains(optionUuid,options[n])){
                //没有被选中项，所有的都要设置为非答案
                String selectSql="UPDATE `project_exam_answer` SET\n" +
                        " `answer_describe` = '',\n  " +
                        " `answer_picture` = '',  `answer_active` = 0  " +
                        " WHERE `option_uuid` = '"+options[n]+"' AND answerUserUUID='"+answerUserUuid+"'";
                list.add(selectSql);
            }
        }
    }

    /**
     * 设置答案
     * @param defineId
     * @param define
     * @param jdbc
     * @param userName
     * @param userId
     * @param teamId
     */
    public static void updateAnswer(String defineId,String define,
                                    JdbcTemplate jdbc,String userName,String userId,
                                    String teamId,String answerUserUuid){
        Map jsonMap = TablesUtil.parseJSON2Map(define);
        Object schema = jsonMap.get("schema");
        Object values = jsonMap.get("values");
        JSONObject jsonSchema = (JSONObject) schema;
        JSONObject jsonValues = (JSONObject) values;
        List<String> list = new ArrayList<String>();
        for (Object key : jsonSchema.keySet()) {
            //JSONObject 实际上相当与一个Map集合，所以我们可以通过Key值获取Value
            JSONObject item = jsonSchema.getJSONObject(key.toString());//k是列名字
            String visual=item.getOrDefault("visual","").toString();
            if(!"static".equals(visual)){
                String uuid=item.getString("uuid");

                //扩展字段，假如有如下值的话，一般没有值，为空 TODO
                //String answerDescribe=json.getOrDefault("answer_describe","").toString();
                //String answerPicture=json.getOrDefault("answer_picture","").toString();

                String type=item.getString("type");
                if(jsonValues.containsKey(key.toString())){
                    if("CheckboxGroup".equals(type)&&!"".equals(jsonValues.getString(key.toString()))){
                        JSONArray optionsArray=item.getJSONArray("options");
                        JSONArray jsonArray=jsonValues.getJSONArray(key.toString());//值
                        String seleted[]=new String[jsonArray.size()];
                        for(int i=0;i<jsonArray.size();i++){
                            JSONObject json=jsonArray.getJSONObject(i);
                            String optionUuid=null;
                            if(json!=null){
                                //获取附加字段
                                //多选类型,先解析值
                                optionUuid=json.getString("uuid");
                                String selectSql="UPDATE `project_exam_answer` SET\n" +
                                        " `answer_active` = 1  " +
                                        " WHERE `option_uuid` = '"+optionUuid+"' AND answerUserUUID='"+answerUserUuid+"'";
                                list.add(selectSql);
                                seleted[i]=optionUuid;
                            }
                        }
                        //更新未被选择的选项状态为未设置为答案
                        TablesUtil.addUpdateAnswer( optionsArray, seleted,list,answerUserUuid);


                    }else if("Select".equals(type)){
                        if(!jsonValues.isEmpty()&&!"".equals(jsonValues.getString(key.toString()))) {
                            JSONArray optionsArray=item.getJSONArray("options");
                            JSONObject json = jsonValues.getJSONObject(key.toString());//值
                            String optionUuid =null;
                            if (json != null) {
                                //获取附加字段
                                //下拉类型,先解析值
                                 optionUuid = json.getString("uuid");
                                String selectSql = "UPDATE `project_exam_answer` SET\n" +
                                        " `answer_active` = 1  " +
                                        " WHERE `option_uuid` = '" + optionUuid +"' AND answerUserUUID='"+answerUserUuid+"'";
                                list.add(selectSql);
                            }
                            //更新未被选择的选项状态为未设置为答案
                            TablesUtil.addUpdateAnswer( optionsArray,  new String[]{optionUuid},list,answerUserUuid);
                        }
                    }else if("FormRadioGroup".equals(type)){

                        if(!jsonValues.isEmpty()&&!"".equals(jsonValues.getString(key.toString()))){
                            JSONObject json=jsonValues.getJSONObject(key.toString());//值
                            JSONArray optionsArray=item.getJSONArray("options");
                            String optionUuid =null;
                            if(json.size()!=0){
                                //获取附加字段
                                //下拉类型,先解析值
                                optionUuid=json.getString("uuid");
                                String selectSql="UPDATE `project_exam_answer` SET\n" +
                                        " `answer_active` = 1  " +
                                        " WHERE `option_uuid` = '"+optionUuid+"' AND answerUserUUID='"+answerUserUuid+"'";
                                list.add(selectSql);
                            }
                                //更新未被选择的选项状态为未设置为答案
                                TablesUtil.addUpdateAnswer( optionsArray, new String[]{optionUuid},list,answerUserUuid);

                        }

                    }else{
                        //非选择题
                        String value=jsonValues.getOrDefault(key.toString(),"").toString();
                        String selectSql="UPDATE `project_exam_answer` SET\n" +
                                " `answer_active` = 1,  " +
                                " `value` = '"+value+"' \n" +
                                " WHERE `uuid` = '"+uuid+"' AND answerUserUUID='"+answerUserUuid+"'";
                        list.add(selectSql);
                    }
                }

            }
        }

        jdbc.batchUpdate(list.toArray(new String[list.size()]));
    }
    /**
     * 设置答案
     * @param defineId
     * @param define
     * @param jdbc
     * @param userName
     * @param userId
     * @param teamId
     * @param answerUserUUID 用户创建的答卷uuid
     */
    public static void addAnswer(String defineId,
                                 String define,JdbcTemplate jdbc,
                                 String userName,String userId,
                                 String teamId,String answerUserUUID){
        Map jsonMap = TablesUtil.parseJSON2Map(define);
        Object schema = jsonMap.get("schema");
        Object values = jsonMap.get("values");
        JSONObject jsonSchema = (JSONObject) schema;
        JSONObject jsonValues = (JSONObject) values;
        List<String> list = new ArrayList<String>();
        for (Object key : jsonSchema.keySet()) {
            //JSONObject 实际上相当与一个Map集合，所以我们可以通过Key值获取Value
            JSONObject item = jsonSchema.getJSONObject(key.toString());//k是列名字
            String visual=item.getOrDefault("visual","").toString();
            if(!"static".equals(visual)){
                String uuid=item.getString("uuid");

                //扩展字段，假如有如下值的话，一般没有值，为空 TODO
                //String answerDescribe=json.getOrDefault("answer_describe","").toString();
                //String answerPicture=json.getOrDefault("answer_picture","").toString();

                String type=item.getString("type");
                if(jsonValues.containsKey(key.toString())){
                    if("CheckboxGroup".equals(type)&&!"".equals(jsonValues.getString(key.toString()))){
                        JSONArray optionsArray=item.getJSONArray("options");
                        JSONArray jsonArray=jsonValues.getJSONArray(key.toString());//值
                        for(int i=0;i<jsonArray.size();i++){
                            JSONObject json=jsonArray.getJSONObject(i);
                            String optionUuid=null;
                            if(json!=null){
                                //获取附加字段
                                //下拉类型,先解析值
                                optionUuid=json.getString("uuid");
                                String selectSql="UPDATE `project_exam_answer` SET\n" +
                                        " `answer_describe` = '',\n  " +
                                        " `answer_picture` = '',  `answer_active` = 1  " +
                                        " WHERE `option_uuid` = '"+optionUuid+"' AND answerUserUUID='"+answerUserUUID+"'";
                                list.add(selectSql);
                            }
                        }


                    }else if("Select".equals(type)){
                        if(!jsonValues.isEmpty()&&!"".equals(jsonValues.getString(key.toString()))) {
                            JSONObject json = jsonValues.getJSONObject(key.toString());//值
                            if (json != null) {
                                //获取附加字段
                                //下拉类型,先解析值
                                String optionUuid = json.getString("uuid");
                                String selectSql = "UPDATE `project_exam_answer` SET\n" +
                                        " `answer_describe` = '',\n  " +
                                        " `answer_picture` = '',  `answer_active` = 1  " +
                                        " WHERE `option_uuid` = '" + optionUuid + "' AND answerUserUUID='"+answerUserUUID+"'";
                                list.add(selectSql);
                            }
                        }
                    }else if("FormRadioGroup".equals(type)){

                        if(!jsonValues.isEmpty()&&!"".equals(jsonValues.getString(key.toString()))){
                            JSONObject json=jsonValues.getJSONObject(key.toString());//值
                            if(json.size()!=0){
                                //获取附加字段
                                //下拉类型,先解析值
                                String optionUuid=json.getString("uuid");
                                String selectSql="UPDATE `project_exam_answer` SET\n" +
                                        " `answer_describe` = '',\n  " +
                                        " `answer_picture` = '',  `answer_active` = 1  " +
                                        " WHERE `option_uuid` = '"+optionUuid+"' AND answerUserUUID='"+answerUserUUID+"'";
                                list.add(selectSql);
                            }
                        }

                    }else{
                        //非选择题
                        String value=jsonValues.getOrDefault(key.toString(),"").toString();
                        String selectSql="UPDATE `project_exam_answer` SET\n" +
                                " `answer_describe` = '',\n  " +
                                " `answer_picture` = '',  `answer_active` = 1,  " +
                                " `value` = '"+value+"' \n" +
                                " WHERE `uuid` = '"+uuid+"' AND answerUserUUID='"+answerUserUUID+"'";
                        list.add(selectSql);
                    }
                }

            }
        }

        jdbc.batchUpdate(list.toArray(new String[list.size()]));
    }

    /**
     * 初始化用户答卷，并设置答案
     * @param defineId
     * @param define
     * @param jdbc
     * @param userName
     * @param userId
     * @param teamId
     * @param dataUuid 用户某次答卷的uuid，一份问卷可以答多份
     */
    public static void parseAnswerSql(String defineId,String define,JdbcTemplate jdbc,
                                      String userName,String userId,String teamId,String dataUuid) {
        String uuid=dataUuid;
        String insertSql="INSERT INTO `project_exam_answer_user` ( `UUID`, `define_id`, `userId`)values(?, ?, ?) ";
        jdbc.update(insertSql,new Object[]{uuid,defineId,userId});

        //1、将问卷的定义paper表复制到answer数据表
        String sql="INSERT INTO `project_exam_answer` ( `define_id`,  `question`,  `questionUuid`,  `col_data`,  \n" +
                "`title`,  `type`,  `columnScore`,  `label`, \n" +
                "`labelId`,  `value`,  `dropdownValue`,  `uuid`,  \n" +
                "`option_uuid`,  `option_title`,  `option_score`,  `answer_describe`,  \n" +
                "`answer_picture`,  `answer_active`,  `answer_username`,  `answer_userid`,  \n" +
                "`team_id`,  `p_uuid`,  `p_option_uuid`,`answerUserUUID`) \n" +
                "SELECT `define_id`,  `question`,  `questionUuid`,  `col_data`,  \n" +
                "`title`,  `type`,  `columnScore`,  `label`,  \n" +
                "`labelId`,  `value`,  `dropdownValue`,  `uuid`,  \n" +
                "`option_uuid`,  `option_title`,  `option_score`,  `answer_describe`,  \n" +
                "`answer_picture`,  `answer_active`,  '"+userName+"',  '"+userId+"',  \n" +
                "'"+teamId+"',  `p_uuid`,  `p_option_uuid`,'"+uuid+"' \n" +
                "FROM `project_exam_paper` WHERE define_id=?";
        jdbc.update(sql,new Object[]{defineId});
        //2、根据类型更新值
        addAnswer(defineId,define,jdbc,userName,userId,teamId,uuid);

    }
}
