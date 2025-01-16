package com.alipay.tumaker.common.facade.model.request;

import com.alipay.tumaker.common.facade.model.vo.common.Enum.GraphLanguageTypeEnum;
import lombok.Data;

import java.util.Map;

/**
 * Template query request parameters
 */
@Data
public class TuQueryTemplateExecuteRequest {

    /**
     * Query statement, template query, parameter placeholder ${{parameterName}}
     */
    private String gql;

    /**
     * query parameters
     */
    private Map<String, Object> parameters;

    /**
     * language type
     */
    private GraphLanguageTypeEnum languageType;

    /**
     * Picture name
     */
    private String graphName;

    /**
     * limit
     */
    private Long limit = 100L;
}
