package com.alipay.tumaker.common.facade.model.request;

import com.alipay.tumaker.common.facade.model.vo.common.Enum.GraphLanguageTypeEnum;
import lombok.Data;

/**
 * Graph query request parameters
 */
@Data
public class TuQueryExecuteRequest {

    /**
     * query statement
     */
    private String gql;

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
