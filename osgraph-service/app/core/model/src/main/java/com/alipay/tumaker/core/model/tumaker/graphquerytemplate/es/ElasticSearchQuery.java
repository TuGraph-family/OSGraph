package com.alipay.tumaker.core.model.tumaker.graphquerytemplate.es;

import lombok.Data;

import java.util.List;

@Data
public class ElasticSearchQuery {
    /**
     * 查询模版
     */
    private MatchPhrase query;
    /**
     * 查询返回行数
     */
    private int size = 10;
    /**
     * 排查
     */
    private List<Object> sort;

}
