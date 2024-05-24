package com.alipay.tumaker.core.model.tumaker.graphquerytemplate;

import lombok.Data;

/**
 * @author Created by XiangChen
 * @date 2024/3/12 20:03
 */
@Data
public class TemplateParameterRequest {

    /**
     * 参数名
     */
    private String parameterName;
    /**
     * 参数值
     */
    private String parameterValue;
    /**
     * 参数类型
     */
    private ValueTypeEnum valueType = ValueTypeEnum.UNKNOWN;

    public Object convertValueType() {
        switch (valueType) {
            case INT:
                return Integer.valueOf(parameterValue);
            case LONG:
                return Long.valueOf(parameterValue);
            case FLOAT:
                return Float.valueOf(parameterValue);
            case DOUBLE:
                return Double.valueOf(parameterValue);
            case BOOLEAN:
                return Boolean.valueOf(parameterValue);
        }
        return parameterValue;
    }
}
