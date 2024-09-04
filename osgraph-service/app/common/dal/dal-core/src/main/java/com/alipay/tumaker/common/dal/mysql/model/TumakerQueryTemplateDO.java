package com.alipay.tumaker.common.dal.mysql.model;

import com.baomidou.mybatisplus.annotation.IdType;
import com.baomidou.mybatisplus.annotation.TableId;
import com.baomidou.mybatisplus.annotation.TableName;
import java.io.Serializable;

/**
 * <p>
 * 查询模版表
 * </p>
 *
 * @author dalgen-mybatisplus
 * @since 2024-04-17
 */
@TableName("tumaker_query_template")
public class TumakerQueryTemplateDO implements Serializable {

    private static final long serialVersionUID = 1L;

    /**
     * 主键
     */
    @TableId(value = "id", type = IdType.AUTO)
    private Long id;

    /**
     * 查询模版
     */
    private String template;

    /**
     * 查询模版
     */
    private String templateParameter;

    /**
     * 模版名称
     */
    private String templateName;

    /**
     * 模版类型
     */
    private String templateType;

    /**
     * 模版说明
     */
    private String templateDesc;

    /**
     * 语言类型
     */
    private String languageType;

    /**
     * 查询类型-语句模版/函数模版
     */
    private String templateQueryType;

    /**
     * 查询数据源
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
