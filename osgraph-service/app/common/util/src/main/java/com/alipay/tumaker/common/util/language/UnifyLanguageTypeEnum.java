package com.alipay.tumaker.common.util.language;
/**
 * @author (yuanxiaohua2013@gmail.com)
 * @date   2024/01/22
 * @version
 */
public enum UnifyLanguageTypeEnum {
    CHINESE("Chinese","中文"),
    ENGLISH("English","英文");
    /**
     * Language type
     */
    private final String languageType;
    /**
     * English explanation of error code
     */
    private final String chineseDesc;

    UnifyLanguageTypeEnum(String languageType, String chineseDesc) {
        this.languageType = languageType;
        this.chineseDesc = chineseDesc;
    }

    public String getLanguageType() {
        return languageType;
    }
    public String getChineseDesc() {
        return chineseDesc;
    }
}
