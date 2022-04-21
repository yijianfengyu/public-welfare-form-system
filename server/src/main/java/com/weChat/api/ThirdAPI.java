package com.weChat.api;

import com.alibaba.fastjson.JSONArray;
import com.alibaba.fastjson.JSONException;
import com.alibaba.fastjson.JSONObject;
import com.utils.Page;
import org.apache.http.client.ClientProtocolException;
import org.springframework.web.multipart.MultipartFile;

import javax.net.ssl.HttpsURLConnection;
import java.io.*;
import java.net.HttpURLConnection;
import java.net.MalformedURLException;
import java.net.URL;
import java.util.*;

/**
 * Created by Administrator on 2018/10/12.
 */
public class ThirdAPI {

    /**
     * 获取第三方平台component_access_token
     * @param component_appid
     * @param component_appsecret
     * @param component_verify_ticket
     * @return
     */
    public static String getComponentAccessToken(String component_appid,String component_appsecret,String component_verify_ticket){
        String accessToken = null;
        JSONObject jso = new JSONObject();
        jso.put("component_appid", component_appid);
        jso.put("component_appsecret", component_appsecret);
        jso.put("component_verify_ticket", component_verify_ticket);
        JSONObject jsonObject = httpsRequest("https://api.weixin.qq.com/cgi-bin/component/api_component_token", "POST",jso.toString());
        // 如果请求成功
        if (null != jsonObject) {
            try {
                accessToken = jsonObject.getString("component_access_token");
            } catch (JSONException e) {
                accessToken = null;
            }
        }
        return accessToken;
    }

    /**
     * 获取预授权码pre_auth_code
     * @param component_access_token
     * @param component_appid
     * @return
     */
    public static String getPreAuthCode(String component_access_token,String component_appid){
        String preAuthCode = null;
        JSONObject jso = new JSONObject();
        jso.put("component_appid", component_appid);
        JSONObject jsonObject = httpsRequest("https://api.weixin.qq.com/cgi-bin/component/api_create_preauthcode?component_access_token="+component_access_token, "POST",jso.toString());
        // 如果请求成功
        if (null != jsonObject) {
            try {
                preAuthCode = jsonObject.getString("pre_auth_code");
            } catch (JSONException e) {
                preAuthCode = null;
            }
        }
        return preAuthCode;
    }

    /**
     * 使用授权码换取公众号或小程序的接口调用凭据和授权信息
     * @param component_access_token
     * @param component_appid
     * @param auth_code
     * @return
     */
    public static JSONObject queryAuthObject(String component_access_token, String component_appid, String auth_code){
        JSONObject obj = null;
        JSONObject jso = new JSONObject();
        jso.put("component_appid", component_appid);
        jso.put("authorization_code", auth_code);
        JSONObject jsonObject = httpsRequest("https://api.weixin.qq.com/cgi-bin/component/api_query_auth?component_access_token="+component_access_token, "POST",jso.toString());
        // 如果请求成功
        if (null != jsonObject) {
            try {
                obj = jsonObject.getJSONObject("authorization_info");
            } catch (JSONException e) {
                obj = null;
            }
        }

        return obj;
    }

    /**
     * 获取（刷新）授权公众号或小程序的接口调用凭据（令牌）
     * @param component_access_token
     * @param component_appid
     * @param authorizer_appid
     * @param authorizer_refresh_token
     * @return
     */
    public static JSONObject refreshAuthorizerToken(String component_access_token,String component_appid,String authorizer_appid,String authorizer_refresh_token){
        JSONObject obj = null;
        JSONObject jso = new JSONObject();
        jso.put("component_appid", component_appid);
        jso.put("authorizer_appid", authorizer_appid);
        jso.put("authorizer_refresh_token", authorizer_refresh_token);
        JSONObject jsonObject = httpsRequest("https://api.weixin.qq.com/cgi-bin/component/api_authorizer_token?component_access_token="+component_access_token, "POST",jso.toString());
        // 如果请求成功
        if (null != jsonObject) {
            try {
                obj = jsonObject;
            } catch (JSONException e) {
                obj = null;
            }
        }
        return obj;
    }

    /**
     * 获取授权方的帐号基本信息
     * @param component_access_token
     * @param component_appid
     * @param authorizer_appid
     * @return
     */
    public static JSONObject getAuthorizerInfo(String component_access_token,String component_appid,String authorizer_appid){
        JSONObject obj = null;
        JSONObject jso = new JSONObject();
        jso.put("component_appid", component_appid);
        jso.put("authorizer_appid", authorizer_appid);
        JSONObject jsonObject = httpsRequest("https://api.weixin.qq.com/cgi-bin/component/api_get_authorizer_info?component_access_token="+component_access_token, "POST",jso.toString());
        // 如果请求成功
        if (null != jsonObject) {
            try {
                obj = jsonObject.getJSONObject("authorizer_info");
            } catch (JSONException e) {
                obj = null;
            }
        }

        return obj;
    }

    public static JSONObject getOauth2AccessToken(String appid,String secret,String code,String grant_type){
        JSONObject obj = null;
        JSONObject jsonObject = httpsRequest("https://api.weixin.qq.com/sns/oauth2/access_token?appid="+appid+"&secret="+secret+"&code="+code+"&grant_type=authorization_code", "GET",null);
        // 如果请求成功
        if (null != jsonObject) {
            try {
                obj = jsonObject;
            } catch (JSONException e) {
                obj = null;
            }
        }
        return obj;
    }

    public static JSONObject getOauth2Userinfo(String access_token,String openid){
        JSONObject obj = null;
        JSONObject jsonObject = httpsRequest("https://api.weixin.qq.com/sns/userinfo?access_token="+access_token+"&openid="+openid+"&lang=zh_CN", "GET",null);
        // 如果请求成功
        if (null != jsonObject) {
            try {
                obj = jsonObject;
            } catch (JSONException e) {
                obj = null;
            }
        }
        return obj;
    }

    /**
     * 获取素材列表
     * @param access_token
     * @param type
     * @param offset
     * @param count
     * @return
     */
    public static Page getMaterialList(String access_token,String type,Integer offset,Integer count){
        Page page = new Page();
        JSONObject jso = new JSONObject();
        jso.put("type", type);
        jso.put("offset", offset*count);
        jso.put("count",count);
        JSONObject jsonObject = httpsRequest("https://api.weixin.qq.com/cgi-bin/material/batchget_material?access_token="+access_token, "POST",jso.toString());
        // 如果请求成功
        if (null != jsonObject) {
            try {
                page.setResultList(jsonObject.getJSONArray("item"));
                page.setTotal(jsonObject.getIntValue("total_count"));
                page.setPageSize(count);
                page.setCurrentPage(offset+1);
            } catch (JSONException e) {
                page = null;
            }
        }
        return page;
    }


    /**
     * 新增素材
     * @param access_token
     * @param material
     * @return
     */
    public static JSONObject addMaterial(String access_token,String material){
        JSONObject jsonObject = httpsRequest("https://api.weixin.qq.com/cgi-bin/material/add_news?access_token=" + access_token, "POST", material.toString());
        if(jsonObject==null){
            jsonObject =  new JSONObject();
        }
        return jsonObject;
    }

    /**
     * 修改素材
     * @param access_token
     * @param material
     * @return
     */
    public static JSONObject updateMaterial(String access_token,String material){
        JSONObject object = JSONObject.parseObject(material);
        JSONObject jso = new JSONObject();
        jso.put("media_id", object.getString("media_id"));
        jso.put("index", object.getString("index"));
        jso.put("articles", object.getJSONObject("content").getJSONArray("articles"));

        String obj = jso.toJSONString().replaceAll("[\\[\\]]","");

        JSONObject jsonObject = httpsRequest("https://api.weixin.qq.com/cgi-bin/material/update_news?access_token=" + access_token, "POST", obj);
        if(jsonObject==null){
            jsonObject =  new JSONObject();
        }
        return jsonObject;
    }

    /**
     * 删除素材
     * @param access_token
     * @param media_id
     * @return
     */
    public static JSONObject deleteMaterial(String access_token,String media_id){
        JSONObject jso = new JSONObject();
        jso.put("media_id", media_id);
        JSONObject jsonObject = httpsRequest("https://api.weixin.qq.com/cgi-bin/material/del_material?access_token="+access_token, "POST",jso.toString());
        return jsonObject;
    }

    /**
     * 群发素材
     * @param access_token
     * @param material
     * @return
     */
    public static JSONObject sendMaterial(String access_token,String material){
        JSONObject jsonObject = httpsRequest("https://api.weixin.qq.com/cgi-bin/message/mass/send?access_token=" + access_token, "POST", material.toString());
        if(jsonObject==null){
            jsonObject =  new JSONObject();
        }
        return jsonObject;
    }

    /**
     * 获取thumb_media_id
     * @param access_token
     * @param type
     * @return
     */
    public static String uploadGetMediaId(String access_token,File file,String type){
        String thumb_media_id = null;

        JSONObject jsonObject = mediaUploadGraphic(access_token, type, file);
        // 如果请求成功
        if (null != jsonObject) {
            try {
                thumb_media_id =jsonObject.getString("media_id");
            } catch (JSONException e) {
                thumb_media_id = null;
            }
        }
        return thumb_media_id;
    }


    public static JSONObject mediaUploadGraphic(String access_token,String type, File media) {
        JSONObject result = null;
        try {
            // 拼装请求地址
            String uploadMediaUrl = String.format(
                    "http://api.weixin.qq.com/cgi-bin/material/add_material?access_token=%1s&type=%2s",
                    access_token,
                    type);
            URL url = new URL(uploadMediaUrl);
            //File file = new File("mediaFileUrl");
            if (!media.exists() || !media.isFile()) {
                System.out.println("上传的文件不存在");
            }

            HttpURLConnection con = (HttpURLConnection) url.openConnection();
            con.setRequestMethod("POST"); // 以Post方式提交表单，默认get方式
            con.setDoInput(true);
            con.setDoOutput(true);
            con.setUseCaches(false); // post方式不能使用缓存
            // 设置请求头信息
            con.setRequestProperty("Connection", "Keep-Alive");
            con.setRequestProperty("Charset", "UTF-8");
            // 设置边界
            String BOUNDARY = "----------" + System.currentTimeMillis();
            con.setRequestProperty("Content-Type", "multipart/form-data; boundary=" + BOUNDARY);

            // 请求正文信息
            // 第一部分：
            StringBuilder sb = new StringBuilder();
            sb.append("--"); // 必须多两道线
            sb.append(BOUNDARY);
            sb.append("\r\n");
            String filename = media.getName();
            sb.append("Content-Disposition: form-data;name=\"media\";filename=\"" + filename + "\" \r\n");
            sb.append("Content-Type:application/octet-stream\r\n\r\n");
            byte[] head = sb.toString().getBytes("utf-8");

            // 获得输出流
            OutputStream out = new DataOutputStream(con.getOutputStream());
            // 输出表头
            out.write(head);
            // 文件正文部分
            // 把文件已流文件的方式 推入到url中
            DataInputStream in = new DataInputStream(new FileInputStream(media));
            int bytes = 0;
            byte[] bufferOut = new byte[1024];
            while ((bytes = in.read(bufferOut)) != -1) {
                out.write(bufferOut, 0, bytes);
            }
            in.close();

            // 结尾部分
            byte[] foot = ("\r\n--" + BOUNDARY + "--\r\n").getBytes("utf-8");// 定义最后数据分隔线
            out.write(foot);
            out.flush();
            out.close();

            StringBuffer buffer = new StringBuffer();
            BufferedReader reader = null;
            // 定义BufferedReader输入流来读取URL的响应
            reader = new BufferedReader(new InputStreamReader(con.getInputStream()));
            String line = null;
            while ((line = reader.readLine()) != null) {
                buffer.append(line);
            }
            if (result == null) {
                result = JSONObject.parseObject(buffer.toString());
            }

            System.out.println(result);


        } catch (IOException e) {
            System.out.println("发送POST请求出现异常！" + e);
            e.printStackTrace();
        } finally {
        }

        return result;
    }




    /**
     * url请求并得到返回结果
     * @param requestUrl
     * @return
     */
    public static JSONObject httpsRequest(String requestUrl, String method, String outputStr) {
        JSONObject jsonObject = null;
        try{
            URL url = new URL(requestUrl);
            HttpsURLConnection connection = (HttpsURLConnection) url.openConnection();
            connection.setDoOutput(true);
            connection.setDoInput(true);
            connection.setUseCaches(false);
            connection.setRequestMethod(method);

            if ("GET".equalsIgnoreCase(method)){
                connection.connect();
            }

            // 当有数据需要提交时
            if (null != outputStr) {
                OutputStream outputStream = connection.getOutputStream();
                // 注意编码格式，防止中文乱码
                outputStream.write(outputStr.getBytes("UTF-8"));
                outputStream.close();
            }


            // 从输入流读取返回内容
            InputStream inputStream = connection.getInputStream();
            InputStreamReader inputStreamReader = new InputStreamReader(inputStream, "utf-8");
            BufferedReader bufferedReader = new BufferedReader(inputStreamReader);
            String str = null;
            StringBuffer buffer = new StringBuffer();
            while ((str = bufferedReader.readLine()) != null) {
                buffer.append(str);
            }
            bufferedReader.close();
            inputStreamReader.close();
            inputStream.close();
            inputStream = null;
            connection.disconnect();
            jsonObject = JSONObject.parseObject(buffer.toString());
        }catch(Exception ex){
            ex.printStackTrace();
        }

        return jsonObject;
    }
}
