package com.alipay.tumaker.core.model.tumaker.graphquerytemplate;

import lombok.Data;

/**
 * @author Created by XiangChen
 * @date 2024/3/27 19:27
 */
public enum TemplateQueryTypeEnum {
    FUNCTION("FUNCTION", "函数模版"),
    STATEMENT("Statement", "语句模版"),
    UNKNOWN("UNKNOWN", "未知类型")
    ;

    final String name;
    final String desc;

    TemplateQueryTypeEnum(String name, String desc) {
        this.name = name;
        this.desc = desc;
    }

    public static TemplateQueryTypeEnum obtainTemplateQueryType (String code) {
        for (TemplateQueryTypeEnum value : values()) {
            if (value.name().equalsIgnoreCase(code)) {
                return value;
            }
        }
        return UNKNOWN;
    }
}
