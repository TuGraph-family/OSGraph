package com.alipay.tumaker.common.facade.model.request;

import com.alipay.tumaker.common.facade.model.vo.common.Enum.GraphLanguageTypeEnum;
import lombok.Data;

/**
 * 图查询请求参数
 */
@Data
public class TuQueryExecuteRequest {

    /**
     * 查询语句
     */
    private String gql;

    /**
     * 语言类型
     */
    private GraphLanguageTypeEnum languageType;

    /**
     * 图名称
     */
    private String graphName;

    /**
     * limit
     */
    private Long limit = 100L;
}
