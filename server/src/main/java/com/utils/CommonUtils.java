package com.utils;

import java.io.UnsupportedEncodingException;
import java.nio.ByteBuffer;
import java.text.DecimalFormat;
import java.text.SimpleDateFormat;
import java.util.Date;
import java.util.regex.Matcher;
import java.util.regex.Pattern;

/**
 * Created by hppc on 2017-12-21.
 */
public class CommonUtils {
    public static int EXIST_CODE=99999;
    //返回结果信息
    public static Handle getHandle(int result) {
        if (result > 0) {
            return new Handle(1, "操作成功");
        } else if(result==EXIST_CODE){
            return new Handle(1, "已经存在");
        }else {
            return new Handle(0, "操作失败，请稍后重试");
        }
    }

    public static String verificationCode() {
        String retStr = "";
        String strTable = true ? "1234567890" : "1234567890abcdefghijkmnpqrstuvwxyz";
        int len = strTable.length();
        boolean bDone = true;
        do {
            retStr = "";
            int count = 0;
            for (int i = 0; i < 6; i++) {
                double dblR = Math.random() * len;
                int intR = (int) Math.floor(dblR);
                char c = strTable.charAt(intR);
                if (('0' <= c) && (c <= '9')) {
                    count++;
                }
                retStr += strTable.charAt(intR);
            }
            if (count >= 2) {
                bDone = false;
            }
        } while (bDone);

        return retStr;
    }

    /**
     * 生成一个以系统时间为文件名的字符串（精确到了毫秒）
     */
    public static String getFileName() {
        SimpleDateFormat df = new SimpleDateFormat("yyyyMMddHHmmssSSS");// 设置日期格式
        String nowDataSystem = df.format(new Date());
        return nowDataSystem;
    }

    static public String filterOffUtf8Mb4(String text) throws UnsupportedEncodingException {
        byte[] bytes = text.getBytes("UTF-8");
        ByteBuffer buffer = ByteBuffer.allocate(bytes.length);
        int i = 0;
        while (i < bytes.length) {
            short b = bytes[i];
            if (b > 0) {
                buffer.put(bytes[i++]);
                continue;
            }
            b += 256;
            if ((b ^ 0xC0) >> 4 == 0) {
                buffer.put(bytes, i, 2);
                i += 2;
            } else if ((b ^ 0xE0) >> 4 == 0) {
                buffer.put(bytes, i, 3);
                i += 3;
            } else if ((b ^ 0xF0) >> 4 == 0) {
                i += 4;
            }
        }
        buffer.flip();
        return new String(buffer.array(), "utf-8");
    }

    public static String getNumberFormat(String strNumber) {
        //只保留小数后两位
        DecimalFormat df = new DecimalFormat("0.##");
        return df.format(Double.valueOf(strNumber));
    }

    public static String getDateFormat() {
        SimpleDateFormat df = new SimpleDateFormat("yyyy-MM-dd HH:mm:ss");// 设置日期格式
        String nowDataSystem = df.format(new Date());
        return nowDataSystem;
    }

    //检测邮箱
    public static boolean checkEmail(String email) {
        try {

            String pattern1 = "^([a-z0-9A-Z]+[-|_|\\.]?)+[a-z0-9A-Z]@([a-z0-9A-Z]+(-[a-z0-9A-Z]+)?\\.)+[a-zA-Z]{2,}$";
            Pattern pattern = Pattern.compile(pattern1);
            Matcher mat = pattern.matcher(email);
            return mat.matches();
        } catch (Exception e) {
            e.printStackTrace();
        }
        return false;
    }

    //检测是否为电话号码（手机、固定电话验证）
    public static boolean checkPhone(String phone) {
        try {
            String regExp = "^((13[0-9])|(15[^4,\\D])|(18[0,5-9]))\\d{8}|[0]{1}[0-9]{2,3}-[0-9]{7,8}$";
            Pattern p = Pattern.compile(regExp);
            Matcher m = p.matcher(phone);
            return m.matches();
        } catch (Exception e) {
            e.printStackTrace();
        }
        return false;
    }

}
