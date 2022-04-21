package com.projectManage.dao;

import com.auth.entity.User;
import com.common.jdbc.JdbcBase;
import com.projectManage.entity.ProjectResource;
import com.projectManage.entity.Region;
import com.utils.CommonUtils;
import com.utils.Handle;
import com.utils.Page;
import com.utils.PinyinUtil;
import net.sourceforge.pinyin4j.PinyinHelper;
import org.springframework.stereotype.Repository;

import java.sql.SQLException;
import java.util.ArrayList;
import java.util.List;
import java.util.Map;
import java.util.UUID;

@Repository
public class RegionDao extends JdbcBase {


    public Page queryRegion(Region e) {
        List params = new ArrayList();
        String sql = " SELECT r.* FROM `region` r  where 1=1 ";
        if (null != e.getName()&& !"".equals(e.getName())) {
            sql += " AND r.name like concat('%',?,'%') ";
            params.add(e.getName());
        }
        sql += " GROUP BY r.id ORDER BY r.id DESC ";
        Page page = this.queryForPage(sql, params,e.getCurrentPage(), 10, Region.class);
        return page;
    }
    /**
     * 将字符串的首字母转大写
     * @param str 需要转换的字符串
     * @return
     */
    private static String captureName(String str) {
        // 进行字母的ascii编码前移，效率要高于截取字符串进行转换的操作
        char[] cs=str.toCharArray();
        cs[0]-=32;
        return String.valueOf(cs);
    }
    public int updateRegion(Region e) throws SQLException {
        //查询父节点的名字
        String mernameSql="SELECT CASE WHEN COUNT(`id`)=0 THEN '' ELSE mername END mername, " +
                " CASE WHEN COUNT(`id`)=0 THEN 0 ELSE ifnull(`level`,0) END 'level'" +
                " FROM `region` WHERE id=?";
        Map<String,Object> map=this.getJdbcTemplate().queryForMap(mernameSql,new Object[]{
                e.getPid()
        });
        String mername=(!"".equals(map.get("mername"))?map.get("mername").toString()+",":"")+e.getName();
        int level=Integer.parseInt(map.get("level").toString())+1;

       /* char[] charArray = e.getName().toCharArray();
        StringBuilder pinyin = new StringBuilder();
        for(int i=0; i<charArray.length; i++){
            if(Character.toString(charArray[i]).matches("[\\u4E00-\\u9FA5]+")){

            }else{
                pinyin.append(charArray[i]);
            }
        }*/
/*        pinyin.append(;*/
        String[] pys= PinyinUtil.hanziToPinyin(e.getName(),",").split(",");
        String py="";
        for(int i =0;i<pys.length;i++){
            py+=captureName(pys[i]);
        }
        if(e.getFlag()==1){
            //插入
            String insertSql="INSERT INTO `region` (\n" +
                    "`id`,`name`,`pid`,`sname`," +
                    "`level`,`citycode`,`yzcode`,`mername`,\n" +
                    "`lng`,`lat`,`pinyin`,`isadd`,\n" +
                    "`state`\n" +
                    ") VALUES(\n" +
                    "?,?,?,?,\n" +
                    "?,?,?,?,\n" +
                    "?,?,?,?,\n" +
                    "?)";
            return this.getJdbcTemplate().update(insertSql,
                    new Object[]{
                            e.getId(),e.getName(),e.getPid(),e.getSname(),
                            level,e.getCitycode(),e.getYzcode(),mername,
                            e.getLng(),e.getLat(),py,e.getIsadd(),
                            e.getState()
                    });
        }
        if(null!=e.getId()&&!e.getId().equals(e.getOldId())){
            //修改了id
            String updateSql="UPDATE `region` SET " +
                    "`id` = ?,`name` = ?,`pid` = ?,`sname` = ?,\n" +
                    "`level` = ?,`citycode` = ?,`yzcode` = ?,`mername` = ?,\n" +
                    "`lng` = ?,`lat` = ?,`pinyin` = ?,`isadd` = ?,\n" +
                    "`state` = ? WHERE `id` = ? ";
            return this.getJdbcTemplate().update(updateSql,new Object[]{
                    e.getId(),e.getName(),e.getPid(),e.getSname(),
                    level,e.getCitycode(),e.getYzcode(),mername,
                    e.getLng(),e.getLat(),py,e.getIsadd(),
                    e.getState(),e.getId()
            });
        }
        String updateSql2="UPDATE `region` SET " +
                " `name` = ?,`pid` = ?,`sname` = ?,\n" +
                "`level` = ?,`citycode` = ?,`yzcode` = ?,`mername` = ?, " +
                "`lng` = ?,`lat` = ?,`pinyin` = ?,`isadd` = ?, " +
                "`state` = ? WHERE `id`  = ? ";
        return this.getJdbcTemplate().update(updateSql2,new Object[]{
                e.getName(),e.getPid(),e.getSname(),
                level,e.getCitycode(),e.getYzcode(),mername,
                e.getLng(),e.getLat(),py,e.getIsadd(),
                e.getState(),e.getId()
        });

    }

    public int deleteRegion(Region e) {
        String bakSql="INSERT INTO `region_bak` (\n" +
                "  `id`,`name`,`pid`,`sname`,`\n" +
                "  level`,`citycode`,`yzcode`,`mername`,\n" +
                "  `lng`,`lat`,`pinyin`,`isadd`,\n" +
                "  `state`\n" +
                ") SELECT \n" +
                "  `id`,`name`,`pid`,`sname`,`\n" +
                "  level`,`citycode`,`yzcode`,`mername`,\n" +
                "  `lng`,`lat`,`pinyin`,`isadd`,\n" +
                "  `state` FROM `region` WHERE id=? ";
        this.getJdbcTemplate().update(bakSql,new Object[]{
                e.getId()
        });
        String sql="DELETE FROM `region` WHERE id=? ";
        return this.getJdbcTemplate().update(sql,new Object[]{
                e.getId()
        });

    }

    public boolean exitsId(String id) {
        int num=this.getJdbcTemplate().queryForObject(
                "SELECT IFNULL(COUNT(id),0) num FROM `region` WHERE id=?"
                ,new Object[]{id},Integer.class);
    return num==0?false:true;
    }

    public List<Map<String, Object>> getAll() {
          String sql="SELECT response_id,answer_type,text_value,option_name,option_id FROM `esawseq`.`answer` WHERE answer_type ='area' ORDER BY response_id;";
        return  this.getJdbcTemplate().queryForList(sql);
    }

    public String text_value(String response_id){
        String text_value= this.getJdbcTemplate().queryForObject(
                "SELECT CASE WHEN COUNT(1)=0 THEN '' ELSE text_value END gg FROM `esawseq`.`answer` WHERE answer_type ='location' AND response_id=?;",
                new Object[]{response_id},String.class);
        return text_value;
    }

    public int num(String lng,String lat,String regionId){
        int num=this.getJdbcTemplate().update(
                "UPDATE `my_water_pro`.`region` SET lng=?,lat=? WHERE id=?",
                new Object[]{lng,lat,regionId});
        return num;
    }

    public List<Map<String, Object>> getQuestion() {
        String select = "SELECT q.`sys_id` muid ,REPLACE(UUID(),'-','') `uuid` ,`name` title,`answer_type`\n" +
                "FROM `esawseq`.`question` q WHERE `answer_type` " +
                "IN('area','date','datetime','double','file','int','location','multi','option','text','textmulti','measurement')";
        List<Map<String, Object>> list = this.getJdbcTemplate().queryForList(select);
        return list;
    }

    public List<Map<String, Object>> getOption(String muid) {
        String sql="SELECT `name`,`sys_id` muid FROM  `esawseq`.`questionoption` WHERE question_id=?";
        return this.getJdbcTemplate().queryForList(sql,new Object[]{muid});
    }

    public void batchInsertQuestion(List<String> sqlList) {
        this.getJdbcTemplate().batchUpdate(sqlList.toArray(new String[sqlList.size()]));
    }
    public void batchInsertQuestionOption(List<String> sqlList) {
        this.getJdbcTemplate().batchUpdate(sqlList.toArray(new String[sqlList.size()]));
    }

    public List<Map<String, Object>> getAnswerArea() {
        String sql="SELECT a.`response_id` answerUserUUID,\n" +
                "a.`questionnaire_id` defineId,\n" +
                "a.`question_id` questionId,\n" +
                "a.`sys_creatuserid` authUserId,\n" +
                "a.`option_name`\n" +
                "FROM  `esawseq`.`answer` a WHERE a.`answer_type`='area' AND option_name <>''";
       return this.getJdbcTemplate().queryForList(sql);
    }
    public List<Map<String, Object>> getAnswerLocation() {
        String sql="SELECT a.`response_id` answerUserUUID,\n" +
                "a.`questionnaire_id` defineId,\n" +
                "a.`question_id` questionId,\n" +
                "a.`sys_creatuserid` authUserId,\n" +
                "a.`text_value` option_name \n" +
                "FROM  `esawseq`.`answer` a WHERE a.`answer_type`='location' AND text_value <>''";
       return this.getJdbcTemplate().queryForList(sql);
    }
    public List<Map<String, Object>> getAnswerMeasurement() {
        String sql="SELECT a.`response_id` answerUserUUID,\n" +
                "a.`questionnaire_id` defineId,\n" +
                "a.`question_id` questionId,\n" +
                "a.`sys_creatuserid` authUserId,\n" +
                "a.`measurement_dilution_rate`,a.`measurement_original`,a.`measurement_value` \n" +
                "FROM  `esawseq`.`answer` a WHERE a.`answer_type`='measurement'";
       return this.getJdbcTemplate().queryForList(sql);
    }

    public void updateAnswerQuestion(List<Object[]> sqllListArea) {
        String sql="UPDATE `my_water_pro`.`project_exam_answer` SET `value`=?,`answer_active`=1 \n" +
                "WHERE `answerUserUUID`=? AND mu_define_id=? AND mu_question_id=? AND `answer_userid`=? ";
        int[] num=this.getJdbcTemplate().batchUpdate(sql,sqllListArea);
        System.out.println("-----更新数量------"+num.length);
    }
    public void updateAnswerOption(List<Object[]> sqllListArea) {
        String sql="UPDATE `my_water_pro`.`project_exam_answer` SET `answer_active`=1 \n" +
                "WHERE `answerUserUUID`=? AND mu_define_id=? " +
                "AND mu_question_id=? " +
                "AND `answer_userid`=? "+
                "AND `mu_question_option_id`=? ";
        int[] num=this.getJdbcTemplate().batchUpdate(sql,sqllListArea);
        System.out.println("-----更新数量------"+num.length);
    }

    public List<Map<String, Object>> getAnswerOption() {
        String sql="SELECT a.`response_id` answerUserUUID,\n" +
                "a.`questionnaire_id` defineId,\n" +
                "a.`question_id` questionId,\n" +
                "a.`sys_creatuserid` authUserId,\n" +
                "b.`option_id` " +
                "FROM  `esawseq`.`answer` a WHERE a.`answer_type` in ('option','multi')";
        return this.getJdbcTemplate().queryForList(sql);
    }

    public List<Map<String, Object>> getAnswerRegion() {
        String sql="SELECT r.`sys_id` answerUserUUID,r.`questionnaire_id` defineId,'942' questionId,r.`sys_creatuserid` authUserId,\n" +
                " r.`location_id`,r.`location_longitude`,r.`location_latitude` \n" +
                "FROM `esawseq`.`response` r WHERE r.`location_id` IS NOT NULL \n" +
                " AND r.`location_id`<>''";
        return this.getJdbcTemplate().queryForList(sql);
    }

    public String getRegionAddress(String location_id) {
        return this.getJdbcTemplate().queryForObject("SELECT CASE WHEN COUNT(`mername`)=0 THEN '' ELSE mername END `name` " +
            "FROM `my_water_pro`.`region` WHERE id=?",new Object[]{location_id},String.class);
    }

    public void updateAnswerRegion(List<Object[]> objs) {
        String sql="UPDATE `my_water_pro`.`project_exam_answer` SET `answer_active`=1,value=? \n" +
                "WHERE `answerUserUUID`=? AND mu_define_id=? " +
                "AND mu_question_id=? " +
                "AND `answer_userid`=? ";
        int[] num=this.getJdbcTemplate().batchUpdate(sql,objs);
        System.out.println("-----更新数量------"+num.length);
    }

    public void updateRegionGps(List<Object[]> objs) {
        int[] num=this.getJdbcTemplate().batchUpdate("UPDATE `my_water_pro`.`region` SET lng=?,lat=? WHERE id=?",
                objs);
        System.out.println("-----更新region数量------"+num.length);
    }

    public List<Map<String, Object>> selectAllUuid() {
        String sql="SELECT DISTINCT p.`define_id`,p.`mu_question_id` FROM `project_exam_paper` p " +
                "WHERE  id>10000 ORDER BY p.`define_id`";
        return this.getJdbcTemplate().queryForList(sql);
    }

    public void updatePaperUuid(List<Object[]> objs) {
        String sql="UPDATE `my_water_pro`.project_exam_paper SET `uuid`=? WHERE define_id=? AND mu_question_id=?";
        int[] num=this.getJdbcTemplate().batchUpdate(sql,objs);
        System.out.println("-----更新数量------"+num.length);
    }

    public void updateAnswerUuid(String define_id, String mu_question_id) {
        String sql="UPDATE `my_water_pro`.`project_exam_answer` a,`my_water_pro`.project_exam_paper p SET\n" +
                "a.`uuid`=p.`uuid` WHERE a.`mu_define_id`=p.`mu_define_id` \n" +
                "AND a.`mu_question_id`=p.`mu_question_id` AND p.`mu_question_id`=? AND p.`mu_define_id`=? ";
        int num=this.getJdbcTemplate().update(sql,new Object[]{mu_question_id,define_id});
        System.out.println("-----更新数量------"+num);
    }
    public List<Map<String, Object>> getAllUser(){
        List<Map<String, Object>> list = this.getJdbcTemplate().queryForList("SELECT `auth_user_id`,`team_id` FROM `sales_team_member`");
        return list;
    }
    public void updateAnserTeamId(String teamId,String answer_userid){
        String sql="UPDATE `my_water_pro`.`project_exam_answer` a SET a.team_id=? WHERE answer_userid=?";
        this.getJdbcTemplate().update(sql,new Object[]{teamId,answer_userid});
    }

    public String getTableDefine() {
        return this.getJdbcTemplate().queryForObject(
                "SELECT define FROM `project_define` WHERE id =310",
                String.class);
    }

    public List<Map<String, Object>> selectAllDefineId() {
        String sql="SELECT DISTINCT define_id " +
                "FROM `project_exam_paper` \n" +
                "WHERE define_id <100 ORDER BY define_id;";
        return this.getJdbcTemplate().queryForList(sql);
    }

    public List<Map<String, Object>> selectDefine(String define_id) {
        String sql="SELECT DISTINCT define_id,CONCAT('sales_his_',`define_id`) tableName,`question`,`col_data`\n" +
                "FROM `project_exam_paper` \n" +
                "WHERE define_id <100 AND define_id=? ORDER BY define_id;";
        return this.getJdbcTemplate().queryForList(sql,new Object[]{define_id});
    }
    public void updateDefine(List<Object[]> objs) {
        String sql="UPDATE `project_define` SET define=? , tableName=? WHERE id=?";
        int[] num=this.getJdbcTemplate().batchUpdate(sql,objs);
        System.out.println("-----更新数量------"+num.length);
    }

    public List<Map<String, Object>> getProjectId() {
        String sql="SELECT projectId,`uuid` FROM `project_exam_answer_user` where projectId is not null order by id desc";
        return this.getJdbcTemplate().queryForList(sql);
    }


}
