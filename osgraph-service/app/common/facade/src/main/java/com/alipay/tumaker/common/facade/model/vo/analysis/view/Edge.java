package com.alipay.tumaker.common.facade.model.vo.analysis.view;

import lombok.Data;

import java.util.Map;
@Data
public class Edge {
    /**
     * 边数据id
     */
    private String id;
    /**
     * 起点id
     */
    private String source;
    /**
     * 终点id
     */
    private String target;
    /**
     * 边的类型
     */
    private String edgeType;
    /**
     * 时间戳
     */
    private String timestamp = "0";
    /**
     * 属性
     */
    private Map<String, Object> properties;
}
