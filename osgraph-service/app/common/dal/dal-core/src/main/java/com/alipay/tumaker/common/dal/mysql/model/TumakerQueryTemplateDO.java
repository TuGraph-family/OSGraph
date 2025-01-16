package com.alipay.tumaker.common.dal.mysql.model;

import com.baomidou.mybatisplus.annotation.IdType;
import com.baomidou.mybatisplus.annotation.TableId;
import com.baomidou.mybatisplus.annotation.TableName;
import java.io.Serializable;

/**
 * <p>
 * Query template table
 * </p>
 *
 * @author dalgen-mybatisplus
 * @since 2024-04-17
 */
@TableName("tumaker_query_template")
public class TumakerQueryTemplateDO implements Serializable {

    private static final long serialVersionUID = 1L;

    /**
     * primary key
     */
    @TableId(value = "id", type = IdType.AUTO)
    private Long id;

    /**
     * Query template
     */
    private String template;

    /**
     * Query template
     */
    private String templateParameter;

    /**
     * Template name
     */
    private String templateName;

    /**
     * template type
     */
    private String templateType;

    /**
     * Template description
     */
    private String templateDesc;

    /**
     * language type
     */
    private String languageType;

    /**
     * Query type-statement template/function template
     */
    private String templateQueryType;

    /**
     * Query data source
     */
    private String querySource;

    public Long getId() {
        return id;
    }

    public void setId(Long id) {
        this.id = id;
    }

    public String getTemplate() {
        return template;
    }

    public void setTemplate(String template) {
        this.template = template;
    }

    public String getTemplateParameter() {
        return templateParameter;
    }

    public void setTemplateParameter(String templateParameter) {
        this.templateParameter = templateParameter;
    }

    public String getTemplateName() {
        return templateName;
    }

    public void setTemplateName(String templateName) {
        this.templateName = templateName;
    }

    public String getTemplateType() {
        return templateType;
    }

    public void setTemplateType(String templateType) {
        this.templateType = templateType;
    }

    public String getTemplateDesc() {
        return templateDesc;
    }

    public void setTemplateDesc(String templateDesc) {
        this.templateDesc = templateDesc;
    }

    public String getLanguageType() {
        return languageType;
    }

    public void setLanguageType(String languageType) {
        this.languageType = languageType;
    }

    public String getTemplateQueryType() {
        return templateQueryType;
    }

    public void setTemplateQueryType(String templateQueryType) {
        this.templateQueryType = templateQueryType;
    }

    public String getQuerySource() {
        return querySource;
    }

    public void setQuerySource(String querySource) {
        this.querySource = querySource;
    }

    @Override
    public String toString() {
        return "TumakerQueryTemplateDO{" +
            "id = " + id +
            ", template = " + template +
            ", templateParameter = " + templateParameter +
            ", templateName = " + templateName +
            ", templateType = " + templateType +
            ", templateDesc = " + templateDesc +
            ", languageType = " + languageType +
            ", templateQueryType = " + templateQueryType +
            ", querySource = " + querySource +
        "}";
    }
}
