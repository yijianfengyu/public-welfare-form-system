package com.utils;

import org.apache.commons.beanutils.PropertyUtils;
import org.apache.commons.collections4.CollectionUtils;

import java.lang.reflect.InvocationTargetException;
import java.util.ArrayList;
import java.util.List;
import java.util.Map;
import java.util.Random;

/**
 * @author WuDong
 * @date 2020/5/27 17:05
 */
public class Util {


    public static <T> List<Map<String, Object>> listConvert(List<T> list) {
        List<Map<String, Object>> list_map = new ArrayList<Map<String, Object>>(); // 定义List<Map<String, Object>>数组<br>　　　　　　　　　　// list为外部传进来的list集合
        if (CollectionUtils.isNotEmpty(list)) {
            list.forEach(item ->{   // PropertyUtils.describe(Object)转换
                Map<String, Object> map = null;
                try {
                    map = (Map<String, Object>) PropertyUtils.describe(item);
                } catch (IllegalAccessException e) {
                    e.printStackTrace();
                } catch (InvocationTargetException e) {
                    e.printStackTrace();
                } catch (NoSuchMethodException e) {
                    e.printStackTrace();
                }
                list_map.add(map );

            });
        }
        return list_map;
    }

    public static boolean vertify(String str) {
        return null == str || "".equals(str) ? false : true;
    }

    public static String getRandomNumber(int length) {            //生成随机字符串
        char[] chr = {'0', '1', '2', '3', '4', '5', '6', '7', '8', '9'};
        Random random = new Random();
        StringBuffer buffer = new StringBuffer();
        for (int i = 0; i < length; i++) {
            buffer.append(chr[random.nextInt(10)]);
        }
        return buffer.toString();
    }

    }
