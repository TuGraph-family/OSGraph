package com.alipay.tumaker.common.facade.model.analysis;

import com.alipay.tumaker.common.facade.model.analysis.view.Edge;
import com.alipay.tumaker.common.facade.model.analysis.view.Node;
import lombok.Data;

import java.util.List;
import java.util.Map;

/***
 * 图分析结果
 * @author junhaohu.hjh
 * version : AggregatedResultVO.java, v 0.1
 */
@Data
public class AggregatedResultVO {
    /**
     * 图谱id
     */
    private String graphId;
    /**
     * 点数据
     */
    private Node[] nodes;
    /**
     * 边数据
     */
    private Edge[] edges;
    /**
     * 查询结果集
     */
    private List<Map<String, Object>> resultSet;
    /**
     * 执行引擎
     */
    private String engineType;
    /**
     * 执行语句
     */
    private String executeStatement;
}
