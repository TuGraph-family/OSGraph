package com.alipay.tumaker.common.facade.model.vo.analysis.view;

import lombok.Data;

import java.util.Map;
@Data
public class Edge {
    /**
     * Edge data id
     */
    private String id;
    /**
     * starting point id
     */
    private String source;
    /**
     *Endpoint id
     */
    private String target;
    /**
     * edge type
     */
    private String edgeType;
    /**
     * Timestamp
     */
    private String timestamp = "0";
    /**
     * property
     */
    private Map<String, Object> properties;
}
