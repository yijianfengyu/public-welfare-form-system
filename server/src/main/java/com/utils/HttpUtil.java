package com.utils;

import com.alibaba.fastjson.JSON;
import com.alibaba.fastjson.JSONArray;
import com.alibaba.fastjson.JSONObject;
import org.apache.commons.lang3.StringUtils;
import org.apache.http.*;
import org.apache.http.client.ClientProtocolException;
import org.apache.http.client.config.RequestConfig;
import org.apache.http.client.entity.UrlEncodedFormEntity;
import org.apache.http.client.methods.CloseableHttpResponse;
import org.apache.http.client.methods.HttpPost;
import org.apache.http.entity.StringEntity;
import org.apache.http.impl.client.CloseableHttpClient;
import org.apache.http.impl.client.HttpClients;
import org.apache.http.message.BasicHeader;
import org.apache.http.message.BasicNameValuePair;
import org.apache.http.protocol.HTTP;
import org.apache.http.util.EntityUtils;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;

import java.io.*;
import java.net.URL;
import java.nio.charset.Charset;
import java.util.ArrayList;
import java.util.List;
import java.util.Map;

/**
 * @author WuDong
 * @date 2020/8/24 16:40
 */
public class HttpUtil {

    private static Logger logger = LoggerFactory.getLogger(HttpUtil.class);

    /**
     * 发送post请求
     * @param url
     * @param params
     * @param charset
     * @return
     * @throws ClientProtocolException
     * @throws IOException
     */
    public static String post(String url, Map<String, String> params, String charset)
            throws ClientProtocolException, IOException {
        logger.info("httpPostRequest url : " + url + "   paramMap : " + params);
        String responseEntity = "";

        // 创建CloseableHttpClient对象
        CloseableHttpClient client = HttpClients.createDefault();

        // 创建post方式请求对象
        HttpPost httpPost = new HttpPost(url);

        // 生成请求参数
        List<NameValuePair> nameValuePairs = new ArrayList<>();
        if (params != null) {
            for (Map.Entry<String, String> entry : params.entrySet()) {
                nameValuePairs.add(new BasicNameValuePair(entry.getKey(), entry.getValue()));
            }
        }

        // 将参数添加到post请求中
        httpPost.setEntity(new UrlEncodedFormEntity(nameValuePairs, charset));

        // 发送请求，获取结果（同步阻塞）
        CloseableHttpResponse response = client.execute(httpPost);

        // 获取响应实体
        HttpEntity entity = response.getEntity();
        if (entity != null) {
            // 按指定编码转换结果实体为String类型
            responseEntity = EntityUtils.toString(entity, charset);
        }

        // 释放资源
        EntityUtils.consume(entity);
        response.close();
        //System.out.println("responseEntity = " + responseEntity);

        return responseEntity;
    }

    public static String postUrl(String url, Map<String, Object> params, String charset) {
        String responseEntity = "";
        // 创建CloseableHttpClient对象
        CloseableHttpClient client = HttpClients.createDefault();
        // 创建post方式请求对象
        HttpPost httpPost = new HttpPost(url);
        // 将参数添加到post请求中
        httpPost.setEntity(new StringEntity(JSON.toJSONString(params), charset));
        // 发送请求，获取结果（同步阻塞）
        CloseableHttpResponse response = null;
        try {
            response = client.execute(httpPost);
            // 获取响应实体
            HttpEntity entity = response.getEntity();
            if (entity != null) {
                // 按指定编码转换结果实体为String类型
                responseEntity = EntityUtils.toString(entity, charset);
            }
            // 释放资源
            EntityUtils.consume(entity);
        } catch (Exception e) {
            e.printStackTrace();
        } finally {
            try {
                response.close();
            } catch (IOException e) {
                e.printStackTrace();
            }
        }
        return responseEntity;
    }

    /**
     * post请求（用于请求json格式的参数）
     * @param url
     * @param params
     * @return
     */
    public static String doPost(String url, String params) throws Exception {

        logger.info("httpPostRequest url : " + url + "   paramMap : " + params);

        CloseableHttpClient httpclient = HttpClients.createDefault();
        HttpPost httpPost = new HttpPost(url);// 创建httpPost
        httpPost.setHeader("Accept", "application/json");
        httpPost.setHeader("Content-Type", "application/json");
        String charSet = "UTF-8";
        StringEntity entity = new StringEntity(params, charSet);
        //logger.info("entity = " + entity);
        httpPost.setEntity(entity);
        CloseableHttpResponse response = null;

        try {

            response = httpclient.execute(httpPost);
            //logger.info("response = " + response);
            StatusLine status = response.getStatusLine();
            int state = status.getStatusCode();
            if (state == HttpStatus.SC_OK) {
                HttpEntity responseEntity = response.getEntity();
                String jsonString = EntityUtils.toString(responseEntity);
                logger.info("post请求响应结果：{}", jsonString);
                return jsonString;
            }
            else{
                logger.error("请求返回:"+state+"("+url+")");
            }
        }
        finally {
            if (response != null) {
                try {
                    response.close();
                } catch (IOException e) {
                    logger.error(e.getMessage());
                }
            }
            try {
                httpclient.close();
            } catch (IOException e) {
                logger.error(e.getMessage());
            }
        }
        return null;
    }

    /**
     * http发送POST请求
     *
     * @author J.M.C
     * @since 2019年1月16日
     * @param url 长连接URL
     * @param paramsJson 请求参数body
     * @return result 字符串
     */
    public static String doPostJson(String url, JSONObject paramsJson) {
        logger.info("httpPostRequest url : " + url + "   paramMap : " + paramsJson);
        if(StringUtils.isBlank(url)){
            logger.error("httpPostRequest url is null");
            return null;
        }
        String result = "";
        try {
            // 创建httpClient实例
            CloseableHttpClient httpClient = HttpClients.createDefault();
            // 创建httpPost远程连接实例
            HttpPost httpPost = new HttpPost(url);
            // 配置请求参数实例
            RequestConfig requestConfig = RequestConfig.custom().setConnectTimeout(10000)// 设置连接主机服务超时时间
                    .setConnectionRequestTimeout(10000)// 设置连接请求超时时间
                    .setSocketTimeout(30000)// 设置读取数据连接超时时间
                    .build();
            // 为httpPost实例设置配置
            httpPost.setConfig(requestConfig);
            // 设置请求头
            httpPost.addHeader("content-type", "application/json;charset=utf-8");
            // 封装post请求参数
            httpPost.setEntity(new StringEntity(paramsJson.toJSONString(), Charset.forName("UTF-8")));
            // httpClient对象执行post请求,并返回响应参数对象
            //   HttpResponse httpResponse = httpClient.execute(httpPost);
            CloseableHttpResponse httpResponse = httpClient.execute(httpPost);
            // 从响应对象中获取响应内容
            result = EntityUtils.toString(httpResponse.getEntity());
            //logger.info("result = {}" , result);
        } catch (UnsupportedEncodingException e) {
            logger.error("URLUtil.httpPostRequest encounters an UnsupportedEncodingException : {}",e);
        } catch (IOException e) {
            logger.error("URLUtil.httpPostRequest encounters an IOException : {}",e);
        }
        logger.info("URLUtil.httpPostRequest -----result----: " + result);
        return result;
    }


    public static String send(String url, JSONObject jsonObject,String encoding) throws Exception{
        logger.info("httpPostRequest url : " + url + "   jsonObject : " + jsonObject);
        String body = "";

        //创建httpclient对象
        CloseableHttpClient client = HttpClients.createDefault();
        //创建post方式请求对象
        HttpPost httpPost = new HttpPost(url);

        String strParam = JSONObject.toJSONString(jsonObject);
        //System.out.println("strParam = " + strParam);

        //装填参数
        StringEntity entity = new StringEntity(strParam, "utf-8");
        entity.setContentEncoding(new BasicHeader(HTTP.CONTENT_TYPE, "application/json"));
        //设置参数到请求对象中
        httpPost.setEntity(entity);
        //System.out.println("请求地址："+ url);
        //System.out.println("请求参数："+ entity.toString());

        //设置header信息
        //指定报文头【Content-type】、【User-Agent】
        //httpPost.setHeader("Content-type", "application/x-www-form-urlencoded");
        httpPost.setHeader("Content-type", "application/json");
        httpPost.setHeader("User-Agent", "Mozilla/4.0 (compatible; MSIE 5.0; Windows NT; DigExt)");

        //执行请求操作，并拿到结果（同步阻塞）
        CloseableHttpResponse response = client.execute(httpPost);
        //获取结果实体
        HttpEntity entityResult = response.getEntity();
        if (entityResult != null) {
            //按指定编码转换结果实体为String类型
            body = EntityUtils.toString(entityResult, encoding);
        }
        EntityUtils.consume(entityResult);
        //释放链接
        response.close();
        //logger.info("body = {}", body);
        return body;
    }


    public static JSONObject doPost(String url,JSONObject json){
        logger.info("httpPostRequest url : " + url + "   jsonObject : " + json);
        CloseableHttpClient httpClient = HttpClients.createDefault();
        HttpPost post = new HttpPost(url);
        JSONObject response = null;
        try {
            StringEntity s = new StringEntity(json.toString());
            s.setContentEncoding("UTF-8");
            s.setContentType("application/json");//发送json数据需要设置contentType
            post.setEntity(s);
            HttpResponse res = httpClient.execute(post);
            if(res.getStatusLine().getStatusCode() == HttpStatus.SC_OK){
                HttpEntity entity = res.getEntity();
                String result = EntityUtils.toString(res.getEntity());// 返回json格式：
                //logger.info("result = {}", result);
                response = (JSONObject) JSONObject.parse(result);
            }
        } catch (Exception e) {
            throw new RuntimeException(e);
        }
        //logger.info("response = {}", response);
        return response;
    }


    /**
     * url请求并得到返回结果
     * @param requestUrl
     * @return
     */
    public static JSONArray httpsRequest(String requestUrl, String method, String outputStr) {
        JSONArray jsonObject = null;
        try{
            URL url = new URL(requestUrl);
            sun.net.www.protocol.http.HttpURLConnection connection = (sun.net.www.protocol.http.HttpURLConnection) url.openConnection();
//            HttpsURLConnection connection = (HttpsURLConnection) url.openConnection();
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
            System.out.println(buffer.toString());
            jsonObject = JSONArray.parseArray(buffer.toString());
        }catch(Exception ex){
            ex.printStackTrace();
        }

        return jsonObject;
    }


    /**
     * url请求并得到返回结果
     * @param requestUrl
     * @return
     */
    public static net.sf.json.JSONObject httpsRequestJSONObject(String requestUrl, String method, String outputStr) {
        net.sf.json.JSONObject jsonObject = null;
        try{
            URL url = new URL(requestUrl);
            sun.net.www.protocol.http.HttpURLConnection connection = (sun.net.www.protocol.http.HttpURLConnection) url.openConnection();
//            HttpsURLConnection connection = (HttpsURLConnection) url.openConnection();
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
            System.out.println(buffer.toString()+">>>>>>>>>>>>>>>>>>>>>>");
            jsonObject = net.sf.json.JSONObject.fromObject(buffer.toString());
        }catch(Exception ex){
            ex.printStackTrace();
        }

        return jsonObject;
    }



}
