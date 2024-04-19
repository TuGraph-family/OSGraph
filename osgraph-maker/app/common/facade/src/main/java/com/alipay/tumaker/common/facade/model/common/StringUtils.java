package com.alipay.tumaker.common.facade.model.common;

import java.util.regex.Matcher;
import java.util.regex.Pattern;

public class StringUtils {
    //逗号
    public static final String COMMA_STRING = ",";
    //空字符串
    public static final String EMPTY_STRING = "";
    public static final String DOT_STRING = ".";

    public static boolean isEmpty(String str) {
        return str == null || str.isEmpty();
    }

    public static boolean isNotEmpty(String str) {
        return str != null && !str.isEmpty();
    }

    public static boolean isBlank(String str) {
        boolean result = true;
        if (isNotEmpty(str)) {
            for (int i = 0; i < str.length(); ++i) {
                if (!Character.isWhitespace(str.charAt(i))) {
                    result = false;
                }
            }
        }
        return result;
    }

    public static boolean isNotBlank(String str) {
        return !isBlank(str);
    }

    public static boolean isNumeric(String str) {
        boolean result = false;
        if (isNotEmpty(str)) {
            int length = str.length();
            for (int i = 0; i < length; ++i) {
                if (!Character.isDigit(str.charAt(i))) {
                    break;
                }
            }
            result = true;
        }
        return result;
    }


    /**
     * 数组格式字符串转 String 数组
     *
     * @param source
     * @return
     */
    public static String[] toStringArray(String source) {
        return source.substring(1, source.length() - 1).split(",");
    }

    /**
     * 获取字符串最后的数字
     *
     * @param name
     * @return
     */
    public static Long obtainLastNumber(String name) {
        if (StringUtils.isEmpty(name)) {
            return null;
        }
        Pattern pattern = Pattern.compile("\\d+$");
        Matcher matcher = pattern.matcher(name);
        return matcher.find() ? Long.valueOf(matcher.group()) : null;
    }
}
