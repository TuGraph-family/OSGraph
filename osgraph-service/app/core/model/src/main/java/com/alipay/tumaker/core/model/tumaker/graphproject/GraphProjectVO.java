package com.alipay.tumaker.core.model.tumaker.graphproject;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

/**
 * @author Created by XiangChen
 * @date 2024/3/20 15:07
 *
 */
@Data
@NoArgsConstructor
@AllArgsConstructor
public class GraphProjectVO {

    /**
     * 图项目id
     */
    private Long graphId;

    /**
     * 图项目名称
     */
    private String graphName;
}
