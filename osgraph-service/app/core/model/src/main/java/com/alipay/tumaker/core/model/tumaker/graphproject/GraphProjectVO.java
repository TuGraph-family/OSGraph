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
     * Figure item id
     */
    private Long graphId;

    /**
     * Figure project name
     */
    private String graphName;
}
