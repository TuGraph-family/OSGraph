package com.alipay.tumaker.common.facade.model.analysis.view;

import lombok.Data;

import java.util.Map;
/**********************************
 * 节点
 * @author junhaohu.hjh
 **************************************/
@Data
public class Node {
    /**
     * 节点id
     */
    private String id;
    /**
     * 节点类型
     */
    private String nodeType;
    /**
     * 属性
     */
    private Map<String, Object> properties;
}
