package com.alipay.tumaker.common.facade.model.vo.analysis;

import com.alipay.tumaker.common.facade.model.vo.analysis.view.Edge;
import com.alipay.tumaker.common.facade.model.vo.analysis.view.Node;
import lombok.Data;

import java.util.List;
import java.util.Map;

/***
 * Graph analysis results
 * @author junhaohu.hjh
 * version : AggregatedResultVO.java, v 0.1
 */
@Data
public class AggregatedResultVO {
    /**
     * Map id
     */
    private String graphId;
    /**
     * point data
     */
    private Node[] nodes;
    /**
     * edge data
     */
    private Edge[] edges;
    /**
     * Query result set
     */
    private List<Map<String, Object>> resultSet;
    /**
     * execution engine
     */
    private String engineType;
    /**
     * Execute statement
     */
    private String executeStatement;
}
