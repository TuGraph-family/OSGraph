package com.alipay.tumaker.core.model.tumaker.graphquerytemplate;

import com.alipay.tumaker.core.model.tumaker.graphquerytemplate.es.FullTextIndexNameEnum;
import lombok.Data;

import java.util.List;

/**
 * @author Created by XiangChen
 * @date 2024/3/12 20:22
 */
@Data
public class QueryTemplateVO {
    /**
     * 模版id
     */
    private Long id;

    /**
     * 查询模版
     */
    private String template;

    /**
     * 模版名称
     */
    private String templateName;

    /**
     * 模版类型
     */
    private TemplateTypeEnum templateType;

    /**
     * 参数化列表
     */
    private List<TemplateParameterRequest> templateParameterList;

    /**
     * 模版说明
     */
    private String templateDesc;

    /**
     * 语言类型
     */
    private String languageType;

    /**
     * 模版查询类型
     */
    private TemplateQueryTypeEnum queryType;

    /**
     * 模版查询数据源
     */
    private FullTextIndexNameEnum querySource;
}
