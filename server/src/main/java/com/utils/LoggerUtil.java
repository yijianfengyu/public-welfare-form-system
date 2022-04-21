package com.utils;

import org.slf4j.Logger;

/**
 * Created by jianlan on 2017/10/25.
 */
public class LoggerUtil {
    private final static Logger loggers = org.slf4j.LoggerFactory.getLogger(LoggerUtil.class);

    public static void infoOut(String message) {
        loggers.info(message);
    }

    public static void debugOut(String message) {
        loggers.debug(message);
    }

    public static void errorOut(String messge) {
        loggers.error(messge);
    }

    public static void warnOut(String message) {
        loggers.warn(message);
    }

}
