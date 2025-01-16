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
     * template id
     */
    private Long id;

    /**
     * Query template
     */
    private String template;

    /**
     * Template name
     */
    private String templateName;

    /**
     * template type
     */
    private TemplateTypeEnum templateType;

    /**
     * Parameterized list
     */
    private List<TemplateParameterRequest> templateParameterList;

    /**
     * Template description
     */
    private String templateDesc;

    /**
     * language type
     */
    private String languageType;

    /**
     * Template query type
     */
    private TemplateQueryTypeEnum queryType;

    /**
     * Template query data source
     */
    private FullTextIndexNameEnum querySource;
}
