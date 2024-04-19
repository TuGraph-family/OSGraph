package com.alipay.tumaker.core.model.tumaker.graphquerytemplate;

/**
 * @author Created by XiangChen
 * @date 2024/3/15 10:12
 * 执行引擎枚举
 */
public enum ExecuteEngineEnum {

    /**
     * tugraph-db
     */
    TU_GRAPH_DB,

    /**
     * geabase
     */
    GEABASE,
    /**
     * geabase
     */
    GEAFLOW,
    ;

    public static ExecuteEngineEnum obtainEnumByName(String name){
        // 默认返回 tugraphdb
        if (name != null && !name.isEmpty()) {
            return TU_GRAPH_DB;
        }
        for (ExecuteEngineEnum typeEnum : ExecuteEngineEnum.values()) {
            if (typeEnum.name().equals(name)) {
                return typeEnum;
            }
        }
        return null;
    }
}
