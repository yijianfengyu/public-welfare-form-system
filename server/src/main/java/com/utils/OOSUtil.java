package com.utils;

import com.aliyun.oss.OSSClient;
import com.aliyun.oss.model.PutObjectResult;

import java.io.File;
import java.io.FileOutputStream;
import java.io.InputStream;
import java.io.OutputStream;

/**
 * 阿里云OOS对象存储api
 *zk
 * Created by Administrator on 2018/6/12.
 */
public class OOSUtil {

    //static String ENDPOINT= "https://oss-cn-shenzhen.aliyuncs.com";
    //static String ACCESS_KEY_ID = "LTAIszdoLssBuCMm"; //阿里云API keyID
    //static String ACCESS_KEY_SECRET = "8qeXs91bjOanPmPG7NqFQBbTA7HEqC"; //阿里云API keySecret
    //static String BUCKET = "pinqi-bucket"; //bucket空间名称
    static String ENDPOINT= "https://oss-cn-shenzhen.aliyuncs.com";
    static String ACCESS_KEY_ID = "LTAIFBiagmGMUYt6"; //阿里云API keyID
    static String ACCESS_KEY_SECRET = "hEF2I91KxZmicePqahq9Gt2VnYo37K"; //阿里云API keySecret
    static String BUCKET = "water-source-area"; //bucket空间名称
    /**
     * 上传文件
     * 上传的文件访问地址：http://pinqi-bucket.oss-cn-shenzhen.aliyuncs.com/文件别名
     * @param objectName 文件别名
     * @param file 文件
     * @return
     */
    public static PutObjectResult putObject(String objectName,File file){
        PutObjectResult por = null;
        // 创建OSSClient实例。
        OSSClient ossClient = new OSSClient(ENDPOINT, ACCESS_KEY_ID, ACCESS_KEY_SECRET);
        // 上传文件。
        por = ossClient.putObject(BUCKET, objectName, file);
        // 关闭Client。
        ossClient.shutdown();

        return por;
    }

    public static void inputStreamToFile(InputStream ins, File file) {
        try {
            OutputStream os = new FileOutputStream(file);
            int bytesRead = 0;
            byte[] buffer = new byte[8192];
            while ((bytesRead = ins.read(buffer, 0, 8192)) != -1) {
                os.write(buffer, 0, bytesRead);
            }
            os.close();
            ins.close();
        } catch (Exception e) {
            e.printStackTrace();
        }
    }

    /**
     * 上传文件
     * 上传的文件访问地址：http://pinqi-bucket.oss-cn-shenzhen.aliyuncs.com/文件别名
     * @param objectName 文件别名
     * @param file 文件
     * @return
     */
    public static String uploadImage(String objectName,File file){
        PutObjectResult por = null;
        // 创建OSSClient实例。
        OSSClient ossClient = new OSSClient(ENDPOINT, ACCESS_KEY_ID, ACCESS_KEY_SECRET);
        // 上传文件。

        por = ossClient.putObject(BUCKET, objectName, file);
        // 关闭Client。

        ossClient.shutdown();

        return "https://" + BUCKET+".oss-cn-shenzhen.aliyuncs.com/"+objectName;
    }

}
