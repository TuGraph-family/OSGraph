package com.alipay.tumaker.core.model.tumaker.graphquerytemplate;

import lombok.Data;

/**
 * @author Created by XiangChen
 * @date 2024/3/12 20:03
 */
@Data
public class TemplateParameterRequest {

    /**
     * Parameter name
     */
    private String parameterName;
    /**
     * Parameter value
     */
    private String parameterValue;
    /**
     * Parameter type
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
