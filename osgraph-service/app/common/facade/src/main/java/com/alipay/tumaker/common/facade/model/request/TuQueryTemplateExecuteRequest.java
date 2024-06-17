package com.alipay.tumaker.common.facade.model.request;

import com.alipay.tumaker.common.facade.model.vo.common.Enum.GraphLanguageTypeEnum;
import lombok.Data;

import java.util.Map;

/**
 * 模版查询请求参数
 */
@Data
public class TuQueryTemplateExecuteRequest {

    /**
     * 查询语句,模版查询，参数占位符${{parameterName}}
     */
    private String gql;

    /**
     * 查询参数
     */
    private Map<String, Object> parameters;

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
