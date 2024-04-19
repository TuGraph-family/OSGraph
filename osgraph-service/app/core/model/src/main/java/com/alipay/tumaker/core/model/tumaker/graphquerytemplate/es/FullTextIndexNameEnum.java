package com.alipay.tumaker.core.model.tumaker.graphquerytemplate.es;

public enum FullTextIndexNameEnum {
    github_user("github_user","用户名"),
    github_repo("github_repo", "项目名"),
    none("none","未知");

    private String indexName;
    private String description;

    FullTextIndexNameEnum(String indexName, String description){
        this.indexName = indexName;
        this.description = description;
    }

    public String getIndexName(){
        return this.indexName;
    }
    public String getDescription(){
        return this.description;
    }

    public static FullTextIndexNameEnum convertToFullTextIndexNameEnum(String indexName){
        if (indexName.isEmpty()) {
            return none;
        }
        for (FullTextIndexNameEnum indexNameEnum : FullTextIndexNameEnum.values()) {
            if (indexNameEnum.indexName.equals(indexName)) {
                return indexNameEnum;
            }
        }
        return none;
    }
}
