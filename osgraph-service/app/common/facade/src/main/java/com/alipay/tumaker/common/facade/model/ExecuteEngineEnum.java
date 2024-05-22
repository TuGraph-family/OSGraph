package com.alipay.tumaker.common.facade.model;

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
    UNKOWN,
    ;

    public static ExecuteEngineEnum obtainEnumByName(String name){
        if (name != null && !name.isEmpty()) {
            return UNKOWN;
        }
        for (ExecuteEngineEnum typeEnum : ExecuteEngineEnum.values()) {
            if (typeEnum.name().equals(name)) {
                return typeEnum;
            }
        }
        return UNKOWN;
    }
}
