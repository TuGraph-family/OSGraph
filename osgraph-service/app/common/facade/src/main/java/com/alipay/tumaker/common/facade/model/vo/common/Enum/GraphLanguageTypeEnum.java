package com.alipay.tumaker.common.facade.model.vo.common.Enum;


public enum GraphLanguageTypeEnum {
    /**
     * Cypher
     */
    CYPHER("CYPHER"),
    /**
     * ISOGQL 标准查询语言-Cypher风格
     */
    ISOGQL("ISOGQL"),
    /**
     * ISOGQL 标准查询语言-SQL风格
     */
    ISOGQL_SQL_STYLE("ISOGQL_SQL_STYLE"),
    /**
     * 未知
     */
    UNKNOWN("UNKNOWN");

    private final String graphLanguageType;
    GraphLanguageTypeEnum(String graphLanguageType){
        this.graphLanguageType = graphLanguageType;
    }

    public String getGraphLanguageType() {
        return graphLanguageType;
    }

    public static GraphLanguageTypeEnum getGraphLanguageTypeEnum(String graphLanguageType){
        GraphLanguageTypeEnum result = UNKNOWN;
        graphLanguageType = graphLanguageType.trim();
        for (GraphLanguageTypeEnum languageTypeEnum : GraphLanguageTypeEnum.values()){
            if (languageTypeEnum.graphLanguageType.equalsIgnoreCase(graphLanguageType)){
                result = languageTypeEnum;
                break;
            }
        }
        return result;
    }
}
