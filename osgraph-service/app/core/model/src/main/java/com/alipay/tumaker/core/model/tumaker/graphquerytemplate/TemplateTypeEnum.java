package com.alipay.tumaker.core.model.tumaker.graphquerytemplate;

/**
 * @author Created by XiangChen
 * @date 2024/3/12 20:16
 */
public enum TemplateTypeEnum {
    /**
     * 项目贡献
     */
    REPO_CONTRIBUTE,
    /**
     * 项目生态
     */
    REPO_ECOLOGY,
    /**
     * 项目社区
     */
    REPO_COMMUNITY,
    /**
     * 开发活动
     */
    ACCT_ACTIVITY,
    /**
     * 开源伙伴
     */
    ACCT_PARTNER,
    /**
     * 开源兴趣
     */
    ACCT_INTEREST,
    /**
     * 未知
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
