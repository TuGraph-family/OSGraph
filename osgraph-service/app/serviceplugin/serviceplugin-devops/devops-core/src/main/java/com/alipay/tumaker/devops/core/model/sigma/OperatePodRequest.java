package com.alipay.tumaker.devops.core.model.sigma;

import lombok.Data;

/**
 * @author Created by XiangChen
 * @date 2024/4/24 11:22
 */
@Data
public class OperatePodRequest {

    /**
     * api version
     */
    private static final String apiVersion = "v1";

    /**
     * Resource type
     */
    private static final String kind = "Pod";

    /**
     * Metadata
     */
    private SigmaOperateMateData metaData;
}

