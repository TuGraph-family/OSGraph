package com.alipay.tumaker.common.facade.model.vo.analysis.view;

import lombok.Data;

import java.util.Map;
/**********************************
 * node
 * @author junhaohu.hjh
 **************************************/
@Data
public class Node {
    /**
     * node id
     */
    private String id;
    /**
     * node type
     */
    private String nodeType;
    /**
     * property
     */
    private Map<String, Object> properties;
}
