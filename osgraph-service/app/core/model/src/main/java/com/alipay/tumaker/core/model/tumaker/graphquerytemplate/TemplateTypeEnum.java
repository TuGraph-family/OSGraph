package com.alipay.tumaker.core.model.tumaker.graphquerytemplate;

/**
 * @author Created by XiangChen
 * @date 2024/3/12 20:16
 */
public enum TemplateTypeEnum {
    /**
     * Project contribution
     */
    REPO_CONTRIBUTE,
    /**
     * Project ecology
     */
    REPO_ECOLOGY,
    /**
     * project community
     */
    REPO_COMMUNITY,
    /**
     * development activities
     */
    ACCT_ACTIVITY,
    /**
     * Open source partners
     */
    ACCT_PARTNER,
    /**
     * Open source interest
     */
    ACCT_INTEREST,
    /**
     * unknown
     */
    UNKNOWN,
    ;

    public static TemplateTypeEnum obtainQueryTemplateType (String code) {
        for (TemplateTypeEnum value : values()) {
            if (value.name().equalsIgnoreCase(code)) {
                return value;
            }
        }
        return UNKNOWN;
    }
}
